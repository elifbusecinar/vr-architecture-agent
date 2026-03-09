using System;
using System.Collections.Generic;

namespace VRArchitecture.Services.AI
{
    [Serializable]
    public class GeminiRequest
    {
        public List<Content> contents;

        public static GeminiRequest Create(string prompt)
        {
            return new GeminiRequest
            {
                contents = new List<Content>
                {
                    new Content
                    {
                        parts = new List<Part> { new Part { text = prompt } }
                    }
                }
            };
        }
    }

    [Serializable]
    public class GeminiResponse
    {
        public List<Candidate> candidates;
        public List<SafetyRating> safetyRatings;
    }

    [Serializable]
    public class Candidate
    {
        public Content content;
        public string finishReason;
        public int index;
        public List<SafetyRating> safetyRatings;
    }

    [Serializable]
    public class Content
    {
        public List<Part> parts;
        public string role;
    }

    [Serializable]
    public class Part
    {
        public string text;
    }

    [Serializable]
    public class SafetyRating
    {
        public string category;
        public string probability;
    }
}
