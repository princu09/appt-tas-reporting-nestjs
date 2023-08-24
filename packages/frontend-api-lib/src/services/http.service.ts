import axiosInstance from "../authentication";

async function GET(endpoint: string, params?: Object) {
  const api = axiosInstance()
  return await api.get(endpoint, {params})
}

function PATCH(endpoint: string, params?: Object, body?: Object) {
  const api = axiosInstance()
  return api.patch(endpoint, body, {params})
}

function UPDATE(endpoint: string, params: Object, body: Object) {
  const api = axiosInstance()
  return api.patch(endpoint, {params, body})
}

function POST(endpoint: string, params?: Object, body?: Object) {
  const api = axiosInstance()
  return api.post(endpoint, body, {params})
}

function POST_FILE(endpoint: string, params?: Object, body?: Object) {
  const api = axiosInstance()
  api.defaults.headers.common['content-type'] = 'multipart/form-data'
  return api.post(endpoint, body, {params})
}

function DELETE(endpoint: string, params: Object) {
  const api = axiosInstance()
  return api.delete(endpoint, {params})
}

export { GET, PATCH, UPDATE, POST, POST_FILE, DELETE };
