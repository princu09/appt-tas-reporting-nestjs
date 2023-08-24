import type { User, UserDTO } from "@appt-digital/appt-nest-types";
import { GET, PATCH, POST, DELETE } from "./http.service";
import { addUserToRole,
  getRoleByTitle
} from "./role.service";
import { AxiosResponse } from "axios";

export async function getUser(id: string, params: Object): Promise<any> {
  return (await GET(`user/${id}`, params))
}


export async function getUsers(
  params: Object,
  sort: string,
): Promise<AxiosResponse<User> | null | unknown> {
  try {
    return (await GET(`user?s=${params}&sort=${sort}`))
  } catch (e) {
    return e;
  }
}

export async function addAdminUser(
  user: Partial<UserDTO>
): Promise<AxiosResponse<User> | unknown> {
  try {
    return await POST("user/transatlantic/adminuser", {}, user);
  } catch (e) {
    return e;
  }
}

export async function addKPIUser(user: Partial<UserDTO>) {
  try {
    return await POST("user/transatlantic/kpiuser", {}, user);
  } catch (e) {
    return e;
  }
}
export async function addHSEUser(user: Partial<UserDTO>) {
  try {
    return await POST("user/transatlantic/hseUser", {}, user);
  } catch (e) {
    return e;
  }
}

export async function addHSEUser(user: Partial<UserDTO>) {
  try {
    return await POST("user/transatlantic/hseUser", {}, user);
  } catch (e) {
    return e;
  }
}

export async function updateUser(
  id: string,
  data: Object
): Promise<AxiosResponse<User> | unknown> {
  try {
    return (await PATCH(`user/${id}`, {}, data))
  } catch (e) {
    return e;
  }
}

export async function addAppUser(
  user: Partial<UserDTO>
): Promise<AxiosResponse<User> | unknown> {
  try {
    return (await POST(`user/transatlantic/appuser`, {}, user))
  } catch (e) {
    return e;
  }
}

export async function deleteUser(
  id: string,
): Promise<AxiosResponse<User> | unknown> {
  try {
    return await DELETE(`user/${id}`, {});
  } catch (e) {
    return e;
  }
}
// export async function replaceUser(
//   id: string,
//   params: Object
// ): Promise<AxiosResponse<User> | unknown> {
//   try {
//     return await PUT(`user/${id}`, params, {});
//   } catch (e) {
//     return e;
//   }
// }
