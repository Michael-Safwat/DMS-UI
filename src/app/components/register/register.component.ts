import { Component } from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";

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
    })
  constructor(private fb:FormBuilder) {}
}
