import {Component, OnInit} from '@angular/core';
import {Workspace} from "../../models/Workspace";
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import {WorkspacesService} from "../../services/workspaces/workspaces.service";
import {ConfirmationService, MessageService} from 'primeng/api';
import {Document} from "../../models/Document";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";
import {DocumentsService} from "../../services/documents/documents.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.css'],
  providers: [ConfirmationService]
})
export class WorkspaceComponent implements OnInit {
  workspace = {} as Workspace;
  directory = {} as Workspace;
  directories = [] as Workspace [];
  document = {} as Document;
  documents = [] as Document [];
  combinedData = [] as any [];
  documentId: string = "";
  deleteConfirmationName: string = "";
  updatedWorkspaceName: string = "";
  updatedDirectoryName: string = "";
  updatedDescription: string = "";
  updatedDocumentName: string = "";
  documentUrl: SafeResourceUrl = "";
  deleteWorkspaceDialog: boolean = false;
  updateWorkspaceDialog: boolean = false;
  createDirectoryDialog: boolean = false;
  updateDirectoryDialog: boolean = false;
  documentPreviewDialog: boolean = false;
  updateDocumentDialog: boolean = false;
  createDirectoryForm = {} as FormGroup;

  constructor(private route: ActivatedRoute,
              private workspaceService: WorkspacesService,
              private messageService: MessageService,
              private router: Router,
              private sanitizer: DomSanitizer,
              private confirmationService: ConfirmationService,
              private documentsService: DocumentsService,
              private fb: FormBuilder) {
  }

  ngOnInit() {

    // Fetch data when the component is initialized
    this.route.params.subscribe(params => {
      const workspaceId = this.route.snapshot.paramMap.get('id');
      this.fetchWorkspace(workspaceId!);
      this.fetchAllDocuments(workspaceId!);
      this.fetchAllDirectories(workspaceId!)
    });

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd && event.url ==='workspace') {
        const workspaceId = this.route.snapshot.paramMap.get('id');
        this.fetchWorkspace(workspaceId!);
        this.fetchAllDocuments(workspaceId!);
        this.fetchAllDirectories(workspaceId!)
      }
    });
    this.createDirectoryForm = this.fb.group({name: ['', Validators.required]});
  }

  get name() {
    return this.createDirectoryForm.get('name');
  }

  private fetchWorkspace(id: string) {
    this.workspaceService.getWorkspaceById(id).subscribe(
      (data) => {
        this.workspace = data;
        this.updatedWorkspaceName = this.workspace.name;
        this.updatedDescription = this.workspace.description
      }, () => {
        this.messageService.add({severity: 'error', summary: 'Error', detail: 'Error fetching workspace!'});
      })
  }

  fetchAllDirectories(parentId: string): void {
    this.workspaceService.getAllWorkspaces(parentId).subscribe((workspaces) => {
      this.directories = workspaces.map((ws: any)=>({
        ...ws,
        flag:'directory'}));
      this.combineItems();
    })
  }

  private fetchAllDocuments(parentId: string) {
    this.workspaceService.getAllDocuments(parentId).subscribe((res) => {
      this.documents = res.map((doc: any)=>({
        ...doc,
        flag:'document'}));
      this.combineItems();
    },()=>{
      this.messageService.add({severity: 'error', summary: 'Error', detail: 'Error fetching documents!'});
    })
  }

  private combineItems() {
    this.combinedData = [...this.directories, ...this.documents];
    console.log('Combined Items:', this.combinedData);
  }

  deleteWorkspace(workspaceId: string) {
    this.workspaceService.deleteWorkspace(workspaceId).subscribe((res) => {
      if(this.workspace.parentId ==="root")
      {
        this.router.navigate(['/my-workspaces']);
        this.messageService.add({severity: 'warn', summary: 'Warning', detail: 'workspace deleted!'});
      }
      else
      {
        this.router.navigate(['/workspace',this.workspace.parentId]);
        this.messageService.add({severity: 'warn', summary: 'Warning', detail: 'directory deleted!'});
      }
      this.deleteWorkspaceDialog = false;
    }, () => {
      this.messageService.add({severity: 'error', summary: 'Error', detail: 'Something went wrong!'});
    });
  }

  createDirectory(parentId: string) {
    if (this.createDirectoryForm.valid) {
      this.workspaceService.createDirectory(parentId, this.createDirectoryForm.value as Workspace).subscribe(() => {
        this.messageService.add({severity: 'success', summary: 'Success', detail: 'directory created!'});
        this.createDirectoryDialog = false;
        this.fetchAllDirectories(parentId);
      }, () => {
        this.messageService.add({severity: 'error', summary: 'Error', detail: 'Failed to create directory'});
      });
    }
  }

  onUpload(event: any) {
    this.messageService.add({severity: 'success', summary: 'Success', detail: 'file uploaded!'});
    this.fetchAllDocuments(this.workspace.id);
  }

  confirmDirectoryDelete(directoryId: string) {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete this document?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteDirectory(directoryId);
      }
    });
  }

  deleteDirectory(directoryId: string) {
    this.workspaceService.deleteWorkspace(directoryId).subscribe((res) => {
      this.fetchAllDirectories(this.workspace.id);
    }, () => {
      this.messageService.add({severity: 'error', summary: 'Error', detail: 'Something went wrong!'});
    });
  }

  updateWorkspace(name: string, description: string) {
    this.updateWorkspaceDialog = false;
    this.workspace.name = name;
    this.workspace.description = description;
    this.workspaceService.updateWorkspace(this.workspace.id, this.workspace).subscribe((res) => {
      this.messageService.add({severity: 'success', summary: 'Success', detail: 'Workspace updated successfully!'});
      this.fetchWorkspace(this.workspace.id);
    }, () => {
      this.messageService.add({severity: 'error', summary: 'Error', detail: 'Unable to update workspace!'});
    })
  }

  updateDirectory() {
    this.directory.name = this.updatedDirectoryName;
    this.updateDirectoryDialog = false;
    this.workspaceService.updateWorkspace(this.directory.id, this.directory).subscribe((res) => {
      this.messageService.add({severity: 'success', summary: 'Success', detail: 'directory updated successfully!'});
      this.fetchAllDirectories(this.workspace.id);
    }, () => {
      this.messageService.add({severity: 'error', summary: 'Error', detail: 'Unable to update directory!'});
    })
  }

  enterDirectory(id: string) {
    this.router.navigate(['/workspace', id]);
  }

  previewDocument(documentId: string, documentType: string) {
    this.documentPreviewDialog = true;
    this.documentId = documentId;


    this.documentsService.previewDocument(documentId).subscribe((base64Data: string) => {
      const blob = this.base64ToBlob(base64Data, documentType);
      const unsafeFileUrl = URL.createObjectURL(blob);
      this.documentUrl = this.sanitizer.bypassSecurityTrustResourceUrl(unsafeFileUrl);
    }, () => {
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

  confirmDocumentDelete(documentId: string) {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete this document?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteDocument(documentId);
      }
    });
  }

  deleteDocument(documentId: string) {
    this.documentsService.deleteDocument(documentId).subscribe(() => {
      this.fetchAllDocuments(this.workspace.id);
      this.messageService.add({severity: 'success', summary: 'Confirmed', detail: 'file deleted'});
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

  confirmDocumentUpdate(document: Document) {
    this.updateDocumentDialog = true;
    this.updatedDocumentName = document.name;
    this.document = document;
  }

  updateDocument(updatedDocumentName: string) {
    this.updateDocumentDialog = false;
    this.document.name = updatedDocumentName;
    this.documentsService.updatedDocument(this.document.id, this.document).subscribe((res) => {
      this.messageService.add({severity: 'success', summary: 'Confirmed', detail: 'file updated'})
      this.fetchAllDocuments(this.workspace.id);
    })
  }

  confirmUpdateDirectory(directory: Workspace) {
    this.updateDirectoryDialog = true;
    this.directory = directory;
    this.updatedDirectoryName = directory.name;
  }
}
