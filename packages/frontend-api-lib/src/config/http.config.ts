let defaultApiUrl = ''
// export const API_URL = 'http://127.0.0.1:1337/'

export let API_URL: string = defaultApiUrl;

export function setApiUrl(url: string) {
  API_URL = url
}
