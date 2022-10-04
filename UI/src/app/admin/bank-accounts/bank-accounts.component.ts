import {Component, Input, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {first} from 'rxjs/operators';
import {HttpService} from '../../_service/http.service';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';

export enum ACHAccountType {
  Checking = 'Checking',
  Savings = 'Savings',
}

export enum Flags {
  N = 'N',
  Y = 'Y',
}

@Component({
  selector: 'app-bank-accounts',
  templateUrl: './bank-accounts.component.html',
  styleUrls: ['./bank-accounts.component.scss']
})
export class BankAccountsComponent implements OnInit {
  @Input() loanId!: string;
  modalRef: BsModalRef;
  modalRefMessage: BsModalRef;
  bankAccounts: any = [];
  message: any;
  bankAddForm: FormGroup;
  fSubmitted = false;
  data: any = {
    answers: [],
    CoApplicant: [],
    document: [],
    from_details: [],
    userDocument: [],
    paymentScheduleDetails: []
  };
  @ViewChild('messagebox', { read: TemplateRef }) messagebox: TemplateRef<any>;

  constructor(
    private service: HttpService,
    private modalService: BsModalService,
    private formBuilder: FormBuilder,
  ) {}

  get f(): { [key: string]: AbstractControl } {
    return this.bankAddForm.controls;
  }

  ngOnInit(): void {
    this.getBankAccounts(this.loanId);
    this.bankAddForm = this.formBuilder.group(
      {
        bankName: ['', Validators.required],
        holderName: ['', Validators.required],
        routingNumber: ['', [Validators.required, Validators.minLength(9)]],
        accountNumber: ['', [Validators.required, Validators.pattern('\\W*\\d{8,17}\\b')]],
        ach_account_type: ['', Validators.required]
      },
    );
  }

  getBankAccounts(loanId) {
    this.service.get(`payment/${loanId}`, 'admin')
      .pipe(first())
      .subscribe(res => {
          if (Array.isArray(res)) {
            this.bankAccounts = res.filter(acc => {
              if (
                Object.values(ACHAccountType).includes(acc.ach_account_type) && acc.delete_flag === Flags.N
              ) {
                return acc;
              } else {
                return;
              }
            });
          }
        },
        err => {
          if (err['error']['message'].isArray) {
            this.message = err['error']['message'];
          } else {
            this.message = [err['error']['message']];
          }
        });
  }

  selectBankAccount(refNo: string): void {
    this.service.patch(`payment/${this.loanId}/${refNo}`, 'admin', {})
      .pipe(first())
      .subscribe(() => {
          this.bankAccounts = this.bankAccounts.map(item => {
            if (item.ref_no === refNo) {
              item.active_flag = 'Y';
            } else {
              item.active_flag = 'N';
            }
            return item;
          });
        },
        err => {
          if (err['error']['message'].isArray) {
            this.message = err['error']['message'];
          } else {
            this.message = [err['error']['message']];
          }
        }
      );
  }

  removeBankAccount(refNo: string): void {
    this.service.authdelete(`payment/${this.loanId}/${refNo}`, 'admin')
      .pipe(first())
      .subscribe(() => {
          this.bankAccounts = this.bankAccounts.filter(item => item.ref_no !== refNo);
        },
        err => {
          if (err['error']['message'].isArray) {
            this.message = err['error']['message'];
          } else {
            this.message = [err['error']['message']];
          }
        });
  }

  manualBankAdd() {
    this.fSubmitted = true;
    if (this.bankAddForm.invalid) {
      return;
    }

    this.service
      .authpost(`payment/${this.loanId}`, 'admin', this.bankAddForm.value)
      .pipe(first())
      .subscribe(
        res => {
          if (res['statusCode'] === 200) {
            this.bankAccounts.push(res['data']);
            this.bankAddFormClose();
          } else {
            this.message = res['message'];
            this.modalRefMessage = this.modalService.show(this.messagebox);
          }
        },
        err => {
          if (err['error']['message'].isArray) {
            this.message = err['error']['message'];
          } else {
            this.message = [err['error']['message']];
          }
          this.modalRefMessage = this.modalService.show(this.messagebox);
        }
      );
  }

  bankAddFormClose(): void {
    this.modalRef.hide();
    this.fSubmitted = false;
    this.bankAddForm.reset();
  }

  manualBankAddModel(manualBankAddTemp: TemplateRef<any>) {
    this.modalRef = this.modalService.show(manualBankAddTemp);
  }

  sendbanklogin() {
    this.service.authget('plaid/requestBank/' + this.loanId, 'admin').subscribe(
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

  close(): void {
    this.modalRefMessage.hide();
  }
}
