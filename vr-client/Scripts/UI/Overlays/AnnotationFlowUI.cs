using System;
using System.Collections;
using System.Collections.Generic;
using System.Threading.Tasks;
using UnityEngine;
using UnityEngine.UIElements;
using UnityEngine.XR.Interaction.Toolkit;
using VRArchitecture.Annotation;
using VRArchitecture.Models;

namespace VRArchitecture.UI.Overlays
{
    /// <summary>
    /// Annotation Flow UI — a 3-step VR panel that guides the user through adding feedback.
    /// </summary>
    [RequireComponent(typeof(UIDocument))]
    public class AnnotationFlowUI : MonoBehaviour
    {
        // ─── Inspector ───────────────────────────────────────────────
        [Header("References")]
        [SerializeField] private UIDocument           _doc;
        [SerializeField] private AnnotationController _annotationController;

        [Header("XR")]
        [SerializeField] private ActionBasedController _rightController;

        // ─── UI Elements ─────────────────────────────────────────────
        private VisualElement _stepAim;
        private VisualElement _stepPlace;
        private VisualElement _stepDescribe;
        private VisualElement _confirmOverlay;
        private VisualElement _voiceVisualiser;
        private Label         _stepIndicator;
        private Label         _pinLocationTag;
        private TextField     _noteField;
        private Button        _btnSave;
        private Button        _btnCancel;
        private Button        _btnVoice;
        private Button        _btnText;
        private Button        _btnPriorityHigh;
        private Button        _btnPriorityMid;
        private Button        _btnPriorityLow;

        // ─── State ───────────────────────────────────────────────────
        private enum FlowStep { Aim = 1, Place, Describe, Done }
        private FlowStep        _currentStep = FlowStep.Aim;
        private Vector3         _hitPoint;
        private Vector3         _hitNormal;
        private string          _hitLocationLabel;
        private AnnotationPriority _priority = AnnotationPriority.Mid;
        private bool            _voiceModeActive;
        private bool            _isActive;

        // Voice recording state
        private AudioClip       _voiceClip;

        // ─── Lifecycle ───────────────────────────────────────────────
        private void Awake()
        {
            if (_doc == null) _doc = GetComponent<UIDocument>();
        }

        private void OnEnable()
        {
            _doc = GetComponent<UIDocument>();
            BindElements();
            BindButtons();
            Hide();
        }

        // ─── Public API ──────────────────────────────────────────────

        public void BeginAnnotationMode()
        {
            if (_isActive) return;
            _isActive = true;
            _doc.rootVisualElement.style.display = DisplayStyle.Flex;
            GoToStep(FlowStep.Aim);
        }

        public void OnHitConfirmed(Vector3 worldPoint, Vector3 worldNormal, string locationLabel)
        {
            if (_currentStep != FlowStep.Aim) return;
            _hitPoint         = worldPoint;
            _hitNormal        = worldNormal;
            _hitLocationLabel = locationLabel;
            GoToStep(FlowStep.Place);
        }

        public void OnPlacementConfirmed()
        {
            if (_currentStep != FlowStep.Place) return;
            GoToStep(FlowStep.Describe);
        }

        // ─── Element binding ─────────────────────────────────────────

        private void BindElements()
        {
            var root         = _doc.rootVisualElement;
            _stepAim         = root.Q<VisualElement>("step-aim");
            _stepPlace       = root.Q<VisualElement>("step-place");
            _stepDescribe    = root.Q<VisualElement>("step-describe");
            _confirmOverlay  = root.Q<VisualElement>("confirm-overlay");
            _voiceVisualiser = root.Q<VisualElement>("voice-visualiser");
            _stepIndicator   = root.Q<Label>("step-indicator");
            _pinLocationTag  = root.Q<Label>("pin-location-tag");
            _noteField       = root.Q<TextField>("note-field");
            _btnSave         = root.Q<Button>("btn-save");
            _btnCancel       = root.Q<Button>("btn-cancel");
            _btnVoice        = root.Q<Button>("mode-voice");
            _btnText         = root.Q<Button>("mode-text");
            _btnPriorityHigh = root.Q<Button>("priority-high");
            _btnPriorityMid  = root.Q<Button>("priority-mid");
            _btnPriorityLow  = root.Q<Button>("priority-low");
        }

        private void BindButtons()
        {
            _btnSave?.RegisterCallback<ClickEvent>(_ => _ = SaveAnnotationAsync());
            _btnCancel?.RegisterCallback<ClickEvent>(_ => Cancel());
            _btnVoice?.RegisterCallback<ClickEvent>(_ => SetInputMode(voice: true));
            _btnText?.RegisterCallback<ClickEvent>(_ => SetInputMode(voice: false));
            _btnPriorityHigh?.RegisterCallback<ClickEvent>(_ => SetPriority(AnnotationPriority.High));
            _btnPriorityMid?.RegisterCallback<ClickEvent>(_ => SetPriority(AnnotationPriority.Mid));
            _btnPriorityLow?.RegisterCallback<ClickEvent>(_ => SetPriority(AnnotationPriority.Low));
        }

        // ─── Step machine ────────────────────────────────────────────

        private void GoToStep(FlowStep step)
        {
            _currentStep = step;

            if (_stepIndicator != null)
                _stepIndicator.text = $"Step {(int)step} of 3";

            SetDisplay(_stepAim,      step == FlowStep.Aim);
            SetDisplay(_stepPlace,    step == FlowStep.Place);
            SetDisplay(_stepDescribe, step == FlowStep.Describe);

            if (step == FlowStep.Place && _pinLocationTag != null)
                _pinLocationTag.text = $"📍 {_hitLocationLabel}";

            if (step == FlowStep.Describe)
            {
                _stepDescribe.AddToClassList("step-describe--visible");
                SetInputMode(voice: false);
                SetPriority(AnnotationPriority.Mid);
                _noteField?.SetValueWithoutNotify(string.Empty);
            }
        }

        private async Task SaveAnnotationAsync()
        {
            if (_annotationController == null)
            {
                Debug.LogError("[AnnotationFlowUI] AnnotationController not assigned.");
                return;
            }

            string note;
            if (_voiceModeActive && _voiceClip != null)
            {
                note = await TranscribeVoiceAsync(_voiceClip);
            }
            else
            {
                note = _noteField?.value?.Trim() ?? string.Empty;
            }

            if (string.IsNullOrEmpty(note))
            {
                ShakePanel();
                return;
            }

            var data = new AnnotationData
            {
                Id            = Guid.NewGuid(),
                WorldPosition = _hitPoint,
                WorldNormal   = _hitNormal,
                LocationLabel = _hitLocationLabel,
                Note          = note,
                Priority      = _priority,
                CreatedAt     = DateTime.UtcNow,
            };

            await _annotationController.CreateAnnotationAsync(data);

            ShowConfirmation();
        }

        private void ShowConfirmation()
        {
            SetDisplay(_stepDescribe, false);
            SetDisplay(_confirmOverlay, true);
            _confirmOverlay.AddToClassList("confirm-overlay--visible");

            _doc.rootVisualElement.schedule.Execute(() =>
            {
                _confirmOverlay.RemoveFromClassList("confirm-overlay--visible");
                SetDisplay(_confirmOverlay, false);
                GoToStep(FlowStep.Aim);
            }).StartingIn(2000);
        }

        private void Cancel()
        {
            _stepDescribe.RemoveFromClassList("step-describe--visible");
            GoToStep(FlowStep.Aim);
        }

        private void Hide()
        {
            _isActive = false;
            _doc.rootVisualElement.style.display = DisplayStyle.None;
        }

        private void SetInputMode(bool voice)
        {
            _voiceModeActive = voice;
            SetDisplay(_voiceVisualiser, voice);
            if (_noteField != null) _noteField.style.display = voice ? DisplayStyle.None : DisplayStyle.Flex;

            // Updated class names to match potential USS classes
            _btnVoice?.EnableInClassList("mode-btn--active", voice);
            _btnText?.EnableInClassList("mode-btn--active", !voice);

            if (voice) StartVoiceCapture();
            else       StopVoiceCapture();
        }

        private void SetPriority(AnnotationPriority p)
        {
            _priority = p;
            _btnPriorityHigh?.EnableInClassList("priority-pill--active-high", p == AnnotationPriority.High);
            _btnPriorityMid?.EnableInClassList("priority-pill--active-mid",  p == AnnotationPriority.Mid);
            _btnPriorityLow?.EnableInClassList("priority-pill--active-low",  p == AnnotationPriority.Low);
        }

        private void StartVoiceCapture()
        {
            if (Microphone.devices.Length > 0)
                _voiceClip = Microphone.Start(null, false, 60, 44100);
            _voiceVisualiser?.AddToClassList("voice-vis--recording");
        }

        private void StopVoiceCapture()
        {
            if (Microphone.IsRecording(null)) Microphone.End(null);
            _voiceVisualiser?.RemoveFromClassList("voice-vis--recording");
        }

        private Task<string> TranscribeVoiceAsync(AudioClip clip)
        {
            Debug.Log("[AnnotationFlowUI] TranscribeVoiceAsync — stub.");
            return Task.FromResult("[Voice transcription placeholder]");
        }

        private void ShakePanel()
        {
            _stepDescribe?.AddToClassList("panel--shake");
            _doc.rootVisualElement.schedule.Execute(() =>
                _stepDescribe?.RemoveFromClassList("panel--shake"))
                .StartingIn(400);
        }

        private static void SetDisplay(VisualElement el, bool visible)
        {
            if (el != null) el.style.display = visible ? DisplayStyle.Flex : DisplayStyle.None;
        }
    }
}
