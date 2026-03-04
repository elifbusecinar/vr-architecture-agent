using UnityEngine;
using System.Collections.Generic;
using VRArchitecture.Services.Networking;

namespace VRArchitecture.Audio
{
    /// <summary>
    /// Manages spatialized audio sources for remote users in a VR session.
    /// Used for T043 (Voice Persistence).
    /// </summary>
    public class SpatialAudioManager : MonoBehaviour
    {
        [Header("Settings")]
        [SerializeField] private GameObject _audioSourcePrefab;
        [SerializeField] private float _maxDistance = 20f;

        private Dictionary<string, AudioSource> _remoteSources = new Dictionary<string, AudioSource>();

        private void Start()
        {
            VRSignalRService.Instance.OnUserMoved += UpdateUserAudioPosition;
            VRSignalRService.Instance.OnParticipantLeft += RemoveUserAudio;
        }

        private void UpdateUserAudioPosition(VRArchitecture.DTOs.VR.AvatarUpdateDto data)
        {
            if (!_remoteSources.TryGetValue(data.userId, out var source))
            {
                var go = Instantiate(_audioSourcePrefab, transform);
                go.name = $"AudioSource_{data.userId}";
                source = go.GetComponent<AudioSource>();
                
                // Configure Spatial Audio
                source.spatialize = true;
                source.spatialBlend = 1.0f; // 100% 3D
                source.rolloffMode = AudioRolloffMode.Logarithmic;
                source.maxDistance = _maxDistance;
                
                _remoteSources.Add(data.userId, source);
            }

            source.transform.position = data.headPosition.ToVector3();
            
            // In a real implementation, we'd pipe incoming WebRTC audio to this source:
            // source.clip = bridge.GetClip(data.userId);
            // source.Play();
        }

        private void RemoveUserAudio(string connectionId)
        {
            // We need userId here, usually connectionId maps 1:1 in our hub
            if (_remoteSources.TryGetValue(connectionId, out var source))
            {
                Destroy(source.gameObject);
                _remoteSources.Remove(connectionId);
            }
        }

        private void OnDestroy()
        {
            if (VRSignalRService.Instance != null)
            {
                VRSignalRService.Instance.OnUserMoved -= UpdateUserAudioPosition;
                VRSignalRService.Instance.OnParticipantLeft -= RemoveUserAudio;
            }
        }
    }
}
