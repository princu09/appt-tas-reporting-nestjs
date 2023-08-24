import axios, {AxiosInstance, AxiosRequestConfig, AxiosResponse} from "axios";
import {getOrganisationId, setOrganisation} from "./services/organisation.service";
import {getSiteId} from "./services/site.service";
import {API_URL} from "./config/http.config";

let token: string | null = null;

function getDefaultParams() {
  const orgId = getOrganisationId();
  const siteId = getSiteId();
  return {
    ...(orgId ? { orgId } : null),
    ...(siteId ? { siteId } : null),
  };
}
const authInstance = (
  method: string,
  endpoint: string,
  params?: Object,
  body?: Object
) => {
  return axios({
    baseURL: API_URL,
    url: endpoint,
    timeout: 10000,
    method,
    data: { ...body },
    params: params,

    withCredentials: true,
  });
};
const axiosInstance = () : AxiosInstance => {
  const instance: any = axios.create({
    baseURL: API_URL,
    timeout: 10000,
    headers: {
      Authorization: getAPIToken()
    },
    params: {...getDefaultParams()},
    withCredentials: true,
  })
  instance.interceptors.request.use(async (req: AxiosRequestConfig) => {
    return req
  })
  return instance
};

async function createPortalUser(username: string, password: string) {
  try {
    return await authInstance(
      'POST',
      'user/transatlantic/usersignup',
      {},
      { username, password }
    )
  } catch (e) {
    return e
  }
}
function changeOrganisation (orgId: string) {
  setOrganisation(orgId)
}

async function login(username: string, password: string) {
  try {
    let res = await authInstance(`POST`, "authentication/login", {}, {
      username,
      password,
    });
    token = res.data.token
    setOrganisation(res.data.userOrganisations[0].id)
    return res;
  } catch (e) {
    return e
  }
}

function getAPIToken(): string | null {
  return token;
}

async function refresh() {
  try {
    let res = await axios.get(API_URL + `authentication/refresh`, {
      withCredentials: true,
    })
    token = res.data.token
    return res;
  }
  catch(e){
    return e
  }
}

async function logout() {
  token = null;
}

async function resetPassword(
  email: string
): Promise<AxiosResponse<object> | unknown> {
  try {
    return (
      await authInstance(
        "POST",
        "authentication/request/password-reset",
        {},
        { email }
      )
    );
  } catch (e) {
    return e;
  }
}

const reset = async (token: string, password: string) => {
  try{
  return await authInstance('POST', 'authentication/password-reset', {}, {token, password})
  }
  catch(e){
    return e
  }
}

const authenticateToken = async (params: Object, body: Object, token2fa: string) => {
  try{
    const res = await authInstance('POST', `authentication/2fa/${token2fa}`, params, body)
    token = res.data.token
    setOrganisation(res.data.userOrganisations[0].id)
    return res;
  }
  catch(e){
    return e
  }
}

export { createPortalUser, login, logout, resetPassword, getAPIToken, refresh, reset, changeOrganisation, authenticateToken};

export default axiosInstance
