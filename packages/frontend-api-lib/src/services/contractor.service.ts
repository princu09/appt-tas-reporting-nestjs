import { DELETE, GET, PATCH, POST } from "./http.service";
import {AxiosResponse} from "axios/index";

export async function createClientScreen(
  query: Object
): Promise<Object | unknown> {
  try {
    return (await GET("contractor-data-report", query))
  } catch (e) {
    return e;
  }
}

export async function incidentFlashReport(
  id: string
): Promise<Object | unknown> {
  try {
    return (await POST(`incident-flash-report/files/${id}`, {}))
  } catch (e) {
    return e;
  }
}

export async function singleIncidentFlashReport(
  id: string
): Promise<Object | unknown> {
  try {
    return (await GET(`incident-flash-report/${id}`, {}))
  } catch (e) {
    return e;
  }
}

export async function updateIncidentFlashReport(
  id: string,
  data: Object
): Promise<Object | unknown> {
  try {
    return (await PATCH(`incident-flash-report/${id}`, {}, data)).data;
  } catch (e) {
    return e;
  }
}

export async function deleteFlashReport(id: string): Promise<Object | unknown> {
  try {
    return (await DELETE(`incident-flash-report/${id}`, {})).data;
  } catch (e) {
    return e;
  }
}

export async function multiFlashReports(id: string): Promise<Object | unknown> {
  try {
    return (await GET(`incident-flash-report/${id}`, {}))
  } catch (e) {
    return e;
  }
}

export async function getSingleContractorDataReport(
  id: string,
  params: Object
): Promise<Object | unknown> {
  try {
    return (await GET(`contractor-data-report/${id}`, params))
  } catch (e) {
    return e;
  }
}
export async function updateSingleContractorReport(
  id: string,
  data: Object
): Promise<Object | unknown> {
  try {
    return (await PATCH(`contractor-data-report/${id}`, {}, data)).data;
  } catch (e) {
    return e;
  }
}

export async function deleteContractorReport(
  id: string
): Promise<Object | unknown> {
  try {
    return (await DELETE(`contractor-data-report/${id}`, {})).data;
  } catch (e) {
    return e;
  }
}

export async function getFlashReports(
  params: object,
): Promise<AxiosResponse | unknown> {
  try {
    return (await GET('incident-flash-report?s='+params + '&join=area'))
  } catch (e) {
    return e;
  }
}

// export async function noidea(data: Object): Promise<Object | unknown> {
//   try {
//     return (await GET(`contractor-data-report/form`, {}, data)).data;
//   } catch (e) {
//     return e;
//   }
// }

// export async function getMultipleContractorDataReports(
//   data: Object
// ): Promise<Object | unknown> {
//   try {
//     return (await GET(`contractor-data-report`, {}, data)).data;
//   } catch (e) {
//     return e;
//   }
// }

export async function createSinglContractorForm(
  data: Object
): Promise<Object | unknown> {
  try {
    return (await POST(`contractor-data-report`, {}, data)).data;
  } catch (e) {
    return e;
  }
}
