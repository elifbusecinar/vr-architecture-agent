using System;
using System.Collections;
using System.Collections.Generic;
using System.Text;
using UnityEngine;
using UnityEngine.Networking;
using VRArchitecture.Services.Auth;

namespace VRArchitecture.Services
{
    /// <summary>
    /// APIService Singleton — central HTTP communication layer for the VR client.
    /// Handles authentication, project CRUD, sessions, annotations, and file downloads.
    /// Persist across scenes via DontDestroyOnLoad.
    /// </summary>
    public class APIService : MonoBehaviour
    {
        // ──────────────────────────────────────────────
        //  Singleton
        // ──────────────────────────────────────────────
        private static APIService _instance;
        public static APIService Instance
        {
            get
            {
                if (_instance == null)
                {
                    // Try finding an existing instance in the scene
                    _instance = FindObjectOfType<APIService>();

                    if (_instance == null)
                    {
                        // Auto-create if none exists
                        var go = new GameObject("[APIService]");
                        _instance = go.AddComponent<APIService>();
                        DontDestroyOnLoad(go);
                    }
                }
                return _instance;
            }
        }

        // ──────────────────────────────────────────────
        //  Configuration
        // ──────────────────────────────────────────────
        [Header("API Configuration")]
        [SerializeField] private string _baseUrl = "http://localhost:5246/api";
        [SerializeField] private float _requestTimeout = 30f;

        public string BaseUrl
        {
            get => _baseUrl;
            set => _baseUrl = value.TrimEnd('/');
        }

        public float RequestTimeout
        {
            get => _requestTimeout;
            set => _requestTimeout = Mathf.Max(1f, value);
        }

        // ──────────────────────────────────────────────
        //  Auth State
        // ──────────────────────────────────────────────
        private string _authToken;

        /// <summary>Current JWT token (loaded from encrypted storage if available).</summary>
        public string AuthToken
        {
            get
            {
                if (string.IsNullOrEmpty(_authToken))
                    _authToken = TokenStorage.LoadToken();
                return _authToken;
            }
        }
        public bool IsAuthenticated => !string.IsNullOrEmpty(AuthToken);

        // ──────────────────────────────────────────────
        //  Events
        // ──────────────────────────────────────────────
        public event Action OnAuthTokenChanged;
        public event Action<string> OnRequestError;

        // ──────────────────────────────────────────────
        //  Unity Lifecycle
        // ──────────────────────────────────────────────
        private void Awake()
        {
            if (_instance != null && _instance != this)
            {
                Debug.LogWarning("[APIService] Duplicate instance detected — destroying this one.");
                Destroy(gameObject);
                return;
            }

            _instance = this;
            DontDestroyOnLoad(gameObject);

            // Try to restore token from encrypted storage
            _authToken = TokenStorage.LoadToken();
            if (!string.IsNullOrEmpty(_authToken))
            {
                Debug.Log("[APIService] Restored auth token from secure storage.");
            }
        }

        private void OnApplicationQuit()
        {
            TokenStorage.OnApplicationQuit();
        }

        // ══════════════════════════════════════════════
        //  PUBLIC API — AUTHENTICATION
        // ══════════════════════════════════════════════

        /// <summary>Login and store the JWT token on success.</summary>
        /// <param name="rememberMe">When true, token persists across app restarts.</param>
        public void Login(string email, string password, Action<bool, string> callback, bool rememberMe = false)
        {
            var body = JsonUtility.ToJson(new LoginRequest { email = email, password = password });
            StartCoroutine(PostRequest("/auth/login", body, false, (success, json) =>
            {
                if (success)
                {
                    var response = JsonUtility.FromJson<TokenResponse>(json);
                    TokenStorage.SetRememberMe(rememberMe);
                    TokenStorage.SaveUserEmail(email);
                    TokenStorage.SaveRefreshToken(response.refreshToken); // Save refresh token
                    SetAuthToken(response.token, response.expiresIn);
                }
                callback?.Invoke(success, json);
            }));
        }

        private bool _isRefreshing = false;

        public IEnumerator RefreshTokenAsync(Action<bool> onComplete)
        {
            if (_isRefreshing) { yield break; }
            _isRefreshing = true;

            string refreshToken = TokenStorage.LoadRefreshToken();
            if (string.IsNullOrEmpty(refreshToken))
            {
                _isRefreshing = false;
                onComplete?.Invoke(false);
                yield break;
            }

            var body = JsonUtility.ToJson(new { refreshToken = refreshToken });
            var url = _baseUrl + "/auth/refresh";
            using var request = new UnityWebRequest(url, "POST");
            byte[] bodyRaw = Encoding.UTF8.GetBytes(body);
            request.uploadHandler = new UploadHandlerRaw(bodyRaw);
            request.downloadHandler = new DownloadHandlerBuffer();
            request.SetRequestHeader("Content-Type", "application/json");
            request.timeout = 10;

            yield return request.SendWebRequest();

            if (request.result == UnityWebRequest.Result.Success)
            {
                var response = JsonUtility.FromJson<TokenResponse>(request.downloadHandler.text);
                TokenStorage.SaveRefreshToken(response.refreshToken);
                SetAuthToken(response.token, response.expiresIn);
                _isRefreshing = false;
                onComplete?.Invoke(true);
            }
            else
            {
                Debug.LogWarning("[APIService] Refresh token failed. Logging out.");
                Logout();
                _isRefreshing = false;
                onComplete?.Invoke(false);
            }
        }

        /// <summary>Register a new user and store the JWT token on success.</summary>
        public void Register(string email, string password, string role, Action<bool, string> callback)
        {
            var body = JsonUtility.ToJson(new RegisterRequest { email = email, password = password, role = role });
            StartCoroutine(PostRequest("/auth/register", body, false, (success, json) =>
            {
                if (success)
                {
                    var response = JsonUtility.FromJson<TokenResponse>(json);
                    TokenStorage.SaveRefreshToken(response.refreshToken);
                    SetAuthToken(response.token, response.expiresIn);
                }
                callback?.Invoke(success, json);
            }));
        }

        /// <summary>Clear the stored token and all auth data (logout).</summary>
        public void Logout()
        {
            SetAuthToken(null);
            TokenStorage.ClearAll();
        }

        // ══════════════════════════════════════════════
        //  PUBLIC API — PROJECTS
        // ══════════════════════════════════════════════

        /// <summary>Fetch all projects for a given workspace.</summary>
        public void GetProjects(string workspaceId, Action<bool, string> callback)
        {
            StartCoroutine(GetRequest($"/projects?workspaceId={workspaceId}", true, callback));
        }

        /// <summary>Fetch a single project by ID (VR Manifest).</summary>
        public void GetProject(string projectId, Action<bool, string> callback)
        {
            StartCoroutine(GetRequest($"/projects/{projectId}", true, callback));
        }

        /// <summary>Update a project (PATCH).</summary>
        public void UpdateProject(string projectId, string jsonBody, Action<bool, string> callback)
        {
            StartCoroutine(PatchRequest($"/projects/{projectId}", jsonBody, true, callback));
        }

        /// <summary>Delete a project.</summary>
        public void DeleteProject(string projectId, Action<bool, string> callback)
        {
            StartCoroutine(DeleteRequest($"/projects/{projectId}", true, callback));
        }

        /// <summary>Toggle public sharing for a project.</summary>
        public void ToggleProjectSharing(string projectId, bool isPublic, Action<bool, string> callback)
        {
            var body = isPublic.ToString().ToLower(); // JSON boolean
            StartCoroutine(PostRequest($"/projects/{projectId}/share", body, true, callback));
        }

        /// <summary>Export project as GLB.</summary>
        public void ExportProjectGlb(string projectId, Action<bool, string> callback)
        {
            StartCoroutine(GetRequest($"/projects/{projectId}/export", true, callback));
        }

        // ══════════════════════════════════════════════
        //  PUBLIC API — SESSIONS (VR)
        // ══════════════════════════════════════════════

        /// <summary>Start a VR session for a project.</summary>
        public void StartSession(string projectId, Action<bool, string> callback)
        {
            StartCoroutine(PostRequest($"/sessions/start/{projectId}", null, true, callback));
        }

        /// <summary>End a VR session.</summary>
        public void EndSession(string sessionId, Action<bool, string> callback)
        {
            StartCoroutine(PostRequest($"/sessions/{sessionId}/end", null, true, callback));
        }

        /// <summary>Join an existing VR session.</summary>
        public void JoinSession(string sessionId, Action<bool, string> callback)
        {
            StartCoroutine(PostRequest($"/sessions/{sessionId}/join", null, true, callback));
        }

        /// <summary>Get currently active sessions.</summary>
        public void GetActiveSessions(Action<bool, string> callback)
        {
            StartCoroutine(GetRequest("/sessions/active", true, callback));
        }

        /// <summary>Get session history for the current user.</summary>
        public void GetSessionHistory(Action<bool, string> callback)
        {
            StartCoroutine(GetRequest("/sessions/history", true, callback));
        }

        // ══════════════════════════════════════════════
        //  PUBLIC API — ANNOTATIONS
        // ══════════════════════════════════════════════

        /// <summary>Create an annotation for a project.</summary>
        public void CreateAnnotation(string jsonBody, Action<bool, string> callback)
        {
            StartCoroutine(PostRequest("/annotations", jsonBody, true, callback));
        }

        /// <summary>Get all annotations for a project.</summary>
        public void GetProjectAnnotations(string projectId, Action<bool, string> callback)
        {
            StartCoroutine(GetRequest($"/annotations/project/{projectId}", true, callback));
        }

        /// <summary>Search annotations by query text.</summary>
        public void SearchAnnotations(string query, Action<bool, string> callback)
        {
            StartCoroutine(GetRequest($"/annotations/search?q={UnityWebRequest.EscapeURL(query)}", true, callback));
        }

        /// <summary>Delete an annotation by ID.</summary>
        public void DeleteAnnotation(string annotationId, Action<bool, string> callback)
        {
            StartCoroutine(DeleteRequest($"/annotations/{annotationId}", true, callback));
        }

        // ══════════════════════════════════════════════
        //  PUBLIC API — FILE DOWNLOADS
        // ══════════════════════════════════════════════

        /// <summary>Download a GLB model file as raw bytes.</summary>
        public void DownloadFile(string fileUrl, Action<bool, byte[]> callback)
        {
            StartCoroutine(DownloadBinaryRequest(fileUrl, callback));
        }

        // ══════════════════════════════════════════════
        //  INTERNAL — HTTP HELPERS
        // ══════════════════════════════════════════════

        private IEnumerator GetRequest(string endpoint, bool auth, Action<bool, string> callback, bool retried = false)
        {
            var url = _baseUrl + endpoint;
            using var request = UnityWebRequest.Get(url);
            ApplyHeaders(request, auth);
            request.timeout = (int)_requestTimeout;

            Debug.Log($"[APIService] GET {url}");
            yield return request.SendWebRequest();

            if (request.responseCode == 401 && auth && !retried)
            {
                Debug.Log("[APIService] 401 Unauthorized. Attempting refresh...");
                bool refreshSuccess = false;
                yield return RefreshTokenAsync(s => refreshSuccess = s);
                if (refreshSuccess)
                {
                    yield return GetRequest(endpoint, auth, callback, true);
                    yield break;
                }
            }

            HandleTextResponse(request, callback);
        }

        private IEnumerator PostRequest(string endpoint, string jsonBody, bool auth, Action<bool, string> callback, bool retried = false)
        {
            var url = _baseUrl + endpoint;
            using var request = new UnityWebRequest(url, "POST");

            if (!string.IsNullOrEmpty(jsonBody))
            {
                byte[] bodyRaw = Encoding.UTF8.GetBytes(jsonBody);
                request.uploadHandler = new UploadHandlerRaw(bodyRaw);
            }

            request.downloadHandler = new DownloadHandlerBuffer();
            request.SetRequestHeader("Content-Type", "application/json");
            ApplyHeaders(request, auth);
            request.timeout = (int)_requestTimeout;

            Debug.Log($"[APIService] POST {url}");
            yield return request.SendWebRequest();

            if (request.responseCode == 401 && auth && !retried)
            {
                Debug.Log("[APIService] 401 Unauthorized. Attempting refresh...");
                bool refreshSuccess = false;
                yield return RefreshTokenAsync(s => refreshSuccess = s);
                if (refreshSuccess)
                {
                    yield return PostRequest(endpoint, jsonBody, auth, callback, true);
                    yield break;
                }
            }

            HandleTextResponse(request, callback);
        }

        private IEnumerator PatchRequest(string endpoint, string jsonBody, bool auth, Action<bool, string> callback, bool retried = false)
        {
            var url = _baseUrl + endpoint;
            using var request = new UnityWebRequest(url, "PATCH");

            if (!string.IsNullOrEmpty(jsonBody))
            {
                byte[] bodyRaw = Encoding.UTF8.GetBytes(jsonBody);
                request.uploadHandler = new UploadHandlerRaw(bodyRaw);
            }

            request.downloadHandler = new DownloadHandlerBuffer();
            request.SetRequestHeader("Content-Type", "application/json");
            ApplyHeaders(request, auth);
            request.timeout = (int)_requestTimeout;

            Debug.Log($"[APIService] PATCH {url}");
            yield return request.SendWebRequest();

            if (request.responseCode == 401 && auth && !retried)
            {
                bool refreshSuccess = false;
                yield return RefreshTokenAsync(s => refreshSuccess = s);
                if (refreshSuccess)
                {
                    yield return PatchRequest(endpoint, jsonBody, auth, callback, true);
                    yield break;
                }
            }

            HandleTextResponse(request, callback);
        }

        private IEnumerator DeleteRequest(string endpoint, bool auth, Action<bool, string> callback, bool retried = false)
        {
            var url = _baseUrl + endpoint;
            using var request = UnityWebRequest.Delete(url);
            request.downloadHandler = new DownloadHandlerBuffer();
            ApplyHeaders(request, auth);
            request.timeout = (int)_requestTimeout;

            Debug.Log($"[APIService] DELETE {url}");
            yield return request.SendWebRequest();

            if (request.responseCode == 401 && auth && !retried)
            {
                bool refreshSuccess = false;
                yield return RefreshTokenAsync(s => refreshSuccess = s);
                if (refreshSuccess)
                {
                    yield return DeleteRequest(endpoint, auth, callback, true);
                    yield break;
                }
            }

            HandleTextResponse(request, callback);
        }

        private IEnumerator DownloadBinaryRequest(string url, Action<bool, byte[]> callback, bool retried = false)
        {
            using var request = UnityWebRequest.Get(url);
            ApplyHeaders(request, true);
            request.timeout = (int)_requestTimeout * 3; 

            Debug.Log($"[APIService] DOWNLOAD {url}");
            yield return request.SendWebRequest();

            if (request.responseCode == 401 && !retried)
            {
                bool refreshSuccess = false;
                yield return RefreshTokenAsync(s => refreshSuccess = s);
                if (refreshSuccess)
                {
                    yield return DownloadBinaryRequest(url, callback, true);
                    yield break;
                }
            }

            if (request.result == UnityWebRequest.Result.Success)
            {
                callback?.Invoke(true, request.downloadHandler.data);
            }
            else
            {
                Debug.LogError($"[APIService] Download failed: [{request.responseCode}] {request.error}");
                OnRequestError?.Invoke(request.error);
                callback?.Invoke(false, null);
            }
        }

        // ──────────────────────────────────────────────
        //  Utilities
        // ──────────────────────────────────────────────
        private void ApplyHeaders(UnityWebRequest request, bool auth)
        {
            request.SetRequestHeader("Accept", "application/json");

            if (auth && !string.IsNullOrEmpty(_authToken))
            {
                request.SetRequestHeader("Authorization", $"Bearer {_authToken}");
            }
        }

        private void HandleTextResponse(UnityWebRequest request, Action<bool, string> callback)
        {
            bool success = request.result == UnityWebRequest.Result.Success;
            string body = request.downloadHandler?.text ?? string.Empty;

            if (!success)
            {
                string errorMsg = $"[{request.responseCode}] {request.error} — {body}";
                Debug.LogError($"[APIService] Request failed: {errorMsg}");
                OnRequestError?.Invoke(errorMsg);
            }

            callback?.Invoke(success, body);
        }

        // ══════════════════════════════════════════════
        //  DTOs
        // ══════════════════════════════════════════════

        [Serializable]
        private class LoginRequest { public string email; public string password; }

        [Serializable]
        private class RegisterRequest { public string email; public string password; public string role; }

        [Serializable]
        private class TokenResponse
        {
            public string token;
            public string refreshToken;
            public int    expiresIn;
        }

        private void SetAuthToken(string token, int expiresInSeconds = 3600)
        {
            _authToken = token;

            if (string.IsNullOrEmpty(token))
            {
                TokenStorage.DeleteToken();
                TokenStorage.DeleteRefreshToken();
                Debug.Log("[APIService] Auth tokens cleared.");
            }
            else
            {
                TokenStorage.SaveToken(token, expiresInSeconds);
                Debug.Log("[APIService] Auth token stored (encrypted).");
            }

            OnAuthTokenChanged?.Invoke();
        }
    }
}
