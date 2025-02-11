import { TOKEN_KEY } from '../shared/constants.js';

const renderHeaderNavigation = () => {
  const navigationContainer = document.getElementById('navigation-container');

  if (!localStorage.getItem(TOKEN_KEY)) {
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

    navigationContainer.classList.add('flex-container');
    navigationContainer.appendChild(registerAnchor);
    navigationContainer.appendChild(loginAnchor);

    return;
  }

  const logOutButton = document.createElement('button');
  logOutButton.textContent = 'Log out';
  logOutButton.addEventListener('click', (_) => {
    localStorage.removeItem(TOKEN_KEY);
    location.reload();
  });
  navigationContainer.appendChild(logOutButton);
  return;
};

renderHeaderNavigation();
