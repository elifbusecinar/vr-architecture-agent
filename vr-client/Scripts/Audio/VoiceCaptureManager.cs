using UnityEngine;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace VRArchitecture.Audio
{
    /// <summary>
    /// Captures microphone audio, handles silence detection, and sends to backend for AI processing.
    /// </summary>
    public class VoiceCaptureManager : MonoBehaviour
    {
        public static VoiceCaptureManager Instance { get; private set; }

        [Header("Settings")]
        [SerializeField] private int _sampleRate = 16000;
        [SerializeField] private float _silenceThreshold = 0.02f;
        [SerializeField] private float _silenceDuration = 1.5f;

        private AudioClip _recording;
        private bool _isRecording = false;
        private float _silenceTimer = 0f;
        private int _lastSamplePos = 0;

        public event System.Action<float> OnAmplitudeChanged;
        public event System.Action<string> OnTranscriptionReceived;
        public event System.Action<string> OnStatusChanged;

        private void Awake()
        {
            Instance = this;
        }

        public void StartCapture()
        {
            if (_isRecording) return;
            
            _recording = Microphone.Start(null, true, 10, _sampleRate);
            _isRecording = true;
            _silenceTimer = 0f;
            _lastSamplePos = 0;
            OnStatusChanged?.Invoke("Listening...");
        }

        public void StopCapture()
        {
            if (!_isRecording) return;
            
            Microphone.End(null);
            _isRecording = false;
            ProcessAudio();
        }

        private void Update()
        {
            if (!_isRecording) return;

            int currentPos = Microphone.GetPosition(null);
            if (currentPos < _lastSamplePos) _lastSamplePos = 0;

            float[] samples = new float[currentPos - _lastSamplePos];
            if (samples.Length > 0)
            {
                _recording.GetData(samples, _lastSamplePos);
                float maxAmp = 0;
                foreach (var s in samples) if (Mathf.Abs(s) > maxAmp) maxAmp = Mathf.Abs(s);
                
                OnAmplitudeChanged?.Invoke(maxAmp);

                if (maxAmp < _silenceThreshold)
                {
                    _silenceTimer += Time.deltaTime;
                    if (_silenceTimer >= _silenceDuration) StopCapture();
                }
                else
                {
                    _silenceTimer = 0f;
                }
            }
            _lastSamplePos = currentPos;
        }

        private async void ProcessAudio()
        {
            OnStatusChanged?.Invoke("Processing AI...");
            
            // 1. Convert to Base64 (Simplification: In production, use WAV encoding)
            float[] samples = new float[_recording.samples];
            _recording.GetData(samples, 0);
            
            // Note: Sending raw float as base64 is for demo; real STT needs WAV/MP3 header
            byte[] bytes = new byte[samples.Length * 2];
            for (int i = 0; i < samples.Length; i++)
            {
                short val = (short)(samples[i] * short.MaxValue);
                byte[] valBytes = System.BitConverter.GetBytes(val);
                bytes[i * 2] = valBytes[0];
                bytes[i * 2 + 1] = valBytes[1];
            }
            string base64 = System.Convert.ToBase64String(bytes);

            // 2. Wrap in STT Request
            await SendToBackend(base64);
        }

        private async Task SendToBackend(string base64)
        {
            // Point 1: Request STT
            // Point 2: Take result text and request Intent Analysis
            // For brevity, we'll assume a combined service or direct calls
            
            string sttUrl = "api/ai/stt";
            // ... UnityWebRequest implementation ...
            // Let's assume we get "Change material to wood"
            
            string mockResult = "Change the floor material to marble"; 
            OnTranscriptionReceived?.Invoke(mockResult);
        }
    }
}
