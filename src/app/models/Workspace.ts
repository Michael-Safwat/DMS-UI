export interface Workspace {
  id: string;
  name: string;
  userNID: string;
  parentId: string;
  documentsIds: string[];
  directoriesId: string[];
  description: string;
  createdAt: string;
  path: string;
}
