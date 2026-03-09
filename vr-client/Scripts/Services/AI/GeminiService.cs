using System;
using System.Collections;
using System.Text;
using UnityEngine;
using UnityEngine.Networking;

namespace VRArchitecture.Services.AI
{
    /// <summary>
    /// Service for communicating with the Gemini API in Unity.
    /// Matches the pattern of APIService for consistent usage.
    /// </summary>
    public class GeminiService : MonoBehaviour
    {
        private static GeminiService _instance;
        public static GeminiService Instance
        {
            get
            {
                if (_instance == null)
                {
                    _instance = FindObjectOfType<GeminiService>();
                    if (_instance == null)
                    {
                        var go = new GameObject("[GeminiService]");
                        _instance = go.AddComponent<GeminiService>();
                        DontDestroyOnLoad(go);
                    }
                }
                return _instance;
            }
        }

        [SerializeField] private GeminiConfig _config;

        public GeminiConfig Config
        {
            get => _config;
            set => _config = value;
        }

        public void Ask(string prompt, Action<bool, string> callback)
        {
            if (_config == null)
            {
                Debug.LogError("[GeminiService] Config is missing. Please assign a GeminiConfig asset.");
                callback?.Invoke(false, "Config missing.");
                return;
            }

            if (string.IsNullOrEmpty(_config.apiKey))
            {
                Debug.LogError("[GeminiService] API Key is missing in GeminiConfig.");
                callback?.Invoke(false, "API Key missing.");
                return;
            }

            StartCoroutine(SendPromptCoroutine(prompt, callback));
        }

        private IEnumerator SendPromptCoroutine(string prompt, Action<bool, string> callback)
        {
            var requestData = new GeminiRequest
            {
                contents = new System.Collections.Generic.List<Content>
                {
                    new Content
                    {
                        parts = new System.Collections.Generic.List<Part> { new Part { text = prompt } }
                    }
                }
            };

            string json = JsonUtility.ToJson(requestData);
            string url = $"https://generativelanguage.googleapis.com/v1beta/models/{_config.modelName}:generateContent?key={_config.apiKey}";

            using (var request = new UnityWebRequest(url, "POST"))
            {
                byte[] bodyRaw = Encoding.UTF8.GetBytes(json);
                request.uploadHandler = new UploadHandlerRaw(bodyRaw);
                request.downloadHandler = new DownloadHandlerBuffer();
                request.SetRequestHeader("Content-Type", "application/json");

                yield return request.SendWebRequest();

                if (request.result == UnityWebRequest.Result.Success)
                {
                    try
                    {
                        var response = JsonUtility.FromJson<GeminiResponse>(request.downloadHandler.text);
                        var content = response?.candidates?[0]?.content?.parts?[0]?.text ?? "No response.";
                        callback?.Invoke(true, content);
                    }
                    catch (Exception ex)
                    {
                        Debug.LogError($"[GeminiService] Parsing failed: {ex.Message}");
                        callback?.Invoke(false, "Parsing Error.");
                    }
                }
                else
                {
                    string errorMsg = $"[{request.responseCode}] {request.error}";
                    Debug.LogError($"[GeminiService] Request failed: {errorMsg}\n{request.downloadHandler.text}");
                    callback?.Invoke(false, errorMsg);
                }
            }
        }
        public void AskWithAudio(string base64Audio, string mimeType, string prompt, Action<bool, string> callback)
        {
            if (_config == null)
            {
                Debug.LogError("[GeminiService] Config is missing. Please assign a GeminiConfig asset.");
                callback?.Invoke(false, "Config missing.");
                return;
            }

            if (string.IsNullOrEmpty(_config.apiKey))
            {
                Debug.LogError("[GeminiService] API Key is missing in GeminiConfig.");
                callback?.Invoke(false, "API Key missing.");
                return;
            }

            StartCoroutine(SendAudioCoroutine(base64Audio, mimeType, prompt, callback));
        }

        private IEnumerator SendAudioCoroutine(string base64Audio, string mimeType, string prompt, Action<bool, string> callback)
        {
            // Build custom JSON to avoid Null/Empty issues with JsonUtility
            string safePrompt = prompt.Replace("\"", "\\\"").Replace("\n", "\\n").Replace("\r", "");
            string json = $@"{{
                ""contents"": [{{
                    ""parts"": [
                        {{ ""text"": ""{safePrompt}"" }},
                        {{ ""inlineData"": {{ ""mimeType"": ""{mimeType}"", ""data"": ""{base64Audio}"" }} }}
                    ]
                }}]
            }}";

            string url = $"https://generativelanguage.googleapis.com/v1beta/models/{_config.modelName}:generateContent?key={_config.apiKey}";

            using (var request = new UnityWebRequest(url, "POST"))
            {
                byte[] bodyRaw = Encoding.UTF8.GetBytes(json);
                request.uploadHandler = new UploadHandlerRaw(bodyRaw);
                request.downloadHandler = new DownloadHandlerBuffer();
                request.SetRequestHeader("Content-Type", "application/json");

                yield return request.SendWebRequest();

                if (request.result == UnityWebRequest.Result.Success)
                {
                    try
                    {
                        var response = JsonUtility.FromJson<GeminiResponse>(request.downloadHandler.text);
                        var content = response?.candidates?[0]?.content?.parts?[0]?.text ?? "No response.";
                        callback?.Invoke(true, content);
                    }
                    catch (Exception ex)
                    {
                        Debug.LogError($"[GeminiService] Parsing failed: {ex.Message}");
                        callback?.Invoke(false, "Parsing Error.");
                    }
                }
                else
                {
                    string errorMsg = $"[{request.responseCode}] {request.error}";
                    Debug.LogError($"[GeminiService] Audio Request failed: {errorMsg}\n{request.downloadHandler.text}");
                    callback?.Invoke(false, errorMsg);
                }
            }
        }
    }
}
