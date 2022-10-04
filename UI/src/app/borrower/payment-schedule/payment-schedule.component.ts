import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/_service/http.service';
import { first } from 'rxjs/operators';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-payment-schedule',
  templateUrl: './payment-schedule.component.html',
  styleUrls: ['./payment-schedule.component.scss']
})
export class PaymentScheduleComponent implements OnInit {
  loanId = sessionStorage.getItem('LoanId');
  data: any = {
    payment_details: [],
    paymentScheduleDetails: [],
    next_schedule: null,
    user_details: null,
  };

  constructor(private service: HttpService, public datePipe: DatePipe) { }

  ngOnInit(): void {
    this.getPaymentDetails(this.loanId);
  }

  getPaymentDetails(loanId){
    const UNPAID = 'UNPAID';
    const HTTP_STATUS_OK = 200;
    this.service.authget('payment-schedule/' + loanId, 'borrower')
    .pipe(first())
    .subscribe(res => {
      this.addlog('View Payment schedule page', loanId);
      if (res['statusCode'] === HTTP_STATUS_OK){
        res['data'].map(payment => {
          if (payment.status_flag === UNPAID) {
            this.data.paymentScheduleDetails.push(payment);
          } else {
            this.data.payment_details.push(payment);
          }
        });
      }
    }, err => {
      console.log(err);
    });
  }

  addlog(module, id){
    this.service.addlog(module, id, 'borrower').subscribe(res => {}, err => {});
  }

}
