using System;
using UnityEngine;

namespace VRArchitecture.Onboarding
{
    /// <summary>
    /// Carries all data required to start onboarding and a VR session.
    /// Passed via OnboardingManager.BeginAsync(sessionData).
    /// </summary>
    [Serializable]
    public class SessionData
    {
        // ─── Core session ─────────────────────────────────────────────
        public string SessionId;
        public string JoinToken;
        public string ProjectId;
        public string ProjectName;
        public DateTime StartsAt;

        // ─── Onboarding — Architect info ──────────────────────────────
        public string ArchitectDisplayName;
        public Color  ArchitectAvatarColor;
        public string ArchitectAvatarInitials;
        /// <summary>CDN URL for a prerecorded welcome voice clip. Null = typewriter-only mode.</summary>
        public string WelcomeVoiceClipUrl;

        // ─── Onboarding — Plot info ────────────────────────────────────
        public float PlotSizeM2;
        public int   FloorCount;
    }
}
