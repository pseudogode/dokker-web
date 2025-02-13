import { renderRegisterAndLoginButtons, renderLogOutButton } from './header.js';
import { authWrapper, fetchHandleUnauthorized } from '../shared/auth.js';
import { mapContainerStateToClass } from '../containers/container-utils.js';
import { containerService } from '../containers/containers-service.js';

import { openModal, closeModal } from './modal.js';

const NAVIGATION_CONTAINER_ID = 'navigation-container';
const MAIN_SECTION_ID = 'main-section';

const CONTAINER_ACTIONS_PREFIX = 'container-actions';
const CONTAINER_MODAL_ID = `${CONTAINER_ACTIONS_PREFIX}-modal`;
const CONTAINER_MODAL_CLASS_NAME = CONTAINER_MODAL_ID;
const CONTAINER_MODAL_CONTENT_CONTAINER_ID = `${CONTAINER_MODAL_ID}-content`;
const CONTAINER_MODAL_HEADER_ID = `${CONTAINER_MODAL_ID}-header`;

const openContainerModal = () =>
  openModal(CONTAINER_MODAL_ID, CONTAINER_MODAL_CLASS_NAME);
const closeContainerModal = () => closeModal(CONTAINER_MODAL_CLASS_NAME);

const containerComparator = ({ Created: Created1 }, { Created: Created2 }) =>
  Created1 - Created2;

const renderContainerModalContent = (container) => {
  setTimeout(async () => {
    try {
      console.log('inside setTimeout');
      const { container: newContainer } =
        await containerService.getContainerById(container.Id);
      if (JSON.stringify(newContainer) !== JSON.stringify(container)) {
        renderContainerModalContent(newContainer);
      }
    } catch (err) {
      console.error(err);
    }
  }, 2000);

  console.log('currentContainer:', container);
  const copyButtonId = 'container-copy-id-button';

  const contentContainer = document.getElementById(
    CONTAINER_MODAL_CONTENT_CONTAINER_ID
  );

  contentContainer.innerHTML = '';

  const headerContainer = document.getElementById(CONTAINER_MODAL_HEADER_ID);
  const { Id, Names, State, Status, Image, Command } = container;
  const [name, ...names] = Names;

  headerContainer.innerHTML = `
    <h2>${name}</h2>
  `;

  const actionsContainer = document.createElement('div');
  contentContainer.innerHTML = '';
  contentContainer.appendChild(actionsContainer);
  actionsContainer.innerHTML = '<h5>Actions</h5>';

  const actionButtonsContainer = document.createElement('div');
  actionsContainer.appendChild(actionButtonsContainer);
  actionButtonsContainer.classList.add('actions-buttons-container');
  actionButtonsContainer.innerHTML = `<button id="${copyButtonId}"># Copy id</button>`;

  // const startButtonId = 'container-start-button';
  const startButton = document.createElement('button');
  startButton.innerText = '> Start';
  if (State !== 'running') {
    actionsContainer.appendChild(startButton);
    startButton.addEventListener('click', async () => {
      try {
        await containerService.triggerContainerOperation(Id, 'start');
        const { containers } =
          (await containerService.getAllContainers()) ?? []; // FIXME: get current only
        renderContainerModalContent(containers.find((c) => c.Id === Id));
      } catch (err) {
        console.error(err);
      }
    });
  }

  // const stopButtonId = 'container-stop-button';
  const stopButton = document.createElement('button');
  stopButton.innerText = '[] Stop';
  if (State === 'running') {
    actionButtonsContainer.appendChild(stopButton);
    stopButton.addEventListener('click', async () => {
      try {
        await containerService.triggerContainerOperation(Id, 'stop');
        const { containers } =
          (await containerService.getAllContainers()) ?? []; // FIXME: get current only
        renderContainerModalContent(containers.find((c) => c.Id === Id));
      } catch (err) {
        console.error(err);
      }
    });
  }

  const copyButton = document.getElementById(copyButtonId);
  copyButton.addEventListener('click', () => {
    try {
      navigator.clipboard.writeText(Id);
    } catch (err) {
      console.error('Failed to copy clipboard');
    }
  });

  const infoContainer = document.createElement('div');
  contentContainer.appendChild(infoContainer);
  infoContainer.innerHTML = ` <h5>Info</h5>
    <p>State: ${State}</p>
    <p>Status: ${Status}</p>
    <p>Image: ${Image}</p> 
    <p>Command: "${Command}"<p>
    ${names.map((n) => `<p>${n}</p>`)}
  `;

  headerContainer.classList.add(`container-${mapContainerStateToClass(State)}`);
};

const renderContainersTable = (
  containers,
  containerElement,
  rowClass = null
) => {
  const table = document.createElement('table');
  table.innerHTML = '';
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
      if (index === 2) {
        cell.classList.add(`container-${mapContainerStateToClass(text)}`);
      }
      cell.textContent = text;
      return cell;
    });

    cells.forEach((cell) => row.appendChild(cell));

    table.appendChild(row);
  });

  containerElement.appendChild(table);
};

const renderDContainersList = async (containerElement, containers) => {
  setTimeout(async () => {
    try {
      const { containers: newContainers } =
        await containerService.getAllContainers();
      if (
        JSON.stringify(newContainers.sort()) !==
        JSON.stringify(containers.sort())
      ) {
        renderDContainersList(containerElement, newContainers);
      }
    } catch (err) {
      console.error(err);
    }
  }, 5000);

  containerElement.innerHTML = '';

  try {
    const { containers } = await containerService.getAllContainers();

    if (!containers) {
      throw new Error('No "containers" key in in response json');
    }

    containers.sort(containerComparator);

    const runningContainers = containers.filter(
      ({ State }) => State === 'running'
    );
    const otherContainers = containers.filter(
      ({ State }) => State !== 'running'
    );

    renderContainersTable(runningContainers, containerElement);

    const otherContainersRowClass = 'faded';
    renderContainersTable(
      otherContainers,
      containerElement,
      otherContainersRowClass
    );
  } catch (err) {
    console.error(err);
  }
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
      mainSection.innerHTML = '<h1>Containers<h1>';
      renderDContainersList(mainSection, []);

      const modalCloseButton = document.getElementById(
        `${CONTAINER_ACTIONS_PREFIX}-close-button`
      );
      modalCloseButton.addEventListener('click', () => closeContainerModal());
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
