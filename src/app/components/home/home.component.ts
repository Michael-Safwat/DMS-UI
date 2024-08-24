import { Component } from '@angular/core';
import {Router} from "@angular/router";
import {AuthService} from "../../services/auth.service";
import {HTTP_INTERCEPTORS} from "@angular/common/http";
import {MyInterceptor} from "../../Interceptor/my.interceptor";


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  constructor(private router:Router, private service: AuthService) {}
  logout() {
      sessionStorage.clear();
      localStorage.clear();
      this.router.navigate(['login']);
  }
  testToken()
  {

    this.service.testHello().subscribe((res:any) =>{
      console.log('res',res);
    });
  }
}
