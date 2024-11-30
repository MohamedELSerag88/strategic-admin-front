export interface EventRequestType {
  id: number;
  "name" :string,
  "event_id":number,
  "event": {
    "id":number,
    "name" :string,
  },
  "event_type": string,
  "event_presentation" :string,
  "job" : string,
  "org_type" : string,
  "phone": string,
  "org_name" : string,
  "headquarter_country" : string,
  "event_country" : string,
  "event_date" : string,
  "notes" : string


}
