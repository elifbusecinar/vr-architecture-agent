using UnityEngine;
using UnityEngine.UIElements;
using System.Collections.Generic;

namespace VRArchitecture.UI
{
    /// <summary>
    /// Controls the wrist-mounted BIM layer toggle menu.
    /// Allows users to hide/show parts of the architectural model.
    /// </summary>
    public class WristMenuController : MonoBehaviour
    {
        [Header("UI Reference")]
        [SerializeField] private UIDocument _uiDocument;
        [SerializeField] private Transform  _parentModel;
        [SerializeField] private GameObject _aiChatOverlay;

        private VisualElement _root;
        private bool _isMenuVisible = false;

        private void OnEnable()
        {
            _root = _uiDocument.rootVisualElement;
            InitializeMenu();
            SetMenuVisibility(false);
        }

        private void InitializeMenu()
        {
            // Assuming UXML has buttons with specific names or classes
            var buttons = _root.Query<Button>().ToList();
            foreach (var btn in buttons)
            {
                if (btn.name == "btn-ai-chat")
                {
                    btn.clicked += ToggleAIChat;
                }
                else
                {
                    string targetName = btn.name;
                    btn.clicked += () => ToggleLayer(targetName);
                }
            }
        }

        private void ToggleAIChat()
        {
            if (_aiChatOverlay != null)
            {
                _aiChatOverlay.SetActive(!_aiChatOverlay.activeSelf);
                if (_aiChatOverlay.activeSelf) SetMenuVisibility(false);
            }
        }

        public void SetMenuVisibility(bool visible)
        {
            _isMenuVisible = visible;
            _root.style.display = visible ? DisplayStyle.Flex : DisplayStyle.None;
        }

        public void ToggleMenu() => SetMenuVisibility(!_isMenuVisible);

        private void ToggleLayer(string layerName)
        {
            if (_parentModel == null) return;

            // Search for children matching the layer name (e.g. "Walls", "Ceiling", "Furniture")
            foreach (Transform child in _parentModel)
            {
                if (child.name.ToLower().Contains(layerName.ToLower()))
                {
                    child.gameObject.SetActive(!child.gameObject.activeSelf);
                    Debug.Log($"[WristMenu] Toggled layer: {child.name} to {child.gameObject.activeSelf}");
                }
            }
        }
    }
}
