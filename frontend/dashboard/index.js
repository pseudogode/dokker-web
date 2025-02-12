import { renderRegisterAndLoginButtons, renderLogOutButton } from './header.js';
import { authWrapper } from '../shared/auth.js';
import { mapContainerStateToClass } from '../containers/container-utils.js';
import { containerService } from '../containers/containers-service.js';

const NAVIGATION_CONTAINER_ID = 'navigation-container';
const MAIN_SECTION_ID = 'main-section';

const renderDContainersList = async (containerElement) => {
  const { containers } = await containerService.getAllContainers();

  if (!containers) return;

  containers.map(({Names, Id, Image, Status, State }) => {
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