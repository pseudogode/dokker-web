import { renderRegisterAndLoginButtons, renderLogOutButton } from './header.js';
import { authWrapper } from '../shared/auth.js';
import { mapContainerStateToClass } from '../containers/container-utils.js';
import { containerService } from '../containers/containers-service.js';

const NAVIGATION_CONTAINER_ID = 'navigation-container';
const MAIN_SECTION_ID = 'main-section';

const renderDContainersList = async (containerElement) => {
  const { containers } = await containerService.getAllContainers();

  if (!containers) return;

  const table = document.createElement('table');
  table.classList.add('container-table');

  containers.map(({ Names, Image, State, Status }) => {
    const row = document.createElement('tr');
    row.classList.add('container-row'); 

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
    }
  );
};

await renderDashboard();
