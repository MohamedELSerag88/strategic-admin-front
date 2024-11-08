import {array} from "yup";

export interface EventType {
  category: {
    id:number,
    name:string
  };
  expert: {
    id:number,
    name:string
  };
  id: number;
  category_id : number,
  title : string,
  specialization : string,
  objective : string,
  main_axes: string,
  main_knowledge: string,
  main_skills: string,
  presentation_format: string,
  duration: number,
  duration_type: string,
  price: number,
  expert_id: number,
  month:string,
  week_number:number,
  from_date : string,
  to_date : string,
  serviceable_data : []

}
