import {
  Component,
  Input,
  OnInit,
  TemplateRef,
  ViewChild
} from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { first } from 'rxjs/operators';
import { HttpService } from '../../_service/http.service';

@Component({
  selector: 'app-document-center',
  templateUrl: './document-center.component.html',
  styleUrls: ['./document-center.component.scss']
})
export class DocumentCenterComponent implements OnInit {
  @Input() loanId!: string;
  @ViewChild('messagebox', { read: TemplateRef }) messagebox: TemplateRef<any>;
  modalRef: BsModalRef;
  message: string;

  data = {
    document: []
  };

  constructor(
    private service: HttpService,
    private modalService: BsModalService
  ) {}

  ngOnInit(): void {
    this.getDocsPdf(this.loanId);
  }

  getDocsPdf(loanId: string) {
    this.service
      .get('loan-contract-page/get-agreement-in-pdf/' + loanId, 'borrower')
      .pipe(first())
      .subscribe(res => {
        this.data.document.push(res['data']);
      });
    this.service
      .get('uploadfiles/consentsInPdf/' + loanId, 'borrower')
      .pipe(first())
      .subscribe(
        res => {
          this.data.document.push(res['data']);
        },
        err => {
          console.log(err);
          this.message = err['error']['message'];
          this.modalRef = this.modalService.show(this.messagebox);
        }
      );
  }

  downloadDocumentPdf(fileData: string) {
    const { data } = JSON.parse(fileData);
    const blob = new Blob([new Uint8Array(data).buffer], {
      type: 'application/pdf'
    });

    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  }

  close(): void {
    this.modalRef.hide();
  }
}
