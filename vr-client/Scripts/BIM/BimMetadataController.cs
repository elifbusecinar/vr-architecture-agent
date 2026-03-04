using UnityEngine;
using System.Collections.Generic;
using VRArchitecture.Services;
using TMPro;

namespace VRArchitecture.BIM
{
    /// <summary>
    /// Fetches and displays BIM metadata for a selected object.
    /// Used for Point 1: BIM Metadata Inspector.
    /// </summary>
    public class BimMetadataController : MonoBehaviour
    {
        [Header("UI Refs")]
        [SerializeField] private GameObject _metadataPanel;
        [SerializeField] private TMP_Text _displayText;

        public void ShowMetadata(string objectId)
        {
            if (string.IsNullOrEmpty(objectId)) return;

            _metadataPanel.SetActive(true);
            _displayText.text = "Fetching BIM data...";

            // Simulation of fetching real IFC/Revit data from Backend
            APIService.Instance.GetRequest($"/api/projects/metadata/{objectId}", true, (success, json) => {
                if (success)
                {
                    _displayText.text = FormatBimData(json);
                }
                else
                {
                    _displayText.text = $"<b>Object:</b> {objectId}\nNo metadata found in BIM database.";
                }
            });
        }

        private string FormatBimData(string json)
        {
            // Simple mock formatting
            return "<b>BIM Properties:</b>\n" +
                   "Type: Basic Wall (200mm)\n" +
                   "Fire Rating: 60 mins\n" +
                   "Material: Concrete Reinforced\n" +
                   "U-Value: 0.28 W/m²K\n" +
                   "Cost Est: $450/m²";
        }

        public void Close() => _metadataPanel.SetActive(false);
    }
}
