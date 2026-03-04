using UnityEngine;
using System.Collections;
using System.IO;
using VRArchitecture.Services;

namespace VRArchitecture.Annotation
{
    /// <summary>
    /// Captures audio from the VR headset and sends it to the AI controller for transcription.
    /// Integrating with AnnotationController for speech-to-annotation.
    /// </summary>
    public class VoiceAnnotationHandler : MonoBehaviour
    {
        [Header("Audio Capture")]
        [SerializeField] private int _samplingRate = 16000;
        [SerializeField] private int _maxRecordLength = 10; // seconds

        private AudioClip _recording;
        private bool _isRecording = false;

        public void StartRecording()
        {
            if (_isRecording) return;
            
            _isRecording = true;
            _recording = Microphone.Start(null, false, _maxRecordLength, _samplingRate);
            Debug.Log("[VoiceAnnot] Recording started...");
        }

        public void StopAndTranscribe(System.Action<string> onResult)
        {
            if (!_isRecording) return;

            _isRecording = false;
            int lastSample = Microphone.GetPosition(null);
            Microphone.End(null);

            if (_recording == null) return;
            
            // POINT 4: Real STT
            byte[] audioData = ConvertAudioClipToWavByte(_recording, lastSample);
            string base64Audio = System.Convert.ToBase64String(audioData);
            string jsonRequest = JsonUtility.ToJson(new STTRequest { Base64Audio = base64Audio });

            APIService.Instance.PostRequest("/api/ai/stt", jsonRequest, true, (success, json) => {
                 if (success) {
                      try {
                          var response = JsonUtility.FromJson<STTResponse>(json);
                          onResult?.Invoke(response.text);
                      } catch (System.Exception ex) {
                          Debug.LogError($"[VoiceAnnot] Failed to parse STT response: {ex.Message}");
                          onResult?.Invoke("Transcription failed.");
                      }
                 }
            });
            
            Debug.Log("[VoiceAnnot] Recording stopped. Transcribing...");
        }

        [System.Serializable]
        private class STTRequest { public string Base64Audio; }

        [System.Serializable]
        private class STTResponse { public string text; public float confidence; }

        private byte[] ConvertAudioClipToWavByte(AudioClip clip, int lastSample)
        {
            float[] samples = new float[lastSample * clip.channels];
            clip.GetData(samples, 0);

            using (var memoryStream = new MemoryStream())
            using (var writer = new BinaryWriter(memoryStream))
            {
                // WAV Header
                writer.Write(new char[4] { 'R', 'I', 'F', 'F' });
                writer.Write(36 + samples.Length * 2);
                writer.Write(new char[4] { 'W', 'A', 'V', 'E' });
                writer.Write(new char[4] { 'f', 'm', 't', ' ' });
                writer.Write(16);
                writer.Write((short)1); // PCM
                writer.Write((short)clip.channels);
                writer.Write(_samplingRate);
                writer.Write(_samplingRate * clip.channels * 2);
                writer.Write((short)(clip.channels * 2));
                writer.Write((short)16);
                writer.Write(new char[4] { 'd', 'a', 't', 'a' });
                writer.Write(samples.Length * 2);

                // Convert float to 16-bit PCM
                foreach (var sample in samples)
                {
                    writer.Write((short)(sample * short.MaxValue));
                }

                return memoryStream.ToArray();
            }
        }
    }
}
