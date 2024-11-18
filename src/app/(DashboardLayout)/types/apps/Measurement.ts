import {array} from "yup";

export interface MeasurementType {
  expert: {
    id:number,
    name:string
  };
  id: number;
  title : string,
  subject : string,
  domain: string,
  targeted_segment: string,
  geographical_scope: string,
  participants: number,
  start_date: string,
  end_date: string,
  expert_id: number,
  related_opinions : [],
  related_services :[]

}
