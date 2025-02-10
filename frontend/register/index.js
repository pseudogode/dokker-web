const SUCCESS = 'success';
const ERROR = 'error';
const TOKEN_KEY = 'token';

// TODO: Cleanup copy pasta

const onRegisterSubmitHandler = (form, formContainer) => async (event) => {
  event.preventDefault();
  const data = new FormData(event.target);
  const formDataObject = Object.fromEntries(data);
  const messageContainerId = 'message-container';
  let messageContainer = document.getElementById(messageContainerId);

  if (formDataObject.password !== formDataObject.confirmPassword) {
    if (!messageContainer) {
      messageContainer = document.createElement('div');
      messageContainer.setAttribute('id', messageContainerId);
      formContainer.appendChild(messageContainer);
    }

    let messageElement = messageContainer.children[0];
    if (!messageElement) {
      messageElement = document.createElement('p');
      messageContainer.appendChild(messageElement);
    }
    messageElement.innerText = "Passwords do not match.";
    form.reset();
    return;
  }

  try {
    const res = await fetch('../../backend/register.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formDataObject),
    });

    const { status, message, token } = await res.json();

    if (status === SUCCESS) {
      localStorage.setItem(TOKEN_KEY, token);
      setTimeout(() => {
        window.location.href = '../dashboard/index.html';
      }, 2000);
      return;
    }

    if (status === ERROR) {
      if (!messageContainer) {
        messageContainer = document.createElement('div');
        messageContainer.setAttribute('id', messageContainerId);
        formContainer.appendChild(messageContainer);
      }

      let messageElement = messageContainer.children[0];
      if (!messageElement) {
        messageElement = document.createElement('p');
        messageContainer.appendChild(messageElement);
      }

      messageElement.innerText = message;
      form.reset();
      return;
    }

    throw new Error('Unexpected server response', status);
  } catch (error) {
    if (!messageContainer) {
      messageContainer = document.createElement('div');
      messageContainer.setAttribute('id', messageContainerId);
      console.log('formContainer', formContainer);
      formContainer.appendChild(messageContainer);
    }

    let messageElement = messageContainer.children[0];
    if (!messageElement) {
      messageElement = document.createElement('p');
      messageContainer.appendChild(messageElement);
    }
    const errorMessage = 'Error on submitting registration form data';
    messageElement.innerText = error?.message ?? errorMessage;
    console.trace(error, errorMessage);
    // <TEST> Simulate registration
    localStorage.setItem(TOKEN_KEY, 'test');
    setTimeout(() => {
      window.location.href = '../dashboard/index.html';
    }, 2000);
    // </TEST>
  }
};

const registerForm = document.getElementById('register-form');
const registerFormContainer = document.getElementById('form-container');

registerForm.addEventListener('submit', onRegisterSubmitHandler(registerForm, registerFormContainer));