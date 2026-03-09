using UnityEngine;

namespace VRArchitecture.Services.AI
{
    [CreateAssetMenu(fileName = "GeminiConfig", menuName = "VRA/AI/GeminiConfig")]
    public class GeminiConfig : ScriptableObject
    {
        [Header("API Key (Keep this secret!)")]
        [Tooltip("Get your key from Google AI Studio (aistudio.google.com)")]
        public string apiKey = "";

        [Header("Model Settings")]
        public string modelName = "gemini-1.5-flash-latest";
        public float temperature = 0.7f;
        public int maxOutputTokens = 1000;

        public string GetApiUrl()
        {
            return $"https://generativelanguage.googleapis.com/v1beta/models/{modelName}:generateContent?key={apiKey}";
        }
    }
}
