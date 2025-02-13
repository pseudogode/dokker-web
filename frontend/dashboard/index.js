import { renderRegisterAndLoginButtons, renderLogOutButton } from './header.js';
import { authWrapper } from '../shared/auth.js';
import { mapContainerStateToClass } from '../containers/container-utils.js';
import { containerService } from '../containers/containers-service.js';

import { openModal, closeModal } from './modal.js';

const NAVIGATION_CONTAINER_ID = 'navigation-container';
const MAIN_SECTION_ID = 'main-section';

const CONTAINER_ACTIONS_PREFIX = 'container-actions';
const CONTAINER_MODAL_ID = `${CONTAINER_ACTIONS_PREFIX}-modal`;
const CONTAINER_MODAL_CLASS_NAME = CONTAINER_MODAL_ID;
const CONTAINER_MODAL_CONTENT_CONTAINER_ID = `${CONTAINER_MODAL_ID}-content`;

const openContainerModal = () => openModal(CONTAINER_MODAL_ID, CONTAINER_MODAL_CLASS_NAME);
const closeContainerModal = () => closeModal(CONTAINER_MODAL_CLASS_NAME);

const containerComparator = ({Created: Created1}, {Created: Created2} ) => Created1 - Created2;

const renderContainerModalContent = (container) => {
  console.log('container', container);
  const contentContainer = document.getElementById(CONTAINER_MODAL_CONTENT_CONTAINER_ID);
  contentContainer.innerHTML=`<p>${container.Names[0]}</p`;
}

const renderContainersTable = (containers, containerElement, rowClass = null) => {
  const table = document.createElement('table');
  table.classList.add('container-table');

  containers.map((container) => {
    const row = document.createElement('tr');
    row.classList.add('container-row', rowClass); 

    row.addEventListener('click', () => {
      renderContainerModalContent(container);
      openContainerModal();
    });

    const { Names, Image, State, Status } = container;

    const cells = [Names[0], Image, State, Status].map((text, index) => {
      const cell = document.createElement('td');
      if (index === 2) { cell.classList.add(mapContainerStateToClass(text)) };
      cell.textContent = text;
      return cell;
    });

    cells.forEach((cell) => row.appendChild(cell));

    table.appendChild(row);
  });

  containerElement.appendChild(table);
};

const renderDContainersList = async (containerElement) => {
  const { containers } = await containerService.getAllContainers();

  if (!containers) return;
  containers.sort(containerComparator);

  const runningContainers = containers.filter(({ State }) => State === 'running');
  const otherContainers = containers.filter(({ State }) => State !== 'running');

  renderContainersTable(runningContainers, containerElement);

  const otherContainersRowClass = 'faded';
  renderContainersTable(otherContainers, containerElement, otherContainersRowClass);
};

const renderDashboard = async () => {
  const navigationContainer = document.getElementById(NAVIGATION_CONTAINER_ID);
  navigationContainer.innerHTML = '';

  const mainSection = document.getElementById(MAIN_SECTION_ID);

  authWrapper(
    () => {
      renderRegisterAndLoginButtons(navigationContainer);
      mainSection.innerHTML = '<h1>You are not logged in<h1>';
    },
    () => {
      renderLogOutButton(navigationContainer);
      mainSection.innerHTML = '<h1>Dashboard<h1>';
      renderDContainersList(mainSection);
      // FIXME: export in const && remove test button
      const testButton = document.getElementById('test-button');

      testButton.addEventListener('click', () => openContainerModal());

      const modalCloseButton = document.getElementById(`${CONTAINER_ACTIONS_PREFIX}-close-button`);
      modalCloseButton.addEventListener('click', () => closeContainerModal());
      // EOF FIXME: 
    }
  );
};

await renderDashboard();

// NOTE: This handles click away events to close modal

window.addEventListener('load', () => {
  document.addEventListener('click', (event) => {
    if (event.target.classList.contains(CONTAINER_MODAL_CLASS_NAME)) {
      closeContainerModal();
    }
  });
});