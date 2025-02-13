import { parseJson } from './utils.js';
import { SUCCESS, API_AUTH_PREFIX } from './constants.js';

export const authWrapper = async (renderGuard, renderContent) => {
  try {
    const res = await fetch(`../../${API_AUTH_PREFIX}status.php`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const { status } = await parseJson(res);

    if (!status) {
      throw new Error('Unexpected server response: "status" is missing');
    }

    if (status !== SUCCESS) {
      throw new Error('Not logged in.');
    }
    renderContent();
  } catch (error) {
    console.error(error?.message ?? 'Error fetching auth status:');
    renderGuard();
  }
};

export const fetchHandleUnauthorized = async (url, options, errorContainer = null) => {
  try {
    const res = await fetch(url, options);
    const { status, message, ...rest } = await parseJson(res);

    if (status === SUCCESS) {
      return rest;
    }

    if (res.status === 401) {
      setTimeout(() => location.reload(), 2000);
      throw new Error('Unauthorized');
    }

    throw new Error(message ?? `[Internal server error] [Status: ${res.status}]`);
  } catch(err) {
    console.error(err);
    throw(err);
  }
}
