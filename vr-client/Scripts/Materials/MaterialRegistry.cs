using UnityEngine;
using System.Collections.Generic;

namespace VRArchitecture.Materials
{
    [CreateAssetMenu(fileName = "MaterialRegistry", menuName = "VR Architecture/Material Registry")]
    public class MaterialRegistry : ScriptableObject
    {
        [System.Serializable]
        public class MaterialEntry
        {
            public string id;
            public string name;
            public Material material;
        }

        public List<MaterialEntry> materials = new List<MaterialEntry>();

        public Material GetMaterial(string id)
        {
            var entry = materials.Find(m => m.id == id);
            return entry?.material;
        }
    }
}
