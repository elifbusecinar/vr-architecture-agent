using System.Collections;
using UnityEngine;
using UnityEngine.UIElements;
using UnityEngine.XR;

namespace VRArchitecture.Onboarding
{
    /// <summary>
    /// Scene 04 — Controller Tutorial (0:46–1:10)
    ///
    /// Monkey-see monkey-do: the system demonstrates, then the user imitates.
    /// 3 steps: Raycast, Annotation, Teleport.
    /// Each completed step shows an audio and visual confirmation.
    /// A Skip button is always visible on the right controller panel.
    ///
    /// UXML element names:
    ///   #tutorial-step-label, #tutorial-instruction, #tutorial-action-key
    ///   #tutorial-ray, #tutorial-pin
    ///   #step-progress-bar (3 .progress-seg children)
    ///   #skip-button, #success-flash
    /// </summary>
    public class ControllerTutorialCtrl : OnboardingSceneBase
    {
        // ─── Inspector ───────────────────────────────────────────────
        [Header("Tutorial — Config")]
        [SerializeField] private float _demoDuration         = 2.0f;
        [SerializeField] private float _waitForUserTimeout   = 12.0f;
        [SerializeField] private float _successFlashDuration = 0.8f;

        [Header("Tutorial — Audio")]
        [SerializeField] private AudioClip _stepSuccessClip;
        [SerializeField] private AudioClip _tutorialCompleteClip;
        [SerializeField] private float     _sfxVolume = 0.7f;

        // ─── Step definitions (static) ────────────────────────────────
        private static readonly (string Title, string Instruction, string KeyLabel, TutorialAction Action)[] Steps =
        {
            ("Raycast",    "Point your right controller at an object", "Trigger",  TutorialAction.Raycast),
            ("Annotate",   "Press A to add an annotation pin",         "A Button", TutorialAction.Annotate),
            ("Teleport",   "Select a destination with the joystick",   "Joystick", TutorialAction.Teleport),
        };

        // ─── UI refs ─────────────────────────────────────────────────
        private Label         _stepLabel;
        private Label         _instruction;
        private Label         _actionKey;
        private VisualElement _tutorialRay;
        private VisualElement _tutorialPin;
        private VisualElement _progressBar;
        private VisualElement _skipButton;
        private VisualElement _successFlash;

        private int      _currentStep = 0;
        private bool     _waitingForUser;
        private Coroutine _stepCoroutine;

        // ─── OnboardingSceneBase overrides ───────────────────────────
        protected override void OnActivate()
        {
            _stepLabel    = _root.Q<Label>("tutorial-step-label");
            _instruction  = _root.Q<Label>("tutorial-instruction");
            _actionKey    = _root.Q<Label>("tutorial-action-key");
            _tutorialRay  = _root.Q<VisualElement>("tutorial-ray");
            _tutorialPin  = _root.Q<VisualElement>("tutorial-pin");
            _progressBar  = _root.Q<VisualElement>("step-progress-bar");
            _skipButton   = _root.Q<VisualElement>("skip-button");
            _successFlash = _root.Q<VisualElement>("success-flash");

            SetDisplay(_successFlash, false);
            SetDisplay(_tutorialPin,  false);

            _skipButton?.RegisterCallback<ClickEvent>(_ => SkipTutorial());
        }

        protected override void OnBegin()
        {
            _currentStep    = 0;
            _waitingForUser = false;
            _stepCoroutine  = StartCoroutine(RunStepSequence());
        }

        protected override void OnDeactivate()
        {
            if (_stepCoroutine != null) StopCoroutine(_stepCoroutine);
            _waitingForUser = false;
        }

        protected override void OnBeginUpdate()
        {
            if (_waitingForUser) CheckUserInput();
        }

        // ─── Step machine ─────────────────────────────────────────────

        private IEnumerator RunStepSequence()
        {
            for (int i = 0; i < Steps.Length; i++)
            {
                _currentStep = i;
                UpdateProgressBar(i);
                ShowStep(Steps[i]);

                // Demo phase
                yield return StartCoroutine(PlayDemo(Steps[i].Action));

                // Wait for user input
                _waitingForUser = true;
                float waited    = 0f;
                while (_waitingForUser && waited < _waitForUserTimeout)
                {
                    waited += Time.deltaTime;
                    yield return null;
                }
                _waitingForUser = false;

                yield return StartCoroutine(ShowSuccessFlash());
            }

            // All steps done
            if (_tutorialCompleteClip != null)
                _audioSource.PlayOneShot(_tutorialCompleteClip, _sfxVolume);

            yield return new WaitForSeconds(0.5f);
            Advance();
        }

        private IEnumerator PlayDemo(TutorialAction action)
        {
            _tutorialRay?.AddToClassList("tutorial-ray--active");

            if (action == TutorialAction.Annotate)
            {
                yield return new WaitForSeconds(_demoDuration * 0.5f);
                SetDisplay(_tutorialPin, true);
                _tutorialPin?.AddToClassList("tutorial-pin--drop");
            }

            yield return new WaitForSeconds(_demoDuration);
            _tutorialRay?.RemoveFromClassList("tutorial-ray--active");
        }

        private IEnumerator ShowSuccessFlash()
        {
            if (_stepSuccessClip != null)
                _audioSource.PlayOneShot(_stepSuccessClip, _sfxVolume);

            SetDisplay(_successFlash, true);
            _successFlash?.AddToClassList("success-flash--visible");
            yield return new WaitForSeconds(_successFlashDuration);
            _successFlash?.RemoveFromClassList("success-flash--visible");
            SetDisplay(_successFlash, false);
            SetDisplay(_tutorialPin,  false);
            _tutorialPin?.RemoveFromClassList("tutorial-pin--drop");
        }

        // ─── XR input detection ───────────────────────────────────────

        private void CheckUserInput()
        {
            if (_currentStep >= Steps.Length) return;
            var rightDevice = InputDevices.GetDeviceAtXRNode(XRNode.RightHand);

            switch (Steps[_currentStep].Action)
            {
                case TutorialAction.Raycast:
                    if (rightDevice.TryGetFeatureValue(CommonUsages.triggerButton, out bool trigger) && trigger)
                        _waitingForUser = false;
                    break;

                case TutorialAction.Annotate:
                    if (rightDevice.TryGetFeatureValue(CommonUsages.primaryButton, out bool aBtn) && aBtn)
                        _waitingForUser = false;
                    break;

                case TutorialAction.Teleport:
                    if (rightDevice.TryGetFeatureValue(CommonUsages.primary2DAxis, out Vector2 axis) && axis.magnitude > 0.5f)
                        _waitingForUser = false;
                    break;
            }
        }

        // ─── UI helpers ───────────────────────────────────────────────

        private void ShowStep((string Title, string Instruction, string KeyLabel, TutorialAction Action) step)
        {
            SetText(_stepLabel,   $"Step {_currentStep + 1} / {Steps.Length}");
            SetText(_instruction, step.Instruction);
            SetText(_actionKey,   step.KeyLabel);
        }

        private void UpdateProgressBar(int completedCount)
        {
            if (_progressBar == null) return;
            var segs = _progressBar.Query<VisualElement>(className: "progress-seg").ToList();
            for (int i = 0; i < segs.Count; i++)
            {
                segs[i].EnableInClassList("progress-seg--done",   i < completedCount);
                segs[i].EnableInClassList("progress-seg--active", i == completedCount);
            }
        }

        private void SkipTutorial()
        {
            if (_stepCoroutine != null) StopCoroutine(_stepCoroutine);
            _waitingForUser = false;
            Advance();
        }

        // ─── Enums ────────────────────────────────────────────────────
        private enum TutorialAction { Raycast, Annotate, Teleport }
    }
}
