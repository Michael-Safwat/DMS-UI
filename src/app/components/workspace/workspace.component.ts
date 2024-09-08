import {Component, OnInit} from '@angular/core';
import {Workspace} from "../../models/Workspace";
import {ActivatedRoute, Router} from "@angular/router";
import {WorkspacesService} from "../../services/workspaces/workspaces.service";
import {ConfirmationService, ConfirmEventType, MessageService} from 'primeng/api';
import {Document} from "../../models/Document";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";

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
  documentUrl:SafeResourceUrl="";

  constructor(private route: ActivatedRoute,
              private workspaceService: WorkspacesService,
              private messageService: MessageService,
              private router: Router,
              private sanitizer: DomSanitizer,
              private confirmationService: ConfirmationService) {
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
    this.messageService.add({severity: 'success', summary: 'Success', detail: 'file uploaded!'});
    this.fetchAllDocuments(this.workspace.id);
  }

  updateDocument(document: any) {

  }

  previewDocument(documentId: string,documentType:string) {
    console.log(this.workspace.id,documentId);

    this.workspaceService.previewDocument(this.workspace.id,documentId).subscribe((base64Data:string)=>{
      const blob = this.base64ToBlob(base64Data, documentType);
      const unsafeFileUrl = URL.createObjectURL(blob);
      this.documentUrl = this.sanitizer.bypassSecurityTrustResourceUrl(unsafeFileUrl);
    },error => {
      this.messageService.add({severity:'error',summary:'Error',detail:'Unable to preview document'});
    })
  }

  base64ToBlob(base64Data: string, contentType: string): Blob {
    const byteCharacters = atob(base64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, { type: contentType });
  }

  protected readonly document = document;

  confirmDelete(documentId:string) {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete this file?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.messageService.add({ severity: 'success', summary: 'Confirmed', detail: 'file deleted' });
        this.deleteDocument(documentId);
      }
    });
  }

  deleteDocument(documentId:string ) {
    this.workspaceService.deleteDocument(this.workspace.id,documentId).subscribe((res)=>{
      this.fetchAllDocuments(this.workspace.id);
    },error => {

    })
  }
}
