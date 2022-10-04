import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgxFileDropEntry, FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';
import { HttpService } from '../../_service/http.service';
import { first } from 'rxjs/operators';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-documents-management',
  templateUrl: './documents-management.component.html',
  styleUrls: ['./documents-management.component.scss']
})
export class DocumentsManagementComponent implements OnInit {
  data: any = {
    files: [],
    userConsentDoc: [],
    initialnote: []
  };
  public files: NgxFileDropEntry[] = [];
  public listfiles: any = [];
  fileitems: any = [];
  today: any = new Date();

  modalRef: BsModalRef;
  message: any = [];
  @ViewChild('messagebox', { read: TemplateRef }) messagebox: TemplateRef<any>;
  loanId = sessionStorage.getItem('LoanId');

  constructor(
    public router: Router,
    private service: HttpService,
    private modalService: BsModalService
  ) { }

  ngOnInit(): void {
    this.addlog('View documents upload page', sessionStorage.getItem('LoanId'));
    window.top.postMessage(5, '*');
    let dd = this.today.getDate();

    let mm = this.today.getMonth() + 1;
    const yyyy = this.today.getFullYear();
    if (dd < 10)
    {
        dd = '0' + dd;
    }

    if (mm < 10)
    {
        mm = '0' + mm;
    }
    this.today = dd + '-' + mm + '-' + yyyy;

    this.get(this.loanId);
    this.getDocsPdf(this.loanId);
  }

  getDocsPdf(loanId: string) {
    this.service
      .get('loan-contract-page/get-agreement-in-pdf/' + loanId, 'borrower')
      .pipe(first())
      .subscribe(
        (res) => {
          this.data.userConsentDoc.push(res['data']);
        },
        (err) => {
          this.message = err['error']['message'];
          this.modalRef = this.modalService.show(this.messagebox);
        }
      );
    this.service
      .get('uploadfiles/consentsInPdf/' + loanId, 'borrower')
      .pipe(first())
      .subscribe(
        (res) => {
          this.data.userConsentDoc.push(res['data']);
        },
        (err) => {
          this.message = err['error']['message'];
          this.modalRef = this.modalService.show(this.messagebox);
        }
      );
  }

  downloadDocumentPdf(fileData: string) {
    const { data } = JSON.parse(fileData);
    const blob = new Blob(
      [new Uint8Array(data).buffer],
      { type: 'application/pdf' },
    );

    const url =  URL.createObjectURL(blob);
    window.open(url, '_blank');
  }

  get(loanId){
    this.service.authget('uploads/getdocuments/' + loanId, 'borrower')
    .pipe(first())
    .subscribe(res => {
      if (res['statusCode'] === 200){
        this.data = res['data'];
      }else{
        this.message = res['message'];
        this.modalRef = this.modalService.show(this.messagebox);
      }
    }, err => {
      if (err['error']['message'].isArray){
        this.message = err['error']['message'];
      }else{
        this.message = [err['error']['message']];
      }
      this.modalRef = this.modalService.show(this.messagebox);
    });
  }

  view(filename: any){
    filename = filename.split('/');
    filename = filename[filename.length - 1];
    window.open(environment.borrowerapiurl + 'files/download/' + filename, '_blank');
  }

  isFileAllowed(fileName: string) {
    let isFileAllowed = false;
    const allowedFiles = ['.pdf', '.jpg', '.jpeg', '.png'];
    const regex = /(?:\.([^.]+))?$/;
    const extension = regex.exec(fileName);
    if (undefined !== extension && null !== extension) {
      for (const ext of allowedFiles) {
        if (ext === extension[0]) {
          isFileAllowed = true;
        }
      }
    }
    return isFileAllowed;
  }

  completed(){
    const formData = new FormData();
    formData.append('loan_id', sessionStorage.getItem('LoanId'));
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.fileitems.length; i++) {
      if (!this.fileitems[i]['documentType'] || this.fileitems[i]['documentType'] === ''){
        this.message = ['Please select the document type for all documents'];
        this.modalRef = this.modalService.show(this.messagebox);
        return false;
      }
      formData.append('documentTypes[]', this.fileitems[i].documentType);
      formData.append('files[]', this.fileitems[i]);
    }

    this.service.authfiles('uploads', 'borrower', formData)
      .pipe(first())
      .subscribe(res => {
        this.addlog('Upload some documents', sessionStorage.getItem('LoanId'));
        if (res['statusCode'] === 200){
          this.files = [];
          this.listfiles = [];
          this.fileitems = [];
          this.get(this.loanId);
        }
      }, err => {
        console.log(err);
      });
  }

  public dropped(files: NgxFileDropEntry[]) {
    this.files = files;
    for (const droppedFile of files) {

      // Is it a file?
      if (droppedFile.fileEntry.isFile && this.isFileAllowed(droppedFile.fileEntry.name)) {
        this.listfiles.push(this.files);
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {
          // Here you can access the real file
          console.log(droppedFile.relativePath, file);
          this.fileitems.push(file);

        });
      } else {
        // It was a directory (empty directories are added, otherwise only files)
        const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
        console.log(droppedFile.relativePath, fileEntry);
      }
    }
    console.log(this.listfiles);
  }

  public fileOver(event){
   // console.log(event);
  }

  public fileLeave(event){
   // console.log(event);
  }

  addlog(module, id){
    this.service.addlog(module, id, 'borrower').subscribe(res => {}, err => {});
  }

  close(): void {
    this.modalRef.hide();
  }

  selectDocType(i, event){
    if (event.target.value !== 'Other'){
      $(event.target).next('input').attr('hidden', 'hidden');
      this.fileitems[i]['documentType'] = event.target.value;
    }else{
      this.fileitems[i]['documentType'] = '';
      $(event.target).next('input').removeAttr('hidden');
    }
  }

  docTypeComment(i, value){
    this.fileitems[i]['documentType'] = value;
  }



}
