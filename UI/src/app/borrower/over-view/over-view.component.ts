import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/_service/http.service';
import { first } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-over-view',
  templateUrl: './over-view.component.html',
  styleUrls: ['./over-view.component.scss']
})
export class OverViewComponent implements OnInit {
  loanId = sessionStorage.getItem('LoanId');
  data: any = {
    customerInfo: {
      name: null,
      mobilePhone: null,
      email: null,
      address: null,
    },
    loanDetails: {
      amountFinanced: null,
      numberOfPayments: null,
      apr: null,
      amountOfEachPayment: null,
    },
    amortizationSchedule: [],
  };

  constructor(
    private service: HttpService,
    public datePipe: DatePipe,
    public router: Router
  ) { }

  ngOnInit(): void {
    this.getOverView(this.loanId);
    this.getAmortizationSchedule(this.loanId);
  }
  getOverView(loanId){
    this.service.authget('loan-contract-page/' + loanId, 'borrower')
    .pipe(first())
    .subscribe(res => {
        this.data = res;
        this.data.customerInfo.email = sessionStorage.getItem('UD_email');
    }, err => {
      console.log(err);
    });
  }

  getAmortizationSchedule(loanId) {
    const UNPAID = 'UNPAID';
    this.service.authget('loan-contract-page/' + loanId, 'borrower')
      .pipe(first())
      .subscribe(res => {
        this.data.amortizationSchedule = res['data'].map(payment => payment.status_flag === UNPAID);
      }, err => {
        console.log(err);
      });
  }

  addlog(module, id){
    this.service.addlog(module, id, 'borrower').subscribe(res => {}, err => {});
  }
}
