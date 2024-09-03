import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from "./components/login/login.component";
import {RegisterComponent} from "./components/register/register.component";
import {MyWorkspacesComponent} from "./components/my-workspaces/my-workspaces.component";
import {WorkspaceComponent} from "./components/workspace/workspace.component";
import {MyProfileComponent} from "./components/my-profile/my-profile.component";

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'my-profile',
    component: MyProfileComponent
  },
  {
    path: 'my-workspaces',
    component: MyWorkspacesComponent
  },
  {
    path: 'workspace/:id',
    component: WorkspaceComponent
  },
  {
    path: '', redirectTo: 'login', pathMatch: 'full'
  },
  {
    path: '**', redirectTo: 'login', pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
