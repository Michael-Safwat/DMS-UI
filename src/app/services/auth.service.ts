import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {RegisterRequest} from "./models/RegisterRequest";
import {LoginRequest} from "./models/LoginRequest";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) { }
  registerUser(userDetails: RegisterRequest)
  {return this.http.post(`${this.baseUrl}/register`,userDetails);}

  logInUser(loginRequest: LoginRequest):Observable<any>
  {return this.http.post(`${this.baseUrl}/login`,loginRequest);}

  testHello()
  {return this.http.get(`${this.baseUrl}/testget`);}
}
