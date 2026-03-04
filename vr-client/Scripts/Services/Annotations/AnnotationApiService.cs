using System.Collections.Generic;
using VRArchitecture.DTOs.Annotations;
using VRArchitecture.DTOs.VR;

namespace VRArchitecture.Services.Annotations
{
    /// <summary>
    /// Handles API communication for annotations in Unity VR client (T060).
    /// </summary>
    public class AnnotationApiService : MonoBehaviour
    {
        private static AnnotationApiService _instance;
        public static AnnotationApiService Instance
        {
            get
            {
                if (_instance == null)
                {
                    var go = new GameObject("[AnnotationApiService]");
                    _instance = go.AddComponent<AnnotationApiService>();
                    DontDestroyOnLoad(go);
                }
                return _instance;
            }
        }

        private string _apiUrl;
        private string _accessToken;

        public void Initialize(string apiUrl, string token)
        {
            _apiUrl = apiUrl;
            _accessToken = token;
        }

        public void CreateAnnotation(string projectId, string text, Vector3 position, Action<bool, AnnotationDto> callback)
        {
            StartCoroutine(PostAnnotationCoroutine(projectId, text, position, callback));
        }

        private IEnumerator PostAnnotationCoroutine(string projectId, string text, Vector3 position, Action<bool, AnnotationDto> callback)
        {
            var dto = new CreateAnnotationDto
            {
                projectId = projectId,
                text = text,
                positionX = position.x,
                positionY = position.y,
                positionZ = position.z
            };

            string json = JsonUtility.ToJson(dto);
            using var request = new UnityWebRequest($"{_apiUrl}/api/annotations", "POST");
            byte[] bodyRaw = Encoding.UTF8.GetBytes(json);
            request.uploadHandler = new UploadHandlerRaw(bodyRaw);
            request.downloadHandler = new DownloadHandlerBuffer();
            request.SetRequestHeader("Content-Type", "application/json");
            request.SetRequestHeader("Authorization", $"Bearer {_accessToken}");

            yield return request.SendWebRequest();

            if (request.result == UnityWebRequest.Result.Success)
            {
                var resultDto = JsonUtility.FromJson<AnnotationDto>(request.downloadHandler.text);
                Debug.Log("[AnnotationAPI] Annotation created successfully.");
                callback?.Invoke(true, resultDto);
            }
            else
            {
                Debug.LogError($"[AnnotationAPI] Failed to create annotation: {request.error}");
                callback?.Invoke(false, null);
            }
        }

        [Serializable]
        public class CreateAnnotationDto
        {
            public string projectId;
            public string text;
            public float positionX;
            public float positionY;
            public float positionZ;
            public string parentId;
        }
    }
}
