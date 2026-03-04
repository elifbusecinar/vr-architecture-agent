using UnityEngine;

namespace VRArchitecture.Environment
{
    /// <summary>
    /// Advanced Section Box with 6-plane clipping (X, Y, Z).
    /// Used for Point 5: Section Box / X-Ray tool.
    /// </summary>
    public class SectionBoxController : MonoBehaviour
    {
        [Header("Settings")]
        [SerializeField] private Vector3 _boxSize = new Vector3(5, 5, 5);
        [SerializeField] private Vector3 _boxPos = Vector3.up * 2;
        [SerializeField] private bool    _isXRayEnabled = false;

        private Plane[] _clipPlanes = new Plane[6];
        private Renderer[] _modelRenderers;

        public void InitializeSection(GameObject root)
        {
            _modelRenderers = root.GetComponentsInChildren<Renderer>();
            UpdatePlanes();
        }

        private void Update()
        {
            UpdatePlanes();
            ApplyToMaterials();
        }

        private void UpdatePlanes()
        {
            var center = _boxPos;
            var ext = _boxSize * 0.5f;

            _clipPlanes[0] = new Plane(Vector3.left, center.x + ext.x);  // +X
            _clipPlanes[1] = new Plane(Vector3.right, center.x - ext.x); // -X
            _clipPlanes[2] = new Plane(Vector3.down, center.y + ext.y);   // +Y
            _clipPlanes[3] = new Plane(Vector3.up, center.y - ext.y);     // -Y
            _clipPlanes[4] = new Plane(Vector3.back, center.z + ext.z);   // +Z
            _clipPlanes[5] = new Plane(Vector3.forward, center.z - ext.z);// -Z
        }

        private void ApplyToMaterials()
        {
            if (_modelRenderers == null) return;

            foreach (var r in _modelRenderers)
            {
                foreach (var m in r.materials)
                {
                    m.SetVector("_BoxCenter", _boxPos);
                    m.SetVector("_BoxSize", _boxSize);
                    
                    if (_isXRayEnabled)
                    {
                        m.EnableKeyword("_XRAY_ON");
                        m.SetFloat("_XRayAlpha", 0.3f);
                    }
                }
            }
        }

        public void ToggleXRay() => _isXRayEnabled = !_isXRayEnabled;
    }
}
