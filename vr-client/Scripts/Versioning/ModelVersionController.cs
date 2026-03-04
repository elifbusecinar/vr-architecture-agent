using UnityEngine;
using System.Collections.Generic;
using VRArchitecture.Models;

namespace VRArchitecture.Versioning
{
    /// <summary>
    /// Manages multiple versions of the same model (e.g., V1, V2).
    /// Used for Point 4: Model Versioning Timeline.
    /// </summary>
    public class ModelVersionController : MonoBehaviour
    {
        [Header("References")]
        [SerializeField] private ModelStreamLoader _loader;
        [SerializeField] private Transform         _versionsRoot;

        private List<GameObject> _loadedVersions = new List<GameObject>();
        private int _currentVersionIndex = 0;

        public void SwitchToVersion(int index)
        {
            if (index < 0 || index >= _loadedVersions.Count) return;

            foreach (var v in _loadedVersions) v.SetActive(false);
            
            _loadedVersions[index].SetActive(true);
            _currentVersionIndex = index;

            Debug.Log($"[Versioning] Swapped to version {index}.");
        }

        public void AddVersion(GameObject versionInstance)
        {
            versionInstance.transform.SetParent(_versionsRoot, false);
            _loadedVersions.Add(versionInstance);
            
            // Auto hide others if it's not the first one
            if (_loadedVersions.Count > 1) versionInstance.SetActive(false);
        }

        public async void FetchProjectVersions(string projectId)
        {
            // Point 6: Model Versioning Integration
            VRArchitecture.Services.APIService.Instance.GetRequest($"/api/projects/{projectId}/detail", true, async (success, json) => {
                if (success)
                {
                    // var detail = JsonUtility.FromJson<ProjectDetailDto>(json);
                    // foreach (var asset in detail.Assets.OrderBy(a => a.CreatedAt)) {
                    //    var go = await _loader.StreamModel(asset.Url);
                    //    AddVersion(go);
                    // }
                    Debug.Log($"[Versioning] Fetching versions for project {projectId}...");
                }
            });
        }

        public void CrossFadeToNext()
        {
            // Future logic for cross-fading using shader property alpha
        }
    }
}
