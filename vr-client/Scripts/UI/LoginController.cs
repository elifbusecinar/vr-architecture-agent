using UnityEngine;
using UnityEngine.UIElements;
using UnityEngine.SceneManagement;
using VRArchitecture.Services;

namespace VRArchitecture.UI
{
    public class LoginController : MonoBehaviour
    {
        [SerializeField] private UIDocument _document;
        [SerializeField] private string _nextSceneName = "Lobby";

        private TextField _emailField;
        private TextField _passwordField;
        private Button _loginButton;
        private Label _errorLabel;

        private void OnEnable()
        {
            var root = _document.rootVisualElement;
            _emailField = root.Q<TextField>("email-field");
            _passwordField = root.Q<TextField>("password-field");
            _loginButton = root.Q<Button>("login-button");
            _errorLabel = root.Q<Label>("error-label");

            _loginButton.clicked += OnLoginClicked;
        }

        private void OnLoginClicked()
        {
            string email = _emailField.value;
            string password = _passwordField.value;

            if (string.IsNullOrEmpty(email) || string.IsNullOrEmpty(password))
            {
                _errorLabel.text = "Email and password are required.";
                return;
            }

            _loginButton.SetEnabled(false);
            _errorLabel.text = "Signing in...";

            APIService.Instance.Login(email, password, (success, message) =>
            {
                if (success)
                {
                    _errorLabel.text = "Success! Redirecting...";
                    SceneManager.LoadScene(_nextSceneName);
                }
                else
                {
                    _errorLabel.text = "Login failed: " + message;
                    _loginButton.SetEnabled(true);
                }
            }, rememberMe: true);
        }
    }
}
