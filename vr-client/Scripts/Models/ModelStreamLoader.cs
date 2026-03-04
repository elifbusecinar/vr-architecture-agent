using System;
using System.Threading;
using System.Threading.Tasks;
using GLTFast;
using GLTFast.Logging;
using UnityEngine;
using UnityEngine.Events;
using VRArchitecture.Core;
using VRArchitecture.Session;

namespace VRArchitecture.Models
{
    /// <summary>
    /// Streams a 3D architectural model from Azure CDN at runtime using GLTFast.
    /// Supports LOD preview loading and full quality streaming.
    /// </summary>
    public class ModelStreamLoader : MonoBehaviour
    {
        [Header("Scene References")]
        [SerializeField] private Transform     _modelRoot;
        [SerializeField] private Material      _sphereWipeMaterial;

        [Header("Network")]
        [SerializeField] private int   _maxRetries     = 3;
        [SerializeField] private float _retryBaseDelay = 1.5f;

        [Header("Events")]
        public UnityEvent<float>  OnProgress         = new();
        public UnityEvent<string> OnStepChanged      = new();
        public UnityEvent         OnLod0Ready        = new();
        public UnityEvent         OnLod1Ready        = new();
        public UnityEvent<string> OnLoadError        = new();

        public bool   IsLoading    { get; private set; }
        public float  Progress     { get; private set; }
        public string CurrentModel { get; private set; }

        private GameObject _lod0Instance;
        private GameObject _lod1Instance;
        private GameObject _lod2Instance;
        private CancellationTokenSource _cts;

        public async Task LoadWithLodsAsync(DTOs.Projects.ProjectDetailDto detail)
        {
            if (detail == null) return;
            CancelCurrent();
            _cts = new CancellationTokenSource();
            IsLoading = true;
            Progress = 0f;

            try
            {
                // 1. Try LOD 2 (Low)
                var lod2 = Array.Find(detail.lods, l => l.level == 2);
                if (lod2 != null)
                {
                    OnStepChanged.Invoke("Loading low-poly preview...");
                    _lod2Instance = await LoadGltfWithRetryAsync(lod2.url);
                    OnLod1Ready.Invoke(); 
                }

                // 2. Load the best (LOD 0)
                var lod0 = Array.Find(detail.lods, l => l.level == 0);
                string bestUrl = lod0 != null ? lod0.url : detail.modelUrl;

                OnStepChanged.Invoke("Loading full model...");
                _lod0Instance = await LoadGltfWithRetryAsync(bestUrl);

                if (_lod2Instance != null) _lod2Instance.SetActive(false);
                OnLod0Ready.Invoke();
            }
            catch (Exception ex)
            {
                Debug.LogError($"[ModelStreamLoader] LOD Load fail: {ex.Message}");
                OnLoadError.Invoke(ex.Message);
            }
            finally
            {
                IsLoading = false;
                Progress  = 1f;
            }
        }

        public async Task LoadAsync(string modelUrl, int version = 0)
        {
            if (IsLoading) CancelCurrent();

            _cts = new CancellationTokenSource();
            IsLoading    = true;
            CurrentModel = modelUrl;
            Progress     = 0f;

            try
            {
                OnStepChanged.Invoke("Downloading model");
                _lod0Instance = await LoadGltfWithRetryAsync(modelUrl);
                OnLod0Ready.Invoke();
                Debug.Log($"[ModelStreamLoader] Model ready: {modelUrl}");
            }
            catch (Exception ex)
            {
                Debug.LogError($"[ModelStreamLoader] Load failed: {ex.Message}");
                OnLoadError.Invoke(ex.Message);
            }
            finally
            {
                IsLoading = false;
                Progress  = 1f;
            }
        }

        public void CancelCurrent()
        {
            _cts?.Cancel();
            _cts?.Dispose();
            _cts = null;
        }

        private async Task<GameObject> LoadGltfWithRetryAsync(string url)
        {
            int attempt = 0;
            while (true)
            {
                try
                {
                    return await LoadGltfAsync(url);
                }
                catch (Exception ex) when (attempt < _maxRetries)
                {
                    attempt++;
                    float delay = _retryBaseDelay * Mathf.Pow(2f, attempt - 1);
                    Debug.LogWarning($"[ModelStreamLoader] Load retry {attempt}/{_maxRetries} after {delay}s: {ex.Message}");
                    await Task.Delay(TimeSpan.FromSeconds(delay), _cts.Token);
                }
            }
        }

        [SerializeField] private Annotation.AnnotationController _annotationController;

        private async Task<GameObject> LoadGltfAsync(string url)
        {
            var container = new GameObject("Model_LOD");
            container.transform.SetParent(_modelRoot, false);
            container.transform.localScale = Vector3.one; // Ensure 1:1 scale at root

            var gltf = new GltfImport();
            gltf.OnDownloadProgress += (float p) => OnProgress.Invoke(p);

            // POINT 6: Local Caching
            string localPath = await EnsureLocalCacheAsync(url);
            bool success = await gltf.Load(localPath);
            if (!success) throw new Exception($"GLTFast load failed: {localPath}");

            await gltf.InstantiateSceneAsync(container.transform);
            
            // POINT 5: Auto-generate Mesh Colliders
            AddCollidersToRenderers(container);
            // Usually we want to keep it as-is if we trust the architect, but we can force it here
            
            if (_annotationController != null)
                _annotationController.SetModelRoot(container.transform);

            return container;
        }

        private void AddCollidersToRenderers(GameObject root)
        {
            var meshes = root.GetComponentsInChildren<MeshRenderer>();
            foreach (var m in meshes)
            {
                if (m.gameObject.GetComponent<Collider>() == null)
                {
                    var mc = m.gameObject.AddComponent<MeshCollider>();
                    mc.convex = false; // Static architecture models don't need convex
                    Debug.Log($"[ModelStreamLoader] Added MeshCollider to {m.name}");
                }
            }
        }

        private async Task<string> EnsureLocalCacheAsync(string url)
        {
            await CleanupCacheAsync(); // Evict old models if quota exceeded

            string fileName = url.GetHashCode().ToString() + ".glb";
            string path = System.IO.Path.Combine(Application.persistentDataPath, "Models", fileName);

            if (System.IO.File.Exists(path))
            {
                Debug.Log($"[ModelStreamLoader] Loading from CACHE: {path}");
                return "file://" + path;
            }

            Debug.Log($"[ModelStreamLoader] Cache miss. Downloading: {url}");
            string dir = System.IO.Path.GetDirectoryName(path);
            if(!System.IO.Directory.Exists(dir)) System.IO.Directory.CreateDirectory(dir);

            using (var www = UnityEngine.Networking.UnityWebRequest.Get(url))
            {
                var op = www.SendWebRequest();
                while (!op.isDone) await Task.Yield();

                if (www.result == UnityEngine.Networking.UnityWebRequest.Result.Success)
                {
                    System.IO.File.WriteAllBytes(path, www.downloadHandler.data);
                    return "file://" + path;
                }
            }

            return url; 
        }

        private async Task CleanupCacheAsync()
        {
            string dir = System.IO.Path.Combine(Application.persistentDataPath, "Models");
            if (!System.IO.Directory.Exists(dir)) return;

            var files = new System.IO.DirectoryInfo(dir).GetFiles("*.glb");
            if (files.Length < 10) return; // Keep at least 10 recent models

            // Sort by access time and delete oldest
            var oldest = System.Linq.Enumerable.OrderBy(files, f => f.LastAccessTime).Take(files.Length - 10);
            foreach (var f in oldest)
            {
                try { f.Delete(); } catch { }
            }
            await Task.Yield();
        }

        private void OnDestroy() => CancelCurrent();
    }
}
