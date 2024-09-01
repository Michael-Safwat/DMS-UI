import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import {ReactiveFormsModule} from "@angular/forms";
import { ButtonModule } from 'primeng/button';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import { ToastModule } from 'primeng/toast';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MessageService} from "primeng/api";
import {MyInterceptor} from "./Interceptor/my.interceptor";
import {ToolbarModule} from "primeng/toolbar";
import {AvatarModule} from "primeng/avatar";
import {SplitButtonModule} from "primeng/splitbutton";
import { HeaderComponent } from "./components/header/header.component";
import { MyWorkspacesComponent } from './components/my-workspaces/my-workspaces.component'
import {MenuModule} from "primeng/menu";
import {DropdownModule} from "primeng/dropdown";
import {TableModule} from "primeng/table";

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    HeaderComponent,
    MyWorkspacesComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CardModule,
    InputTextModule,
    ReactiveFormsModule,
    ButtonModule,
    HttpClientModule,
    ToastModule,
    BrowserAnimationsModule,
    ToolbarModule,
    AvatarModule,
    SplitButtonModule,
    MenuModule,
    DropdownModule,
    TableModule
  ],
  providers: [MessageService,{
    provide: HTTP_INTERCEPTORS, useClass:MyInterceptor,
    multi:true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
