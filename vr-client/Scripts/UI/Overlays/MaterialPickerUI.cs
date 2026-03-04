using System;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UIElements;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UnityEngine.Networking;

namespace VRArchitecture.UI.Overlays
{
    /// <summary>
    /// Unity implementation of the Material Picker & Swatch Wall (Screen 11).
    /// Mirrors the logic and aesthetic of the web-based VR Interface.
    /// </summary>
    [RequireComponent(typeof(UIDocument))]
    public class MaterialPickerUI : MonoBehaviour
    {
        [Serializable]
        public class MaterialData
        {
            public string id;
            public string name;
            public string type;
            public Texture2D texture;
        }

        [Header("Material Database")]
        [SerializeField] private List<MaterialData> _materials = new List<MaterialData>();
        
        private VisualElement _root;
        private VisualElement _swatchGrid;
        private VisualElement _activePreview;
        private Label _activeName;
        private Label _activeCode;
        private Label _materialCountTag;
        
        private string _activeTab = "All";
        private MaterialData _selectedMaterial;

        // Modal Elements
        private VisualElement _requestModal;
        private TextField _reqNameInput;
        private TextField _reqDescInput;
        private Button _reqSubmitBtn;
        private Button _reqCancelBtn;

        // API Endpoint (This would usually come from a global config)
        private string _apiUrl = "http://localhost:5031"; 

        private void OnEnable()
        {
            _root = GetComponent<UIDocument>().rootVisualElement;
            BindElements();
            RefreshGrid();
        }

        private void BindElements()
        {
            _swatchGrid = _root.Q<ScrollView>("mat-grid");
            _activePreview = _root.Q<VisualElement>("mat-active-preview");
            _activeName = _root.Q<Label>("mat-active-name");
            _activeCode = _root.Q<Label>("mat-active-code");
            _materialCountTag = _root.Q<Label>("mat-count-tag");

            // Category Tabs
            var tabs = _root.Query<Button>(null, "mat-tab").ToList();
            foreach (var tab in tabs)
            {
                tab.clicked += () => SetTab(tab.text);
            }

            // Apply Button
            var applyBtn = _root.Q<Button>(null, "mat-apply-btn");
            if (applyBtn != null)
            {
                applyBtn.clicked += HandleApply;
            }

            // Request Button
            var requestBtn = _root.Q<Button>("mat-request-btn");
            if (requestBtn != null)
            {
                requestBtn.clicked += OpenRequestModal;
            }

            // Modal Setup
            _requestModal = _root.Q<VisualElement>("mat-request-modal");
            if (_requestModal != null)
            {
                var textFields = _requestModal.Query<TextField>().ToList();
                if (textFields.Count >= 2)
                {
                    _reqNameInput = textFields[0];
                    _reqDescInput = textFields[1];
                }

                _reqCancelBtn = _requestModal.Q<Button>(null, "mat-modal-cancel");
                _reqSubmitBtn = _requestModal.Q<Button>(null, "mat-modal-submit");

                if (_reqCancelBtn != null) _reqCancelBtn.clicked += CloseRequestModal;
                if (_reqSubmitBtn != null) _reqSubmitBtn.clicked += async () => { await SubmitRequest(); };
            }
        }

        private void SetTab(string tabName)
        {
            _activeTab = tabName;
            
            // Update UI active state
            var tabs = _root.Query<Button>(null, "mat-tab").ToList();
            foreach (var tab in tabs)
            {
                if (tab.text.Equals(tabName, StringComparison.OrdinalIgnoreCase))
                    tab.AddToClassList("active");
                else
                    tab.RemoveFromClassList("active");
            }

            RefreshGrid();
        }

        private void RefreshGrid()
        {
            if (_swatchGrid == null) return;
            _swatchGrid.Clear();

            var filtered = _materials.Where(m => _activeTab.Equals("All", StringComparison.OrdinalIgnoreCase) || 
                                              m.type.Equals(_activeTab, StringComparison.OrdinalIgnoreCase)).ToList();

            if (_materialCountTag != null)
                _materialCountTag.text = $"{filtered.Count} materials";

            // VisualElement to hold items (grid layout handle)
            var container = new VisualElement();
            container.style.flexDirection = FlexDirection.Row;
            container.style.flexWrap = Wrap.Wrap;
            container.style.justifyContent = Justify.SpaceBetween;
            container.style.paddingLeft = 1; // minor offsets for spacing

            foreach (var m in filtered)
            {
                var card = CreateSwatchCard(m);
                container.Add(card);
            }

            _swatchGrid.Add(container);

            if (_selectedMaterial == null && filtered.Count > 0)
                SelectMaterial(filtered[0]);
        }

        private VisualElement CreateSwatchCard(MaterialData m)
        {
            var card = new VisualElement();
            card.AddToClassList("mat-card");
            if (_selectedMaterial?.id == m.id) card.AddToClassList("selected");

            var preview = new VisualElement();
            preview.AddToClassList("mat-preview");
            if (m.texture != null)
                preview.style.backgroundImage = new StyleBackground(m.texture);

            var overlay = new VisualElement();
            overlay.AddToClassList("mat-overlay");
            var typeLabel = new Label(m.type.ToUpper());
            typeLabel.AddToClassList("mat-type-tag");
            overlay.Add(typeLabel);
            preview.Add(overlay);

            var info = new VisualElement();
            info.AddToClassList("mat-info");
            var nameLabel = new Label(m.name);
            nameLabel.AddToClassList("mat-name");
            var codeLabel = new Label(m.id);
            codeLabel.AddToClassList("mat-id");
            info.Add(nameLabel);
            info.Add(codeLabel);

            card.Add(preview);
            card.Add(info);

            card.RegisterCallback<ClickEvent>(evt => SelectMaterial(m));

            return card;
        }

        private void SelectMaterial(MaterialData m)
        {
            _selectedMaterial = m;
            
            // Update selection visuals in grid
            _swatchGrid.Query<VisualElement>(null, "mat-card").ForEach(c => c.RemoveFromClassList("selected"));
            // ... would require mapping cards but since we re-render, we'll just check it in RefreshGrid next time if we did shared selection.
            // For now, let's just update the toolbar.
            
            if (_activePreview != null && m.texture != null)
                _activePreview.style.backgroundImage = new StyleBackground(m.texture);
            
            if (_activeName != null) _activeName.text = m.name;
            if (_activeCode != null) _activeCode.text = m.id;
        }

        private void HandleApply()
        {
            if (_selectedMaterial == null) return;
            Debug.Log($"[MaterialPicker] Applying {_selectedMaterial.name} to target surface...");
            // Trigger actual material assignment via SignalR or Versioning system
        }

        private void OpenRequestModal()
        {
            if (_requestModal == null) return;
            _requestModal.style.display = DisplayStyle.Flex;
            if (_reqNameInput != null) _reqNameInput.value = "";
            if (_reqDescInput != null) _reqDescInput.value = "";
        }

        private void CloseRequestModal()
        {
            if (_requestModal == null) return;
            _requestModal.style.display = DisplayStyle.None;
        }

        [Serializable]
        private class MatRequestDto
        {
            public string name;
            public string description;
        }

        private async Task SubmitRequest()
        {
            if (_reqNameInput == null || string.IsNullOrWhiteSpace(_reqNameInput.value))
            {
                Debug.LogWarning("[MaterialPicker] Name is required for custom texture request.");
                return;
            }

            var dto = new MatRequestDto
            {
                name = _reqNameInput.value,
                description = _reqDescInput?.value ?? ""
            };

            string json = JsonUtility.ToJson(dto);
            byte[] bodyRaw = Encoding.UTF8.GetBytes(json);

            // Fetch Token from PlayerPrefs or Auth system
            string token = PlayerPrefs.GetString("jwt_token", "");

            using var www = new UnityWebRequest($"{_apiUrl}/api/materials/request", "POST");
            www.uploadHandler = new UploadHandlerRaw(bodyRaw);
            www.downloadHandler = new DownloadHandlerBuffer();
            www.SetRequestHeader("Content-Type", "application/json");
            if (!string.IsNullOrEmpty(token))
            {
                www.SetRequestHeader("Authorization", $"Bearer {token}");
            }

            var operation = www.SendWebRequest();
            while (!operation.isDone) await Task.Yield();

            if (www.result == UnityWebRequest.Result.Success)
            {
                Debug.Log("[MaterialPicker] Request submitted successfully!");
                CloseRequestModal();
            }
            else
            {
                Debug.LogError($"[MaterialPicker] Failed to submit request: {www.error} - {www.downloadHandler.text}");
            }
        }
    }
}
