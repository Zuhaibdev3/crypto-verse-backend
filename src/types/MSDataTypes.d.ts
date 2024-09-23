
// export class IMergeExpandKeys {
//   leads: "owner,converted_contact,converted_account",
//   contacts: "contacts",
//   opportunities: "owner,stage,account",
//   accounts: "owner",
//   accountDetails: "", // error in accountDetails.list and expand: '' not get
//   tasks: "owner,account,opportunity",
//   stages: '' // expand: not exist in stages,
//   engagements: "contacts,owner,account,engagement_type",
//   engagementTypes: '' // expand: not exist in engagementTypes,
// }


export type IgetMSDataRetrivalKeys = "leads" | "contacts" | "opportunities" | "accounts" | "tasks" | "stages" | "engagements" | "engagementTypes"

export type IMergeExpandKeys = 
"owner,converted_contact,converted_account" |
"contacts" |
"owner,stage,account" |
"owner" |
"owner,account,opportunity" |
"contacts,owner,account,engagement_type"
