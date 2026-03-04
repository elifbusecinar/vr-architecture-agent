using UnityEngine;
using System;
using VRArchitecture.Services.Networking;
using VRArchitecture.DTOs.VR;

namespace VRArchitecture.Session
{
    /// <summary>
    /// Handles synchronization for non-presenter clients during a Guided Tour.
    /// Controls camera locking and position interpolation.
    /// </summary>
    public class ClientSyncHandler : MonoBehaviour
    {
        public static ClientSyncHandler Instance { get; private set; }

        [Header("Sync Settings")]
        [SerializeField] private bool _isLockedToPresenter = false;
        [SerializeField] private float _lerpSpeed = 5f;
        [SerializeField] private Transform _targetCameraRig;

        private Vector3 _targetPosition;
        private Quaternion _targetRotation;
        private string _activePresenterId;

        private void Awake()
        {
            Instance = this;
            if (_targetCameraRig == null) _targetCameraRig = transform;
        }

        private void Start()
        {
            if (VRSignalRService.Instance != null)
            {
                VRSignalRService.Instance.OnPresentationStarted += HandlePresentationStarted;
                VRSignalRService.Instance.OnPresentationEnded += HandlePresentationEnded;
                VRSignalRService.Instance.OnPresenterMoved += HandlePresenterMoved;
            }
        }

        private void Update()
        {
            if (_isLockedToPresenter)
            {
                _targetCameraRig.position = Vector3.Lerp(_targetCameraRig.position, _targetPosition, Time.deltaTime * _lerpSpeed);
                _targetCameraRig.rotation = Quaternion.Slerp(_targetCameraRig.rotation, _targetRotation, Time.deltaTime * _lerpSpeed);
            }
        }

        private void HandlePresentationStarted(string presenterId)
        {
            _activePresenterId = presenterId;
            // Lock if we are not the presenter
            _isLockedToPresenter = VRSignalRService.Instance.ConnectionId != presenterId;
            Debug.Log($"[ClientSync] Presentation started by {presenterId}. Locked: {_isLockedToPresenter}");
        }

        private void HandlePresentationEnded()
        {
            _isLockedToPresenter = false;
            _activePresenterId = null;
            Debug.Log("[ClientSync] Presentation ended. Locomotion unlocked.");
        }

        private void HandlePresenterMoved(string jsonTransform)
        {
            if (!_isLockedToPresenter) return;

            var data = JsonUtility.FromJson<PresenterTransformData>(jsonTransform);
            _targetPosition = data.position.ToVector3();
            _targetRotation = data.rotation.ToQuaternion();
        }

        [Serializable]
        private class PresenterTransformData
        {
            public Vector3Dto position;
            public QuaternionDto rotation;
        }
    }
}
