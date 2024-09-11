import {Component, OnInit} from '@angular/core';
import {Workspace} from "../../models/Workspace";
import {ActivatedRoute, Router} from "@angular/router";
import {WorkspacesService} from "../../services/workspaces/workspaces.service";
import {ConfirmationService, ConfirmEventType, MessageService} from 'primeng/api';
import {Document} from "../../models/Document";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";
import {DocumentsService} from "../../services/documents/documents.service";

@Component({
  selector: 'app-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.css'],
  providers: [ConfirmationService]
})
export class WorkspaceComponent implements OnInit {
  workspace = {} as Workspace;
  documents = [] as Document [];
  documentId: string = "";
  deleteConfirmationName: string = "";
  deleteDialogVisible: boolean = false;
  updateDialogVisible: boolean = false;
  updatedName: string = "";
  updatedDescription: string = "";
  documentUrl: SafeResourceUrl = "";
  displayModal: boolean = false;
  updateDocumentDialog: boolean = false;
  updatedDocumentName: string = "";
  document = {} as Document;


  constructor(private route: ActivatedRoute,
              private workspaceService: WorkspacesService,
              private messageService: MessageService,
              private router: Router,
              private sanitizer: DomSanitizer,
              private confirmationService: ConfirmationService,
              private documentsService: DocumentsService) {
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

  previewDocument(documentId: string, documentType: string) {
    this.displayModal = true;
    this.documentId = documentId;


    this.documentsService.previewDocument(documentId).subscribe((base64Data: string) => {
      const blob = this.base64ToBlob(base64Data, documentType);
      const unsafeFileUrl = URL.createObjectURL(blob);
      this.documentUrl = this.sanitizer.bypassSecurityTrustResourceUrl(unsafeFileUrl);
    }, error => {
      this.messageService.add({severity: 'error', summary: 'Error', detail: 'Unable to preview document'});
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

    return new Blob(byteArrays, {type: contentType});
  }

  confirmDelete(documentId: string) {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete this file?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteDocument(documentId);
      }
    });
  }

  deleteDocument(documentId: string) {
    this.documentsService.deleteDocument(documentId).subscribe((res) => {
      this.fetchAllDocuments(this.workspace.id);
      this.messageService.add({severity: 'success', summary: 'Confirmed', detail: 'file deleted'});
    }, error => {

    })
  }

  downloadDocument(documentId: string) {
    this.documentsService.downloadDocument(documentId).subscribe(response => {
      const blob = response.body;
      const contentDisposition = response.headers.get('Content-Disposition') || response.headers.get('content-disposition');
      const fileName = this.getFileNameFromContentDisposition(contentDisposition);

      // @ts-ignore
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = fileName || 'downloaded-file'; // Fallback in case fileName is null
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(downloadUrl);
    }, error => {
      console.error('Download error:', error);
    });
  }

  private getFileNameFromContentDisposition(contentDisposition: string | null): string {
    if (!contentDisposition) return 'downloaded-file'; // Fallback if no header
    const matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(contentDisposition);
    return matches && matches[1] ? matches[1].replace(/['"]/g, '') : 'downloaded-file'; // Remove quotes if present
  }

  confirmUpdate(document: Document) {
    this.updateDocumentDialog = true;
    this.updatedDocumentName = document.name;
    this.document = document;
  }

  updateDocument(updatedDocumentName: string) {
    this.updateDocumentDialog = false;
    this.document.name=updatedDocumentName;
    this.documentsService.updatedDocument(this.document.id, this.document).subscribe((res) => {
      this.messageService.add({severity: 'success', summary: 'Confirmed', detail: 'file updated'})
      this.fetchAllDocuments(this.workspace.id);
    }, error => {

    })
  }


}
