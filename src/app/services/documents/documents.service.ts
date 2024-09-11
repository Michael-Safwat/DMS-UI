import { Injectable } from '@angular/core';
import {FileUploadEvent} from "primeng/fileupload";
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {Document} from "../../models/Document";

@Injectable({
  providedIn: 'root'
})
export class DocumentsService {

  private baseUrl: string = 'http://localhost:8080';

  constructor(private http: HttpClient) { }


  downloadDocument(documentId:string){
    return this.http.get(`${this.baseUrl}/documents/${documentId}`,{responseType:'blob',observe: 'response' });
  }

  previewDocument(documentId:string):Observable<any>{
    return this.http.get(`${this.baseUrl}/documents/${documentId}/preview`,{ responseType: 'text' });
  }

  deleteDocument(documentId:string):Observable<any>{
    return this.http.delete(`${this.baseUrl}/documents/${documentId}`);
  }

  updatedDocument(documentId:string,document:Document):Observable<any>{
    return this.http.put(`${this.baseUrl}/documents/${documentId}`,document);
  }
}
