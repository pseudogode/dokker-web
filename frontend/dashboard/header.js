import { parseJson } from '../shared/utils.js';
import { SUCCESS, API_AUTH_PREFIX } from '../shared/constants.js';

export const renderLogOutButton = (navigationContainer) => {
  const logOutButton = document.createElement('button');
  logOutButton.textContent = 'Log out';
  logOutButton.addEventListener('click', async () => {
    try {
      const res = await fetch(`../../${API_AUTH_PREFIX}logout.php`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const { status } = parseJson(res);

      if (!status) {
        throw new Error('Unexpected server response. "status" is missing.');
      }

      if (status !== SUCCESS) {
        throw new Error('Error during server logout');
      }
    } catch (e) {
      console.error(e?.message ?? 'Error during logout');
    }

    location.reload();
  });

  navigationContainer.appendChild(logOutButton);
};

export const renderRegisterAndLoginButtons = (navigationContainer) => {
  const loginButton = document.createElement('button');
  loginButton.textContent = 'Login';
  const loginAnchor = document.createElement('a');
  loginAnchor.href = '../login/index.html';
  loginAnchor.appendChild(loginButton);

  const registerButton = document.createElement('button');
  registerButton.textContent = 'Register';
  const registerAnchor = document.createElement('a');
  registerAnchor.href = '../register/index.html';
  registerAnchor.appendChild(registerButton);

  navigationContainer.appendChild(registerAnchor);
  navigationContainer.appendChild(loginAnchor);
}

