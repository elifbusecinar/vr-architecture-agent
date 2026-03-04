using System;
using UnityEngine;

namespace VRArchitecture.DTOs.VR
{
    [Serializable]
    public class Vector3Dto
    {
        public float x;
        public float y;
        public float z;

        public Vector3Dto(Vector3 v)
        {
            x = v.x;
            y = v.y;
            z = v.z;
        }

        public Vector3 ToVector3() => new Vector3(x, y, z);
    }

    [Serializable]
    public class QuaternionDto
    {
        public float x;
        public float y;
        public float z;
        public float w;

        public QuaternionDto(Quaternion q)
        {
            x = q.x;
            y = q.y;
            z = q.z;
            w = q.w;
        }

        public Quaternion ToQuaternion() => new Quaternion(x, y, z, w);
    }

    [Serializable]
    public class AvatarUpdateDto
    {
        public string userId;
        public Vector3Dto headPosition;
        public QuaternionDto headRotation;
        public Vector3Dto leftHandPosition;
        public QuaternionDto leftHandRotation;
        public Vector3Dto rightHandPosition;
        public QuaternionDto rightHandRotation;
    }

    [Serializable]
    public class LaserUpdateDto
    {
        public string userId;
        public bool isActive;
        public Vector3Dto origin;
        public Vector3Dto direction;
        public Vector3Dto hitPoint;
        public string hitObjectId; // Point 2: Highlighted object ID
    }

    [Serializable]
    public class StrokeDto
    {
        public string userId;
        public Vector3Dto[] points;
        public Color color;
    }

    [Serializable]
    public class SummonDto
    {
        public string senderId;
        public Vector3Dto targetPosition;
        public QuaternionDto targetRotation;
    }

    [Serializable]
    public class VoiceSignalDto
    {
        public string senderId;
        public string targetId;
        public string signalType; // "offer", "answer", "candidate"
        public string data;       // SDP or Candidate JSON
    }

    [Serializable]
    public class MeasurementDto
    {
        public string userId;
        public Vector3Dto startPoint;
        public Vector3Dto endPoint;
        public float distance;
        public string unit;
        public bool isFinalized;
    }
}
