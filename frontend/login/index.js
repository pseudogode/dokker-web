import { parseJson } from '../shared/utils.js';
import { API_AUTH_PREFIX, ERROR, SUCCESS } from '../shared/constants.js';

const ERROR_MESSAGE_CONTAINER_ID = 'message-container';

const onSubmitHandler = (form) => async (event) => {
  event.preventDefault();
  const data = new FormData(event.target);
  const formDataObject = Object.fromEntries(data);

  const messageContainer = document.getElementById(ERROR_MESSAGE_CONTAINER_ID);

  const showMessage = (message) => {
    messageContainer.innerHTML = `<p>${message}</p>`;
  }

  try {
    const res = await fetch(`../../${API_AUTH_PREFIX}login.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formDataObject),
    });

    const { status, message } = await parseJson(res);

    if (status === SUCCESS) {
      showMessage('Success! Redirecting...');
      setTimeout(() => {
        window.location.href = '../dashboard/index.html';
      }, 2000);
      return;
    }

    if (status === ERROR) {
      showMessage(message);
      form.reset();
      return;
    }

    throw new Error('Unexpected server response');
  } catch (err) {
    const errorMessage =
      err?.message ?? 'Error on submitting login form data';
    showMessage(errorMessage);
    console.error(err);
  }
};

const form = document.getElementById('login-form');

form.addEventListener('submit', onSubmitHandler(form));
