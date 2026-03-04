using System;
using Fusion;
using UnityEngine;

namespace VRArchitecture.Models
{
    [Serializable]
    public struct AnnotationData : INetworkStruct
    {
        public Guid     Id;
        public NetworkString<_32> SessionId;
        public NetworkString<_128> Text;
        public NetworkString<_32> Room;
        public Vector3  WorldPos;
        public Vector3  WorldNormal;
        public Vector3  LocalPos;
        public Vector3  LocalNormal;
        public NetworkString<_32> CreatedBy;
        public Color    AuthorColor;
        public long     CreatedAtTicks; // Fusion Structs handle long better than DateTime

        public DateTime CreatedAt 
        { 
            get => new DateTime(CreatedAtTicks);
            set => CreatedAtTicks = value.Ticks;
        }

        public bool     IsResolved;
        public Annotation.AnnotationPriority Priority;

        // Fields from earlier AnnotationData for compatibility with UI scripts
        public string Note { get => Text.ToString(); set => Text = value; }
        public string AuthorName { get => CreatedBy.ToString(); set => CreatedBy = value; }
        public string LocationLabel { get => Room.ToString(); set => Room = value; }
        public string PriorityLabel => Priority.ToString().ToLower();
    }
}
