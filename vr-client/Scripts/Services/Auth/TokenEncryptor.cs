using System;
using System.IO;
using System.Security.Cryptography;
using System.Text;
using UnityEngine;

namespace VRArchitecture.Services.Auth
{
    /// <summary>
    /// AES-256-CBC encryption helper for securing sensitive data at rest.
    /// The key is derived from a device-unique seed via PBKDF2 so that
    /// tokens stored in PlayerPrefs are not readable in plain text.
    ///
    /// NOTE: This is NOT a substitute for platform-level secure storage
    /// (e.g. Android Keystore / iOS Keychain).  It raises the bar above
    /// plain-text PlayerPrefs and is suitable for development / MVP.
    /// </summary>
    internal static class TokenEncryptor
    {
        // Salt used during PBKDF2 key derivation.
        // Changing this will invalidate all previously encrypted data.
        private static readonly byte[] Salt = Encoding.UTF8.GetBytes("VRArch_Salt_2026!");

        private const int KeySize = 256;   // AES-256
        private const int BlockSize = 128; // AES block
        private const int Iterations = 10_000;

        /// <summary>
        /// Encrypt plainText using a password derived from the device identifier.
        /// Returns a Base64-encoded string containing IV + ciphertext.
        /// </summary>
        public static string Encrypt(string plainText, string passphrase)
        {
            if (string.IsNullOrEmpty(plainText)) return string.Empty;

            using var aes = Aes.Create();
            aes.KeySize = KeySize;
            aes.BlockSize = BlockSize;
            aes.Mode = CipherMode.CBC;
            aes.Padding = PaddingMode.PKCS7;

            // Derive a key from the passphrase
            using var keyDerivation = new Rfc2898DeriveBytes(passphrase, Salt, Iterations, HashAlgorithmName.SHA256);
            aes.Key = keyDerivation.GetBytes(KeySize / 8);
            aes.GenerateIV();

            using var encryptor = aes.CreateEncryptor();
            byte[] plainBytes = Encoding.UTF8.GetBytes(plainText);
            byte[] cipherBytes = encryptor.TransformFinalBlock(plainBytes, 0, plainBytes.Length);

            // Prepend IV to ciphertext so we can decrypt later
            byte[] result = new byte[aes.IV.Length + cipherBytes.Length];
            Buffer.BlockCopy(aes.IV, 0, result, 0, aes.IV.Length);
            Buffer.BlockCopy(cipherBytes, 0, result, aes.IV.Length, cipherBytes.Length);

            return Convert.ToBase64String(result);
        }

        /// <summary>
        /// Decrypt a Base64-encoded string (IV + ciphertext) back to plaintext.
        /// Returns null on failure (corrupted data, wrong passphrase, etc.).
        /// </summary>
        public static string Decrypt(string encryptedBase64, string passphrase)
        {
            if (string.IsNullOrEmpty(encryptedBase64)) return null;

            try
            {
                byte[] fullCipher = Convert.FromBase64String(encryptedBase64);

                using var aes = Aes.Create();
                aes.KeySize = KeySize;
                aes.BlockSize = BlockSize;
                aes.Mode = CipherMode.CBC;
                aes.Padding = PaddingMode.PKCS7;

                int ivLength = BlockSize / 8;
                if (fullCipher.Length < ivLength + 1) return null;

                byte[] iv = new byte[ivLength];
                Buffer.BlockCopy(fullCipher, 0, iv, 0, ivLength);

                byte[] cipherBytes = new byte[fullCipher.Length - ivLength];
                Buffer.BlockCopy(fullCipher, ivLength, cipherBytes, 0, cipherBytes.Length);

                using var keyDerivation = new Rfc2898DeriveBytes(passphrase, Salt, Iterations, HashAlgorithmName.SHA256);
                aes.Key = keyDerivation.GetBytes(KeySize / 8);
                aes.IV = iv;

                using var decryptor = aes.CreateDecryptor();
                byte[] plainBytes = decryptor.TransformFinalBlock(cipherBytes, 0, cipherBytes.Length);

                return Encoding.UTF8.GetString(plainBytes);
            }
            catch (Exception ex)
            {
                Debug.LogWarning($"[TokenEncryptor] Decryption failed (data may be corrupted): {ex.Message}");
                return null;
            }
        }
    }
}
