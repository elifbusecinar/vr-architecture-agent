using System;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UIElements;
using VRArchitecture.Models;
using VRArchitecture.Annotation;

namespace VRArchitecture.UI.Overlays
{
    /// <summary>
    /// Annotation Panel UI — side panel for viewing existing annotations.
    /// </summary>
    [RequireComponent(typeof(UIDocument))]
    public class AnnotationPanelUI : MonoBehaviour
    {
        private UIDocument _doc;
        private VisualElement _listContainer;
        private Label _countLabel;
        
        [Header("Templates")]
        [SerializeField] private VisualTreeAsset _annotationRowTemplate;
        
        [Header("Controller")]
        [SerializeField] private AnnotationController _controller;

        private void Awake()
        {
            _doc = GetComponent<UIDocument>();
            _listContainer = _doc.rootVisualElement.Q<VisualElement>("ap-scroll");
            _countLabel = _doc.rootVisualElement.Q<Label>("ap-count");
            
            if (_controller != null)
            {
                _controller.OnAnnotationCreated += AddAnnotationRow;
                _controller.OnAnnotationReceived += AddAnnotationRow;
            }
        }

        private void Start()
        {
            RefreshList();
        }

        public void RefreshList()
        {
            if (_listContainer == null || _controller == null) return;
            _listContainer.Clear();
            
            var annotations = _controller.GetSessionAnnotations();
            foreach (var a in annotations)
            {
                AddAnnotationRow(a);
            }
            UpdateCount(annotations.Count);
        }

        private void AddAnnotationRow(AnnotationData data)
        {
            if (_annotationRowTemplate == null || _listContainer == null) return;
            
            var row = _annotationRowTemplate.Instantiate();
            row.Q<Label>("an-name").text = data.AuthorName;
            row.Q<Label>("an-text").text = data.Note;
            row.Q<Label>("an-time").text = data.CreatedAt.ToString("HH:mm");
            row.Q<Label>("an-room").text = data.LocationLabel;
            
            var av = row.Q<VisualElement>("an-av");
            if (av != null)
            {
                av.style.backgroundColor = data.AuthorColor;
                av.Q<Label>().text = data.AuthorName.Substring(0, Mathf.Min(2, data.AuthorName.Length)).ToUpper();
            }

            row.RegisterCallback<PointerDownEvent>(evt => OnRowClicked(data));
            
            _listContainer.Insert(0, row); // Newest on top
            UpdateCount(_listContainer.childCount);
        }

        private void OnRowClicked(AnnotationData data)
        {
            Debug.Log($"[AnnotationPanel] Teleport to: {data.WorldPos}");
            // Teleport logic would go here
        }

        private void UpdateCount(int count)
        {
            if (_countLabel != null) _countLabel.text = count.ToString();
        }

        private void OnDestroy()
        {
            if (_controller != null)
            {
                _controller.OnAnnotationCreated -= AddAnnotationRow;
                _controller.OnAnnotationReceived -= AddAnnotationRow;
            }
        }
    }
}
