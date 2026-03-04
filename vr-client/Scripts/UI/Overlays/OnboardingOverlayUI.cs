using UnityEngine;
using UnityEngine.UIElements;
using System.Collections.Generic;
using UnityEngine.Networking;
using System.Threading.Tasks;

namespace VRArchitecture.UI.Overlays
{
    /// <summary>
    /// Manages the Onboarding Walkthrough (Tutorial).
    /// Cycles through scenes in OnboardingOverlay.uxml and persists completion state to backend.
    /// </summary>
    [RequireComponent(typeof(UIDocument))]
    public class OnboardingOverlayUI : MonoBehaviour
    {
        private VisualElement _root;
        private List<VisualElement> _scenes = new List<VisualElement>();
        private int _currentSceneIndex = 0;

        private string _apiUrl = "http://localhost:5031"; // In production, get from Config

        private void OnEnable()
        {
            _root = GetComponent<UIDocument>().rootVisualElement;
            InitializeScenes();
            ShowScene(0);

            // Bind Skip Button (Scene 4)
            var skipBtn = _root.Q<Button>("skip-button");
            if (skipBtn != null) skipBtn.clicked += async () => await CompleteOnboarding();

            // Bind specific continue actions for each scene
            BindSceneActions();
        }

        private void InitializeScenes()
        {
            _scenes.Clear();
            _scenes.Add(_root.Q<VisualElement>("scene-1-root"));
            _scenes.Add(_root.Q<VisualElement>("scene-2-root"));
            _scenes.Add(_root.Q<VisualElement>("scene-3-root"));
            _scenes.Add(_root.Q<VisualElement>("scene-4-root"));
            _scenes.Add(_root.Q<VisualElement>("scene-5-root"));
        }

        private void BindSceneActions()
        {
            // Background clicks or specific buttons to advance
            _scenes[0].RegisterCallback<ClickEvent>(evt => ShowNextScene()); // Welcome -> Plot
            _scenes[1].RegisterCallback<ClickEvent>(evt => ShowNextScene()); // Plot -> Architect
            _scenes[2].RegisterCallback<ClickEvent>(evt => ShowNextScene()); // Architect -> Tutorial
            
            // Note: Scene 4 is Advanced via Skip or Task Completion (dummy click for now)
            _scenes[3].RegisterCallback<ClickEvent>(evt => {
                if (evt.target is Button btn && btn.name == "skip-button") return;
                ShowNextScene();
            });

            // Final scene -> End
            _scenes[4].RegisterCallback<ClickEvent>(evt => {
                 _ = CompleteOnboarding();
            });
        }

        public void ShowScene(int index)
        {
            if (index < 0 || index >= _scenes.Count) return;

            for (int i = 0; i < _scenes.Count; i++)
            {
                if (_scenes[i] != null)
                    _scenes[i].style.display = (i == index) ? DisplayStyle.Flex : DisplayStyle.None;
            }
            _currentSceneIndex = index;
            Debug.Log($"[Onboarding] Displaying Scene {index + 1}");
        }

        private void ShowNextScene()
        {
            if (_currentSceneIndex < _scenes.Count - 1)
                ShowScene(_currentSceneIndex + 1);
            else
                _ = CompleteOnboarding();
        }

        private async Task CompleteOnboarding()
        {
            Debug.Log("[Onboarding] Completing tutorial...");
            
            // 1. Notify Backend
            string endpoint = $"{_apiUrl}/api/user/profile/complete-onboarding";
            using (UnityWebRequest www = UnityWebRequest.PostWwwForm(endpoint, ""))
            {
                string token = PlayerPrefs.GetString("jwt_token", "");
                if (!string.IsNullOrEmpty(token)) www.SetRequestHeader("Authorization", $"Bearer {token}");
                
                var op = www.SendWebRequest();
                while (!op.isDone) await Task.Yield();

                if (www.result == UnityWebRequest.Result.Success)
                    Debug.Log("[Onboarding] Saved to backend successfully.");
                else
                    Debug.LogWarning($"[Onboarding] Backend save failed: {www.error}");
            }

            // 2. Hide UI
            gameObject.SetActive(false);
        }
    }
}
