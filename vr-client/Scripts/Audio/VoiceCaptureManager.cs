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

        private void ProcessAudio()
        {
            OnStatusChanged?.Invoke("Processing Audio...");
            
            if (_recording == null) return;

            // Trim silence from the end by finding where maxAmp exceeded threshold
            float[] samples = new float[_recording.samples * _recording.channels];
            _recording.GetData(samples, 0);

            // Compress to base64 WAV
            byte[] wavBytes = EncodeToWAV(samples, _recording.channels, _recording.frequency);
            string base64Audio = System.Convert.ToBase64String(wavBytes);

            SendToGemini(base64Audio);
        }

        private void SendToGemini(string base64Audio)
        {
            OnStatusChanged?.Invoke("Thinking (Audio)...");

            string systemPrompt = @"You are a smart home/architecture VR assistant.
The user's voice command is provided as audio. 
Listen to the audio, and extract their intent.
Return ONLY valid JSON with three fields:
1) 'transcription': What the user said.
2) 'action': Short ID of action (ChangeMaterial, ShowMinimap, TakeSnapshot, CreateAnnotation, None)
3) 'feedback': Brief response to the user.
";

            if (VRArchitecture.Services.AI.GeminiService.Instance != null)
            {
                VRArchitecture.Services.AI.GeminiService.Instance.AskWithAudio(base64Audio, "audio/wav", systemPrompt, (success, responseString) =>
                {
                    if (success)
                    {
                        // Clean markdown formatting if present
                        if (responseString.StartsWith("```json")) responseString = responseString.Replace("```json\n", "").Replace("\n```", "");
                        else if (responseString.StartsWith("```")) responseString = responseString.Replace("```\n", "").Replace("\n```", "");

                        try
                        {
                            var response = JsonUtility.FromJson<AiAudioResponse>(responseString);
                            if (response != null && !string.IsNullOrEmpty(response.transcription))
                            {
                                OnTranscriptionReceived?.Invoke(response.transcription);
                                // The VoiceCommandOverlayUI handles the intent display natively now!
                                // It can parse the same response object.
                                // Actually, let's fire another event for the actual intent, or just pass the full JSON text
                                // so the UI can parse it.
                                OnTranscriptionReceived?.Invoke("JSON|" + responseString);
                            }
                            else
                            {
                                OnTranscriptionReceived?.Invoke("JSON|" + responseString); // fallback passing Raw
                            }
                        }
                        catch (System.Exception ex)
                        {
                            Debug.LogError($"[VoiceCapture] Parse Error: {ex.Message}");
                            OnTranscriptionReceived?.Invoke("Error processing audio intent.");
                        }
                    }
                    else
                    {
                        Debug.LogError($"[VoiceCapture] Gemini Audio API Failure: {responseString}");
                        OnTranscriptionReceived?.Invoke("API connection failed.");
                    }
                });
            }
        }

        [System.Serializable]
        private class AiAudioResponse
        {
            public string transcription;
            public string action;
            public string feedback;
        }

        public static byte[] EncodeToWAV(float[] samples, int channels, int sampleRate)
        {
            int sampleCount = samples.Length;
            int byteCount = sampleCount * 2;
            byte[] wavData = new byte[byteCount + 44];
            
            // RIFF header
            byte[] riff = System.Text.Encoding.UTF8.GetBytes("RIFF");
            System.Array.Copy(riff, 0, wavData, 0, 4);
            System.BitConverter.GetBytes(byteCount + 36).CopyTo(wavData, 4);
            System.Text.Encoding.UTF8.GetBytes("WAVE").CopyTo(wavData, 8);
            
            // fmt chunk
            System.Text.Encoding.UTF8.GetBytes("fmt ").CopyTo(wavData, 12);
            System.BitConverter.GetBytes(16).CopyTo(wavData, 16);
            System.BitConverter.GetBytes((short)1).CopyTo(wavData, 20); // PCM
            System.BitConverter.GetBytes((short)channels).CopyTo(wavData, 22);
            System.BitConverter.GetBytes(sampleRate).CopyTo(wavData, 24);
            System.BitConverter.GetBytes(sampleRate * channels * 2).CopyTo(wavData, 28);
            System.BitConverter.GetBytes((short)(channels * 2)).CopyTo(wavData, 32);
            System.BitConverter.GetBytes((short)16).CopyTo(wavData, 34);
            
            // data chunk
            System.Text.Encoding.UTF8.GetBytes("data").CopyTo(wavData, 36);
            System.BitConverter.GetBytes(byteCount).CopyTo(wavData, 40);
            
            // PCM payload
            int offset = 44;
            for (int i = 0; i < sampleCount; i++)
            {
                short val = (short)(Mathf.Clamp(samples[i], -1f, 1f) * 32767);
                byte[] valBytes = System.BitConverter.GetBytes(val);
                wavData[offset++] = valBytes[0];
                wavData[offset++] = valBytes[1];
            }
            
            return wavData;
        }
    }
}
