using UnityEngine;
using System.Collections;
using System.Collections.Generic;
using VRArchitecture.DTOs.Projects;
using UnityEngine.XR.Interaction.Toolkit;

namespace VRArchitecture.Storytelling
{
    /// <summary>
    /// Manages the guided tour (Storytelling) mode in VR.
    /// Teleports the user to pre-defined architectural waypoints.
    /// </summary>
    public class GuidedTourManager : MonoBehaviour
    {
        [Header("Tour Refs")]
        [SerializeField] private List<ProjectWaypointDto> _waypoints = new List<ProjectWaypointDto>();
        [SerializeField] private float _transitionFading = 0.5f;

        private int _currentIndex = -1;
        private LocomotionSystem _locomotionSystem;

        private void Start()
        {
            _locomotionSystem = FindAnyObjectByType<LocomotionSystem>();
        }

        public void StartTour(List<ProjectWaypointDto> waypoints)
        {
            _waypoints = waypoints;
            if (_waypoints.Count > 0)
            {
                GoToWaypoint(0);
            }
        }

        public void NextWaypoint()
        {
            if (_waypoints.Count == 0) return;
            _currentIndex = (_currentIndex + 1) % _waypoints.Count;
            GoToWaypoint(_currentIndex);
        }

        public void PreviousWaypoint()
        {
            if (_waypoints.Count == 0) return;
            _currentIndex--;
            if (_currentIndex < 0) _currentIndex = _waypoints.Count - 1;
            GoToWaypoint(_currentIndex);
        }

        private void GoToWaypoint(int index)
        {
            if (index < 0 || index >= _waypoints.Count) return;

            var wp = _waypoints[index];
            Vector3 pos = new Vector3(wp.positionX, wp.positionY, wp.positionZ);
            
            // Perform Teleport Request via the Locomotion System if possible
            if (_locomotionSystem != null)
            {
                var request = new TeleportRequest
                {
                    destinationPosition = pos,
                    destinationRotation = Quaternion.Euler(wp.pitch, wp.yaw, 0)
                };
                
                var provider = _locomotionSystem.GetComponentInChildren<TeleportationProvider>();
                if (provider != null) provider.QueueTeleportRequest(request);

                Debug.Log($"[Tour] Moving to: {wp.title}");
            }
        }
    }
}
