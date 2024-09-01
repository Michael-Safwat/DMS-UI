import {Component, OnInit} from '@angular/core';
import {Workspace} from "../../models/Workspace";
import {WorkspacesService} from "../../services/workspaces/workspaces.service";

@Component({
  selector: 'app-my-workspaces',
  templateUrl: './my-workspaces.component.html',
  styleUrls: ['./my-workspaces.component.css']
})
export class MyWorkspacesComponent implements OnInit{

  // @ts-ignore
  nid:string = localStorage.getItem("nid");
  constructor(private workspaceService:WorkspacesService) {
  }

  workspaces: Workspace[] = [];

  ngOnInit() {
    this.loadWorkspaces();
  }

  loadWorkspaces():void
  {

    this.workspaceService.getAllWorkspaces(this.nid).subscribe(
      (data)=>{
        this.workspaces = data;
        console.log(this.workspaces);
      },(error)=>{
        console.log("Error fetching workspaces",error);
      }
    )
  }

}
