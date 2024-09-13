import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Workspace} from "../../models/Workspace";
import {FileUpload, FileUploadEvent} from "primeng/fileupload";

@Injectable({
  providedIn: 'root'
})
export class WorkspacesService {

  private baseUrl: string = 'http://localhost:8080/workspaces';

  constructor(private http: HttpClient) {
  }

  getAllWorkspaces(parentId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/all/${parentId}`);
  }

  getWorkspaceById(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  createWorkspace(workspace: Workspace): Observable<any> {
    return this.http.post(`${this.baseUrl}`, workspace);
  }

  createDirectory(parentId: string,directory:Workspace):Observable<any>{
    return this.http.post(`${this.baseUrl}/directories/${parentId}`,directory);
  }

  deleteWorkspace(workspaceId: string) {
    return this.http.delete(`${this.baseUrl}/${workspaceId}`);
  }

  updateWorkspace(workspaceId: string, workspace: Workspace) {
    return this.http.put(`${this.baseUrl}/${workspaceId}`, workspace);
  }

  uploadDocument(file: FileUploadEvent, workspaceId: string) {
    return this.http.post(`${this.baseUrl}/${workspaceId}/documents`, file);
  }

  getAllDocuments(workspaceId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${workspaceId}/documents`)
  }

}
