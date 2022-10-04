import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from '../../_service/http.service';
import { first } from 'rxjs/operators';
import { Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { environment } from '../../../environments/environment';
import { DatePipe } from '@angular/common';
import {
  FinanceInatance,
  CommonDataInatance
} from '../../_service/comman.service';
import {
  FormGroup,
  Validators,
  FormBuilder,
  FormControl
} from '@angular/forms';
import { readyMade } from '../../../environments/environment';
import { FileValidators } from 'ngx-file-drag-drop';
@Component({
  selector: 'app-incompletedetails',
  templateUrl: './incompletedetails.component.html',
  styleUrls: ['./incompletedetails.component.scss']
})
export class IncompletedetailsComponent implements OnInit {
  data: any = {
    CoApplicant: [],
    document: [],
    from_details: [],
    userDocument: []
  };
  modalRef: BsModalRef;
  message: any = [];
  payment: any = [];
  cm = {};
  manualBankAddFields = {};
  resComments: any = [];
  screenlogs: any = [];
  durationMonths = FinanceInatance.durationMonths;
  apForm: FormGroup;
  apibtn = false;
  public id: any;
  bankaccounts: any = [];
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
  documentsTypes = CommonDataInatance.documentsTypes(false);
  formControls: any;
  viewApp = false;
  loanId: string;

  constructor(
    public datePipe: DatePipe,
    private route: ActivatedRoute,
    private service: HttpService,
    public router: Router,
    private modalService: BsModalService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.loanId = this.route.snapshot.paramMap.get('id');
    let pages = sessionStorage.getItem('pages');
    let tabs = sessionStorage.getItem('tabs');
    if (pages) {
      pages = JSON.parse(pages);
      for (let i = 0; i < pages.length; i++) {
        if (pages[i]['name'] === 'Incomplete Application') {
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
    console.log(this.durationMonths);
    // build form
    this.apForm = this.formBuilder.group({
      LoanAmount: [
        '',
        [Validators.required, Validators.pattern(readyMade.pattern.decimal)]
      ],
      APR: [
        '',
        [Validators.required, Validators.pattern(readyMade.pattern.decimal)]
      ],
      Duration: ['12', [Validators.required]],
      PaymentAmount: [{ value: 0, disabled: true }]
    });
    this.id = this.route.snapshot.paramMap.get('id');
    this.get(this.id);
    this.getlogs();
    // this.getbankaccounts(this.id);
    // documents upload
    this.formControls = {
      docFile: new FormControl(
        [],
        [
          FileValidators.required,
          FileValidators.fileExtension(['png', 'jpeg', 'pdf', 'jpg'])
        ]
      ),
      type: new FormControl('', [FileValidators.required])
    };
  }
  modelopen(modelTemp: TemplateRef<any>) {
    this.modalRef = this.modalService.show(modelTemp);
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

  dt(today: any) {
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

  get(id: any) {
    this.service
      .authget('incomplete/' + id, 'admin')
      .pipe(first())
      .subscribe(
        res => {
          if (res['statusCode'] === 200) {
            this.data = res['data'];
            console.log(this.data);
            this.afterResponse();
            // this.pay()
            this.getcomments();
            this.viewApp = true;
          } else {
            this.message = res['message'];
            this.modalRef = this.modalService.show(this.messagebox);
            this.router.navigate(['admin/incomplete']);
          }
        },
        err => {
          if (err['error']['message'].isArray) {
            this.message = err['error']['message'];
          } else {
            this.message = [err['error']['message']];
          }
          this.modalRef = this.modalService.show(this.messagebox);
          this.router.navigate(['admin/incomplete']);
        }
      );
  }

  close(): void {
    this.modalRef.hide();
  }

  delete() {
    const id = this.route.snapshot.paramMap.get('id');
    this.service
      .authget('denied/delete/' + id, 'admin')
      .pipe(first())
      .subscribe(
        res => {
          if (res['statusCode'] === 200) {
            this.router.navigate(['admin/incomplete']);
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
    // alert(1);
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
  addlogs(module, id) {
    this.service.addlog(module, id, 'admin').subscribe(
      res => {},
      err => {}
    );
  }
  getbankaccounts(id) {
    // todo remove
  }

  sendbanklogin() {
    const id = this.route.snapshot.paramMap.get('id');
    this.service.authget('plaid/requestBank/' + id, 'admin').subscribe(
      res => {
        if (res['statusCode'] === 200) {
          this.message = ['Mail Successfully Sent'];
          this.modalRef = this.modalService.show(this.messagebox);
        }
      },
      err => {
        console.log(err);
      }
    );
  }
  rePullBankAccounts() {
    const id = this.route.snapshot.paramMap.get('id');
    this.service.authget('plaid/accountsRepull/' + id, 'admin').subscribe(
      res => {
        if (res['statusCode'] === 200) {
          this.bankaccounts = res['data'];
        }
      },
      err => {
        console.log(err);
      }
    );
  }
  /*public dropped(files: NgxFileDropEntry[]) {
    this.files = files;
    for (const droppedFile of files) {

      // Is it a file?
      if (droppedFile.fileEntry.isFile && this.isFileAllowed(droppedFile.fileEntry.name)) {
        this.listfiles.push(this.files)
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {
          // Here you can access the real file
          console.log(droppedFile.relativePath, file);
          this.fileitems.push(file)

        });
      } else {
        // It was a directory (empty directories are added, otherwise only files)
        const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
        console.log(droppedFile.relativePath, fileEntry);
      }
    }
    console.log(this.listfiles)
  }*/
  findPaymentAmount(): number {
    let monthly: any;
    const loanAmount = this.apForm.get('LoanAmount').value;
    const arr = this.apForm.get('APR').value;
    const duration = this.apForm.get('Duration').value;
    monthly = FinanceInatance.findPaymentAmount(
      Number(loanAmount),
      Number(arr),
      Number(duration)
    );
    this.apForm.get('PaymentAmount').setValue(monthly);
    return monthly;
  }
  afterResponse(): void {
    // data convertion
    this.data.from_details[0].birthday = new Date(
      this.data.from_details[0].birthday
    );
    this.data.from_details[0].createdAt = new Date(
      this.data.from_details[0].createdAt
    );
    this.data.from_details[0].updatedAt = new Date(
      this.data.from_details[0].updatedAt
    );
    // set input value
    this.apForm
      .get('LoanAmount')
      .setValue(this.data.from_details[0].loanAmount);
    this.apForm.get('APR').setValue(this.data.from_details[0].apr);
    this.apForm.get('Duration').setValue(this.data.from_details[0].loanTerm);
    // trigger
    // find payment amount
    this.findPaymentAmount();
  }
  sendForm(): void {
    this.apibtn = true;
    if (!this.apForm.invalid) {
      console.log(this.apForm.value);
      const data = this.apForm.value;
      const sendData = {
        loanAmount: Number(data.LoanAmount),
        duration: +data.Duration,
        apr: +data.APR
      };
      // updateuserloan​/edituserloanamountdetails​/
      this.service
        .authpatch(
          'updateuserloan/edituserloanamountdetails/' + this.id,
          'admin',
          sendData
        )
        .pipe(first())
        .subscribe(
          res => {
            if (res['statusCode'] === 200) {
              console.log(res);
              // this.router.navigate(['admin/dashboard']);
              this.message = 'Loan details updated';
              this.modalRef = this.modalService.show(this.messagebox);
            } else {
              console.log(res['statusCode'], res);
            }
          },
          err => {
            console.log(err);
            if (err['error']['message'].isArray) {
              this.message = err['error']['message'];
            } else {
              this.message = [err['error']['message']];
            }
            this.modalRef = this.modalService.show(this.messagebox);
          }
        );
    }
  }
  inviteUser(): void {
    this.service
      .authget('mailcontrollers/' + this.id + '/Invite', 'admin')
      .pipe(first())
      .subscribe(
        res => {
          if (res['statusCode'] === 200) {
            console.log(res);
            this.message = [res['data']];
            this.modalRef = this.modalService.show(this.messagebox);
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
  inviteTest(): void {
    const userData = JSON.parse(sessionStorage.getItem('resuser'));
    this.service
      .authget(
        'mailcontrollers/' + this.id + '/Invite/' + userData.email,
        'admin'
      )
      .pipe(first())
      .subscribe(
        res => {
          if (res['statusCode'] === 200) {
            this.message = [res['data']];
            console.log(res);
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
  uploadDoc(): void {
    if (this.formControls.docFile.valid && this.formControls.type.valid) {
      const formData = new FormData();
      formData.append('type', this.formControls.type.value);
      formData.append('loan_id', this.id);
      formData.append('files', this.formControls.docFile.value[0]);
      console.log(this.formControls.docFile.value);
      this.service
        .files('uploadfiles/uploads/', 'admin', formData)
        .pipe(first())
        .subscribe(
          res => {
            if (res['statusCode'] === 200) {
              console.log(res);
              // value update
              this.data.userDocument.push({
                type: this.formControls.type.value,
                orginalfileName: this.formControls.docFile.value[0].name,
                fileName: res['data']['key']
              });
              this.formControls.docFile.setValue([]);
              this.formControls.type.setValue('');
            } else {
              console.log(res['statusCode'], res);
            }
          },
          err => {
            console.log(err.error.message);
          }
        );
    } else {
      // show error
      console.log('error');
      console.log(
        this.formControls.docFile.value,
        this.formControls.docFile.valid,
        'here',
        this.formControls.docFile.errors
      );
    }
  }
}
