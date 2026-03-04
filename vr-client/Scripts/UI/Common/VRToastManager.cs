using UnityEngine;
using UnityEngine.UIElements;
using System.Collections;

namespace VRArchitecture.UI.Common
{
    /// <summary>
    /// Global manager for showing non-intrusive VR notifications (Toasts).
    /// </summary>
    public class VRToastManager : MonoBehaviour
    {
        public static VRToastManager Instance { get; private set; }

        [SerializeField] private UIDocument _toastDocument;
        private VisualElement _container;
        private Label _messageLabel;

        private void Awake()
        {
            if (Instance == null) Instance = this;
            else Destroy(gameObject);

            if (_toastDocument != null)
            {
                _container = _toastDocument.rootVisualElement.Q<VisualElement>("toast-container");
                _messageLabel = _toastDocument.rootVisualElement.Q<Label>("toast-message");
                
                if (_container != null) _container.style.display = DisplayStyle.None;
            }
        }

        public void ShowToast(string message, Color? color = null, float duration = 3f)
        {
            if (_container == null || _messageLabel == null)
            {
                Debug.Log($"[TOAST] {message}");
                return;
            }

            StopAllCoroutines();
            StartCoroutine(ToastRoutine(message, color ?? Color.white, duration));
        }

        private IEnumerator ToastRoutine(string message, Color color, float duration)
        {
            _messageLabel.text = message;
            _messageLabel.style.color = color;
            _container.style.display = DisplayStyle.Flex;
            _container.RemoveFromClassList("fade-out");
            _container.AddToClassList("fade-in");

            yield return new WaitForSeconds(duration);

            _container.RemoveFromClassList("fade-in");
            _container.AddToClassList("fade-out");

            yield return new WaitForSeconds(1f);
            _container.style.display = DisplayStyle.None;
        }

        public void ShowError(string message) => ShowToast(message, Color.red, 5f);
        public void ShowSuccess(string message) => ShowToast(message, Color.green, 3f);
    }
}
