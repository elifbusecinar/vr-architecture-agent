using System;
using UnityEngine;

namespace VRArchitecture.Services.Auth
{
    /// <summary>
    /// Secure JWT token storage mechanism for Unity.
    ///
    /// Tokens are encrypted with AES-256 before being written to PlayerPrefs,
    /// keyed by a device-unique passphrase (SystemInfo.deviceUniqueIdentifier).
    /// This means tokens cannot be trivially extracted from prefs files.
    ///
    /// Features:
    ///   • Save / Load / Delete JWT tokens
    ///   • Save / Load / Delete refresh tokens
    ///   • Token expiration tracking
    ///   • In-memory cache for fast access (avoids repeated decryption)
    ///   • "Remember Me" flag support
    ///
    /// Usage:
    ///   TokenStorage.SaveToken(jwt);
    ///   string jwt = TokenStorage.LoadToken();
    ///   TokenStorage.ClearAll();
    /// </summary>
    public static class TokenStorage
    {
        // ──────────────────────────────────────────────
        //  PlayerPrefs Keys
        // ──────────────────────────────────────────────
        private const string PrefKey_Token        = "vra_auth_token";
        private const string PrefKey_RefreshToken  = "vra_refresh_token";
        private const string PrefKey_TokenExpiry   = "vra_token_expiry";
        private const string PrefKey_RememberMe    = "vra_remember_me";
        private const string PrefKey_UserId        = "vra_user_id";
        private const string PrefKey_UserEmail     = "vra_user_email";

        // ──────────────────────────────────────────────
        //  In-memory cache
        // ──────────────────────────────────────────────
        private static string _cachedToken;
        private static string _cachedRefreshToken;
        private static bool _cacheLoaded;

        // ──────────────────────────────────────────────
        //  Passphrase (device-unique encryption key seed)
        // ──────────────────────────────────────────────
        private static string Passphrase
        {
            get
            {
                // SystemInfo.deviceUniqueIdentifier gives a per-device string.
                // On some platforms it may return "N/A"; fall back to a constant
                // so encryption still works (just not device-bound).
                string id = SystemInfo.deviceUniqueIdentifier;
                if (string.IsNullOrEmpty(id) || id == "N/A" || id == SystemInfo.unsupportedIdentifier)
                {
                    id = "VRArchitecture_Fallback_Key_2026";
                }
                return id;
            }
        }

        // ══════════════════════════════════════════════
        //  JWT TOKEN
        // ══════════════════════════════════════════════

        /// <summary>
        /// Encrypt and persist the JWT access token.
        /// Also caches it in memory for fast retrieval.
        /// </summary>
        /// <param name="token">The raw JWT string.</param>
        /// <param name="expiresInSeconds">
        /// Optional lifetime in seconds. When set, <see cref="IsTokenExpired"/>
        /// can be used to check validity without decoding the JWT.
        /// </param>
        public static void SaveToken(string token, int expiresInSeconds = 0)
        {
            if (string.IsNullOrEmpty(token))
            {
                DeleteToken();
                return;
            }

            string encrypted = TokenEncryptor.Encrypt(token, Passphrase);
            PlayerPrefs.SetString(PrefKey_Token, encrypted);

            if (expiresInSeconds > 0)
            {
                long expiryUnix = DateTimeOffset.UtcNow.ToUnixTimeSeconds() + expiresInSeconds;
                PlayerPrefs.SetString(PrefKey_TokenExpiry, expiryUnix.ToString());
            }

            PlayerPrefs.Save();
            _cachedToken = token;
            _cacheLoaded = true;

            Debug.Log("[TokenStorage] JWT token saved (encrypted).");
        }

        /// <summary>
        /// Load and decrypt the stored JWT token.
        /// Returns the cached value if available, otherwise decrypts from PlayerPrefs.
        /// Returns null if no token is stored or decryption fails.
        /// </summary>
        public static string LoadToken()
        {
            if (_cacheLoaded && _cachedToken != null)
                return _cachedToken;

            if (!PlayerPrefs.HasKey(PrefKey_Token))
                return null;

            string encrypted = PlayerPrefs.GetString(PrefKey_Token);
            string token = TokenEncryptor.Decrypt(encrypted, Passphrase);

            if (token != null)
            {
                _cachedToken = token;
                _cacheLoaded = true;
            }

            return token;
        }

        /// <summary>Remove the stored JWT token from both cache and PlayerPrefs.</summary>
        public static void DeleteToken()
        {
            PlayerPrefs.DeleteKey(PrefKey_Token);
            PlayerPrefs.DeleteKey(PrefKey_TokenExpiry);
            PlayerPrefs.Save();
            _cachedToken = null;

            Debug.Log("[TokenStorage] JWT token deleted.");
        }

        /// <summary>
        /// Check whether the JWT token has expired based on the stored expiry time.
        /// Returns true if no expiry was recorded (conservative approach).
        /// </summary>
        public static bool IsTokenExpired()
        {
            if (!PlayerPrefs.HasKey(PrefKey_TokenExpiry))
                return true; // no expiry info → treat as expired

            string expiryStr = PlayerPrefs.GetString(PrefKey_TokenExpiry);
            if (!long.TryParse(expiryStr, out long expiryUnix))
                return true;

            long nowUnix = DateTimeOffset.UtcNow.ToUnixTimeSeconds();
            // Consider expired 30 seconds early to account for latency
            return nowUnix >= (expiryUnix - 30);
        }

        /// <summary>Check whether a JWT token exists in storage (may still be expired).</summary>
        public static bool HasToken()
        {
            return PlayerPrefs.HasKey(PrefKey_Token);
        }

        // ══════════════════════════════════════════════
        //  REFRESH TOKEN
        // ══════════════════════════════════════════════

        /// <summary>Encrypt and persist a refresh token.</summary>
        public static void SaveRefreshToken(string refreshToken)
        {
            if (string.IsNullOrEmpty(refreshToken))
            {
                DeleteRefreshToken();
                return;
            }

            string encrypted = TokenEncryptor.Encrypt(refreshToken, Passphrase);
            PlayerPrefs.SetString(PrefKey_RefreshToken, encrypted);
            PlayerPrefs.Save();
            _cachedRefreshToken = refreshToken;

            Debug.Log("[TokenStorage] Refresh token saved (encrypted).");
        }

        /// <summary>Load and decrypt the stored refresh token.</summary>
        public static string LoadRefreshToken()
        {
            if (_cachedRefreshToken != null)
                return _cachedRefreshToken;

            if (!PlayerPrefs.HasKey(PrefKey_RefreshToken))
                return null;

            string encrypted = PlayerPrefs.GetString(PrefKey_RefreshToken);
            _cachedRefreshToken = TokenEncryptor.Decrypt(encrypted, Passphrase);
            return _cachedRefreshToken;
        }

        /// <summary>Remove the stored refresh token.</summary>
        public static void DeleteRefreshToken()
        {
            PlayerPrefs.DeleteKey(PrefKey_RefreshToken);
            PlayerPrefs.Save();
            _cachedRefreshToken = null;

            Debug.Log("[TokenStorage] Refresh token deleted.");
        }

        // ══════════════════════════════════════════════
        //  USER METADATA  (non-sensitive, stored plain)
        // ══════════════════════════════════════════════

        /// <summary>Store the current user's ID for quick access.</summary>
        public static void SaveUserId(string userId)
        {
            PlayerPrefs.SetString(PrefKey_UserId, userId ?? string.Empty);
            PlayerPrefs.Save();
        }

        /// <summary>Get the stored user ID (empty string if not set).</summary>
        public static string LoadUserId()
        {
            return PlayerPrefs.GetString(PrefKey_UserId, string.Empty);
        }

        /// <summary>Store the current user's email for display / auto‐fill.</summary>
        public static void SaveUserEmail(string email)
        {
            PlayerPrefs.SetString(PrefKey_UserEmail, email ?? string.Empty);
            PlayerPrefs.Save();
        }

        /// <summary>Get the stored user email.</summary>
        public static string LoadUserEmail()
        {
            return PlayerPrefs.GetString(PrefKey_UserEmail, string.Empty);
        }

        // ══════════════════════════════════════════════
        //  REMEMBER ME
        // ══════════════════════════════════════════════

        /// <summary>
        /// Persist the "Remember Me" preference.
        /// When false, tokens should be cleared on application quit.
        /// </summary>
        public static void SetRememberMe(bool remember)
        {
            PlayerPrefs.SetInt(PrefKey_RememberMe, remember ? 1 : 0);
            PlayerPrefs.Save();
        }

        /// <summary>Get the "Remember Me" preference (default false).</summary>
        public static bool GetRememberMe()
        {
            return PlayerPrefs.GetInt(PrefKey_RememberMe, 0) == 1;
        }

        // ══════════════════════════════════════════════
        //  CLEAR ALL
        // ══════════════════════════════════════════════

        /// <summary>
        /// Remove all stored authentication data.
        /// Call this on logout or when the user explicitly wants to sign out.
        /// </summary>
        public static void ClearAll()
        {
            PlayerPrefs.DeleteKey(PrefKey_Token);
            PlayerPrefs.DeleteKey(PrefKey_RefreshToken);
            PlayerPrefs.DeleteKey(PrefKey_TokenExpiry);
            PlayerPrefs.DeleteKey(PrefKey_RememberMe);
            PlayerPrefs.DeleteKey(PrefKey_UserId);
            PlayerPrefs.DeleteKey(PrefKey_UserEmail);
            PlayerPrefs.Save();

            _cachedToken = null;
            _cachedRefreshToken = null;
            _cacheLoaded = false;

            Debug.Log("[TokenStorage] All auth data cleared.");
        }

        /// <summary>
        /// Should be called from MonoBehaviour.OnApplicationQuit().
        /// Clears tokens if "Remember Me" is not enabled.
        /// </summary>
        public static void OnApplicationQuit()
        {
            if (!GetRememberMe())
            {
                Debug.Log("[TokenStorage] Remember Me is off — clearing tokens on quit.");
                ClearAll();
            }
        }
    }
}
