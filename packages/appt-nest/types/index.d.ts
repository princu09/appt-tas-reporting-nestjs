declare abstract class ApptBaseDTO {
    owner?: string | null;
    organisation?: string | null;
    site?: string | null;
    id?: string | null;
    deletedAt?: string | null;
    createdAt?: string | null;
    updatedAt?: string | null;
}

declare class Area extends ApptBaseEntity {
    name: string;
    flashReports: IncidentFlashReport[];
}
declare class AreaDTO extends ApptBaseDTO {
    name: string;
}

declare class ContractorDataReport extends ApptBaseEntity {
    weeklyWorkedHours: number;
    numOfWorkers: number;
    numLostTimeInjuries: number;
    numMajorInjuries: number;
    numDangerousOccurences: number;
    numNearMisses: number;
    medicalTreatmentInjuries: number;
    numRestrictedWorkCase: number;
    numLostDays: number;
    numRIDDOROccupationalIllnesses: number;
    numRIDDOR7DayInjuries: number;
    numRIDDOR3DayInjuries: number;
    numEmployeeOver7DayInjuries: number;
    numEmployeeOver3DayInjuries: number;
    numOSHARecordableInjuriesIllnesses: number;
    numTier1PSECount: number;
    numTier2PSECount: number;
    contractor: OrganisationContractor | null;
    contractorId: string | null;
    signature: boolean;
}

declare enum SafetyObservationRiskLevel {
    HIGH = "High",
    MEDIUM = "Medium",
    LOW = "Low",
    GOOD_PRACTICE = "Good Practice"
}
declare enum SafetyObservationsBreachType {
    REGULATORY = "Regulatory",
    PROJECT_PLAN = "Project Plan"
}
declare enum SafetyObservationSubcategory {
    SUB1 = "sub1",
    SUB2 = "sub2"
}
declare enum SafetyObservationUnsafeActOrCondition {
    UNSAFE_ACT = "Unsafe Act",
    CONDITION = "condition"
}
declare enum SafetyObservationCategory {
    PHYSICAL_RISK = "Physical Risk",
    BIOLOGICAL_RISK = "Biological Risk",
    CHEMICAL_RISK = "Chemical Risk",
    PHYSIOLOGICAL_RISK = "Physiological Risk"
}
declare class SafetyObservations extends ApptBaseEntity {
    dateObserved: Date;
    observation: string;
    category: SafetyObservationCategory;
    photoEvidence: Record[];
    photoEvidenceClosure: Record[];
    riskLevel: SafetyObservationRiskLevel;
    subcategory: SafetyObservationSubcategory;
    breachType: SafetyObservationsBreachType;
    actionTaken: string;
    requiredAction: string;
    unsafeActOrCondition: SafetyObservationUnsafeActOrCondition;
    contractor: OrganisationContractor | null;
    contractorId: string | null;
    signature: boolean;
    closingSignature: boolean;
}

declare class OrganisationContractor extends ApptBaseEntity {
    name: string;
    default: boolean;
    users: User[];
    flashReports: IncidentFlashReport[];
    contractorDataReports: ContractorDataReport[];
    safetyReports: SafetyObservations[];
}
declare class OrganisationContractorDTO extends ApptBaseDTO {
    name: string;
}

interface IOrganisation {
    id: string;
}
declare class Organisation {
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
    id: string;
    name: string | null;
    deleted: boolean | null;
    primarycolour: string | null;
    secondarycolour: string | null;
    logo: Record | null;
    appsettings: string | null;
    bundleid: string | null;
    appuniversallink: string | null;
    appstoreid: string | null;
    androidpackageid: string | null;
    appleappstorelink: string | null;
    androidappstorelink: string | null;
    enabledmodules: string | null;
    tertiaryColour: string | null;
    privacypolicy: string | null;
    readmoretext: string | null;
    public: boolean;
    contentIsPublic: boolean | null;
    emailToSendNotifications: string | null;
    sharedAppOwner: boolean;
    hasCustomApp: boolean;
    addressLineOne: string | null;
    addressLineTwo: string | null;
    postcode: string | null;
    city: string | null;
    customdomain: string | null;
    subscription: number | null;
    active: boolean | null;
    contractors: OrganisationContractor[];
    areas: Area[];
    adminModel: User | null;
    admin: string | null;
    users: User[];
    hassites: boolean;
    numallowedusers: number | null;
    notes: string | null;
    projectNumber: string;
    projectLocation: string;
    projectStartDate: Date;
    projectEndDate: Date;
    projectPhase: string;
    enabledKPIs: TransAtKPIListDTO[];
    kpiMultiplier: number;
}
declare class TransAtKPIListDTO {
    id: string;
    displayName: string;
    contractorReportId?: string;
    contractorId?: string;
    enabled: boolean;
}
declare class OrganisationDTO extends ApptBaseDTO {
    id: string;
    name: string | null;
    primarycolour?: string | null;
    secondarycolour?: string | null;
    appsettings?: string | null;
    bundleid?: string | null;
    appuniversallink?: string | null;
    appstoreid?: string | null;
    androidpackageid?: string | null;
    appleappstorelink?: string | null;
    androidappstorelink?: string | null;
    enabledmodules?: string | null;
    tertiaryColour?: string | null;
    privacypolicy?: string | null;
    readmoretext?: string | null;
    public?: boolean | null;
    contentIsPublic?: boolean | null;
    emailToSendNotifications?: string | null;
    sharedAppOwner?: boolean | null;
    hasCustomApp?: boolean | null;
    addressLineOne?: string | null;
    addressLineTwo?: string | null;
    postcode?: string | null;
    city?: string | null;
    customdomain?: string | null;
    subscription?: number | null;
    admin?: string | null;
    hassites?: boolean | null;
    numallowedusers?: number | null;
    notes?: string | null;
    projectNumber?: string;
    projectLocation?: string;
    projectStartDate?: Date;
    projectEndDate?: Date;
    projectPhase?: string;
    enabledKPIs?: TransAtKPIListDTO[];
}
declare class TransAtOrgUpdateDTO {
    organisation: OrganisationDTO;
    areas: AreaDTO[];
    contractors: OrganisationContractorDTO[];
    newKpiUsers: string[];
    deletedKpiUsersIds: string[];
}

interface ISite {
    id: string;
}

declare abstract class ApptBaseEntity {
    id: string;
    deletedAt: Date;
    createdAt: Date;
    updatedAt: Date;
    ownerModel: IUser;
    owner: string;
    organisationModel?: IOrganisation;
    organisation: string;
    siteModel: ISite | null;
    site: string | null;
}

declare class Record extends ApptBaseEntity {
    fileName: string;
    fileUrl: string;
    fileType: string;
    photoEvidenceSo: SafetyObservations;
    photoEvidenceClosureSo: SafetyObservations;
    pictureIFR: IncidentFlashReport;
}

declare class IncidentFlashReport extends ApptBaseEntity {
    observed: Date;
    area: Area | null;
    areaId: string | null;
    description: string;
    picture: Record[];
    contractor: OrganisationContractor | null;
    contractorId: string | null;
    signature: boolean;
}

declare class TriggerEmailContext {
    firstname: string;
    lastname: string;
    mobile: string;
    email: string;
}

declare class MessagingMessage extends ApptBaseEntity {
    message: string | null;
    conversationModel: MessagingConversation;
    conversation: string;
}

declare class MessagingConversation extends ApptBaseEntity {
    name: string | null;
    messages: MessagingMessage[];
    chatters: User[];
}

declare class Role extends ApptBaseEntity {
    title: string | null;
    permissions: string[] | null;
    defaultrole: boolean | null;
    hidden: boolean | null;
    roleUsers: Roleuser[];
}
declare class RoleDTO {
    title: string | null;
    permissions: string[] | null;
    defaultrole: boolean | null;
    hidden: boolean | null;
    owner: string | null;
    organisation: string | null;
    site: string | null;
}

declare class Roleuser extends ApptBaseEntity {
    roleModel: Role;
    role: string;
}

interface IUser {
    id: string;
}
declare class User {
    deletedAt: Date;
    createdAt: Date;
    updatedAt: Date;
    lastLoggedIn: Date | null;
    id: string;
    username: string | null;
    password: string | null;
    email: string | null;
    verifyemailtoken: string | null;
    passwordResetToken: string | null;
    changepassword: boolean | null;
    mobile: string | null;
    firstname: string | null;
    lastname: string | null;
    devicetoken: string | null;
    deleted: boolean;
    apprated: boolean | null;
    emailverified: boolean | null;
    actived: boolean;
    touchid: string | null;
    backendcurrentorganisation: number | null;
    isdeveloper: boolean;
    enabledbcache: boolean;
    reference: string | null;
    ethnicity: string | null;
    gender: string | null;
    jobTitle: string | null;
    type: string | null;
    dob: Date | null;
    verificationExpires: Date | null;
    verificationCode: number | null;
    isglobaladmin: boolean;
    addressLineOne: string | null;
    addressLineTwo: string | null;
    city: string | null;
    postcode: string | null;
    selfSignUpProcessed: boolean | null;
    stripeConnectAccountId: string | null;
    passwordLocked: Date;
    passwordAttempts: number;
    roles: Roleuser[];
    organisations: Organisation[];
    messagingConversations: MessagingConversation[];
    contractors: OrganisationContractor[];
    safetyObservations: SafetyObservations[];
    incidentFlashReport: IncidentFlashReport[];
    static getEmailTriggerContext(user: User): TriggerEmailContext;
}
declare class UserDTO {
    username: string | null;
    email: string | null;
    mobile?: string | null;
    firstname?: string | null;
    lastname?: string | null;
    reference?: string | null;
    ethnicit?: string | null;
    gender?: string | null;
    jobTitle?: string | null;
    type?: string | null;
    dob?: string | null;
    addressLineOne?: string | null;
    addressLineTwo?: string | null;
    city?: string | null;
    postcode?: string | null;
}

export { Role, RoleDTO, Roleuser, TransAtKPIListDTO, TransAtOrgUpdateDTO, User, UserDTO };
