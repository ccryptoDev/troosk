import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { HttpService } from '../../_service/http.service';
import { first } from 'rxjs/operators';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';

export enum ACHAccountType {
  Checking = 'Checking',
  Savings = 'Savings',
}

export enum Flags {
  N = 'N',
  Y = 'Y',
}

@Component({
  selector: 'app-payment-method',
  templateUrl: './payment-method.component.html',
  styleUrls: ['./payment-method.component.scss']
})
export class PaymentMethodComponent implements OnInit {
  userId = sessionStorage.getItem('UserId');
  loanId = sessionStorage.getItem('LoanId');
  data: any = {
    bankDetails: [],
    cardDetails: [],
    user_details: null
  };
  modalRefMessage: BsModalRef;
  modalRef: BsModalRef;
  message: any = [];
  bankAddFields = {};
  debitCardAddFields = {};
  activeBank = null;
  activeCard = null;
  bankChooseFields = {};
  cardChooseFields = {};
  toggleAutoPayFields = {};

  bankAddForm: FormGroup;
  fSubmitted = false;

  @ViewChild('messagebox', { read: TemplateRef }) messagebox: TemplateRef<any>;

  constructor(
    private modalService: BsModalService,
    private service: HttpService,
    private formBuilder: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.addlog('View Payment Method page', sessionStorage.getItem('LoanId'));
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

  get f(): { [key: string]: AbstractControl } {
    return this.bankAddForm.controls;
  }

  selectBankAccount(refNo: string): void {
    this.service.patch(`payment/${this.loanId}/${refNo}`, 'admin', {})
      .pipe(first())
      .subscribe((res) => {
          if (res['statusCode'] === 200) {
            this.data.bankDetails = this.data.bankDetails.map(item => {
              if (item.ref_no === refNo) {
                item.active_flag = 'Y';
                console.log(item);
              } else {
                item.active_flag = 'N';
              }
              return item;
            });
          } else {
            this.message = res['message'];
          }
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


  changeCard(changeCardTemp: TemplateRef<any>){
    this.modalRef = this.modalService.show(changeCardTemp);
  }

  addNewBank(addNewBankTemp: TemplateRef<any>){
    this.modalRef = this.modalService.show(addNewBankTemp);
  }

  addNewCard(addNewCardTemp: TemplateRef<any>){
    this.modalRef = this.modalService.show(addNewCardTemp);
  }

  close(): void {
    this.modalRef.hide();
  }

  getBankAccounts(loanId) {
    this.service.get(`payment/${loanId}`, 'admin')
      .pipe(first())
      .subscribe(res => {
          if (Array.isArray(res)) {
            this.data.bankDetails = res.filter(acc => {
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

  debitCardAdd(){
   const data: any = {};
   data.user_id = this.userId;
   const ex = this.debitCardAddFields['expires'];
   data.expires = ex.substring(0, 2) + '/' + ex.substring(2, 4);
   data.agree = this.debitCardAddFields['agree'];
   data.billingAddress = this.debitCardAddFields['billingAddress'];
   data.cardNumber = Number(this.debitCardAddFields['cardNumber']);
   data.confirm = this.debitCardAddFields['confirm'];
   data.csc = Number(this.debitCardAddFields['csc']);
   data.fullName = this.debitCardAddFields['fullName'];

   this.service.authpost('payment-method/debitcardadd', 'borrower', data)
    .pipe(first())
    .subscribe(res => {
      if (res['statusCode'] === 200){
        console.log('data', res['data']);
        // this.getBankAndCard();
        this.modalRef.hide();
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
            this.data.bankDetails.push(res['data']);
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

  cardChoose(){
    console.log('activeCard', this.activeCard);
    this.cardChooseFields['card_id'] = this.activeCard;
    this.service.authput('payment-method/cardchoose/' + this.userId, 'borrower', this.cardChooseFields)
    .pipe(first())
    .subscribe(res => {
      if (res['statusCode'] === 200){
        console.log(res);
        // this.getBankAndCard();
        this.modalRef.hide();
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

  toggleAutoPay(value){
    console.log(value);
    this.toggleAutoPayFields['value'] = value;
    this.service.authput('payment-method/toggleAutoPay/' + this.userId, 'borrower', this.toggleAutoPayFields)
    .pipe(first())
    .subscribe(res => {
      if (res['statusCode'] === 200){
        console.log(res);
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

  addlog(module, id){
    this.service.addlog(module, id, 'borrower').subscribe(res => {}, err => {});
  }
}
