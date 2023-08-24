import { GET } from "./http.service";

export async function getKPIS(params: Object): Promise<Object | unknown> {
  try {
    return (await GET("/kpi", params))
  } catch (e) {
    return e;
  }
}

export async function getKPISList(params: Object): Promise<any[]> {
  try {
    return (await GET("/kpi/list", params)).data as any[]
  } catch (e) {
    return e;
  }
}
