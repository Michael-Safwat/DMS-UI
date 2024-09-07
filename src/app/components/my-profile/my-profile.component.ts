import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../services/authentication/auth.service";
import {User} from "../../models/User";
import {ActivatedRoute} from "@angular/router";
import {MessageService} from "primeng/api";

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.css']
})
export class MyProfileComponent implements OnInit {

  user = {} as User;
  // @ts-ignore
  userEmail: string = localStorage.getItem("email");

  constructor(private userService: AuthService,
              private messageService: MessageService) {
  }

  ngOnInit() {
    this.userService.getUserInfo(this.userEmail).subscribe((res) => {
      this.user = res;
    }, error => {
      console.error("couldn't load user data!", error);
    })
  }

}
