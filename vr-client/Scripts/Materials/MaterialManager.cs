using UnityEngine;
using VRArchitecture.Services.Networking;

namespace VRArchitecture.Materials
{
    public class MaterialManager : MonoBehaviour
    {
        public static MaterialManager Instance { get; private set; }

        [SerializeField] private MaterialRegistry _registry;

        private void Awake()
        {
            if (Instance == null) Instance = this;
            else Destroy(gameObject);
        }

        private void Start()
        {
            // Subscribe to remote material changes
            if (VRSignalRService.Instance != null)
            {
                VRSignalRService.Instance.OnEnvironmentSynced += HandleRemoteMaterialChange;
            }
        }

        private void HandleRemoteMaterialChange(string jsonData)
        {
            if (jsonData.Contains("MaterialUpdate"))
            {
                var update = JsonUtility.FromJson<MaterialUpdate>(jsonData);
                ApplyMaterialLocal(update.objectId, update.materialId);
            }
        }

        public void ChangeMaterial(GameObject target, string materialId)
        {
            if (target == null) return;

            string objectId = target.name; // In a real app, use a unique ID / GUID from BIM
            ApplyMaterialLocal(objectId, materialId);

            // Broadcast to others
            var update = new MaterialUpdate { 
                type = "MaterialUpdate", 
                objectId = objectId, 
                materialId = materialId 
            };
            VRSignalRService.Instance?.BroadcastEnvironment(JsonUtility.ToJson(update));
        }

        private void ApplyMaterialLocal(string objectName, string materialId)
        {
            GameObject obj = GameObject.Find(objectName);
            if (obj == null) return;

            Material mat = _registry.GetMaterial(materialId);
            if (mat == null) return;

            Renderer renderer = obj.GetComponent<Renderer>();
            if (renderer != null)
            {
                renderer.material = mat;
            }
        }

        [System.Serializable]
        private class MaterialUpdate
        {
            public string type;
            public string objectId;
            public string materialId;
        }
    }
}
