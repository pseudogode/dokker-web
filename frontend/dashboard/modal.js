// import { stringToUuid } from '../shared/utils.js';

const getHelperClass = (className) => `${className}-open`;

export const openModal = (id, className, onOpen) => {
  document.getElementById(id).classList.add('open');
  document.body.classList.add(getHelperClass(className));
  onOpen();
};

export const closeModal = (className, onClose) => {
  document.querySelector(`.${className}.open`).classList.remove('open');
  document.body.classList.remove(getHelperClass(className));
  onClose();
};


