using System.Collections;
using UnityEngine;
using UnityEngine.Networking;
using UnityEngine.UIElements;
using UnityEngine.XR;

namespace VRArchitecture.Onboarding
{
    /// <summary>
    /// Scene 03 — Meet the Architect (0:28–0:46)
    ///
    /// The architect avatar enters and greets the user with a voice message.
    /// A speech bubble fills up character by character via a typewriter effect.
    /// Pressing A button triggers a "handshake" and advances to the next scene.
    ///
    /// UXML element names:
    ///   #architect-avatar, #architect-name, #architect-role
    ///   #speech-bubble, #speech-text, #typing-dots, #handshake-prompt
    /// </summary>
    public class ArchitectSceneController : OnboardingSceneBase
    {
        // ─── Inspector ───────────────────────────────────────────────
        [Header("Architect — Config")]
        [SerializeField] private string _defaultWelcomeText = "Hello! Welcome to your project. We will review every detail together.";
        [SerializeField] private float  _typewriterSpeed    = 0.04f;   // seconds per character
        [SerializeField] private float  _holdAfterSpeech    = 0.8f;

        [Header("Architect — Audio")]
        [SerializeField] private AudioClip _appearClip;
        [SerializeField] private AudioClip _handshakeClip;
        [SerializeField] private float     _sfxVolume = 0.7f;

        // ─── Data ────────────────────────────────────────────────────
        private string _architectName  = "Your Architect";
        private Color  _architectColor = new Color(0.70f, 0.32f, 0.04f);
        private string _voiceClipUrl   = null;

        // ─── UI refs ─────────────────────────────────────────────────
        private VisualElement _architectAvatar;
        private Label         _architectNameLabel;
        private Label         _architectRoleLabel;
        private VisualElement _speechBubble;
        private Label         _speechText;
        private VisualElement _typingDots;
        private VisualElement _handshakePrompt;

        private Coroutine _introCoroutine;
        private Coroutine _preloadCoroutine;
        private bool      _speechDone;
        private AudioClip _voiceClip;

        // ─── Injection ───────────────────────────────────────────────
        public void Inject(string architectName, Color avatarColor, string voiceClipUrl = null)
        {
            _architectName  = architectName;
            _architectColor = avatarColor;
            _voiceClipUrl   = voiceClipUrl;
        }

        // ─── OnboardingSceneBase overrides ───────────────────────────
        protected override void OnActivate()
        {
            _architectAvatar    = _root.Q<VisualElement>("architect-avatar");
            _architectNameLabel = _root.Q<Label>("architect-name");
            _architectRoleLabel = _root.Q<Label>("architect-role");
            _speechBubble       = _root.Q<VisualElement>("speech-bubble");
            _speechText         = _root.Q<Label>("speech-text");
            _typingDots         = _root.Q<VisualElement>("typing-dots");
            _handshakePrompt    = _root.Q<VisualElement>("handshake-prompt");

            SetText(_architectNameLabel, _architectName);
            SetText(_architectRoleLabel, "Lead Architect");

            // Set avatar initials and background color
            if (_architectAvatar != null)
            {
                var lbl = _architectAvatar.Q<Label>() ?? new Label();
                lbl.text = GetInitials(_architectName);
                if (!_architectAvatar.Contains(lbl)) _architectAvatar.Add(lbl);
                _architectAvatar.style.backgroundColor = _architectColor;
            }

            SetDisplay(_handshakePrompt, false);
            SetDisplay(_speechBubble,    false);
            _speechDone = false;

            // Pre-load voice clip if a URL was provided
            if (!string.IsNullOrEmpty(_voiceClipUrl))
                _preloadCoroutine = StartCoroutine(PreloadVoiceClip(_voiceClipUrl));
        }

        protected override void OnBegin()
        {
            _introCoroutine = StartCoroutine(IntroSequence());
        }

        protected override void OnDeactivate()
        {
            if (_introCoroutine   != null) StopCoroutine(_introCoroutine);
            if (_preloadCoroutine != null) StopCoroutine(_preloadCoroutine);
        }

        protected override void OnBeginUpdate()
        {
            if (!_speechDone) return;

            // Check XR primary button (Meta Quest A) to advance
            var rightDevice = InputDevices.GetDeviceAtXRNode(XRNode.RightHand);
            if (rightDevice.TryGetFeatureValue(CommonUsages.primaryButton, out bool pressed) && pressed)
            {
                if (_handshakeClip != null) _audioSource.PlayOneShot(_handshakeClip, _sfxVolume);
                Advance();
            }
        }

        // ─── Intro sequence ───────────────────────────────────────────

        private IEnumerator IntroSequence()
        {
            // 1. Avatar appear animation
            if (_appearClip != null)
                _audioSource.PlayOneShot(_appearClip, _sfxVolume);
            _architectAvatar?.AddToClassList("architect-avatar--appear");

            yield return new WaitForSeconds(0.6f);

            // 2. Show speech bubble with typing indicator dots
            SetDisplay(_speechBubble, true);
            _speechBubble?.AddToClassList("speech-bubble--appear");
            SetDisplay(_typingDots, true);
            SetText(_speechText, "");

            // 3. Play voice clip if already loaded
            if (_voiceClip != null)
            {
                _audioSource.clip = _voiceClip;
                _audioSource.Play();
            }

            yield return new WaitForSeconds(0.5f);

            // 4. Typewriter effect
            SetDisplay(_typingDots, false);
            yield return StartCoroutine(TypewriterRoutine(_defaultWelcomeText));

            yield return new WaitForSeconds(_holdAfterSpeech);

            // 5. Show handshake prompt
            _speechDone = true;
            SetDisplay(_handshakePrompt, true);
            _handshakePrompt?.AddToClassList("handshake-prompt--pulse");

            _gazeAdvanceEnabled = true;
        }

        private IEnumerator TypewriterRoutine(string text)
        {
            if (_speechText == null) yield break;
            _speechText.text = "";
            foreach (char c in text)
            {
                _speechText.text += c;
                yield return new WaitForSeconds(_typewriterSpeed);
            }
        }

        // ─── Voice clip preload ────────────────────────────────────────

        private IEnumerator PreloadVoiceClip(string url)
        {
            using var req = UnityWebRequestMultimedia.GetAudioClip(url, AudioType.MPEG);
            yield return req.SendWebRequest();
            if (req.result == UnityWebRequest.Result.Success)
                _voiceClip = DownloadHandlerAudioClip.GetContent(req);
            else
                Debug.LogWarning($"[ArchitectSceneController] Voice clip load failed: {req.error}");
        }

        // ─── Utility ─────────────────────────────────────────────────

        private static string GetInitials(string name)
        {
            var parts = name.Split(' ', System.StringSplitOptions.RemoveEmptyEntries);
            return parts.Length >= 2
                ? $"{parts[0][0]}{parts[1][0]}"
                : name.Length >= 2 ? name[..2].ToUpper() : name.ToUpper();
        }
    }
}
