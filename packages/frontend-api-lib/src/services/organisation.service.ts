import { AxiosResponse } from "axios";
import { DELETE, GET, PATCH, POST, POST_FILE } from "./http.service";

const organisationIdName = "organisationId";

export function getOrganisationId(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem(organisationIdName);
  }
  return "a61e7231-d23c-451c-9847-71cfe927c2e7";
}

export function setOrganisation(id: string) {
  localStorage.setItem(organisationIdName, id);
}

export async function addUserToOrg(
  userId: string,
): Promise<AxiosResponse | unknown> {
  try {
    return (await POST("roleuser", {}, { userId }))
  } catch (e) {
    return e;
  }
}

export async function getOrgs(
  params: Object,
  sort: string,
): Promise<AxiosResponse | unknown> {
  try {
    return (await GET(`organisation?s=${params}&sort=${sort}`));
  } catch (e) {
    return e;
  }
}

export async function addOrg(data: Object): Promise<AxiosResponse | unknown> {
  try {
    return (await POST("organisation/transatlantic", {}, data))
  } catch (e) {
    return e;
  }
}

export async function getOrgByUser(
  id: string
): Promise<AxiosResponse | unknown> {
  try {
    return (await POST(`organisation/transatlantic/${id}`))
  } catch (e) {
    return e;
  }
}

export async function deleteOrgUser(
  id: string,
): Promise<AxiosResponse | unknown> {
  try {
    return (await DELETE(`organisation/user/${id}`, {}))
  } catch (e) {
    return e;
  }
}

export async function getSingleOrg(
  id: string,
  params: Object
): Promise<AxiosResponse | unknown> {
  try {
    return (await GET(`organisation/${id}`, params))
  } catch (e) {
    return e;
  }
}

export async function updateSingleOrg(
  id: string,
  data: Object
): Promise<AxiosResponse | unknown> {
  try {
    return (await PATCH(`organisation/${id}`, {}, data))
  } catch (e) {
    return e;
  }
}

export async function replaceSingleOrg(
  id: string,
  data: Object
): Promise<AxiosResponse | unknown> {
  try {
    return (await PATCH(`organisation/${id}`, {}, data))
  } catch (e) {
    return e;
  }
}

export async function deleteSingleOrg(
  id: string
): Promise<AxiosResponse | unknown> {
  try {
    let org = getOrganisationId()
    setOrganisation(id)
    let ret = (await DELETE(`organisation/${id}`, {}))
    setOrganisation(org)
    return ret
  } catch (e) {
    return e;
  }
}

export async function getMultipleOrgs(
  params: Object
): Promise<AxiosResponse | unknown> {
  try {
    return (await GET(`organisation`, params))
  } catch (e) {
    return e;
  }
}

export async function createSingleOrg(
  data: Object
): Promise<AxiosResponse | unknown> {
  try {
    return (await POST(`organisation`, {}, data))
  } catch (e) {
    return e;
  }
}

export async function addOrgUser(
  id: string,
  data: Object
): Promise<AxiosResponse | unknown> {
  try {
    return (await PATCH(`organisation/${id}`, {}, data))
  } catch (e) {
    return e;
  }
}

export async function getOrgContractors(
): Promise<AxiosResponse | unknown> {
  try {
    return (await GET(`organisationcontractor`, {}))
  } catch (e) {
    return e;
  }
}


export async function uploadLogo(
  file: any,
  orgId: string
): Promise<AxiosResponse | unknown> {
  let org = getOrganisationId()
  setOrganisation(orgId)
  try {
    let ret = (await POST_FILE(`organisation/uploadlogo`, {}, file))
    setOrganisation(org)
    return ret
  } catch (e) {
    setOrganisation(org)
    return e;
  }
}

export async function updateTransatOrganisation(data: any) {
  return (await PATCH(`/organisation/transatlantic`, {}, data))
}

export async function getClientData(
  orgId: string,
  params: Object
): Promise<AxiosResponse | unknown> {
  let org = getOrganisationId()
  setOrganisation(orgId)
  try {
    let ret = (await GET(`organisation/clientdata`, params))
    setOrganisation(org)
    return ret
  } catch (e) {
    setOrganisation(org)
    return e;
  }
}

export async function assignContractor(
  id: string,
  userId: string
): Promise<AxiosResponse | unknown> {
  try {
    return (await POST(`organisationcontractor/assign/${id}`, {}, {userId}))
  } catch (e) {
    return e;
  }
}
