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

  getAllWorkspaces(parentID: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/all/${parentID}`);
  }

  getWorkspaceByID(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  createWorkspace(workspace: Workspace): Observable<any> {
    return this.http.post(`${this.baseUrl}`, workspace);
  }

  createDirectory(parentID: string, directory: Workspace): Observable<any> {
    return this.http.post(`${this.baseUrl}/directories/${parentID}`, directory);
  }

  deleteWorkspace(workspaceID: string) {
    return this.http.delete(`${this.baseUrl}/${workspaceID}`);
  }

  updateWorkspace(workspaceID: string, workspace: Workspace) {
    return this.http.put(`${this.baseUrl}/${workspaceID}`, workspace);
  }

  getAllDocuments(workspaceID: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${workspaceID}/documents`)
  }

  searchWorkspaces(searchTerm: string, owner: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/search/workspaces/${searchTerm}/${owner}`);
  }

  searchContent(name: string, workspaceID: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/search/${name}/${workspaceID}`)
  }

}
