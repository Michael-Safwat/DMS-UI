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
export class MyWorkspacesComponent implements OnInit {

  workspace = {} as Workspace;
  workspaces: Workspace[] = [];
  createWorkspaceForm!: FormGroup;
  createWorkspaceDialog: boolean = false;
  deleteWorkspaceDialog: boolean = false;
  updateWorkspaceDialog: boolean = false;
  deleteConfirmationName: string = "";
  updatedWorkspaceName: string = "";
  updatedDescription: string = "";
  searchTerm: string = "";


  constructor(private workspaceService: WorkspacesService,
              private fb: FormBuilder,
              private messageService: MessageService,
              private router: Router) {
  }

  ngOnInit() {
    this.createWorkspaceForm = this.fb.group({name: ['', Validators.required], description: ['', Validators.required]});
    this.fetchWorkspaces();
  }

  get name() {
    return this.createWorkspaceForm.get('name');
  }

  get description() {
    return this.createWorkspaceForm.get('description');
  }

  createWorkspace() {
    if (this.createWorkspaceForm.valid) {
      this.workspaceService.createWorkspace(this.createWorkspaceForm.value as Workspace).subscribe(
        () => {
          this.messageService.add({severity: 'success', summary: 'Success', detail: 'Workspace created!'});
          this.createWorkspaceDialog = false;
          this.fetchWorkspaces();
        },
        error => {
          if (error.status === 400)
            this.messageService.add({severity: 'error', summary: 'Error', detail: 'workspace name already exists'});
          else
            this.messageService.add({severity: 'error', summary: 'Error', detail: 'failed to create workspace'});
        }
      );
    }
  }

  fetchWorkspaces(): void {

    this.workspaceService.getAllWorkspaces("root").subscribe(
      (data) => {
        this.workspaces = data;
        console.log(this.workspaces);
      }, (error) => {
        console.log("Error fetching workspaces", error);
      }
    )
  }

  getWorkspace(id: string) {
    this.router.navigate(['/workspace', id]);
  }

  deleteWorkspaceConfirmation(workspace: Workspace) {
    this.workspace = workspace;
    this.deleteWorkspaceDialog = true;
  }

  deleteWorkspace(workspaceId: string) {
    this.deleteWorkspaceDialog = false;
    this.deleteConfirmationName = "";
    this.workspaceService.deleteWorkspace(workspaceId).subscribe(() => {
      this.fetchWorkspaces();
      this.messageService.add({severity: 'warn', summary: 'Warning', detail: 'Workspace deleted!'});
    }, () => {
      this.messageService.add({severity: 'error', summary: 'Error', detail: 'Something went wrong!'});
    });
  }

  updateWorkspaceConfirmation(workspace: Workspace) {
    this.workspace = workspace;
    this.updateWorkspaceDialog = true;
    this.updatedWorkspaceName = workspace.name;
    this.updatedDescription = workspace.description;
  }

  updateWorkspace(name: string, description: string) {
    this.updateWorkspaceDialog = false;
    this.workspace.name = name;
    this.workspace.description = description;
    this.workspaceService.updateWorkspace(this.workspace.id, this.workspace).subscribe(() => {
      this.messageService.add({severity: 'success', summary: 'Success', detail: 'Workspace updated successfully!'});
      this.fetchWorkspaces();
    }, () => {
      this.messageService.add({severity: 'error', summary: 'Error', detail: 'Unable to update workspace!'});
    })
  }

  onSearchTermChange() {
    if (this.searchTerm.trim() === '') {
      this.fetchWorkspaces();
    } else {
      this.search();
    }
  }

  search() {
    this.workspaceService.searchWorkspaces(this.searchTerm, localStorage.getItem("nid")!).subscribe((res) => {
      this.workspaces = res;
    }, () => {

    });
  }
}




