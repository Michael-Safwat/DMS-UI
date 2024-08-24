import { Component } from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {AuthService} from "../../services/auth.service";
import {LoginRequest} from "../../services/models/LoginRequest";
import {MessageService} from "primeng/api";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm = this.fb.group({
    email:['',[Validators.required,Validators.email]],
    password:['',Validators.required]
  })

  constructor(private fb: FormBuilder,
              private authService: AuthService,
              private messageService: MessageService,
              private router: Router) {}

  get email()
  {return this.loginForm.controls['email'];}
  get password()
  {return this.loginForm.controls['password'];}

  loginUser() {
    const postData ={...this.loginForm.value};
    this.authService.logInUser(postData as LoginRequest).subscribe((res:any) =>
    {
      console.log('res',res);
      localStorage.setItem('token',res.token);
      localStorage.setItem('email',res.email);

      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Login Successfully' });
      this.router.navigate(['home']);

    },error => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Email or Password is incorrect!' });
    })
  }
}
