using System.Collections;
using UnityEngine;
using UnityEngine.UIElements;

namespace VRArchitecture.Onboarding
{
    /// <summary>
    /// Scene 05 — First Flight (1:10–1:30)
    ///
    /// The camera follows a Catmull-Rom path over the city and around the building
    /// in a cinematic tour. Music builds to a crescendo, the camera approaches the
    /// entrance door, then a white flash ends the onboarding and hands off to the session.
    ///
    /// UXML element names:
    ///   #building-label, #altitude-display
    ///   #flight-progress-bar, #enter-building-flash
    /// </summary>
    public class FirstFlightController : OnboardingSceneBase
    {
        // ─── Inspector ───────────────────────────────────────────────
        [Header("Flight — Camera Path")]
        [Tooltip("Waypoint array (min 3 points). Arrange in a spiral around the building.")]
        [SerializeField] private Transform[]    _waypoints;
        [SerializeField] private float          _flightDuration     = 18f;
        [SerializeField] private AnimationCurve _flightSpeedCurve   = AnimationCurve.EaseInOut(0, 1, 1, 1);

        [Header("Flight — Building")]
        [SerializeField] private Transform _buildingEntryPoint;

        [Header("Flight — Audio")]
        [SerializeField] private AudioClip _cinematicMusicClip;
        [SerializeField] private float     _musicStartVolume    = 0f;
        [SerializeField] private float     _musicPeakVolume     = 0.85f;
        [SerializeField] private float     _crescendoStartNorm  = 0.65f;   // normalized position in flight (0..1)
        [SerializeField] private AudioClip _whooshClip;
        [SerializeField] private AudioClip _entryClip;
        [SerializeField] private float     _sfxVolume           = 0.7f;

        // ─── Data ────────────────────────────────────────────────────
        private string _projectName = "Your Project";
        private int    _floorCount  = 8;

        // ─── Runtime ─────────────────────────────────────────────────
        private Camera       _xrCamera;
        private AudioSource  _musicSource;
        private Coroutine    _flightCoroutine;

        // ─── UI refs ─────────────────────────────────────────────────
        private Label         _buildingLabel;
        private Label         _altitudeDisplay;
        private VisualElement _flightProgressBar;
        private VisualElement _enterFlash;

        // ─── Injection ───────────────────────────────────────────────
        public void Inject(string projectName, int floorCount)
        {
            _projectName = projectName;
            _floorCount  = floorCount;
        }

        // ─── OnboardingSceneBase overrides ───────────────────────────
        protected override void OnActivate()
        {
            _buildingLabel     = _root.Q<Label>("building-label");
            _altitudeDisplay   = _root.Q<Label>("altitude-display");
            _flightProgressBar = _root.Q<VisualElement>("flight-progress-bar");
            _enterFlash        = _root.Q<VisualElement>("enter-building-flash");

            SetText(_buildingLabel, _projectName);
            SetDisplay(_enterFlash, false);

            _xrCamera = Camera.main;

            // Dedicated 2D music AudioSource
            _musicSource              = gameObject.AddComponent<AudioSource>();
            _musicSource.clip         = _cinematicMusicClip;
            _musicSource.loop         = false;
            _musicSource.volume       = 0f;
            _musicSource.spatialBlend = 0f;
        }

        protected override void OnBegin()
        {
            if (_waypoints == null || _waypoints.Length < 2)
            {
                Debug.LogWarning("[FirstFlightController] Waypoints missing — using fallback delay.");
                _flightCoroutine = StartCoroutine(FallbackDelay());
                return;
            }

            _flightCoroutine = StartCoroutine(FlightSequence());
        }

        protected override void OnDeactivate()
        {
            if (_flightCoroutine != null) StopCoroutine(_flightCoroutine);
            if (_musicSource     != null) { _musicSource.Stop(); Destroy(_musicSource); }

            // Restore XR rig locomotion
            SetXRRigEnabled(true);
        }

        // ─── Flight sequence ──────────────────────────────────────────

        private IEnumerator FlightSequence()
        {
            // Disable player locomotion — the flight sequence owns the camera
            SetXRRigEnabled(false);

            if (_cinematicMusicClip != null)
            {
                _musicSource.Play();
                StartCoroutine(MusicCrescendoRoutine());
            }

            // Opening whoosh
            if (_whooshClip != null)
                _audioSource.PlayOneShot(_whooshClip, _sfxVolume);

            float elapsed = 0f;

            while (elapsed < _flightDuration)
            {
                elapsed += Time.deltaTime;
                float t       = Mathf.Clamp01(elapsed / _flightDuration);
                float tCurved = _flightSpeedCurve.Evaluate(t);

                MoveAlongPath(tCurved);
                UpdateHUD(t);

                yield return null;
            }

            // Approach the building entry point
            if (_buildingEntryPoint != null)
                yield return StartCoroutine(ApproachEntry());

            // White entry flash — session starts
            yield return StartCoroutine(EntryFlash());

            Advance();
        }

        private void MoveAlongPath(float t)
        {
            if (_xrCamera == null || _waypoints.Length < 2) return;

            float scaled = t * (_waypoints.Length - 1);
            int   idx    = Mathf.FloorToInt(scaled);
            float localT = scaled - idx;

            int i0 = Mathf.Max(0,                      idx - 1);
            int i1 = idx;
            int i2 = Mathf.Min(_waypoints.Length - 1,  idx + 1);
            int i3 = Mathf.Min(_waypoints.Length - 1,  idx + 2);

            Vector3 pos = CatmullRom(
                _waypoints[i0].position,
                _waypoints[i1].position,
                _waypoints[i2].position,
                _waypoints[i3].position,
                localT);

            Vector3 lookAt = _waypoints[i2].position;

            _xrCamera.transform.position = pos;
            _xrCamera.transform.rotation = Quaternion.Slerp(
                _xrCamera.transform.rotation,
                Quaternion.LookRotation(lookAt - pos),
                Time.deltaTime * 3f);
        }

        private IEnumerator ApproachEntry()
        {
            float   duration = 2.0f;
            float   elapsed  = 0f;
            Vector3 startPos = _xrCamera.transform.position;
            var     startRot = _xrCamera.transform.rotation;
            var     endRot   = Quaternion.LookRotation(_buildingEntryPoint.position - startPos);

            while (elapsed < duration)
            {
                elapsed += Time.deltaTime;
                float s  = Mathf.SmoothStep(0f, 1f, elapsed / duration);
                _xrCamera.transform.position = Vector3.Lerp(startPos, _buildingEntryPoint.position, s);
                _xrCamera.transform.rotation = Quaternion.Slerp(startRot, endRot, s);
                yield return null;
            }
        }

        private IEnumerator EntryFlash()
        {
            if (_entryClip != null)
                _audioSource.PlayOneShot(_entryClip, _sfxVolume);

            SetDisplay(_enterFlash, true);
            _enterFlash?.AddToClassList("enter-flash--white");
            yield return new WaitForSeconds(0.6f);
            _enterFlash?.RemoveFromClassList("enter-flash--white");
            SetDisplay(_enterFlash, false);
        }

        private IEnumerator MusicCrescendoRoutine()
        {
            // Fade in to 60 % of peak volume
            float elapsed   = 0f;
            float fadeInDur = _flightDuration * _crescendoStartNorm;

            while (elapsed < fadeInDur)
            {
                elapsed += Time.deltaTime;
                _musicSource.volume = Mathf.Lerp(_musicStartVolume, _musicPeakVolume * 0.6f, elapsed / fadeInDur);
                yield return null;
            }

            // Crescendo to full peak
            elapsed = 0f;
            float remaining = _flightDuration * (1f - _crescendoStartNorm);
            float startVol  = _musicSource.volume;

            while (elapsed < remaining)
            {
                elapsed += Time.deltaTime;
                _musicSource.volume = Mathf.Lerp(startVol, _musicPeakVolume, elapsed / remaining);
                yield return null;
            }
        }

        private void UpdateHUD(float t)
        {
            float altitude = Mathf.Lerp(200f, 0f, t);
            SetText(_altitudeDisplay, $"{altitude:F0} m");

            if (_flightProgressBar != null)
                _flightProgressBar.style.width = new Length(t * 100f, LengthUnit.Percent);
        }

        private void SetXRRigEnabled(bool enabled)
        {
            var rig = FindFirstObjectByType<Unity.XR.CoreUtils.XROrigin>();
            if (rig != null) rig.enabled = enabled;
        }

        private IEnumerator FallbackDelay()
        {
            yield return new WaitForSeconds(3f);
            Advance();
        }

        // ─── Catmull-Rom spline ───────────────────────────────────────

        private static Vector3 CatmullRom(Vector3 p0, Vector3 p1, Vector3 p2, Vector3 p3, float t)
        {
            float t2 = t  * t;
            float t3 = t2 * t;
            return 0.5f * (
                2f * p1 +
                (-p0 + p2) * t +
                (2f * p0 - 5f * p1 + 4f * p2 - p3) * t2 +
                (-p0 + 3f * p1 - 3f * p2 + p3) * t3);
        }
    }
}
