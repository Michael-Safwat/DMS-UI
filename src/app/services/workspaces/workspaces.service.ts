import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Workspace} from "../../models/Workspace";
import {FileUpload, FileUploadEvent} from "primeng/fileupload";

@Injectable({
  providedIn: 'root'
})
export class WorkspacesService {

  private baseUrl: string = 'http://localhost:8080';

  constructor(private http: HttpClient) {
  }

  getAllWorkspaces(): Observable<any> {
    return this.http.get(`${this.baseUrl}/workspaces`);
  }

  getWorkspaceById(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/workspaces/${id}`);
  }

  createWorkspace(workspace: Workspace): Observable<any> {
    return this.http.post(`${this.baseUrl}/workspaces`, workspace);
  }

  deleteWorkspace(workspaceId: string) {
    return this.http.delete(`${this.baseUrl}/workspaces/${workspaceId}`);
  }

  updateWorkspace(workspaceId: string, workspace: Workspace) {
    return this.http.put(`${this.baseUrl}/workspaces/${workspaceId}`, workspace);
  }

  uploadDocument(file: FileUploadEvent, workspaceId: string) {
    return this.http.post(`${this.baseUrl}/workspaces/${workspaceId}/documents`, file);
  }

  getAllDocuments(workspaceId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/workspaces/${workspaceId}/documents`)
  }

}
