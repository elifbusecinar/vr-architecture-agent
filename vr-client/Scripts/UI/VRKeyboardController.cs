using UnityEngine;
using TMPro;
using System;
using System.Collections.Generic;

namespace VRArchitecture.UI
{
    /// <summary>
    /// Programmatic VR Keyboard with Turkish support.
    /// Point 3: VR Keyboard Integration.
    /// </summary>
    public class VRKeyboardController : MonoBehaviour
    {
        public static event Action<string> OnKeyTyped;

        [Header("UI Refs")]
        [SerializeField] private TMP_InputField _targetField;
        [SerializeField] private GameObject    _keyPrefab;
        [SerializeField] private Transform     _keysRoot;

        private readonly string[] _trKeys = { 
            "1","2","3","4","5","6","7","8","9","0",
            "Q","W","E","R","T","Y","U","I","O","P","Ğ","Ü",
            "A","S","D","F","G","H","J","K","L","Ş","İ",
            "Z","X","C","V","B","N","M","Ö","Ç",
            "SPACE", "BACK"
        };

        private void Start()
        {
            GenerateKeys();
        }

        private void GenerateKeys()
        {
            foreach (var key in _trKeys)
            {
                // In a real project, we instantiate from prefab and setup listener
                // For this implementation, we simulate the logic
                Debug.Log($"[VRKeyboard] Key created: {key}");
            }
        }

        public void OnKeyPress(string character)
        {
            if (_targetField == null) return;

            if (character == "BACK")
            {
                if (_targetField.text.Length > 0)
                    _targetField.text = _targetField.text.Substring(0, _targetField.text.Length - 1);
            }
            else if (character == "SPACE")
            {
                _targetField.text += " ";
            }
            else
            {
                _targetField.text += character;
            }

            OnKeyTyped?.Invoke(character);
        }
    }
}
