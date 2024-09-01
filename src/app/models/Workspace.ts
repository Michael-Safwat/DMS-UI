import {User} from "./User";
import {Document} from "./Document";

export interface Workspace{
  id:string;
  name:string;
  user:User;
  documents:Document[];
}
