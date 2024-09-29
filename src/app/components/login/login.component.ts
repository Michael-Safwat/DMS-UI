import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {AuthService} from "../../services/authentication/auth.service";
import {User} from "../../models/User";
import {MessageService} from "primeng/api";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  sessionExpired: boolean = false;
  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  })

  constructor(private fb: FormBuilder,
              private authService: AuthService,
              private messageService: MessageService,
              private router: Router,
              private route: ActivatedRoute,) {
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['sessionExpired']) {
        this.sessionExpired = true;
      }
    })
  }

  get email() {
    return this.loginForm.controls['email'];
  }

  get password() {
    return this.loginForm.controls['password'];
  }

  loginUser() {

    const postData = {...this.loginForm.value};
    this.authService.logInUser(postData as User).subscribe((res) => {

      localStorage.setItem('token', res.token);
      localStorage.setItem('email', res.email);
      localStorage.setItem('nid', res.nid);

      this.messageService.add({severity: 'success', summary: 'Success', detail: 'Login Successfully'});
      this.router.navigate(['my-workspaces']);

    }, error => {
      if (error.status === 401 || error.status === 400)
        this.messageService.add({severity: 'error', summary: 'Error', detail: 'Email or Password is incorrect!'});
      else
        this.messageService.add({severity: 'error', summary: 'Error', detail: 'Something went wrong try again later!'});

    })
  }
}
