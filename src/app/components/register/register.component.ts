import { Component } from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {passwordMatchValidator} from "../../shared/password-match.directive";
import {AuthService} from "../../services/auth.service";
import {User} from "../../interfaces/User";
import {MessageService} from "primeng/api";
import {Router} from "@angular/router";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm = this.fb.group({
    firstName:['',[Validators.required,Validators.pattern(/^[a-z ,.'-]+$/i)]],
    lastName:['',[Validators.required,Validators.pattern(/^[a-z ,.'-]+$/i)]],
    nationalId:['',Validators.required],
    username:['',[Validators.required,Validators.pattern(/^[0-9A-Za-z]{6,16}$/)]],
    email:['',[Validators.required,Validators.email]],
    password:['',Validators.required],
    confirmPassword:['',Validators.required]
    },{
    validators: passwordMatchValidator
  })
  constructor(private fb:FormBuilder,
              private authService: AuthService,
              private messageService: MessageService,
              private router: Router) {}

  get firstName() {return this.registerForm.controls['firstName'];}
  get lastName() {return this.registerForm.controls['lastName'];}
  get nationalId(){return this.registerForm.controls['nationalId'];}
  get username(){return this.registerForm.controls['username'];}
  get email(){return this.registerForm.controls['email'];}
  get password(){return this.registerForm.controls['password'];}
  get confirmPassword(){return this.registerForm.controls['confirmPassword'];}

  submitDetails() {
    const postData = {... this.registerForm.value};
    delete postData.confirmPassword;
    this.authService.registerUser(postData as User).subscribe(
      response => {
          console.log(response);
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Registered Successfully' });
          this.router.navigate(['login'])
      },
      error => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Something went wrong!' });
      }
    )
  }
}
