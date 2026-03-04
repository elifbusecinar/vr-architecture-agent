namespace VRArchitecture.DTOs.Enums
{
    /// <summary>
    /// Mirrors Backend → VRArchitecture.Domain.Enums.ActivityType
    /// </summary>
    public enum ActivityType
    {
        ProjectCreated,
        ProjectUpdated,
        ProjectDeleted,
        ProjectStatusChanged,
        AssetUploaded,
        AssetVersioned,
        SessionStarted,
        SessionEnded,
        MemberInvited,
        MemberJoined,
        WorkspaceCreated,
        ProjectShared,
        ProjectUnshared,
        StoryCreated,
        StoryDeleted,
        CommentAdded,
        CommentDeleted,
        SystemEvent
    }
}
