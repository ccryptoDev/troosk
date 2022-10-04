import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from '../../_service/http.service';
import { first } from 'rxjs/operators';
import { Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { environment } from '../../../environments/environment';
import { DatePipe } from '@angular/common';
import {AbstractControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-approveddetails',
  templateUrl: './approveddetails.component.html',
  styleUrls: ['./approveddetails.component.scss']
})
export class ApproveddetailsComponent implements OnInit {
  data: any = {
    answers: [],
    CoApplicant: [],
    files: [],
    from_details: [],
    paymentScheduleDetails: []
  };
  modalRef: BsModalRef;
  message: any = [];
  payment: any = [];
  manualBankAddFields = {};
  cm = {};
  bankAddForm: FormGroup;
  fSubmitted = false;
  loanId: string;

  resComments: any = [];
  screenlogs: any = [];
  @ViewChild('messagebox', { read: TemplateRef }) messagebox: TemplateRef<any>;

  tabs: any = {
    'User Information': false,
    'Credit Report': false,
    'Payment Schedule': false,
    'Bank Accounts': false,
    'Document Center': false,
    Comments: false,
    Log: false
  };

  constructor(
    public datePipe: DatePipe,
    private route: ActivatedRoute,
    private service: HttpService,
    public router: Router,
    private modalService: BsModalService
  ) {}

  ngOnInit(): void {
    this.loanId = this.route.snapshot.paramMap.get('id');
    let pages = sessionStorage.getItem('pages');
    let tabs = sessionStorage.getItem('tabs');
    if (pages) {
      pages = JSON.parse(pages);
      for (let i = 0; i < pages.length; i++) {
        if (pages[i]['name'] === 'Approved Application') {
          if (tabs) {
            tabs = JSON.parse(tabs);
            console.log(tabs[pages[i]['id']]);
            // tslint:disable-next-line:prefer-for-of
            for (let j = 0; j < tabs[pages[i]['id']].length; j++) {
              this.tabs[tabs[pages[i]['id']][j]['name']] = true;
            }
            i = pages.length + 1;
          }
        }
      }
    }
    this.get(this.route.snapshot.paramMap.get('id'));
    this.getlogs();
  }

  get f(): { [key: string]: AbstractControl } {
    return this.bankAddForm.controls;
  }

  manualBankAddModel(manualBankAddTemp: TemplateRef<any>) {
    this.modalRef = this.modalService.show(manualBankAddTemp);
  }

  manualBankAdd() {
    this.manualBankAddFields['user_id'] = this.data.from_details[0].user_id;
    console.log('manualBankAddFields', this.manualBankAddFields);
    this.service
      .authpost('pending/manualbankadd', 'admin', this.manualBankAddFields)
      .pipe(first())
      .subscribe(
        res => {
          console.log('res', res);
          if (res['statusCode'] === 200) {
            console.log('data', res['data']);
            this.modalRef.hide();
          } else {
            this.message = res['message'];
            this.modalRef = this.modalService.show(this.messagebox);
          }
        },
        err => {
          if (err['error']['message'].isArray) {
            this.message = err['error']['message'];
          } else {
            this.message = [err['error']['message']];
          }
          this.modalRef = this.modalService.show(this.messagebox);
        }
      );
  }
  pay() {
    const date = new Date(this.data['from_details'][0]['createdAt']);
    this.payment.push({
      createdAt: this.dt(date),
      loan_advance: this.data['from_details'][0]['loanAmount'],
      payOffAmount: this.data['from_details'][0]['loanAmount'],
      apr: this.data['from_details'][0]['apr'],
      loantermcount: this.data['from_details'][0]['loanTerm'],
      maturityDate: this.dt(
        new Date(
          new Date(this.data['from_details'][0]['createdAt']).setMonth(
            new Date(this.data['from_details'][0]['createdAt']).getMonth() + 12
          )
        )
      ),
      nextPaymentSchedule: this.dt(
        new Date(
          new Date(this.data['from_details'][0]['createdAt']).setMonth(
            new Date(this.data['from_details'][0]['createdAt']).getMonth() + 1
          )
        )
      )
    });
  }

  round(x) {
    return Math.round(x * 100) / 100;
  }

  dt(today) {
    let dd: any = today.getDate();

    let mm: any = today.getMonth() + 1;
    const yyyy = today.getFullYear();
    if (dd < 10) {
      dd = '0' + dd;
    }

    if (mm < 10) {
      mm = '0' + mm;
    }
    return mm + '-' + dd + '-' + yyyy;
  }
  get(id) {
    this.service
      .authget('approved/' + id, 'admin')
      .pipe(first())
      .subscribe(
        res => {
          if (res['statusCode'] === 200) {
            this.data = res['data'];
            this.pay();
            this.getcomments();
          } else {
            this.message = res['message'];
            this.modalRef = this.modalService.show(this.messagebox);
            this.router.navigate(['admin/approved']);
          }
        },
        err => {
          if (err['error']['message'].isArray) {
            this.message = err['error']['message'];
          } else {
            this.message = [err['error']['message']];
          }
          this.modalRef = this.modalService.show(this.messagebox);
          this.router.navigate(['admin/approved']);
        }
      );
  }

  Pending() {
    const id = this.route.snapshot.paramMap.get('id');
    this.service
      .authget('denied/pending/' + id, 'admin')
      .pipe(first())
      .subscribe(
        res => {
          if (res['statusCode'] === 200) {
            this.router.navigate(['admin/pendings/' + id]);
          } else {
            this.message = res['message'];
            this.modalRef = this.modalService.show(this.messagebox);
          }
        },
        err => {
          if (err['error']['message'].isArray) {
            this.message = err['error']['message'];
          } else {
            this.message = [err['error']['message']];
          }
          this.modalRef = this.modalService.show(this.messagebox);
        }
      );
  }

  view(filename: any) {
    filename = filename.split('/');
    filename = filename[filename.length - 1];
    window.open(
      environment.adminapiurl + 'files/download/' + filename,
      '_blank'
    );
  }

  close(): void {
    this.modalRef.hide();
  }
  getcomments() {
    const id = this.route.snapshot.paramMap.get('id');
    this.service
      .authget('pending/getcomments/' + id, 'admin')
      .pipe(first())
      .subscribe(
        res => {
          if (res['statusCode'] === 200) {
            this.resComments = res['data'];
          } else {
            this.message = res['message'];
            this.modalRef = this.modalService.show(this.messagebox);
          }
        },
        err => {
          if (err['error']['message'].isArray) {
            this.message = err['error']['message'];
          } else {
            this.message = [err['error']['message']];
          }
          this.modalRef = this.modalService.show(this.messagebox);
        }
      );
  }
  addcomments(msgbox: TemplateRef<any>) {
    this.cm['loan_id'] = this.route.snapshot.paramMap.get('id');
    this.cm['user_id'] = JSON.parse(sessionStorage.getItem('resuser'))['id'];
    this.service
      .authpost('pending/addcomments', 'admin', this.cm)
      .pipe(first())
      .subscribe(
        res => {
          if (res['statusCode'] === 200) {
            this.message = ['Comments Added'];
            this.modalRef = this.modalService.show(msgbox);
            this.getcomments();
          } else {
            this.message = res['message'];
            this.modalRef = this.modalService.show(msgbox);
          }
        },
        err => {
          if (err['error']['message'].isArray) {
            this.message = err['error']['message'];
          } else {
            this.message = [err['error']['message']];
          }
          this.modalRef = this.modalService.show(this.messagebox);
        }
      );
  }
  getlogs() {
    const id = this.route.snapshot.paramMap.get('id');
    this.service
      .authget('approved/getlogs/' + id, 'admin')
      .pipe(first())
      .subscribe(
        res => {
          if (res['statusCode'] === 200) {
            this.screenlogs = res['data'];
          } else {
            this.message = res['message'];
            this.modalRef = this.modalService.show(this.messagebox);
          }
        },
        err => {
          if (err['error']['message'].isArray) {
            this.message = err['error']['message'];
          } else {
            this.message = [err['error']['message']];
          }
          this.modalRef = this.modalService.show(this.messagebox);
        }
      );
  }

  bankAddFormClose() {
    console.log('bankAddFormClose call');

    this.modalRef.hide();
    this.fSubmitted = false;
    this.bankAddForm.reset();
  }
}
