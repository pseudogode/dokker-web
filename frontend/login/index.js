const SUCCESS = 'success';
const ERROR = 'error';
const TOKEN_KEY = 'token';

const onSubmitHandler = (form, formContainer) => async (event) => {
  event.preventDefault();
  const data = new FormData(event.target);
  const formDataObject = Object.fromEntries(data);

  try {
    const res = await fetch('../../backend/login.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formDataObject),
    });

    const { status, message, token } = res.json();

    if (status === SUCCESS) {
      localStorage.setItem(TOKEN_KEY, token);
      setTimeout(() => {
        window.location.href = '../dashboard/index.html';
      }, 2000);
      return;
    }

    if (status === ERROR) {
      const messageContainerId = 'message-container';
      let messageContainer = document.getElementById(messageContainerId);
      if (!messageContainer) {
        messageContainer = document.createElement('div');
        messageContainer.setAttribute('id', messageContainerId);
        formContainer.appendChild(messageContainer);
      }

      let messageElement = messageContainer.children[0];
      if (!messageElement) {
        messageElement = document.createElement('p');
      }

      messageElement.innerText = message;
      form.reset();
      return;
    }

    throw new Error('Unexpected server response', status);
  } catch (error) {
    console.trace(error, 'Error on submitting form data');
    // <TEST> Simulate login
    localStorage.setItem(TOKEN_KEY, 'test');
    setTimeout(() => {
      window.location.href = '../dashboard/index.html';
    }, 2000);
    // </TEST>
  }
};

const form = document.getElementById('login-form');
const formContainer = document.getElementById('form-container');

form.addEventListener('submit', onSubmitHandler(form, formContainer));
