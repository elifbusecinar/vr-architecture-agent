using System.Collections;
using System.Collections.Generic;
using UnityEngine;

namespace VRArchitecture.Onboarding
{
    /// <summary>
    /// OnboardingAudioManager — manages all onboarding audio layers.
    ///
    /// Layers:
    ///   - Ambient  : looping background sounds (night city, construction, etc.)
    ///   - SFX pool : short one-shot effects (pool of 8 sources)
    ///   - Music    : single track with crescendo support
    ///
    /// Each scene controller can use these APIs:
    ///   OnboardingAudioManager.Instance.PlaySFX(clip);
    ///   OnboardingAudioManager.Instance.CrossfadeAmbient(clip, 1.5f);
    ///   OnboardingAudioManager.Instance.CrescendoMusic(target, duration);
    ///
    /// SETUP:
    ///   Attach to an empty GameObject in the Bootstrap scene.
    ///   Assign 5 clips to SceneAmbients (in scene order).
    /// </summary>
    public class OnboardingAudioManager : MonoBehaviour
    {
        // ─── Singleton ───────────────────────────────────────────────
        public static OnboardingAudioManager Instance { get; private set; }

        // ─── Inspector ───────────────────────────────────────────────
        [Header("Layers")]
        [SerializeField] private AudioSource _ambientSource;
        [SerializeField] private AudioSource _musicSource;
        [SerializeField] private float       _ambientMasterVolume = 0.30f;
        [SerializeField] private float       _musicMasterVolume   = 0.80f;

        [Header("SFX Pool")]
        [SerializeField] private int   _sfxPoolSize     = 8;
        [SerializeField] private float _sfxMasterVolume = 0.70f;

        [Header("Scene Ambients")]
        [Tooltip("Ambient clips used by each scene in order (5 elements).")]
        [SerializeField] private AudioClip[] _sceneAmbients;

        // ─── Runtime ─────────────────────────────────────────────────
        private readonly List<AudioSource> _sfxPool = new();
        private Coroutine _ambientFadeRoutine;
        private Coroutine _musicVolumeRoutine;

        // ─── Lifecycle ───────────────────────────────────────────────
        private void Awake()
        {
            if (Instance != null && Instance != this) { Destroy(gameObject); return; }
            Instance = this;
            DontDestroyOnLoad(gameObject);

            BuildSFXPool();
        }

        private void Start()
        {
            if (OnboardingManager.Instance != null)
                OnboardingManager.Instance.OnOnboardingStarted.AddListener(OnOnboardingStarted);
        }

        private void OnDestroy()
        {
            if (OnboardingManager.Instance != null)
                OnboardingManager.Instance.OnOnboardingStarted.RemoveListener(OnOnboardingStarted);
        }

        // ─── Public API ──────────────────────────────────────────────

        /// <summary>Play a one-shot SFX from the pool at the given volume (0–1).</summary>
        public void PlaySFX(AudioClip clip, float volume = 1f)
        {
            if (clip == null) return;
            var src = GetFreeSFXSource();
            if (src == null) return;
            src.volume = volume * _sfxMasterVolume;
            src.PlayOneShot(clip);
        }

        /// <summary>Crossfade the ambient layer to a new clip over fadeDuration seconds.</summary>
        public void CrossfadeAmbient(AudioClip newClip, float fadeDuration = 1.5f)
        {
            if (_ambientFadeRoutine != null) StopCoroutine(_ambientFadeRoutine);
            _ambientFadeRoutine = StartCoroutine(CrossfadeRoutine(_ambientSource, newClip, fadeDuration, _ambientMasterVolume));
        }

        /// <summary>Start the music track from the beginning at startVolume.</summary>
        public void StartMusic(AudioClip clip, float startVolume = 0f)
        {
            if (clip == null || _musicSource == null) return;
            _musicSource.clip   = clip;
            _musicSource.volume = startVolume;
            _musicSource.loop   = false;
            _musicSource.Play();
        }

        /// <summary>Gradually raise music to targetVolume over duration seconds.</summary>
        public void CrescendoMusic(float targetVolume, float duration)
        {
            if (_musicVolumeRoutine != null) StopCoroutine(_musicVolumeRoutine);
            _musicVolumeRoutine = StartCoroutine(VolumeRampRoutine(_musicSource, targetVolume * _musicMasterVolume, duration));
        }

        /// <summary>Fade music out to silence.</summary>
        public void FadeOutMusic(float duration = 1f)
        {
            if (_musicVolumeRoutine != null) StopCoroutine(_musicVolumeRoutine);
            _musicVolumeRoutine = StartCoroutine(VolumeRampRoutine(_musicSource, 0f, duration));
        }

        /// <summary>Switch ambient audio to the clip assigned to the given onboarding scene.</summary>
        public void SetSceneAmbient(OnboardingScene scene, float crossfadeDuration = 1.2f)
        {
            int idx = (int)scene;
            if (_sceneAmbients == null || idx < 0 || idx >= _sceneAmbients.Length) return;
            var clip = _sceneAmbients[idx];
            if (clip != null) CrossfadeAmbient(clip, crossfadeDuration);
        }

        /// <summary>Stop all audio layers immediately.</summary>
        public void StopAll()
        {
            _ambientSource?.Stop();
            _musicSource?.Stop();
            foreach (var s in _sfxPool) s?.Stop();
        }

        // ─── Internal ────────────────────────────────────────────────

        private void OnOnboardingStarted()
        {
            SetSceneAmbient(OnboardingScene.Welcome, 0f);
        }

        private void BuildSFXPool()
        {
            for (int i = 0; i < _sfxPoolSize; i++)
            {
                var go  = new GameObject($"SFX_Pool_{i}");
                go.transform.parent = transform;
                var src = go.AddComponent<AudioSource>();
                src.playOnAwake  = false;
                src.spatialBlend = 0f;
                _sfxPool.Add(src);
            }
        }

        private AudioSource GetFreeSFXSource()
        {
            foreach (var s in _sfxPool)
                if (!s.isPlaying) return s;
            // Steal the first source if all are busy
            _sfxPool[0].Stop();
            return _sfxPool[0];
        }

        private IEnumerator CrossfadeRoutine(AudioSource src, AudioClip newClip, float duration, float targetVolume)
        {
            float startVol = src.volume;
            float elapsed  = 0f;
            float half     = duration * 0.5f;

            // Fade out current clip
            while (elapsed < half)
            {
                elapsed += Time.deltaTime;
                src.volume = Mathf.Lerp(startVol, 0f, elapsed / half);
                yield return null;
            }

            src.clip   = newClip;
            src.volume = 0f;
            if (newClip != null) { src.loop = true; src.Play(); }

            // Fade in new clip
            elapsed = 0f;
            while (elapsed < half)
            {
                elapsed += Time.deltaTime;
                src.volume = Mathf.Lerp(0f, targetVolume, elapsed / half);
                yield return null;
            }
            src.volume = targetVolume;
        }

        private IEnumerator VolumeRampRoutine(AudioSource src, float targetVolume, float duration)
        {
            if (src == null) yield break;
            float startVol = src.volume;
            float elapsed  = 0f;
            while (elapsed < duration)
            {
                elapsed += Time.deltaTime;
                src.volume = Mathf.Lerp(startVol, targetVolume, elapsed / duration);
                yield return null;
            }
            src.volume = targetVolume;
            if (targetVolume <= 0f) src.Stop();
        }
    }
}
