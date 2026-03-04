using System.Threading.Tasks;
using UnityEngine;
using UnityEngine.UIElements;
using System.Collections.Generic;

namespace VRArchitecture.Onboarding
{
    /// <summary>
    /// Base class for all 5 onboarding scene controllers.
    ///
    /// Each scene controller extends this:
    ///   - Binds UIDocument elements
    ///   - Manages fade in/out (CanvasGroup alpha or USS opacity)
    ///   - Calls OnboardingManager.Instance.AdvanceToNext()
    ///
    /// Contains shared helpers for gaze triggers, audio, and USS animations.
    /// </summary>
    [RequireComponent(typeof(UIDocument))]
    public abstract class OnboardingSceneBase : MonoBehaviour, IOnboardingScene
    {
        // ─── Inspector ───────────────────────────────────────────────
        [Header("Base — Scene")]
        [SerializeField] protected UIDocument _doc;
        [SerializeField] protected AudioSource _audioSource;

        [Header("Base — Gaze Trigger")]
        [Tooltip("When enabled, the user advances by gazing at the center for X seconds.")]
        [SerializeField] protected bool  _gazeAdvanceEnabled = false;
        [SerializeField] protected float _gazeDwellSeconds   = 1.5f;

        [Header("Base — Timing")]
        [SerializeField] protected float _autoAdvanceAfterSeconds = 0f;   // 0 = disabled

        // ─── State ───────────────────────────────────────────────────
        protected VisualElement _root;
        protected bool          _isActive;
        protected bool          _hasAdvanced;
        private   float         _gazeTimer;
        private   float         _autoTimer;

        // ─── Unity ───────────────────────────────────────────────────
        protected virtual void Awake()
        {
            if (_doc == null) _doc = GetComponent<UIDocument>();
        }

        protected virtual void Update()
        {
            if (!_isActive || _hasAdvanced) return;

            HandleGazeTrigger();
            HandleAutoAdvance();
            OnBeginUpdate();
        }

        // ─── IOnboardingScene ─────────────────────────────────────────

        public virtual void Activate()
        {
            _root = _doc.rootVisualElement;
            _root.style.display   = DisplayStyle.Flex;
            _root.style.opacity   = 0f;
            _isActive    = false;
            _hasAdvanced = false;
            _gazeTimer   = 0f;
            _autoTimer   = 0f;
            OnActivate();
        }

        public virtual void Deactivate()
        {
            _isActive = false;
            if (_root != null)
                _root.style.display = DisplayStyle.None;
            OnDeactivate();
        }

        public virtual void Begin()
        {
            _isActive = true;
            OnBegin();
        }

        public async Task FadeInAsync(float duration)
        {
            if (_root == null) return;
            _root.style.opacity = 0f;
            float elapsed = 0f;
            while (elapsed < duration)
            {
                elapsed += Time.deltaTime;
                _root.style.opacity = Mathf.Clamp01(elapsed / duration);
                await Task.Yield();
            }
            _root.style.opacity = 1f;
        }

        public async Task FadeOutAsync(float duration)
        {
            if (_root == null) return;
            float elapsed = 0f;
            while (elapsed < duration)
            {
                elapsed += Time.deltaTime;
                _root.style.opacity = Mathf.Clamp01(1f - elapsed / duration);
                await Task.Yield();
            }
            _root.style.opacity = 0f;
        }

        // ─── Gaze trigger ─────────────────────────────────────────────

        private void HandleGazeTrigger()
        {
            if (!_gazeAdvanceEnabled) return;

            bool isGazing = CheckGaze();

            if (isGazing)
            {
                _gazeTimer += Time.deltaTime;
                UpdateGazeProgress(_gazeTimer / _gazeDwellSeconds);

                if (_gazeTimer >= _gazeDwellSeconds)
                    Advance();
            }
            else
            {
                if (_gazeTimer > 0f)
                {
                    _gazeTimer = Mathf.Max(0f, _gazeTimer - Time.deltaTime * 2f); // decay
                    UpdateGazeProgress(_gazeTimer / _gazeDwellSeconds);
                }
            }
        }

        /// <summary>
        /// Override to implement platform-specific gaze detection.
        /// Default: checks if XR head forward hits a sphere around the gaze target.
        /// </summary>
        protected virtual bool CheckGaze()
        {
            var cam = Camera.main;
            if (cam == null) return false;

            var target = GetGazeTarget();
            if (target == null) return false;

            var toTarget = (target.position - cam.transform.position).normalized;
            float dot = Vector3.Dot(cam.transform.forward, toTarget);
            return dot > 0.96f;   // ~15 degree cone
        }

        protected virtual Transform GetGazeTarget() => null;

        /// <summary>
        /// Called each frame while gaze is active. t = 0..1
        /// Override to update a progress ring or gaze indicator in USS.
        /// </summary>
        protected virtual void UpdateGazeProgress(float t)
        {
            _root?.Q<VisualElement>("gaze-ring")?.style.SetProperty("--gaze-progress", t.ToString("F2"));
        }

        // ─── Auto-advance ─────────────────────────────────────────────

        private void HandleAutoAdvance()
        {
            if (_autoAdvanceAfterSeconds <= 0f) return;
            _autoTimer += Time.deltaTime;
            if (_autoTimer >= _autoAdvanceAfterSeconds)
                Advance();
        }

        // ─── Advance ─────────────────────────────────────────────────

        protected void Advance()
        {
            if (_hasAdvanced) return;
            _hasAdvanced = true;
            OnboardingManager.Instance?.AdvanceToNext();
        }

        // ─── Helpers ─────────────────────────────────────────────────

        protected static void SetDisplay(VisualElement el, bool visible)
        {
            if (el != null)
                el.style.display = visible ? DisplayStyle.Flex : DisplayStyle.None;
        }

        protected static void SetText(Label lbl, string text)
        {
            if (lbl != null) lbl.text = text;
        }

        protected IEnumerator<float> PlayClipAndWait(AudioClip clip)
        {
            if (_audioSource == null || clip == null) yield break;
            _audioSource.clip = clip;
            _audioSource.Play();
            float t = 0;
            while (t < clip.length) { t += Time.deltaTime; yield return t; }
        }

        // ─── Abstract hooks ───────────────────────────────────────────

        /// <summary>Called once when the scene becomes visible (before FadeIn).</summary>
        protected virtual void OnActivate() { }

        /// <summary>Called once when the scene becomes active and input is enabled.</summary>
        protected virtual void OnBegin() { }

        /// <summary>Called when the scene is hidden.</summary>
        protected virtual void OnDeactivate() { }

        /// <summary>Called every frame for custom scene logic.</summary>
        protected virtual void OnBeginUpdate() { }
    }

    public interface IOnboardingScene
    {
        void Activate();
        void Deactivate();
        void Begin();
        Task FadeInAsync(float duration);
        Task FadeOutAsync(float duration);
    }
}
