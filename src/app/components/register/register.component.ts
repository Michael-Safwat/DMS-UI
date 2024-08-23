import { Component } from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {passwordMatchValidator} from "../../shared/password-match.directive";

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
  constructor(private fb:FormBuilder) {}

  get firstName() {return this.registerForm.controls['firstName'];}
  get lastName() {return this.registerForm.controls['lastName'];}
  get nationalId(){return this.registerForm.controls['nationalId'];}
  get username(){return this.registerForm.controls['username'];}
  get email(){return this.registerForm.controls['email'];}
  get password(){return this.registerForm.controls['password'];}
  get confirmPassword(){return this.registerForm.controls['confirmPassword'];}
}
