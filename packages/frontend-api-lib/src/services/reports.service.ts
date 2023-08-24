import {GET, POST} from "./http.service";

export async function getReports(params: Object, type: string): Promise<any> {
  try {
    return (await GET(`reports/${type}`, params))
  } catch (e) {
    return e;
  }
}
export async function getOrgReports(params: Object): Promise<any> {
  try {
    return (await GET("/reports/organisations", params))
  } catch (e) {
    return e;
  }
}
export async function getWeeklyDataReportForm(params: Object): Promise<any> {
  try {
    return (await GET("weekly-data-report/form", params))
  } catch (e) {
    return e;
  }
}
export async function postWeeklyDataReport(data: Object): Promise<any> {
  try {
    return (await POST("weekly-data-report", {}, data))
  } catch (e) {
    return e;
  }
}
