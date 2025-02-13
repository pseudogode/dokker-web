import { fetchHandleUnauthorized } from '../shared/auth.js';

const URL = '../../backend/api/docker_api/containers.php';

class ContainerService {
  async getAllContainers() {
    const containers = await fetchHandleUnauthorized(URL, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return containers; // Container[]
  }

  async triggerContainerOperation(containerId, operation) {
     await fetchHandleUnauthorized(URL, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        containerId, 
        operation
      }),
    });
  }
}

export const containerService = new ContainerService();
