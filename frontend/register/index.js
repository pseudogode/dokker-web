import { parseJson } from '../shared/utils.js';
import { API_AUTH_PREFIX, ERROR, SUCCESS } from '../shared/constants.js';

const ERROR_MESSAGE_CONTAINER_ID = 'message-container';

const onRegisterSubmitHandler = (form) => async (event) => {
  event.preventDefault();

  const data = new FormData(event.target);
  const formDataObject = Object.fromEntries(data);

  const messageContainer = document.getElementById(ERROR_MESSAGE_CONTAINER_ID);

  const showMessage = (message) => {
    messageContainer.innerHTML = `<p>${message}</p>`;
  }

  if (formDataObject.password !== formDataObject.confirmPassword) {
    showMessage('Passwords do not match');
    form.reset();
    return;
  }

  try {
    const { confirmPassword, ...rest } = formDataObject;
    const res = await fetch(`../../${API_AUTH_PREFIX}register.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(rest),
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
      err?.message ?? 'Error on submitting registration form data';
    showMessage(errorMessage);
    console.error(err);
  }
};

const registerForm = document.getElementById('register-form');

registerForm.addEventListener(
  'submit',
  onRegisterSubmitHandler(registerForm)
);
