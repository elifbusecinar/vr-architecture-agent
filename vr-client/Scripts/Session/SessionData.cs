using System;

namespace VRArchitecture.Session
{
    [Serializable]
    public class SessionData
    {
        public string    SessionId;
        public string    RoomName;
        public string    ModelUrl;
        public int       ModelVersion;
        public bool      IsHost;
        public string    ProjectName;
        public Guid      ProjectId;
        public float     Latitude;
        public DateTime  StartsAt;

        // Fields from previous setup for Lobby/Summary UI
        public int SessionNumber;
        public float Duration; // seconds
        public System.Collections.Generic.List<ParticipantSummary> ParticipantSummaries = new();
        public System.Collections.Generic.List<ApprovalSummary> ApprovalRequests = new();
    }
}
