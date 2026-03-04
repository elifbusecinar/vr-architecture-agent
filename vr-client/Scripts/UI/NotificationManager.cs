using UnityEngine;
using UnityEngine.UIElements;
using System.Collections;
using VRArchitecture.Services.Networking;
using VRArchitecture.Session;

namespace VRArchitecture.UI
{
    public class NotificationManager : MonoBehaviour
    {
        public static NotificationManager Instance { get; private set; }

        [SerializeField] private UIDocument _uiDocument;
        [SerializeField] private VisualTreeAsset _inviteTemplate;

        private VisualElement _root;
        private VisualElement _container;

        private void Awake()
        {
            if (Instance != null) { Destroy(gameObject); return; }
            Instance = this;
            DontDestroyOnLoad(gameObject);

            _root = _uiDocument.rootVisualElement;
            _container = _root.Q<VisualElement>("notification-container");
            if (_container == null)
            {
                _container = new VisualElement { name = "notification-container" };
                _container.style.position = Position.Absolute;
                _container.style.top = 20;
                _container.style.right = 20;
                _root.Add(_container);
            }
        }

        private void Start()
        {
            VRSignalRService.Instance.OnSessionInvite += ShowSessionInvite;
            VRSignalRService.Instance.OnNotificationReceived += ShowNotification;
        }

        public void ShowNotification(VRSignalRService.NotificationSyncDto dto)
        {
            // Build visual element programmatically so we don't rely on Editor assigned serialized fields
            var toastItem = new VisualElement();
            toastItem.AddToClassList("toast-futuristic");
            toastItem.AddToClassList("toast-warning");
            toastItem.style.marginBottom = 10;

            var toastBody = new VisualElement();
            toastBody.AddToClassList("toast-body");
            
            var icon = new Label("🔔");
            icon.AddToClassList("toast-icon");
            
            var content = new VisualElement();
            content.AddToClassList("toast-content");

            var titleRow = new VisualElement();
            titleRow.AddToClassList("toast-title-row");

            var tag = new Label(dto.type?.ToUpper() ?? "INFO");
            tag.AddToClassList("toast-tag");
            tag.AddToClassList("tag-gold"); // Default fallback, could base on type
            if (dto.type == "material_request") { icon.text = "🎨"; tag.AddToClassList("tag-blue"); }

            var title = new Label(dto.title);
            title.AddToClassList("toast-title");
            
            titleRow.Add(tag);
            titleRow.Add(title);

            var msg = new Label(dto.message);
            msg.AddToClassList("toast-msg");

            var time = new Label("Just now");
            time.AddToClassList("toast-time");

            content.Add(titleRow);
            content.Add(msg);
            content.Add(time);

            toastBody.Add(icon);
            toastBody.Add(content);
            toastItem.Add(toastBody);

            // Close button
            var actions = new VisualElement();
            actions.AddToClassList("toast-actions");
            var closeBtn = new Button { text = "✕" };
            closeBtn.AddToClassList("toast-close");
            closeBtn.RegisterCallback<ClickEvent>(evt => toastItem.RemoveFromHierarchy());
            actions.Add(closeBtn);
            toastItem.Add(actions);

            _container.Add(toastItem);
            StartCoroutine(AutoDismiss(toastItem, 8f));
        }

        public void ShowSessionInvite(string sessionId, string inviterName)
        {
            var inviteElement = _inviteTemplate.Instantiate();
            var title = inviteElement.Q<Label>("title");
            if (title != null) title.text = $"Session Invite from {inviterName}";

            var acceptBtn = inviteElement.Q<Button>("accept");
            acceptBtn?.RegisterCallback<ClickEvent>(evt => {
                SessionManager.Instance.JoinSession(sessionId);
                inviteElement.RemoveFromHierarchy();
            });

            var declineBtn = inviteElement.Q<Button>("decline");
            declineBtn?.RegisterCallback<ClickEvent>(evt => {
                inviteElement.RemoveFromHierarchy();
            });

            _container.Add(inviteElement);
            StartCoroutine(AutoDismiss(inviteElement, 15f));
        }

        private IEnumerator AutoDismiss(VisualElement element, float delay)
        {
            yield return new WaitForSeconds(delay);
            if (element.parent != null) element.RemoveFromHierarchy();
        }
    }
}
