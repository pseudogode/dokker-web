import { renderRegisterAndLoginButtons, renderLogOutButton } from '../shared/header.js';
import { authWrapper } from '../shared/auth.js';
import { getAllContainersMock } from '../mock/getAllContainers.js';

const NAVIGATION_CONTAINER_ID = 'navigation-container';
const MAIN_SECTION_ID = 'main-section';

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
      },
  );
}

await renderDashboard();