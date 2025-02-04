const BASE_URL = process.env.NEXT_PUBLIC_BE_URL;
const API_PATH = process.env.NEXT_PUBLIC_API_BASE_URL;

export const API_ENDPOINTS = {
  text: {
    script: `${BASE_URL}${API_PATH}/text/script`,
    captions: `${BASE_URL}${API_PATH}/text/captions`
  },
  upload: `${BASE_URL}${API_PATH}/upload`,
  pdf: `${BASE_URL}${API_PATH}/pdf`,
  youtube: `${BASE_URL}${API_PATH}/youtube/transcript`
} as const;

// Helper for checking if the API is available
export async function checkAPIHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${BASE_URL}${API_PATH}/health`);
    return response.ok;
  } catch (error) {
    console.error('API Health Check Failed:', error);
    return false;
  }
}
