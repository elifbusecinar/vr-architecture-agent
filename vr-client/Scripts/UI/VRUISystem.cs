using System;
using UnityEngine;
using UnityEngine.UI;
using UnityEngine.EventSystems;
using UnityEngine.XR.Interaction.Toolkit.UI;

namespace VRArchitecture.UI
{
    /// <summary>
    /// Programmatic setup for World Space Canvas in VR.
    /// Used for login, project list, and annotation input panels.
    /// </summary>
    public class VRUISystem : MonoBehaviour
    {
        [ContextMenu("Setup World Space Canvas")]
        public void CreateWorldCanvas()
        {
            // 1. Setup EventSystem if missing
            if (FindAnyObjectByType<EventSystem>() == null)
            {
                var eventSystemGo = new GameObject("EventSystem", typeof(EventSystem), typeof(XRUIInputModule));
                Debug.Log("[VRUISystem] XRUIInputModule EventSystem created.");
            }

            // 2. Create Canvas
            var canvasGo = new GameObject("VR World Canvas");
            var canvas = canvasGo.AddComponent<Canvas>();
            canvas.renderMode = RenderMode.WorldSpace;
            
            var scaler = canvasGo.AddComponent<CanvasScaler>();
            scaler.dynamicPixelsPerUnit = 10;
            
            canvasGo.AddComponent<GraphicRaycaster>();
            canvasGo.AddComponent<TrackedDeviceGraphicRaycaster>();

            // 3. Set Dimensions & Placement
            var rect = canvasGo.GetComponent<RectTransform>();
            rect.sizeDelta = new Vector2(800, 600);
            rect.localScale = Vector3.one * 0.001f; // Scale down to VR units
            canvasGo.transform.position = new Vector3(0, 1.3f, 2.0f); // In front of user

            // 4. Create Panels (Placeholders)
            CreatePanel(canvasGo.transform, "LoginPanel", new Color(0.1f, 0.1f, 0.1f, 0.9f));
            CreatePanel(canvasGo.transform, "ProjectListPanel", new Color(0.2f, 0.2f, 0.2f, 0.9f)).SetActive(false);
            
            Debug.Log("[VRUISystem] World space canvas for interaction setup complete.");
        }

        private GameObject CreatePanel(Transform parent, string name, Color color)
        {
            var panelGo = new GameObject(name, typeof(Image));
            panelGo.transform.SetParent(parent, false);
            
            var rect = panelGo.GetComponent<RectTransform>();
            rect.anchorMin = Vector2.zero;
            rect.anchorMax = Vector2.one;
            rect.sizeDelta = Vector2.zero;
            
            var image = panelGo.GetComponent<Image>();
            image.color = color;
            
            return panelGo;
        }
    }
}
