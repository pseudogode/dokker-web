import { renderRegisterAndLoginButtons, renderLogOutButton } from '../shared/header.js';
import { authWrapper } from '../shared/auth.js';
import { getAllContainersMock, mapContainerStateToClass } from '../mock/getAllContainers.js';

const NAVIGATION_CONTAINER_ID = 'navigation-container';
const MAIN_SECTION_ID = 'main-section';

const renderDContainersList = (containerElement) => {
  getAllContainersMock().map(({Names, Id, Image, Status, State }) => {
    const pill = document.createElement('div');
    pill.classList.add('pill', 'container-pill');
    pill.innerHTML = `
      <strong class="container-prop">${Names[0]}</strong>
      <span class="container-prop image">${Image}</span>
      <span class="pill container-prop ${mapContainerStateToClass(State)}">${State}</span>
      <span class="status container-prop">${Status}</span>
    `;

    containerElement.appendChild(pill);
  });
}

const renderDashboard = async () => {
  const navigationContainer = document.getElementById(NAVIGATION_CONTAINER_ID);
  navigationContainer.innerHTML = '';

  const mainSection = document.getElementById(MAIN_SECTION_ID);

  authWrapper(
      () => {
        renderRegisterAndLoginButtons(navigationContainer);
        mainSection.innerHTML='<h1>You are not logged in<h1>';
      },
      () => {
        renderLogOutButton(navigationContainer);
        mainSection.innerHTML='<h1>Dashboard<h1>';
        renderDContainersList(mainSection);
      },
  );
}

await renderDashboard();