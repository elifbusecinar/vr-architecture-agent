using UnityEngine;
using System.Collections;
using System.IO;
using VRArchitecture.Services;

namespace VRArchitecture.Tools
{
    /// <summary>
    /// Captures a VR screenshot and uploads it to the project attachments.
    /// Used for T061 (Project Progress Snapshots).
    /// </summary>
    public class VRSnapshotTool : MonoBehaviour
    {
        [Header("Capture Settings")]
        [SerializeField] private Vector2Int _resolution = new Vector2Int(1920, 1080);
        [SerializeField] private Color _flashColor = Color.white;
        [SerializeField] private float _flashDuration = 0.2f;

        private bool _isCapturing = false;

        public void TakeSnapshot(string projectId)
        {
            if (_isCapturing) return;
            StartCoroutine(CaptureRoutine(projectId));
        }

        private IEnumerator CaptureRoutine(string projectId)
        {
            _isCapturing = true;
            Debug.Log("[Snapshot] Taking VR photo...");
            
            // Visual feedback (flash)
            ApplyFlash();

            yield return new WaitForEndOfFrame(); // Required to capture the final frame
            
            Texture2D screenTexture = new Texture2D(Screen.width, Screen.height, TextureFormat.RGB24, false);
            screenTexture.ReadPixels(new Rect(0, 0, Screen.width, Screen.height), 0, 0);
            screenTexture.Apply();

            byte[] photoData = screenTexture.EncodeToJPG();
            Destroy(screenTexture);

            Debug.Log($"[Snapshot] Captured {photoData.Length} bytes. Uploading...");
            
            // Upload point: POST /projects/{id}/attachments
            APIService.Instance.PostRequest($"/api/projects/{projectId}/attachments/snapshot", System.Convert.ToBase64String(photoData), true, (success, json) => {
                if (success) {
                    Debug.Log("[Snapshot] VR photo uploaded successfully.");
                } else {
                    Debug.LogError("[Snapshot] Upload failed.");
                }
            });

            _isCapturing = false;
        }

        private void ApplyFlash()
        {
            // Simple camera overlay or VFX could be triggered here
            // In a production app, we'd spawn a 2D quad in front of the camera
        }
    }
}
