import { showErrorMessage, parseJson } from '../shared/functions.js';
import { API_AUTH_PREFIX, ERROR, SUCCESS } from '../shared/constants.js';

const onSubmitHandler = (form, formContainer) => async (event) => {
  event.preventDefault();
  const data = new FormData(event.target);
  const formDataObject = Object.fromEntries(data);

  const messageContainerId = 'message-container';
  const showError = (message) =>
    showErrorMessage(formContainer, messageContainerId, message);

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
      setTimeout(() => {
        window.location.href = '../dashboard/index.html';
      }, 2000);
      return;
    }

    if (status === ERROR) {
      showError(message);
      form.reset();
      return;
    }

    throw new Error('Unexpected server response');
  } catch (err) {
    const errorMessage =
      err?.message ?? 'Error on submitting login form data';
    showError(errorMessage);
    console.error(err);
  }
};

const form = document.getElementById('login-form');
const formContainer = document.getElementById('form-container');

form.addEventListener('submit', onSubmitHandler(form, formContainer));
