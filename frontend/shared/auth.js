import { parseJson } from './functions.js';
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
}