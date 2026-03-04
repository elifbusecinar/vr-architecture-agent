using UnityEditor;
using UnityEditor.Build;
using UnityEditor.Rendering;
using UnityEngine;
using UnityEngine.Rendering;
using System.Collections.Generic;

namespace VRArchitecture.Editor
{
    /// <summary>
    /// Configures Shader Stripping for GLTFast to prioritize URP shaders.
    /// Ensures Built-in shaders are stripped in URP projects to minimize build size.
    /// </summary>
    public class GltFastShaderStripper : IPreprocessShaders
    {
        public int callbackOrder => 0;

        public void OnProcessShader(Shader shader, ShaderSnippetData snippet, IList<ShaderCompilerData> data)
        {
            // If we are using URP, we should strip non-URP shaders provided by GLTFast
            // Or ensure Built-in shaders are not included.
            
            // GLTFast Shaders usually have "GLTF" or "GltFast" in their name.
            if (shader.name.Contains("GLTF") || shader.name.Contains("GltFast"))
            {
                // If it's not a URP-compatible shader (hidden/Internal or Legacy), strip it
                if (shader.name.Contains("Builtin") || shader.name.Contains("Standard") || shader.name.Contains("Unlit"))
                {
                    // If URP is enabled, strip these
                    if (GraphicsSettings.currentRenderPipeline != null)
                    {
                        data.Clear();
                    }
                }
            }
        }
    }
}
