interface FetchOptions extends RequestInit {
  retries?: number;
  retryDelay?: number;
}

export async function fetchWithRetry(
  url: string,
  options: FetchOptions = {}
): Promise<Response> {
  const { retries = 3, retryDelay = 1000, ...fetchOptions } = options;

  const defaultHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  for (let i = 0; i < retries; i++) {
    try {
      console.log(`Attempt ${i + 1}: Fetching ${url}`);

      const response = await fetch(url, {
        ...fetchOptions,
        credentials: 'include',
        headers: {
          ...defaultHeaders,
          ...fetchOptions.headers,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { rawError: errorText };
        }
        
        throw new Error(JSON.stringify({
          status: response.status,
          statusText: response.statusText,
          error: errorData,
          url
        }));
      }

      return response;
    } catch (error) {
      console.error(`Attempt ${i + 1} failed:`, error);
      
      if (i === retries - 1) throw error;
      
      await new Promise(resolve => setTimeout(resolve, retryDelay));
    }
  }

  throw new Error('All retry attempts failed');
} 