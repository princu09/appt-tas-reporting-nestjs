export { getSiteId, setSite } from "./services/site.service";

export { createPortalUser,
  login,
  logout,
  resetPassword,
  getAPIToken,
  refresh,
  reset,
  changeOrganisation,
  authenticateToken
} from "./authentication";

export {setApiUrl} from './config/http.config'
export {
  // getRoleByTitle,
  addUserToRole,
  // getUsersWithRole,
  createRole,
} from "./services/role.service";

export {
  getKPIS,
  getKPISList
} from './services/kpi.service';

export {
  getUsers,
  // createAdminUser,
  addAdminUser,
  addKPIUser,
  addHSEUser,
  updateUser,
  addAppUser,
  deleteUser,
  addHSEUser
} from "./services/user.service";

export {
  setOrganisation,
  addUserToOrg,
  getOrgs,
  addOrg,
  getOrgByUser,
  deleteOrgUser,
  getSingleOrg,
  deleteSingleOrg,
  updateSingleOrg,
  replaceSingleOrg,
  getMultipleOrgs,
  createSingleOrg,
  getOrgContractors,
  uploadLogo,
  assignContractor,
  getClientData,
  updateTransatOrganisation
} from "./services/organisation.service";

export {
  createClientScreen,
  incidentFlashReport,
  singleIncidentFlashReport,
  updateIncidentFlashReport,
  deleteFlashReport,
  multiFlashReports,
  getSingleContractorDataReport,
  updateSingleContractorReport,
  deleteContractorReport,
  createSinglContractorForm,
  getFlashReports

} from "./services/contractor.service";

export {getWeeklyDataReportForm, postWeeklyDataReport} from './services/reports.service'

export { openObservations } from "./services/observations.service"

