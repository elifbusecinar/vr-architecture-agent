using System;
using System.Runtime.CompilerServices;
using UnityEngine.Networking;

namespace VRArchitecture.Services.Http
{
    /// <summary>
    /// Makes UnityWebRequestAsyncOperation awaitable so we can write:
    ///   await request.SendWebRequest();
    /// instead of yielding inside a coroutine.
    /// </summary>
    public struct UnityWebRequestAwaiter : INotifyCompletion
    {
        private UnityWebRequestAsyncOperation _asyncOp;

        public UnityWebRequestAwaiter(UnityWebRequestAsyncOperation asyncOp)
        {
            _asyncOp = asyncOp;
        }

        public bool IsCompleted => _asyncOp.isDone;

        public void OnCompleted(Action continuation)
        {
            _asyncOp.completed += _ => continuation();
        }

        public UnityWebRequest GetResult()
        {
            return _asyncOp.webRequest;
        }
    }

    /// <summary>
    /// Extension methods that enable await on UnityWebRequestAsyncOperation.
    /// </summary>
    public static class UnityWebRequestExtensions
    {
        public static UnityWebRequestAwaiter GetAwaiter(this UnityWebRequestAsyncOperation asyncOp)
        {
            return new UnityWebRequestAwaiter(asyncOp);
        }
    }
}
