using UnityEngine;
using System.Collections;
using System.Collections.Generic;

namespace VRArchitecture.Audio
{
    /// <summary>
    /// Handles capturing audio from the VR headset's microphone.
    /// Provides low-latency audio chunks for WebRTC streaming.
    /// </summary>
    public class MicrophoneCapturer : MonoBehaviour
    {
        public static MicrophoneCapturer Instance { get; private set; }

        [Header("Settings")]
        [SerializeField] private int _frequency = 48000;
        [SerializeField] private int _chunkLengthMs = 20;

        private string _microphoneName;
        private AudioClip _micClip;
        private int _lastSamplePos;
        private bool _isCapturing;

        public event System.Action<float[]> OnAudioChunkCaptured;

        private void Awake()
        {
            if (Instance != null) { Destroy(gameObject); return; }
            Instance = this;
        }

        public void StartCapture()
        {
            if (_isCapturing) return;

            if (Microphone.devices.Length == 0)
            {
                Debug.LogError("[Mic] No microphone devices found!");
                return;
            }

            _microphoneName = Microphone.devices[0]; // Default device
            _micClip = Microphone.Start(_microphoneName, true, 10, _frequency);
            _lastSamplePos = 0;
            _isCapturing = true;

            StartCoroutine(CaptureRoutine());
            Debug.Log($"[Mic] Capturing from: {_microphoneName}");
        }

        public void StopCapture()
        {
            if (!_isCapturing) return;
            Microphone.End(_microphoneName);
            _isCapturing = false;
        }

        private IEnumerator CaptureRoutine()
        {
            float[] sampleBuffer = new float[_frequency / (1000 / _chunkLengthMs)];

            while (_isCapturing)
            {
                int currentPos = Microphone.GetPosition(_microphoneName);
                
                if (currentPos < _lastSamplePos)
                {
                    // Handle wrap-around
                    int remaining = _micClip.samples - _lastSamplePos;
                    if (remaining + currentPos >= sampleBuffer.Length)
                    {
                        ProcessSamples(sampleBuffer);
                    }
                }
                else if (currentPos - _lastSamplePos >= sampleBuffer.Length)
                {
                    ProcessSamples(sampleBuffer);
                }

                yield return new WaitForSeconds(_chunkLengthMs / 2000f);
            }
        }

        private void ProcessSamples(float[] buffer)
        {
            _micClip.GetData(buffer, _lastSamplePos);
            _lastSamplePos = (_lastSamplePos + buffer.Length) % _micClip.samples;
            OnAudioChunkCaptured?.Invoke(buffer);
        }
    }
}
