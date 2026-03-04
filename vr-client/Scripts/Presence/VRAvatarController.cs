using UnityEngine;

namespace VRArchitecture.Presence
{
    /// <summary>
    /// Handles the visual representation of other users in VR.
    /// Manages Head, Left Hand, and Right Hand IK/Lerping.
    /// </summary>
    public class VRAvatarController : MonoBehaviour
    {
        public Transform head;
        public Transform leftHand;
        public Transform rightHand;

        private Vector3 _targetHeadPos, _targetLeftPos, _targetRightPos;
        private Quaternion _targetHeadRot, _targetLeftRot, _targetRightRot;

        private float _lerpSpeed = 15f;

        public void UpdateTargetTransforms(string jsonUpdate)
        {
            var data = JsonUtility.FromJson<AvatarUpdate>(jsonUpdate);
            
            _targetHeadPos = data.hPos;
            _targetHeadRot = data.hRot;
            _targetLeftPos = data.lPos;
            _targetLeftRot = data.lRot;
            _targetRightPos = data.rPos;
            _targetRightRot = data.rRot;
        }

        private void Update()
        {
            // Smoothly move the parts to sync positions
            if (head)
            {
                head.localPosition = Vector3.Lerp(head.localPosition, _targetHeadPos, Time.deltaTime * _lerpSpeed);
                head.localRotation = Quaternion.Slerp(head.localRotation, _targetHeadRot, Time.deltaTime * _lerpSpeed);
            }

            if (leftHand)
            {
                leftHand.localPosition = Vector3.Lerp(leftHand.localPosition, _targetLeftPos, Time.deltaTime * _lerpSpeed);
                leftHand.localRotation = Quaternion.Slerp(leftHand.localRotation, _targetLeftRot, Time.deltaTime * _lerpSpeed);
            }

            if (rightHand)
            {
                rightHand.localPosition = Vector3.Lerp(rightHand.localPosition, _targetRightPos, Time.deltaTime * _lerpSpeed);
                rightHand.localRotation = Quaternion.Slerp(rightHand.localRotation, _targetRightRot, Time.deltaTime * _lerpSpeed);
            }
            
            // Note: In a real project with FinalIK or Animation Rigging, 
            // these transforms would be targets for the IK solver.
        }

        [System.Serializable]
        private class AvatarUpdate
        {
            public Vector3 hPos, lPos, rPos;
            public Quaternion hRot, lRot, rRot;
        }
    }
}
