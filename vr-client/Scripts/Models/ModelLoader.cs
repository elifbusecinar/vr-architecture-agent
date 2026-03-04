using System;
using System.Threading.Tasks;
using UnityEngine;
using Unity.Cloud.GltFast;

namespace VRArchitecture.Services.Models
{
    /// <summary>
    /// Handles downloading, importing, and instantiating GLTF models dynamically.
    /// Includes scaling and collider logic.
    /// </summary>
    public class ModelLoader : MonoBehaviour
    {
        private static ModelLoader _instance;
        public static ModelLoader Instance
        {
            get
            {
                if (_instance == null)
                {
                    var go = new GameObject("[ModelLoader]");
                    _instance = go.AddComponent<ModelLoader>();
                    DontDestroyOnLoad(go);
                }
                return _instance;
            }
        }

        /// <summary>
        /// Loads a 3D model from the given URL and instantiates it as a child of parent.
        /// </summary>
        public async Task<GameObject> LoadModelAsync(string url, Transform parent = null, bool addColliders = true, float targetSize = 0f)
        {
            Debug.Log($"[ModelLoader] Starting download from: {url}");
            
            var gltf = new GltfImport();
            var settings = new ImportSettings
            {
                GenerateMipMaps = true,
                AnisotropicFilterLevel = 3,
                NodeNameMethod = ImportSettings.NameMethod.OriginalUnique
            };

            bool success = await gltf.Load(url, settings);

            if (success)
            {
                var modelContainer = new GameObject("LoadedModel");
                if (parent != null) modelContainer.transform.SetParent(parent, false);

                // Instantiate the main scene
                var instantiator = new GameObjectInstantiator(gltf, modelContainer.transform);
                success = await gltf.InstantiateMainSceneAsync(instantiator);

                if (success)
                {
                    Debug.Log("[ModelLoader] Model instantiated successfully.");
                    
                    if (addColliders)
                        AddMeshColliders(modelContainer);

                    if (targetSize > 0)
                        NormalizeScale(modelContainer, targetSize);

                    return modelContainer;
                }
            }

            Debug.LogError($"[ModelLoader] Failed to load model from: {url}");
            return null;
        }

        private void AddMeshColliders(GameObject root)
        {
            var renderers = root.GetComponentsInChildren<MeshRenderer>();
            foreach (var r in renderers)
            {
                var meshFilter = r.GetComponent<MeshFilter>();
                if (meshFilter != null && meshFilter.sharedMesh != null)
                {
                    var collider = r.gameObject.AddComponent<MeshCollider>();
                    collider.sharedMesh = meshFilter.sharedMesh;
                }
            }
        }

        private void NormalizeScale(GameObject root, float maxDimension)
        {
            Bounds bounds = new Bounds(root.transform.position, Vector3.zero);
            bool hasBounds = false;

            var renderers = root.GetComponentsInChildren<Renderer>();
            foreach (var renderer in renderers)
            {
                if (!hasBounds)
                {
                    bounds = renderer.bounds;
                    hasBounds = true;
                }
                else
                {
                    bounds.Encapsulate(renderer.bounds);
                }
            }

            if (!hasBounds) return;

            float size = Mathf.Max(bounds.size.x, bounds.size.y, bounds.size.z);
            if (size > 0.0001f)
            {
                float scaleFactor = maxDimension / size;
                root.transform.localScale = Vector3.one * scaleFactor;
                Debug.Log($"[ModelLoader] Model normalized with scale factor: {scaleFactor}");
            }
        }
    }
}
