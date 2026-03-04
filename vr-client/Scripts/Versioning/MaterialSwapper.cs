using UnityEngine;
using System.Collections.Generic;
using VRArchitecture.Services.Networking;

namespace VRArchitecture.Versioning
{
    /// <summary>
    /// Cycles through different materials on a selected architectural object.
    /// Used for Point 3: Material & Configuration Swapper.
    /// </summary>
    public class MaterialSwapper : MonoBehaviour
    {
        [Header("Materials")]
        [SerializeField] private List<Material> _availableMaterials;
        [SerializeField] private MeshRenderer _targetRenderer;

        private int _currentIndex = 0;

        public void NextMaterial()
        {
            if (_availableMaterials.Count == 0 || _targetRenderer == null) return;

            _currentIndex = (_currentIndex + 1) % _availableMaterials.Count;
            ApplyMaterial(_currentIndex);
            
            // Sync to others via SignalR broadcast
            // VRSignalRService.Instance.BroadcastMaterialSwap(_targetRenderer.gameObject.name, _currentIndex);
        }

        public void ApplyMaterial(int index)
        {
            if (index < 0 || index >= _availableMaterials.Count) return;
            _targetRenderer.material = _availableMaterials[index];
            Debug.Log($"[Swapper] Applied material: {_availableMaterials[index].name}");
        }
    }
}
