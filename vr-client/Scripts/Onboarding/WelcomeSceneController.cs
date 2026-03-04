using System.Collections;
using UnityEngine;
using UnityEngine.UIElements;

namespace VRArchitecture.Onboarding
{
    /// <summary>
    /// Scene 01 — Welcome (0:00–0:12)
    ///
    /// Personalised welcome card with client name and project name.
    /// Star particle system animated via USS.
    /// Wrist clock overlay shows the current real time.
    /// Gaze trigger: user gazes at the card centre for 1.5 s to advance.
    ///
    /// UXML element names:
    ///   #greeting-name, #greeting-project, #greeting-session-label
    ///   #wrist-time, #wrist-label
    ///   #gaze-ring           (progress ring)
    ///   #welcome-card        (float animation via USS class)
    ///   #stars-container     (stars are added at runtime)
    /// </summary>
    public class WelcomeSceneController : OnboardingSceneBase
    {
        // ─── Inspector ───────────────────────────────────────────────
        [Header("Welcome — Config")]
        [SerializeField] private Transform _gazeTargetTransform;
        [SerializeField] private int       _starCount = 60;

        [Header("Welcome — Audio")]
        [SerializeField] private AudioClip _ambientNightClip;
        [SerializeField] private float     _ambientVolume  = 0.25f;
        [SerializeField] private float     _fadeInSeconds  = 2.0f;

        // ─── Data (injected by OnboardingManager) ────────────────────
        private string   _clientName   = "Guest";
        private string   _projectName  = "Your Project";
        private DateTime _sessionStart = DateTime.Now;

        // ─── UI refs ─────────────────────────────────────────────────
        private Label         _greetingName;
        private Label         _greetingProject;
        private Label         _greetingSessionLabel;
        private Label         _wristTime;
        private VisualElement _welcomeCard;
        private VisualElement _starsContainer;
        private VisualElement _gazeRing;

        private Coroutine _clockCoroutine;
        private Coroutine _audioFadeCoroutine;

        // ─── Injection ───────────────────────────────────────────────
        public void Inject(string clientName, string projectName, DateTime sessionStart)
        {
            _clientName   = clientName;
            _projectName  = projectName;
            _sessionStart = sessionStart;
        }

        // ─── OnboardingSceneBase overrides ───────────────────────────
        protected override void OnActivate()
        {
            _greetingName         = _root.Q<Label>("greeting-name");
            _greetingProject      = _root.Q<Label>("greeting-project");
            _greetingSessionLabel = _root.Q<Label>("greeting-session-label");
            _wristTime            = _root.Q<Label>("wrist-time");
            _welcomeCard          = _root.Q<VisualElement>("welcome-card");
            _starsContainer       = _root.Q<VisualElement>("stars-container");
            _gazeRing             = _root.Q<VisualElement>("gaze-ring");

            PopulateText();
            SpawnStars();
        }

        protected override void OnBegin()
        {
            // Trigger floating animation via USS class
            _welcomeCard?.AddToClassList("welcome-card--floating");

            // Live wrist clock
            _clockCoroutine = StartCoroutine(ClockRoutine());

            // Ambient audio fade-in
            if (_ambientNightClip != null)
            {
                _audioSource.clip   = _ambientNightClip;
                _audioSource.loop   = true;
                _audioSource.volume = 0f;
                _audioSource.Play();
                _audioFadeCoroutine = StartCoroutine(FadeAudioIn(_ambientVolume, _fadeInSeconds));
            }

            _gazeAdvanceEnabled = true;
        }

        protected override void OnDeactivate()
        {
            if (_clockCoroutine     != null) StopCoroutine(_clockCoroutine);
            if (_audioFadeCoroutine != null) StopCoroutine(_audioFadeCoroutine);
            _welcomeCard?.RemoveFromClassList("welcome-card--floating");
        }

        protected override Transform GetGazeTarget() => _gazeTargetTransform;

        protected override void UpdateGazeProgress(float t)
        {
            if (_gazeRing == null) return;
            _gazeRing.style.rotate  = new StyleRotate(new Rotate(new Angle(t * 360f, AngleUnit.Degree)));
            _gazeRing.style.opacity = t > 0.01f ? 1f : 0f;
        }

        // ─── Helpers ─────────────────────────────────────────────────
        private void PopulateText()
        {
            SetText(_greetingName,         _clientName);
            SetText(_greetingProject,      _projectName);
            SetText(_greetingSessionLabel, $"Session · {_sessionStart:HH:mm}");
        }

        private void SpawnStars()
        {
            if (_starsContainer == null) return;
            _starsContainer.Clear();

            var rng = new System.Random(42);
            for (int i = 0; i < _starCount; i++)
            {
                var star = new VisualElement();
                star.AddToClassList("star");

                float size  = (float)(rng.NextDouble() * 2.5 + 0.5);
                float top   = (float)(rng.NextDouble() * 70);
                float left  = (float)(rng.NextDouble() * 100);
                float delay = (float)(rng.NextDouble() * 4);
                float dur   = (float)(rng.NextDouble() * 3 + 2);

                star.style.width  = size;
                star.style.height = size;
                star.style.top    = new Length(top,  LengthUnit.Percent);
                star.style.left   = new Length(left, LengthUnit.Percent);
                star.style.animationDelay    = new StyleList<TimeValue>(new[] { new TimeValue(delay) });
                star.style.animationDuration = new StyleList<TimeValue>(new[] { new TimeValue(dur) });

                _starsContainer.Add(star);
            }
        }

        private IEnumerator ClockRoutine()
        {
            while (true)
            {
                if (_wristTime != null)
                    _wristTime.text = DateTime.Now.ToString("HH:mm");
                yield return new WaitForSeconds(10f);
            }
        }

        private IEnumerator FadeAudioIn(float targetVolume, float duration)
        {
            float elapsed = 0f;
            while (elapsed < duration)
            {
                elapsed += Time.deltaTime;
                _audioSource.volume = Mathf.Lerp(0f, targetVolume, elapsed / duration);
                yield return null;
            }
            _audioSource.volume = targetVolume;
        }
    }
}
