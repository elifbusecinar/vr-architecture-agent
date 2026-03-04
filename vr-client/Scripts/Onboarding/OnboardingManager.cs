using System;
using System.Threading.Tasks;
using UnityEngine;
using UnityEngine.Events;
using UnityEngine.UIElements;
using VRArchitecture.Services;

namespace VRArchitecture.Onboarding
{
    /// <summary>
    /// OnboardingManager — central state machine.
    ///
    /// Responsibilities:
    ///   • Manages transition order between 5 scenes
    ///   • Hides HUDController during onboarding
    ///   • Injects session data into all scene controllers
    ///   • Skips directly to session if onboarding already completed (PlayerPrefs flag)
    ///
    /// SETUP:
    ///   1. Attach to an empty GameObject in the Bootstrap scene.
    ///   2. Link all 5 scene controllers via Inspector.
    ///   3. Assign UIDocument with OnboardingRoot.uxml to the UIDocument field.
    ///   4. Call BeginAsync(sessionData) before joining the VR session.
    /// </summary>
    public class OnboardingManager : MonoBehaviour
    {
        // ─── Singleton ───────────────────────────────────────────────
        public static OnboardingManager Instance { get; private set; }

        // ─── Inspector ───────────────────────────────────────────────
        [Header("Scene Controllers")]
        [SerializeField] private WelcomeSceneController   _welcomeCtrl;
        [SerializeField] private PlotSceneController      _plotCtrl;
        [SerializeField] private ArchitectSceneController _architectCtrl;
        [SerializeField] private ControllerTutorialCtrl   _tutorialCtrl;
        [SerializeField] private FirstFlightController    _flightCtrl;

        [Header("References")]
        [SerializeField] private GameObject  _hud;
        [SerializeField] private UIDocument  _uiDocument;
        [SerializeField] private AudioSource _musicSource;

        [Header("Config")]
        [Tooltip("Show on every session. When disabled, skipped after the first session.")]
        [SerializeField] private bool  _alwaysShow       = false;
        [SerializeField] private float _sceneFadeDuration = 0.4f;
        [Tooltip("Check this flag to reset completed onboarding progress.")]
        [SerializeField] private bool  _resetProgressNow = false;

        [Header("Events")]
        public UnityEvent OnOnboardingStarted  = new();
        public UnityEvent OnOnboardingComplete = new();

        // ─── State ───────────────────────────────────────────────────
        public OnboardingScene CurrentScene { get; private set; } = OnboardingScene.None;
        public bool            IsRunning    { get; private set; }

        private SessionData        _sessionData;
        private IOnboardingScene[] _scenes;

        private const string PREFS_KEY = "vra_onboarding_done";

        // ─── Lifecycle ───────────────────────────────────────────────
        private void Awake()
        {
            if (Instance != null && Instance != this) { Destroy(gameObject); return; }
            Instance = this;
            DontDestroyOnLoad(gameObject);
        }

        private void OnValidate()
        {
            if (_resetProgressNow)
            {
                PlayerPrefs.DeleteKey(PREFS_KEY);
                _resetProgressNow = false;
                Debug.Log("[OnboardingManager] Onboarding progress reset.");
            }
        }

        private void Start()
        {
            // Build scene array in order
            _scenes = new IOnboardingScene[]
            {
                _welcomeCtrl,
                _plotCtrl,
                _architectCtrl,
                _tutorialCtrl,
                _flightCtrl,
            };

            // Deactivate all scene roots at startup
            foreach (var s in _scenes) s?.Deactivate();
        }

        // ─── Public API ──────────────────────────────────────────────

        /// <summary>
        /// Call immediately after receiving session data, before joining the VR session.
        /// If onboarding was already completed and _alwaysShow is false, skips straight to join.
        /// </summary>
        public async Task BeginAsync(SessionData sessionData)
        {
            _sessionData = sessionData ?? throw new ArgumentNullException(nameof(sessionData));

            if (!_alwaysShow && PlayerPrefs.GetInt(PREFS_KEY, 0) == 1)
            {
                Debug.Log("[OnboardingManager] Onboarding already completed — skipping.");
                await JoinSessionDirectAsync();
                return;
            }

            IsRunning = true;
            OnOnboardingStarted.Invoke();

            // Hide HUD during onboarding
            if (_hud != null) _hud.SetActive(false);

            if (_uiDocument != null)
                _uiDocument.rootVisualElement.style.display = DisplayStyle.Flex;

            InjectSessionData(sessionData);

            await TransitionToAsync(OnboardingScene.Welcome);
        }

        /// <summary>
        /// Called by each scene controller when its completion condition is met.
        /// </summary>
        public void AdvanceToNext()
        {
            if (!IsRunning) return;

            var next = CurrentScene + 1;
            if (next > OnboardingScene.FirstFlight)
                _ = CompleteAsync();
            else
                _ = TransitionToAsync(next);
        }

        /// <summary>
        /// Skip directly to session — e.g. from the Skip button in tutorial.
        /// </summary>
        public void SkipOnboarding() => _ = CompleteAsync();

        // ─── Scene transitions ────────────────────────────────────────

        private async Task TransitionToAsync(OnboardingScene target)
        {
            // Fade out the current scene
            if (CurrentScene != OnboardingScene.None)
            {
                var current = _scenes[(int)CurrentScene];
                await current.FadeOutAsync(_sceneFadeDuration);
                current.Deactivate();
            }

            CurrentScene = target;
            var next = _scenes[(int)target];
            if (next == null)
            {
                Debug.LogError($"[OnboardingManager] Scene controller for {target} is missing!");
                AdvanceToNext();
                return;
            }

            next.Activate();
            await next.FadeInAsync(_sceneFadeDuration);
            next.Begin();

            // Auto-switch ambient audio per scene
            OnboardingAudioManager.Instance?.SetSceneAmbient(target);

            Debug.Log($"[OnboardingManager] → Scene: {target}");
        }

        private async Task CompleteAsync()
        {
            if (CurrentScene != OnboardingScene.None && IsRunning)
            {
                var last = _scenes[(int)CurrentScene];
                await last.FadeOutAsync(_sceneFadeDuration);
                last.Deactivate();
            }

            PlayerPrefs.SetInt(PREFS_KEY, 1);
            PlayerPrefs.Save();

            IsRunning    = false;
            CurrentScene = OnboardingScene.None;

            // Restore HUD
            if (_hud != null) _hud.SetActive(true);

            if (_uiDocument != null)
                _uiDocument.rootVisualElement.style.display = DisplayStyle.None;

            OnOnboardingComplete.Invoke();

            await JoinSessionDirectAsync();
        }

        private async Task JoinSessionDirectAsync()
        {
            if (_sessionData == null) return;
            Debug.Log($"[OnboardingManager] Joining session: {_sessionData.SessionId}");
            
            // Actually transition to the main VR session and join the session
            if (SessionManager.Instance != null)
            {
                // We use the SessionId as the token/id for the main session
                await SessionManager.Instance.JoinSessionAsync(_sessionData.SessionId);
            }
            else
            {
                Debug.LogError("[OnboardingManager] SessionManager instance not found! Cannot join session.");
            }
        }

        // ─── Data injection ───────────────────────────────────────────

        private void InjectSessionData(SessionData data)
        {
            var clientName    = data.ProjectName ?? "Guest";
            var architectName = data.ArchitectDisplayName ?? "Your Architect";
            var projectName   = data.ProjectName ?? "Your Project";

            _welcomeCtrl?.Inject(clientName, projectName, data.StartsAt);
            _plotCtrl?.Inject(projectName, data.PlotSizeM2, data.FloorCount);
            _architectCtrl?.Inject(architectName, data.ArchitectAvatarColor, data.WelcomeVoiceClipUrl);
            _flightCtrl?.Inject(projectName, data.FloorCount);
        }
    }

    // ─── Enums ───────────────────────────────────────────────────────────────

    public enum OnboardingScene
    {
        None        = -1,
        Welcome     =  0,
        Plot        =  1,
        Architect   =  2,
        Tutorial    =  3,
        FirstFlight =  4,
    }
}
