using System.Collections;
using UnityEngine;
using UnityEngine.UIElements;

namespace VRArchitecture.Onboarding
{
    /// <summary>
    /// Scene 02 — Empty Plot (0:12–0:28)
    ///
    /// A ghost building rises floor by floor. Each floor triggers an SFX. Fully automatic.
    ///
    /// UXML element names:
    ///   #building-container   (floors added here, column-reverse layout)
    ///   #plot-area            (plot boundary outline)
    ///   #measurement-label
    ///   #build-progress-label
    /// </summary>
    public class PlotSceneController : OnboardingSceneBase
    {
        // ─── Inspector ───────────────────────────────────────────────
        [Header("Plot — Config")]
        [SerializeField] private int   _defaultFloorCount       = 8;
        [SerializeField] private float _floorSpawnInterval      = 0.55f;
        [SerializeField] private float _holdAfterBuildSeconds   = 1.5f;

        [Header("Plot — Audio")]
        [SerializeField] private AudioClip _floorPlacedClip;
        [SerializeField] private AudioClip _buildCompleteClip;
        [SerializeField] private float     _sfxVolume = 0.6f;

        // ─── Data ────────────────────────────────────────────────────
        private string _projectName = "Your Project";
        private float  _plotSizeM2  = 280f;
        private int    _floorCount;

        // ─── UI refs ─────────────────────────────────────────────────
        private VisualElement _buildingContainer;
        private VisualElement _plotArea;
        private Label         _measurementLabel;
        private Label         _buildProgressLabel;

        private Coroutine _buildCoroutine;

        // ─── Injection ───────────────────────────────────────────────
        public void Inject(string projectName, float plotSizeM2, int floorCount)
        {
            _projectName = projectName;
            _plotSizeM2  = plotSizeM2 > 0 ? plotSizeM2 : 280f;
            _floorCount  = floorCount > 0 ? floorCount : _defaultFloorCount;
        }

        // ─── OnboardingSceneBase overrides ───────────────────────────
        protected override void OnActivate()
        {
            _buildingContainer  = _root.Q<VisualElement>("building-container");
            _plotArea           = _root.Q<VisualElement>("plot-area");
            _measurementLabel   = _root.Q<Label>("measurement-label");
            _buildProgressLabel = _root.Q<Label>("build-progress-label");

            if (_measurementLabel != null)
                _measurementLabel.text = $"← {Mathf.Sqrt(_plotSizeM2):F0} m →";

            _buildingContainer?.Clear();
        }

        protected override void OnBegin()
        {
            _plotArea?.AddToClassList("plot-area--active");
            _buildCoroutine = StartCoroutine(BuildRoutine());
        }

        protected override void OnDeactivate()
        {
            if (_buildCoroutine != null) StopCoroutine(_buildCoroutine);
            _plotArea?.RemoveFromClassList("plot-area--active");
        }

        // ─── Build sequence ───────────────────────────────────────────

        private IEnumerator BuildRoutine()
        {
            SetText(_buildProgressLabel, "Preparing foundation…");
            yield return new WaitForSeconds(0.4f);

            for (int i = 0; i < _floorCount; i++)
            {
                SpawnFloor(i);

                // Volume ramps up as the building grows
                float vol = _sfxVolume * (0.7f + 0.3f * ((float)i / _floorCount));
                if (_floorPlacedClip != null)
                    _audioSource.PlayOneShot(_floorPlacedClip, vol);

                int floorNum = i + 1;
                if (_buildProgressLabel != null)
                    _buildProgressLabel.text = floorNum < _floorCount
                        ? $"Placing floor {floorNum}…"
                        : "Building complete ✓";

                yield return new WaitForSeconds(_floorSpawnInterval);
            }

            if (_buildCompleteClip != null)
                _audioSource.PlayOneShot(_buildCompleteClip, _sfxVolume);

            yield return new WaitForSeconds(_holdAfterBuildSeconds);
            Advance();
        }

        private void SpawnFloor(int index)
        {
            if (_buildingContainer == null) return;

            var floor = new VisualElement();
            floor.AddToClassList("ghost-floor");

            // Slightly taper toward the top for perspective feel
            float widthPct = Mathf.Lerp(100f, 75f, (float)index / Mathf.Max(1, _floorCount - 1));
            floor.style.width = new Length(widthPct, LengthUnit.Percent);

            float delay = index * 0.04f;
            floor.style.animationDelay = new StyleList<TimeValue>(new[] { new TimeValue(delay) });
            floor.AddToClassList("ghost-floor--spawn");

            // Add windows
            int windowCount = Mathf.Max(2, 5 - index / 3);
            for (int w = 0; w < windowCount; w++)
            {
                var win = new VisualElement();
                win.AddToClassList("ghost-window");
                if (UnityEngine.Random.value < 0.4f)
                    win.AddToClassList("ghost-window--lit");
                floor.Add(win);
            }

            _buildingContainer.Add(floor);
        }
    }
}
