using UnityEngine;
using UnityEngine.UIElements;
using UnityEngine.Networking;
using System.Threading.Tasks;
using VRArchitecture.UI.Common;

namespace VRArchitecture.UI.Overlays
{
    [RequireComponent(typeof(UIDocument))]
    public class BimInspectorUI : MonoBehaviour
    {
        private VisualElement _root;
        private Label _objectName;
        private Label _category;
        private Label _material;
        private Label _volume;
        private Label _cost;
        private VisualElement _detailsPanel;
        
        private string _apiUrl = "http://localhost:5031";

        private void OnEnable()
        {
            _root = GetComponent<UIDocument>().rootVisualElement;
            BindElements();
            _detailsPanel.style.display = DisplayStyle.None;
        }

        private void BindElements()
        {
            _detailsPanel = _root.Q<VisualElement>("bim-details-panel");
            _objectName = _root.Q<Label>("bim-obj-name");
            _category = _root.Q<Label>("bim-category");
            _material = _root.Q<Label>("bim-material");
            _volume = _root.Q<Label>("bim-volume");
            _cost = _root.Q<Label>("bim-cost");

            var closeBtn = _root.Q<Button>("bim-close-btn");
            if (closeBtn != null) closeBtn.clicked += () => _detailsPanel.style.display = DisplayStyle.None;
        }

        public async void InspectObject(string externalId)
        {
            _detailsPanel.style.display = DisplayStyle.Flex;
            _objectName.text = "Loading...";
            
            string projectId = "00000000-0000-0000-0000-000000000000";
            if (Session.SessionManager.Instance?.ActiveSession != null)
                projectId = Session.SessionManager.Instance.ActiveSession.ProjectId.ToString();

            string url = $"{_apiUrl}/api/BimMetadata/{projectId}/{externalId}";
            
            using var www = UnityWebRequest.Get(url);
            string token = PlayerPrefs.GetString("jwt_token", "");
            if (!string.IsNullOrEmpty(token)) www.SetRequestHeader("Authorization", $"Bearer {token}");

            var op = www.SendWebRequest();
            while (!op.isDone) await Task.Yield();

            if (www.result == UnityWebRequest.Result.Success)
            {
                var data = JsonUtility.FromJson<BimMetadataDto>(www.downloadHandler.text);
                PopulateUI(data);
            }
            else
            {
                _objectName.text = "No Metadata Found";
                VRToastManager.Instance?.ShowError($"BIM Data failed: {www.error}");
            }
        }

        private void PopulateUI(BimMetadataDto data)
        {
            _objectName.text = data.externalId;
            _category.text = data.category;
            _material.text = data.material;
            _volume.text = $"{data.volume:F2} m³";
            _cost.text = $"${data.estimatedCost:N0}";
        }

        [System.Serializable]
        private class BimMetadataDto
        {
            public string externalId;
            public string category;
            public string material;
            public float volume;
            public decimal estimatedCost;
        }
    }
}
