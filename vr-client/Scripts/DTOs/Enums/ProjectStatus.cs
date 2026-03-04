namespace VRArchitecture.DTOs.Enums
{
    /// <summary>
    /// Mirrors Backend → VRArchitecture.Domain.Enums.ProjectStatus
    /// </summary>
    public enum ProjectStatus
    {
        Draft,
        Processing,
        Ready,
        VRReady,
        InReview,
        Approved,
        VRActive,
        Error
    }
}
