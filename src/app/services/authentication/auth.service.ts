import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {User} from "../../models/User";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) {
  }

  registerUser(registerRequest: User) {
    return this.http.post(`${this.baseUrl}/register`, registerRequest);
  }

  logInUser(loginRequest: User): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, loginRequest);
  }

  getUserInfo(): Observable<any> {
    return this.http.get(`${this.baseUrl}/users`);
  }

  logout() {
    localStorage.clear();
  }
}
