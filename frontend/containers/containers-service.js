import { fetchHandleUnauthorized } from '../shared/auth.js';
import { parseJson } from '../shared/utils.js';

const URL = '../../backend/api/docker_api/containers.php';

const mapSimpleContainerObject = (container) => {
  return {
    ...container, 
    Names: [container.Name],
    State: container.State.Status,
    Status: container.State.Status === 'running' ? `PID: ${container.State.Pid}` : `ExitCode: ${container.State.ExitCode ?? container.State.Status}`,
    Image: container.Config.Image,
    Command: container.Config.Cmd.join(', '),
  }
}

class ContainerService {
  async getAllContainers() {
    const data = await fetchHandleUnauthorized(URL, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return data; // { containers: Container[] }
  }

  async getContainerById(containerId) {
    const data = await fetchHandleUnauthorized(
      URL +
        '?' +
        new URLSearchParams({
          containerId,
        }),
      {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    return { ...data, container: !!data?.container ? mapSimpleContainerObject(data.container) : undefined };
  }

  async triggerContainerOperation(containerId, operation) {
    const res = await fetchHandleUnauthorized(URL, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        containerId,
        operation,
      }),
    });

    const { status } = parseJson(res);

    if (status !== 'success') {
      throw new Error(
        `Error when executing operation: ${operation} on ${containerId}`
      );
    }
  }
}

export const containerService = new ContainerService();
