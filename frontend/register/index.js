import { showErrorMessage, parseJson } from '../shared/functions.js';

const SUCCESS = 'success';
const ERROR = 'error';

const onRegisterSubmitHandler = (form, formContainer) => async (event) => {
  event.preventDefault();

  const data = new FormData(event.target);
  const formDataObject = Object.fromEntries(data);

  const messageContainerId = 'message-container';
  const showError = (message) =>
    showErrorMessage(formContainer, messageContainerId, message);

  if (formDataObject.password !== formDataObject.confirmPassword) {
    showError('Passwords do not match');
    form.reset();
    return;
  }

  try {
    const { confirmPassword, ...rest } = formDataObject;
    const res = await fetch('../../backend/api/auth/register.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(rest),
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
      err?.message ?? 'Error on submitting registration form data';
    showError(errorMessage);
    console.error(err);
  }
};

const registerForm = document.getElementById('register-form');
const registerFormContainer = document.getElementById('form-container');

registerForm.addEventListener(
  'submit',
  onRegisterSubmitHandler(registerForm, registerFormContainer)
);
