import {Component, OnInit} from '@angular/core';
import {Workspace} from "../../models/Workspace";
import {ActivatedRoute} from "@angular/router";
import {WorkspacesService} from "../../services/workspaces/workspaces.service";

@Component({
  selector: 'app-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.css']
})
export class WorkspaceComponent implements OnInit{
  workspace!:Workspace;
  // @ts-ignore
  nid:string = localStorage.getItem("nid");

  constructor(private route:ActivatedRoute,
              private workspaceService: WorkspacesService) {}
  ngOnInit() {
    const workspaceId = this.route.snapshot.paramMap.get("id");
    this.fetchWorkspace(workspaceId!);
  }

  private fetchWorkspace(id: string) {
    this.workspaceService.getWorkspaceById(this.nid,id).subscribe(
      (data)=>{
        this.workspace=data;
      },
      (error)=>{
        console.error('Error fetching the workspace',error);
      }
    )
  }
}
