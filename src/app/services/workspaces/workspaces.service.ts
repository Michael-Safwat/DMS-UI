import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Workspace} from "../../models/Workspace";

@Injectable({
  providedIn: 'root'
})
export class WorkspacesService {

  private baseUrl: string = 'http://localhost:8080';
  constructor(private http: HttpClient) { }

  getAllWorkspaces(nid:string):Observable<any>
  {
    return this.http.get(`${this.baseUrl}/workspaces/${nid}`);
  }

  getWorkspaceById(nid:string,id:string):Observable<any>{
    return this.http.get(`${this.baseUrl}/workspaces/${nid}/${id}`);
  }

  createWorkspace(nid:string, workspace:Workspace):Observable<any>
  {
      return this.http.post(`${this.baseUrl}/workspaces/${nid}`,workspace);
  }
}
