import {User} from "./User";
import {Document} from "./Document";

export interface Workspace{
  id:string;
  name:string;
  userNID:string;
  documentsIds:string[];
  description:string;
  createdAt:string;
}
