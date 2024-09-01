import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

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
}
