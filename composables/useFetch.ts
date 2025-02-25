// composables/useApi.ts

export type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';
export type RequestHeaders = Record<string, string>;

interface RequestOptions {
    path: string;  // We will use 'path' instead of 'url'
    method?: RequestMethod;
    body?: any;  // You can specify a more specific type if you know the structure.
    headers?: RequestHeaders;
    params?: Record<string, any>;  // New field for query parameters
}

// Define your base URL
const BASE_URL = 'https://ayandesabz.ir/api';

export function useApi() {
    /**
     * Helper function to build a query string from an object.
     * @param {Record<string, any>} params - An object representing query parameters.
     * @returns {string} - A formatted query string.
     */
    const buildQueryString = (params: Record<string, any>): string => {
        const query = new URLSearchParams(params).toString();
        return query ? `?${query}` : '';
    };

    /**
     * General function to make HTTP requests.
     * @param {RequestOptions} options - Options for the HTTP request.
     * @returns {Promise<T>} - Promise resolving with the response data.
     */
    const request = async <T>({ path, method = 'GET', body = null, headers = {}, params = {} }: RequestOptions): Promise<T> => {
        try {
            const queryString = buildQueryString(params); // Create query string if params exist
            const response: T = await $fetch(`${BASE_URL}${path}${queryString}`, {
                method,
                headers,
                body: body ? JSON.stringify(body) : undefined,
            });
            return response;
        } catch (error: any) {
            throw new Error(`API request failed: ${error.message}`);
        }
    };

    // Specific functions for common HTTP methods
    const get = async <T>(path: string, params: Record<string, any> = {}, headers: RequestHeaders = {}): Promise<T> =>
        request<T>({ path, method: 'GET', params, headers });

    const post = async <T>(path: string, body: any, headers: RequestHeaders = {}): Promise<T> =>
        request<T>({ path, method: 'POST', body, headers });

    const put = async <T>(path: string, body: any, headers: RequestHeaders = {}): Promise<T> =>
        request<T>({ path, method: 'PUT', body, headers });

    const del = async <T>(path: string, headers: RequestHeaders = {}): Promise<T> =>
        request<T>({ path, method: 'DELETE', headers });



    function getImageUrl(imageUrl: string): string {
        const BASE_URL = 'https://ayandesabz.ir';
        const cleanedImageUrl = imageUrl.replace(/^\/+/, '');
        const fullUrl = `${BASE_URL}/${cleanedImageUrl}`;
        return fullUrl;
    }
    return {
        get,
        post,
        put,
        del,
        getImageUrl
    };
}
