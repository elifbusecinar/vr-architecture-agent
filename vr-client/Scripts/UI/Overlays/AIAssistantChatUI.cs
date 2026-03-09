using UnityEngine;
using UnityEngine.UIElements;
using System.Collections.Generic;
using VRArchitecture.Services.AI;
using VRArchitecture.Tools;

namespace VRArchitecture.UI.Overlays
{
    [RequireComponent(typeof(UIDocument))]
    public class AIAssistantChatUI : MonoBehaviour
    {
        private VisualElement _root;
        private TextField _chatInput;
        private Button _sendBtn;
        private Button _closeBtn;
        private ScrollView _chatHistory;

        private void OnEnable()
        {
            _root = GetComponent<UIDocument>().rootVisualElement;
            BindElements();
            
            // Listen to virtual keyboard input
            VRKeyboardController.OnKeyTyped += HandleVirtualKeyPress;
        }

        private void OnDisable()
        {
            VRKeyboardController.OnKeyTyped -= HandleVirtualKeyPress;
        }

        private void BindElements()
        {
            _chatInput = _root.Q<TextField>("ai-input");
            _sendBtn = _root.Q<Button>("ai-send-btn");
            _closeBtn = _root.Q<Button>("ai-close-btn");
            _chatHistory = _root.Q<ScrollView>("ai-history-scroll");

            if (_sendBtn != null) _sendBtn.clicked += SendMessage;
            if (_closeBtn != null) _closeBtn.clicked += () => gameObject.SetActive(false);
            
            if (_chatInput == null) Debug.LogWarning("[AIAssistantChatUI] 'ai-input' not found in UXML.");
        }

        private void HandleVirtualKeyPress(string key)
        {
            if (_chatInput == null) return;

            if (key == "BACK")
            {
                if (_chatInput.value.Length > 0)
                    _chatInput.value = _chatInput.value.Substring(0, _chatInput.value.Length - 1);
            }
            else if (key == "SPACE")
            {
                _chatInput.value += " ";
            }
            else if (key == "ENTER")
            {
                SendMessage();
            }
            else
            {
                _chatInput.value += key;
            }
        }

        public void SendMessage()
        {
            if (_chatInput == null || string.IsNullOrWhiteSpace(_chatInput.value)) return;
            
            string message = _chatInput.value;
            _chatInput.value = "";
            AppendMessage("You", message, "user");

            if (GeminiService.Instance != null)
            {
                AppendMessage("Archie", "Thinking...", "system");
                
                string prompt = @"You are Archie, an architectural VR assistant.
The user is texting you. Respond in a brief, professional tone. 
If they issue a command (like taking a picture, or changing material), wrap your response strictly in the following JSON format and say 'Action required'.
Format: {\""action\"": \""TakeSnapshot\"", \""feedback\"": \""Taking a snapshot now.\""}
Valid actions: TakeSnapshot, ChangeMaterial, ShowMinimap, CreateAnnotation.
If it is just a question, return normal text.";

                GeminiService.Instance.Ask($"{prompt}\n\nUser: {message}", (success, response) => 
                {
                    // Remove pending "Thinking..." message
                    RemoveLastMessage();

                    if (success)
                    {
                        ProcessResponse(response);
                    }
                    else
                    {
                        AppendMessage("Archie", "Sorry, I lost connection to the server.", "error");
                    }
                });
            }
        }

        private void ProcessResponse(string response)
        {
            try
            {
                // Simple check if JSON block exists
                if (response.Contains("{") && response.Contains("action"))
                {
                    string cleanJson = response;
                    if (cleanJson.StartsWith("```json")) cleanJson = cleanJson.Replace("```json\n", "").Replace("\n```", "");
                    else if (cleanJson.StartsWith("```")) cleanJson = cleanJson.Replace("```\n", "").Replace("\n```", "");

                    var intent = JsonUtility.FromJson<ChatIntentResponse>(cleanJson);
                    if (intent != null && !string.IsNullOrEmpty(intent.action))
                    {
                        AppendMessage("Archie", intent.feedback, "assistant");
                        ExecuteIntent(intent.action, intent.feedback);
                        return;
                    }
                }
            }
            catch 
            {
                // Not JSON, just regular formatted text chat
            }

            AppendMessage("Archie", response, "assistant");
        }

        [System.Serializable]
        private class ChatIntentResponse
        {
            public string action;
            public string feedback;
        }

        private void ExecuteIntent(string action, string feedback)
        {
            Debug.Log($"[AIChat] Executing Action: {action}");
            try 
            {
                switch (action)
                {
                    case "ChangeMaterial":
                        if (VRArchitecture.Materials.MaterialManager.Instance != null)
                        {
                            GameObject floor = GameObject.Find("Floor");
                            if (floor == null) floor = new GameObject("Floor");
                            VRArchitecture.Materials.MaterialManager.Instance.ChangeMaterial(floor, "mat_marble_01");
                        }
                        break;
                    case "TakeSnapshot":
                        var snapshotTool = FindObjectOfType<VRSnapshotTool>();
                        if (snapshotTool != null) snapshotTool.TakeSnapshot("chat_project");
                        break;
                    case "CreateAnnotation":
                        var annotator = FindObjectOfType<Annotation.AnnotationController>();
                        if (annotator != null) annotator.CompleteAnnotation(feedback, Vector3.zero);
                        break;
                }
            }
            catch (System.Exception ex)
            {
                Debug.LogError($"[AIChat] Execution failed: {ex.Message}");
            }
        }

        private void AppendMessage(string sender, string msg, string cssClass)
        {
            if (_chatHistory == null) return;
            
            var msgContainer = new VisualElement();
            msgContainer.AddToClassList("chat-msg-row");
            msgContainer.AddToClassList($"chat-msg--{cssClass}");

            var senderLabel = new Label($"{sender}:");
            senderLabel.AddToClassList("chat-msg-sender");

            var textLabel = new Label(msg);
            textLabel.AddToClassList("chat-msg-text");

            msgContainer.Add(senderLabel);
            msgContainer.Add(textLabel);
            _chatHistory.Add(msgContainer);

            // Scroll to bottom
            _chatHistory.schedule.Execute(() => _chatHistory.ScrollTo(msgContainer)).StartingIn(100);
        }

        private void RemoveLastMessage()
        {
            if (_chatHistory != null && _chatHistory.childCount > 0)
            {
                _chatHistory.RemoveAt(_chatHistory.childCount - 1);
            }
        }
    }
}
