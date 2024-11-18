import {array} from "yup";

export interface ForumType {
  id: number;
  title : string,
  subject : string,
  domain: string,
  start_date: string,
  end_date: string,
  related_forums : [],
  related_services :[]

}
