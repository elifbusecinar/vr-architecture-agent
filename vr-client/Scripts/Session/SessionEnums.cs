namespace VRArchitecture.Session
{
    public enum SessionState 
    { 
        Idle, 
        Connecting, 
        Active, 
        Leaving, 
        Error,
        Ended // Keep Ended from previous requirement for Summary UI
    }
}
