using UnityEngine;
using UnityEngine.UIElements;
using System.Collections.Generic;
using VRArchitecture.Services.Networking;
using VRArchitecture.DTOs.VR;

namespace VRArchitecture.UI.Overlays
{
    /// <summary>
    /// Implementation of the Presentation/Guided Tour UI (Screen 15).
    /// Handles slide navigation and presenter mode toggling.
    /// </summary>
    [RequireComponent(typeof(UIDocument))]
    public class PresentationModeUI : MonoBehaviour
    {
        [Serializable]
        public class SlideInfo
        {
            public string title;
            public string notes;
        }

        [Header("Presentation Data")]
        [SerializeField] private List<SlideInfo> _slides = new List<SlideInfo>();
        private int _currentSlideIndex = 0;

        private VisualElement _root;
        private Label _slideMetaLabel;
        private Label _slideTitleLabel;
        private Label _pageTitleLabel;
        private Label _pageNumLabel;
        private VisualElement _progressFill;
        private Label _notesLabel;
        
        private Button _prevBtn;
        private Button _nextBtn;
        private Button _endBtn;

        private bool _isPresenter = false;

        private void OnEnable()
        {
            _root = GetComponent<UIDocument>().rootVisualElement;
            BindElements();
            
            if (VRSignalRService.Instance != null)
            {
                VRSignalRService.Instance.OnSlideSynced += HandleRemoteSlideSync;
                VRSignalRService.Instance.OnPresentationStarted += (id) => {
                    if (id != VRSignalRService.Instance.ConnectionId) SetViewMode(false);
                };
            }

            UpdateUI();
        }

        private void BindElements()
        {
            _slideMetaLabel = _root.Q<Label>(null, "pres-slide-meta");
            _slideTitleLabel = _root.Q<Label>(null, "pres-slide-title");
            _pageTitleLabel = _root.Q<Label>(null, "pres-page-title");
            _pageNumLabel = _root.Q<Label>(null, "pres-page-num");
            _progressFill = _root.Q<VisualElement>(null, "pres-progress-fill");
            _notesLabel = _root.Q<Label>(null, "pres-note-text");

            _prevBtn = _root.Q<Button>(null, "pres-nav-btn").parent.Q<Button>(null, "pres-nav-btn"); // Need specific selection
            var navBtns = _root.Query<Button>(null, "pres-nav-btn").ToList();
            if (navBtns.Count >= 2)
            {
                _prevBtn = navBtns[0];
                _nextBtn = navBtns[1];
                _prevBtn.clicked += () => ChangeSlide(-1);
                _nextBtn.clicked += () => ChangeSlide(1);
            }

            _endBtn = _root.Q<Button>(null, "pres-end-btn");
            if (_endBtn != null) _endBtn.clicked += EndPresentation;
        }

        public void StartPresentation()
        {
            _isPresenter = true;
            SetViewMode(true);
            VRSignalRService.Instance?.BroadcastPresentationStart(VRSignalRService.Instance.ConnectionId);
            SyncSlide();
        }

        private void SetViewMode(bool asPresenter)
        {
            _isPresenter = asPresenter;
            // In a real implementation, we'd hide/show specific UI groups
            // For now, we adjust interaction
            if (_prevBtn != null) _prevBtn.SetEnabled(asPresenter);
            if (_nextBtn != null) _nextBtn.SetEnabled(asPresenter);
            if (_endBtn != null) _endBtn.style.display = asPresenter ? DisplayStyle.Flex : DisplayStyle.None;
        }

        private void ChangeSlide(int direction)
        {
            if (!_isPresenter) return;
            
            _currentSlideIndex = Mathf.Clamp(_currentSlideIndex + direction, 0, _slides.Count - 1);
            UpdateUI();
            SyncSlide();
        }

        private void UpdateUI()
        {
            if (_slides.Count == 0) return;
            var slide = _slides[_currentSlideIndex];

            if (_slideMetaLabel != null) _slideMetaLabel.text = $"Slide {_currentSlideIndex + 1} of {_slides.Count}";
            if (_slideTitleLabel != null) _slideTitleLabel.text = slide.title;
            if (_pageTitleLabel != null) _pageTitleLabel.text = slide.title;
            if (_pageNumLabel != null) _pageNumLabel.text = $"{_currentSlideIndex + 1} / {_slides.Count}";
            if (_notesLabel != null) _notesLabel.text = slide.notes;

            if (_progressFill != null)
            {
                float progress = ((float)_currentSlideIndex + 1) / _slides.Count * 100f;
                _progressFill.style.width = Length.Percent(progress);
            }
        }

        private void SyncSlide()
        {
            if (!_isPresenter || VRSignalRService.Instance == null) return;

            var syncData = new SlideSyncData {
                index = _currentSlideIndex,
                title = _slides[_currentSlideIndex].title
            };
            VRSignalRService.Instance.BroadcastSlide(JsonUtility.ToJson(syncData));
        }

        private void HandleRemoteSlideSync(string json)
        {
            if (_isPresenter) return;

            var data = JsonUtility.FromJson<SlideSyncData>(json);
            _currentSlideIndex = data.index;
            UpdateUI();
        }

        private void EndPresentation()
        {
            _isPresenter = false;
            VRSignalRService.Instance?.BroadcastPresentationEnd();
            gameObject.SetActive(false);
        }

        [Serializable]
        private class SlideSyncData { public int index; public string title; }
        
        private void Update()
        {
            if (_isPresenter && VRSignalRService.Instance != null)
            {
                // Sync camera transform every frame (or optimized at interval)
                var transformData = new PresenterTransformSync {
                    position = new Vector3Dto(Camera.main.transform.position),
                    rotation = new QuaternionDto(Camera.main.transform.rotation)
                };
                VRSignalRService.Instance.BroadcastPresenterTransform(JsonUtility.ToJson(transformData));
            }
        }

        [Serializable]
        private class PresenterTransformSync { public Vector3Dto position; public QuaternionDto rotation; }
    }
}
