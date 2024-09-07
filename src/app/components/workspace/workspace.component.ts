import {Component, OnInit} from '@angular/core';
import {Workspace} from "../../models/Workspace";
import {ActivatedRoute, Router} from "@angular/router";
import {WorkspacesService} from "../../services/workspaces/workspaces.service";
import {ConfirmationService, MessageService} from 'primeng/api';
import {Document} from "../../models/Document";

@Component({
  selector: 'app-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.css'],
  providers: [ConfirmationService]
})
export class WorkspaceComponent implements OnInit {
  workspace = {} as Workspace;
  documents = [] as Document [];
  deleteConfirmationName: string = "";
  deleteDialogVisible: boolean = false;
  updateDialogVisible: boolean = false;
  updatedName: string = "";
  updatedDescription: string = "";
  uploadedFiles: any[] = [];

  constructor(private route: ActivatedRoute,
              private workspaceService: WorkspacesService,
              private messageService: MessageService,
              private router: Router) {
  }

  ngOnInit() {
    const workspaceId = this.route.snapshot.paramMap.get("id");
    this.fetchWorkspace(workspaceId!);
    this.fetchAllDocuments(workspaceId!);
  }

  private fetchWorkspace(id: string) {
    this.workspaceService.getWorkspaceById(id).subscribe(
      (data) => {
        this.workspace = data;
        this.updatedName = this.workspace.name;
        this.updatedDescription = this.workspace.description
      },
      (error) => {
        console.error('Error fetching the workspace', error);
      }
    )
  }

  private fetchAllDocuments(id: string) {
    this.workspaceService.getAllDocuments(id).subscribe((res) => {
        this.documents = res;
      }, error => {
        console.error("error fetching documents", error);
      }
    )
  }

  showDeleteDialog() {
    this.deleteDialogVisible = true;
  }

  deleteWorkspace() {
    this.workspaceService.deleteWorkspace(this.workspace.id).subscribe((res) => {
      this.router.navigate(['/my-workspaces']);
    }, error => {
      this.messageService.add({severity: 'error', summary: 'Error', detail: 'Something went wrong!'});
    });
  }

  showUpdateDialog() {
    this.updateDialogVisible = true;
  }

  updateWorkspace(name: string, description: string) {
    this.updateDialogVisible = false;
    this.workspace.name = name;
    this.workspace.description = description;
    this.workspaceService.updateWorkspace(this.workspace.id, this.workspace).subscribe((res) => {

      this.messageService.add({severity: 'success', summary: 'Success', detail: 'Workspace updated successfully!'});
      this.fetchWorkspace(this.workspace.id);
    }, error => {
      this.messageService.add({severity: 'error', summary: 'Error', detail: 'Unable to update workspace!'});
    })
  }

  onUpload(event: any) {
    this.messageService.add({severity: 'success', summary: 'Success', detail: 'Workspace updated successfully!'});
  }
}
