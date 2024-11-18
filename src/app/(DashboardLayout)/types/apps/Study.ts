import {array} from "yup";

export interface StudyType {

  expert: {
    id:number,
    name:string
  };
  id: number;
  title : string,
  type : string,
  specialization : string,
  page_numbers: string,
  publication_date: string,
  main_topics: string,
  summary: string,
  file: number,
  related_studies: [],
  expert_id: number,
  related_services : [],
  serviceable_data :[]

}
