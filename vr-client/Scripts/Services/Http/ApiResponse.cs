using System;

namespace VRArchitecture.Services.Http
{
    /// <summary>
    /// Immutable result object returned by every WebRequestHelper call.
    /// Callers inspect IsSuccess before reading Data / Text.
    /// </summary>
    [Serializable]
    public class ApiResponse
    {
        /// <summary>True when HTTP 2xx is received.</summary>
        public bool IsSuccess { get; }

        /// <summary>HTTP status code (e.g. 200, 401, 500).</summary>
        public long StatusCode { get; }

        /// <summary>Response body as UTF-8 string (empty on binary-only responses).</summary>
        public string Text { get; }

        /// <summary>Response body as raw bytes (null on failure unless server still sent data).</summary>
        public byte[] Data { get; }

        /// <summary>Error message from UnityWebRequest (null on success).</summary>
        public string Error { get; }

        public ApiResponse(bool isSuccess, long statusCode, string text, byte[] data, string error)
        {
            IsSuccess = isSuccess;
            StatusCode = statusCode;
            Text = text ?? string.Empty;
            Data = data;
            Error = error;
        }

        // ── Convenience helpers ──

        /// <summary>Deserialize the JSON body into T via Unity's JsonUtility.</summary>
        public T FromJson<T>()
        {
            return UnityEngine.JsonUtility.FromJson<T>(Text);
        }

        /// <summary>Deserialize a JSON array by wrapping it: {"items": [...] }.</summary>
        public T FromJsonArray<T>()
        {
            string wrapped = "{\"items\":" + Text + "}";
            return UnityEngine.JsonUtility.FromJson<T>(wrapped);
        }

        public override string ToString()
        {
            return IsSuccess
                ? $"[ApiResponse OK {StatusCode}] {Text.Substring(0, Math.Min(Text.Length, 200))}"
                : $"[ApiResponse FAIL {StatusCode}] {Error}";
        }
    }
}
