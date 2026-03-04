using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using UnityEngine;
using UnityEngine.Networking;

namespace VRArchitecture.Services.Http
{
    /// <summary>
    /// Async helper wrappers for UnityWebRequest.
    /// Provides Get, Post (JSON), PostFile (multipart), Put, Patch, Delete.
    /// All methods return Task&lt;ApiResponse&gt; and can be awaited.
    ///
    /// Usage:
    ///   var response = await WebRequestHelper.GetAsync("https://api.example.com/data", headers);
    ///   if (response.IsSuccess) { var dto = response.FromJson&lt;MyDto&gt;(); }
    /// </summary>
    public static class WebRequestHelper
    {
        // ══════════════════════════════════════════════
        //  GET
        // ══════════════════════════════════════════════

        /// <summary>
        /// Send an HTTP GET request.
        /// </summary>
        /// <param name="url">Full URL including query parameters.</param>
        /// <param name="headers">Optional headers (e.g. Authorization).</param>
        /// <param name="timeout">Timeout in seconds (default 30).</param>
        public static async Task<ApiResponse> GetAsync(
            string url,
            Dictionary<string, string> headers = null,
            int timeout = 30)
        {
            using var request = UnityWebRequest.Get(url);
            ApplyHeaders(request, headers);
            request.timeout = timeout;

            Debug.Log($"[WebRequestHelper] GET {url}");
            await request.SendWebRequest();

            return BuildResponse(request);
        }

        // ══════════════════════════════════════════════
        //  POST  (JSON body)
        // ══════════════════════════════════════════════

        /// <summary>
        /// Send an HTTP POST request with a JSON body.
        /// </summary>
        /// <param name="url">Full URL.</param>
        /// <param name="jsonBody">Serialized JSON string. Pass null for empty body.</param>
        /// <param name="headers">Optional headers.</param>
        /// <param name="timeout">Timeout in seconds.</param>
        public static async Task<ApiResponse> PostAsync(
            string url,
            string jsonBody,
            Dictionary<string, string> headers = null,
            int timeout = 30)
        {
            using var request = new UnityWebRequest(url, "POST");

            if (!string.IsNullOrEmpty(jsonBody))
            {
                byte[] bodyRaw = Encoding.UTF8.GetBytes(jsonBody);
                request.uploadHandler = new UploadHandlerRaw(bodyRaw);
            }

            request.downloadHandler = new DownloadHandlerBuffer();
            request.SetRequestHeader("Content-Type", "application/json");
            ApplyHeaders(request, headers);
            request.timeout = timeout;

            Debug.Log($"[WebRequestHelper] POST {url}");
            await request.SendWebRequest();

            return BuildResponse(request);
        }

        /// <summary>
        /// Post a serializable object as JSON.
        /// </summary>
        public static Task<ApiResponse> PostAsync<T>(
            string url,
            T body,
            Dictionary<string, string> headers = null,
            int timeout = 30)
        {
            string json = JsonUtility.ToJson(body);
            return PostAsync(url, json, headers, timeout);
        }

        // ══════════════════════════════════════════════
        //  POST FILE  (multipart/form-data)
        // ══════════════════════════════════════════════

        /// <summary>
        /// Upload a file using multipart/form-data POST.
        /// Optionally attach additional text form fields.
        /// </summary>
        /// <param name="url">Full URL.</param>
        /// <param name="fileData">Raw file bytes.</param>
        /// <param name="fileName">Display name of the file (e.g. "model.glb").</param>
        /// <param name="fileFieldName">Form field name expected by the server (default "file").</param>
        /// <param name="mimeType">MIME type (default "application/octet-stream").</param>
        /// <param name="formFields">Additional text form fields to send alongside the file.</param>
        /// <param name="headers">Optional headers (e.g. Authorization).</param>
        /// <param name="timeout">Timeout in seconds (default 120 for large files).</param>
        public static async Task<ApiResponse> PostFileAsync(
            string url,
            byte[] fileData,
            string fileName,
            string fileFieldName = "file",
            string mimeType = "application/octet-stream",
            Dictionary<string, string> formFields = null,
            Dictionary<string, string> headers = null,
            int timeout = 120)
        {
            var form = new List<IMultipartFormSection>();

            // Add the file part
            form.Add(new MultipartFormFileSection(fileFieldName, fileData, fileName, mimeType));

            // Add optional text fields
            if (formFields != null)
            {
                foreach (var kvp in formFields)
                {
                    form.Add(new MultipartFormDataSection(kvp.Key, kvp.Value));
                }
            }

            using var request = UnityWebRequest.Post(url, form);
            ApplyHeaders(request, headers);
            request.timeout = timeout;

            Debug.Log($"[WebRequestHelper] POST FILE {url} ({fileName}, {fileData.Length} bytes)");
            await request.SendWebRequest();

            return BuildResponse(request);
        }

        // ══════════════════════════════════════════════
        //  PUT  (JSON body)
        // ══════════════════════════════════════════════

        /// <summary>
        /// Send an HTTP PUT request with a JSON body.
        /// </summary>
        public static async Task<ApiResponse> PutAsync(
            string url,
            string jsonBody,
            Dictionary<string, string> headers = null,
            int timeout = 30)
        {
            using var request = new UnityWebRequest(url, "PUT");

            if (!string.IsNullOrEmpty(jsonBody))
            {
                byte[] bodyRaw = Encoding.UTF8.GetBytes(jsonBody);
                request.uploadHandler = new UploadHandlerRaw(bodyRaw);
            }

            request.downloadHandler = new DownloadHandlerBuffer();
            request.SetRequestHeader("Content-Type", "application/json");
            ApplyHeaders(request, headers);
            request.timeout = timeout;

            Debug.Log($"[WebRequestHelper] PUT {url}");
            await request.SendWebRequest();

            return BuildResponse(request);
        }

        // ══════════════════════════════════════════════
        //  PATCH  (JSON body)
        // ══════════════════════════════════════════════

        /// <summary>
        /// Send an HTTP PATCH request with a JSON body.
        /// </summary>
        public static async Task<ApiResponse> PatchAsync(
            string url,
            string jsonBody,
            Dictionary<string, string> headers = null,
            int timeout = 30)
        {
            using var request = new UnityWebRequest(url, "PATCH");

            if (!string.IsNullOrEmpty(jsonBody))
            {
                byte[] bodyRaw = Encoding.UTF8.GetBytes(jsonBody);
                request.uploadHandler = new UploadHandlerRaw(bodyRaw);
            }

            request.downloadHandler = new DownloadHandlerBuffer();
            request.SetRequestHeader("Content-Type", "application/json");
            ApplyHeaders(request, headers);
            request.timeout = timeout;

            Debug.Log($"[WebRequestHelper] PATCH {url}");
            await request.SendWebRequest();

            return BuildResponse(request);
        }

        // ══════════════════════════════════════════════
        //  DELETE
        // ══════════════════════════════════════════════

        /// <summary>
        /// Send an HTTP DELETE request.
        /// </summary>
        public static async Task<ApiResponse> DeleteAsync(
            string url,
            Dictionary<string, string> headers = null,
            int timeout = 30)
        {
            using var request = UnityWebRequest.Delete(url);
            request.downloadHandler = new DownloadHandlerBuffer();
            ApplyHeaders(request, headers);
            request.timeout = timeout;

            Debug.Log($"[WebRequestHelper] DELETE {url}");
            await request.SendWebRequest();

            return BuildResponse(request);
        }

        // ══════════════════════════════════════════════
        //  DOWNLOAD  (binary)
        // ══════════════════════════════════════════════

        /// <summary>
        /// Download a binary file (e.g. .glb model) from a URL.
        /// Returns the raw bytes in ApiResponse.Data on success.
        /// </summary>
        /// <param name="url">Full URL to the binary resource.</param>
        /// <param name="headers">Optional headers.</param>
        /// <param name="timeout">Timeout in seconds (default 300 for large files).</param>
        /// <param name="onProgress">Optional callback reporting download progress 0→1.</param>
        public static async Task<ApiResponse> DownloadAsync(
            string url,
            Dictionary<string, string> headers = null,
            int timeout = 300,
            Action<float> onProgress = null)
        {
            using var request = UnityWebRequest.Get(url);
            ApplyHeaders(request, headers);
            request.timeout = timeout;

            Debug.Log($"[WebRequestHelper] DOWNLOAD {url}");

            var operation = request.SendWebRequest();

            // Report progress while waiting
            while (!operation.isDone)
            {
                onProgress?.Invoke(operation.progress);
                await Task.Yield();
            }

            onProgress?.Invoke(1f);

            return BuildResponse(request);
        }

        // ══════════════════════════════════════════════
        //  INTERNAL UTILITIES
        // ══════════════════════════════════════════════

        /// <summary>
        /// Build a standard header dictionary with Bearer token.
        /// Convenience for callers who don't want to build it manually.
        /// </summary>
        public static Dictionary<string, string> AuthHeader(string token)
        {
            return new Dictionary<string, string>
            {
                { "Authorization", $"Bearer {token}" }
            };
        }

        /// <summary>
        /// Build a header dictionary with Bearer token plus extra headers.
        /// </summary>
        public static Dictionary<string, string> AuthHeader(string token, Dictionary<string, string> extra)
        {
            var headers = AuthHeader(token);
            if (extra != null)
            {
                foreach (var kvp in extra)
                {
                    headers[kvp.Key] = kvp.Value;
                }
            }
            return headers;
        }

        // ──────────────────────────────────────────────

        private static void ApplyHeaders(UnityWebRequest request, Dictionary<string, string> headers)
        {
            request.SetRequestHeader("Accept", "application/json");

            if (headers == null) return;

            foreach (var kvp in headers)
            {
                request.SetRequestHeader(kvp.Key, kvp.Value);
            }
        }

        private static ApiResponse BuildResponse(UnityWebRequest request)
        {
            bool success = request.result == UnityWebRequest.Result.Success;
            long statusCode = request.responseCode;
            string text = request.downloadHandler?.text ?? string.Empty;
            byte[] data = request.downloadHandler?.data;
            string error = success ? null : request.error;

            if (!success)
            {
                Debug.LogError($"[WebRequestHelper] [{statusCode}] {request.error} — {text.Substring(0, Math.Min(text.Length, 500))}");
            }

            return new ApiResponse(success, statusCode, text, data, error);
        }
    }
}
