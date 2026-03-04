using System;
using System.Collections.Generic;
using Fusion;
using TMPro;
using UnityEngine;
using UnityEngine.UI;
using VRArchitecture.Session;

namespace VRArchitecture.Annotation
{
    /// <summary>
    /// Networked visual for an annotation pin.
    /// Matches the "hud-annot-ping" style from the VR design system.
    /// </summary>
    public class AnnotationPin : NetworkBehaviour
    {
        [Networked] public Vector3 WorldPosition { get; set; }
        [Networked] public NetworkString<_128> Text { get; set; }
        [Networked] public NetworkString<_32> Author { get; set; }
        [Networked] public Color AuthorColor { get; set; }
        [Networked] public bool IsResolved { get; set; }
        [Networked] public bool HasSnapshot { get; set; }
        [Networked] public bool HasAudio { get; set; }
        [Networked] public NetworkString<_256> MediaUrl { get; set; }

        [Header("UI References")]
        [SerializeField] private TMP_Text _noteLabel;
        [SerializeField] private Image    _dotImage;
        [SerializeField] private GameObject _labelContainer;
        [SerializeField] private CanvasGroup _canvasGroup;
        [SerializeField] private GameObject _snapshotIcon;
        [SerializeField] private GameObject _audioIcon;
        [SerializeField] private RawImage   _snapshotPreview;

        [Header("Config")]
        [SerializeField] private float _showLabelDistance = 5f;
        [SerializeField] private float _cullDistance = 30f;
        
        public Models.AnnotationData Annotation { get; private set; }

        public override void Spawned()
        {
            transform.position = WorldPosition;
            if (_noteLabel != null) _noteLabel.text = Text.ToString();
            if (_dotImage != null) _dotImage.color = AuthorColor;

            // Point 6: Show enrichment icons
            if (_snapshotIcon != null) _snapshotIcon.SetActive(HasSnapshot);
            if (_audioIcon != null)    _audioIcon.SetActive(HasAudio);
            
            Debug.Log($"[AnnotationPin] Spawned: {Text} by {Author}, Snapshot: {HasSnapshot}");
        }

        public void Initialise(Models.AnnotationData data)
        {
            Annotation = data;
            WorldPosition = data.WorldPos;
            Text = data.Text;
            Author = data.CreatedBy;
            AuthorColor = data.AuthorColor;
        }

        private void Update()
        {
            if (Camera.main == null) return;
            
            float dist = Vector3.Distance(transform.position, Camera.main.transform.position);

            // Point 6: Performance - Disable entire pin if too far (Occlusion)
            if (dist > _cullDistance)
            {
                if (_canvasGroup != null) _canvasGroup.alpha = 0f;
                // Deactivating the whole object might break Fusion sync if not careful, 
                // but for visual-only parts like renderer/UI, it's fine.
                if (_labelContainer != null) _labelContainer.SetActive(false);
                return; 
            }

            // Billboard effect: Always face the camera
            transform.LookAt(Camera.main.transform);
            
            // Show/hide label based on distance
            bool shouldShowLabel = dist < _showLabelDistance;
            if (_labelContainer != null) _labelContainer.SetActive(shouldShowLabel);
            
            // Subtle fade based on distance
            if (_canvasGroup != null)
            {
                float alpha = 1f - Mathf.Clamp01((dist - _showLabelDistance) / (_cullDistance - _showLabelDistance));
                _canvasGroup.alpha = IsResolved ? alpha * 0.5f : alpha;
            }
        }

        [Rpc(RpcSources.All, RpcTargets.StateAuthority)]
        public void RPC_Resolve() 
        {
            IsResolved = true;
            if (_canvasGroup != null) _canvasGroup.alpha = 0.5f;
        }
    }
}
