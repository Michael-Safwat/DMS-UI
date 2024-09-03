import {Component, OnInit} from '@angular/core';
import {Workspace} from "../../models/Workspace";
import {WorkspacesService} from "../../services/workspaces/workspaces.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MessageService} from "primeng/api";
import {Router} from "@angular/router";

@Component({
  selector: 'app-my-workspaces',
  templateUrl: './my-workspaces.component.html',
  styleUrls: ['./my-workspaces.component.css'],
  providers: [MessageService]
})
export class MyWorkspacesComponent implements OnInit{

  // @ts-ignore
  nid:string = localStorage.getItem("nid");
  displayModal: boolean = false;
  workspaces: Workspace[] = [];
  createWorkspaceForm!:FormGroup;

  constructor(private workspaceService:WorkspacesService,
              private fb: FormBuilder,
              private messageService: MessageService,
              private router : Router){ }

  ngOnInit() {
    this.createWorkspaceForm = this.fb.group({name:['',Validators.required],description:['',Validators.required]});
    this.loadWorkspaces();
  }

  get name()
  {
    return this.createWorkspaceForm.get('name');
  }

  get description()
  {
    return this.createWorkspaceForm.get('description');
  }

  createWorkspace() {
    if (this.createWorkspaceForm.valid) {
      this.workspaceService.createWorkspace(this.nid,this.createWorkspaceForm.value as Workspace).subscribe(
        response => {
          this.messageService.add({severity: 'success', summary: 'Success', detail: 'Workspace created!'});
          this.displayModal = false;
          this.loadWorkspaces();
        },
        error => {
          this.messageService.add({severity: 'error', summary: 'Error', detail: 'Failed to create workspace'});
        }
      );
    }
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

  getWorkspace(id:string) {
        this.router.navigate(['/workspace',id]);
  }
}
