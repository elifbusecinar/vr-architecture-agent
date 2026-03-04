using System;
using UnityEngine;

namespace VRArchitecture.DTOs.Workspaces
{
    /// <summary>
    /// Mirrors Backend → WorkspaceDto
    /// GET /api/workspaces
    /// </summary>
    [Serializable]
    public class WorkspaceDto
    {
        public string id;
        public string name;
        public string description;
        public int memberCount;
        public int projectCount;
    }

    /// <summary>
    /// Wrapper to deserialize JSON arrays via JsonUtility.
    /// </summary>
    [Serializable]
    public class WorkspaceListWrapper
    {
        public WorkspaceDto[] items;
    }

    /// <summary>
    /// Mirrors Backend → CreateWorkspaceDto
    /// POST /api/workspaces
    /// </summary>
    [Serializable]
    public class CreateWorkspaceDto
    {
        public string name;
        public string description;
    }

    /// <summary>
    /// Mirrors Backend → WorkspaceMemberDto
    /// </summary>
    [Serializable]
    public class WorkspaceMemberDto
    {
        public string userId;
        public string username;
        public string email;
        public int role; // maps to WorkspaceRole enum
    }

    /// <summary>
    /// Mirrors Backend → InvitationDto
    /// </summary>
    [Serializable]
    public class InvitationDto
    {
        public string id;
        public string email;
        public string workspaceId;
        public string workspaceName;
        public int targetRole; // maps to WorkspaceRole enum
        public string token;
        public string expiryDate;
        public bool isAccepted;
    }

    /// <summary>
    /// Mirrors Backend → SendInvitationDto
    /// POST /api/workspaces/{id}/invite
    /// </summary>
    [Serializable]
    public class SendInvitationDto
    {
        public string email;
        public string workspaceId;
        public int targetRole; // maps to WorkspaceRole enum
    }
}
