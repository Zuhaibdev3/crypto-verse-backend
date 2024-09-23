export enum BusinessStatus {
  setupPending = "SetupPending",
  siteAssigned = "SiteAssigned",
  invited = "Invited",
  active = "Active",
  suspended = "Suspended",
  registered = "Registered",
}

export enum JobStatus {
  open = "open",
  close = "close"
}

export enum OptionType {
  select = "select",
  input = "input",
}

export enum QuestionType {
  mcq = "mcq",
  list = "list",
}

export enum GenderType {
  male = "male",
  female = "female"
}

export enum LoginSource {
  facebook = "facebook",
  google = "google",
  apple = "apple",
  default = "default",
}

export enum VisitStatus {
  inProgress = "inProgress",
  complete = "complete"
}

// export enum PrismaModel {
//   "user",
//   "post",
//  "profile"
// }
export enum GeoJSONObjectTypes {
  point = "Point",
  lineString = "LineString",
  polygon = "Polygon",
  multiPoint = "MultiPoint",
  multiLineString = "MultiLineString",
  multiPolygon = "MultiPolygon",
  geometryCollection = "GeometryCollection"
}


export enum JobApplicationStatus {
  interviewed = 'interviewed',
  candidate = 'candidate',
  applied = 'applied',
  hired = 'hired',
  rejected = 'rejected',
  contacted = 'contacted',
  reviewed = 'reviewed'
}

export enum GOAL_TYPES {
  ORGANIZATION = "ORGANIZATION",
  EMPLOYEE = "EMPLOYEE"
}

export enum GOAL_STATUS {
  NOT_STARTED = "NOT_STARTED",
  STARTED = "STARTED",
  IN_PROGRESS = "IN_PROGRESS",
  ALMOST_DONE = "ALMOST_DONE",
  COMPLETE = "COMPLETE",
  BLOCKED = "BLOCKED",
}

export enum BCS_PERSONA {
  B2B = "B2B",
  B2C = "B2C",
}

export enum BRAND_FACING {
  EMPLOYEE = "EMPLOYEE",
  CUSTOMER = "CUSTOMER",
}

export enum SEQUENCE_STATUS {
  ACTIVE = "ACTIVE",
  PAUSED = "PAUSED",
}

export enum WORKSPACE_STATUS {
  ACTIVE = "ACTIVE",
  UPCOMING = "UPCOMING",
  ARCHIVE = "ARCHIVE",
}

export enum SEQUENCE_TASK_STEP {
  AUTOMATIC_EMAIL = "AUTOMATIC_EMAIL",
  PHONE_CALL = "PHONE_CALL",
  LINKEDIN_CONNECTION_REQUEST = "LINKEDIN_CONNECTION_REQUEST",
  LINKEDIN_SEND_MESSAGE = "LINKEDIN_SEND_MESSAGE",
  LINKEDIN_VIEW_PROFILE = "LINKEDIN_VIEW_PROFILE",
  LINKEDIN_INTERACT_POST = "LINKEDIN_INTERACT_POST",
}


export function getEnumValues<T extends string | number>(e: any): T[] {
  return typeof e === 'object' ? Object.values(e) : [];
}
