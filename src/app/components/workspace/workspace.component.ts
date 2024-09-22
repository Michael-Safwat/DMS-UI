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
  updatedDirectoryName: string = "";
  updatedDocumentName: string = "";
  documentType: string = "";
  searchTerm: string = "";
  documentUrl: SafeResourceUrl = "";
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
    this.route.params.subscribe(() => {
      const workspaceId = this.route.snapshot.paramMap.get('id');
      this.fetchWorkspace(workspaceId!);
      this.fetchAllDocuments(workspaceId!);
      this.fetchAllDirectories(workspaceId!)
    });

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd && event.url === 'workspace') {
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
    this.workspaceService.getWorkspaceByID(id).subscribe(
      (data) => {
        this.workspace = data;
      }, () => {
        this.messageService.add({severity: 'error', summary: 'Error', detail: 'Error fetching workspace!'});
      })
  }

  fetchAllDirectories(parentId: string): void {
    this.workspaceService.getAllWorkspaces(parentId).subscribe((workspaces) => {
      this.directories = workspaces.map((ws: any) => ({
        ...ws,
        flag: 'directory'
      }));
      this.combineItems();
    })
  }

  private fetchAllDocuments(parentId: string) {
    this.workspaceService.getAllDocuments(parentId).subscribe((res) => {
      this.documents = res.map((doc: any) => ({
        ...doc,
        flag: 'document'
      }));
      this.combineItems();
    }, () => {
      this.messageService.add({severity: 'error', summary: 'Error', detail: 'Error fetching documents!'});
    })
  }

  private combineItems() {
    this.combinedData = [...this.directories, ...this.documents];
  }

  onSearchTermChange() {
    if (this.searchTerm.trim() === '') {
      this.fetchAllDirectories(this.workspace.id);
      this.fetchAllDocuments(this.workspace.id);
    } else {
      this.search();
    }
  }

  search() {
    this.workspaceService.searchContent(this.searchTerm, this.workspace.id).subscribe((res) => {
      this.directories = res['a'].map((ws: any) => ({...ws, flag: 'directory'}));
      this.documents = res['b'].map((doc: any) => ({...doc, flag: 'document'}));
      this.combineItems();
    }, () => {

    });
  }

  createDirectory(parentId: string) {
    if (this.createDirectoryForm.valid) {
      this.workspaceService.createDirectory(parentId, this.createDirectoryForm.value as Workspace).subscribe(() => {
        this.messageService.add({severity: 'success', summary: 'Success', detail: 'directory created!'});
        this.createDirectoryDialog = false;
        this.fetchAllDirectories(parentId);
      }, (error) => {
        if (error.status === 400)
          this.messageService.add({severity: 'error', summary: 'Error', detail: 'directory name already exists'});
        else
          this.messageService.add({severity: 'error', summary: 'Error', detail: 'failed to create directory!'});
      });
    }
  }

  onUpload() {
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
    this.workspaceService.deleteWorkspace(directoryId).subscribe(() => {
      this.fetchAllDirectories(this.workspace.id);
    }, () => {
      this.messageService.add({severity: 'error', summary: 'Error', detail: 'Something went wrong!'});
    });
  }

  updateDirectory() {
    this.directory.name = this.updatedDirectoryName;
    this.updateDirectoryDialog = false;
    this.workspaceService.updateWorkspace(this.directory.id, this.directory).subscribe(() => {
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
    this.documentType = documentType;

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
    this.documentsService.updatedDocument(this.document.id, this.document).subscribe(() => {
      this.messageService.add({severity: 'success', summary: 'Confirmed', detail: 'file updated'})
      this.fetchAllDocuments(this.workspace.id);
    })
  }

  confirmUpdateDirectory(directory: Workspace) {
    this.updateDirectoryDialog = true;
    this.directory = directory;
    this.updatedDirectoryName = directory.name;
  }

  isImageFile(): boolean {
    return this.documentType === "image/jpeg";

  }

}
