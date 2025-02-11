const createMessageContainer = (formContainer, messageContainerId) => {
  const messageContainer = document.createElement('div');
  messageContainer.setAttribute('id', messageContainerId);
  formContainer.appendChild(messageContainer);

  return messageContainer;
};

const createMessageElement = (messageContainer) => {
  const messageElement = document.createElement('p');
  messageContainer.appendChild(messageElement);
  return messageElement;
};

export const showErrorMessage = (
  formContainer,
  messageContainerId,
  message
) => {
  let messageContainer = document.getElementById(messageContainerId);
  if (!messageContainer) {
    messageContainer = createMessageContainer(
      formContainer,
      messageContainerId
    );
  }

  let messageElement = messageContainer.children[0];
  if (!messageElement) {
    messageElement = createMessageElement(messageContainer);
  }

  messageElement.innerText = message;
};

export const parseJson = async (response) => {
  const text = await response.text();
  try {
    const json = JSON.parse(text);
    return json;
  } catch (err) {
    throw new Error(
      `Server response is not in json format: "${text.slice(0, 16)}.."`
    );
  }
};
