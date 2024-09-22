import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {AuthService} from "../../services/authentication/auth.service";
import {MenuItem} from 'primeng/api';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  items: MenuItem[] | undefined;

  ngOnInit() {
    this.items = [
      {
        label: 'My Profile',
        icon: 'pi pi-user',
        routerLink: '/my-profile'
      },
      {
        label: 'My Workspaces',
        icon: 'pi pi-desktop',
        routerLink: '/my-workspaces'
      },
      {
        label: 'Log out',
        icon: 'pi pi-sign-out',
        command: () => {
          this.logout()
        }
      }
    ];
  }

  constructor(private router: Router, private service: AuthService) {
  }

  logout() {
    this.service.logout();
    this.router.navigate(['/login']);
  }
}
