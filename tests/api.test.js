// api.test.js

// Mock the fetch function
global.fetch = jest.fn();

describe('API Tests', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test('fetchShifts should handle 401 Unauthorized error', async () => {
    // Mock the fetch to return a 401 error
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: async () => ({ message: 'Unauthorized' }),
    });

    // Your fetchShifts function (simplified for example)
    async function fetchShifts() {
      const response = await fetch('https://staging-funx-app.azurewebsites.net/api/shifts');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    }

    // Test the function
    await expect(fetchShifts()).rejects.toThrow('HTTP error! status: 401');
  });

  test('addShift should handle 401 Unauthorized error', async () => {
    // Mock the fetch to return a 401 error
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: async () => ({ message: 'Unauthorized' }),
    });

    // Your addShift function (simplified for example)
    async function addShift(shiftData) {
      const response = await fetch('https://staging-funx-app.azurewebsites.net/api/staging-function', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(shiftData),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    }

    // Test the function
    await expect(addShift({ /* shift data */ })).rejects.toThrow('HTTP error! status: 401');
  });

  test('API should accept valid authentication', async () => {
    // Mock a successful response
    fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ message: 'Success' }),
    });

    // Your authenticated request function
    async function makeAuthenticatedRequest() {
      const response = await fetch('https://staging-funx-app.azurewebsites.net/api/some-endpoint', {
        headers: {
          'Authorization': 'Bearer YOUR_AUTH_TOKEN_HERE',
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    }

    // Test the function
    await expect(makeAuthenticatedRequest()).resolves.toEqual({ message: 'Success' });
  });
});
