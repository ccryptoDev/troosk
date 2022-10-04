import { Component, OnInit,TemplateRef,ViewChild } from '@angular/core';
import { HttpService } from '../../_service/http.service';
import { first } from 'rxjs/operators';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-complete',
  templateUrl: './complete.component.html',
  styleUrls: ['./complete.component.scss']
})
export class CompleteComponent implements OnInit {
  loanId=sessionStorage.getItem('Loan_ID');
  data:any={
    loan:[]
  }
  monthDue=0;
  message:any = [];
  modalRef: BsModalRef;

  @ViewChild('messagebox', { read: TemplateRef }) messagebox:TemplateRef<any>;

  constructor(private service: HttpService, private modalService: BsModalService, private datePipe: DatePipe) { }

  ngOnInit(): void {
    window.top.postMessage(6,'*');
    this.getLoan(this.loanId)
  }

  getLoan(loanId){
    this.service.authget('loan/'+loanId,'sales')
    .pipe(first())
    .subscribe(res=>{
      if(res['statusCode']==200){
        console.log('data', res['data']);        
        this.data= res['data'];
        this.monthDue = this.calculateDue(this.data.loan[0].loanAmount,this.data.loan[0].apr,this.data.loan[0].loanTerm)
        this.createPaymentSchedule(
          this.data.loan[0].loanAmount,
          this.data.loan[0].apr,
          this.data.loan[0].loanTerm,
          this.data.loan[0].createdAt
        )
      }else{
        this.message = res['message']
        this.modalRef = this.modalService.show(this.messagebox);
      }
    },err=>{
      if(err['error']['message'].isArray){
        this.message = err['error']['message']
      }else{
        this.message = [err['error']['message']]
      }
      this.modalRef = this.modalService.show(this.messagebox);
    })
  }

  createPaymentSchedule(amount, apr, term, createdAt){
    let paymentScheduler = [];
    let date = new Date(createdAt)
    
    var principal = Number(amount);
    var interest = Number(apr) / 100 / 12;
    var payments = Number(term)
    var x = Math.pow(1 + interest, payments);
    var monthly:any = (principal*x*interest)/(x-1);
    if (!isNaN(monthly) && 
    (monthly != Number.POSITIVE_INFINITY) &&
    (monthly != Number.NEGATIVE_INFINITY)) 
    {
      monthly = this.round(monthly);
      for (let i = 0; i < payments; i++) {
        let inter = this.round((principal*Number(apr))/1200)
        let pri = this.round(monthly - inter)
        paymentScheduler.push({
          loan_id: this.loanId,
          unpaidPrincipal:principal,
          principal:pri,
          interest:inter,
          fees:0,
          amount:monthly,
          scheduleDate: this.datePipe.transform(new Date(new Date(createdAt).setMonth(new Date(createdAt).getMonth()+(i+1))), "yyyy-MM-dd")
        })
        principal = this.round(principal- pri);
      }        
    }
    let data = {paymentScheduler:paymentScheduler}
    this.service.post('payment-scheduler','sales', data)
    .pipe(first())
    .subscribe(res=>{
      if(res['statusCode']==200){
        console.log('data', res['data']);        
        
      }else{
        this.message = res['message']
        this.modalRef = this.modalService.show(this.messagebox);
      }
    },err=>{
      if(err['error']['message'].isArray){
        this.message = err['error']['message']
      }else{
        this.message = [err['error']['message']]
      }
      this.modalRef = this.modalService.show(this.messagebox);
    })
    
  }

  dt(today){
    var dd:any = today.getDate();
  
    var mm:any = today.getMonth()+1; 
    var yyyy = today.getFullYear();
    if(dd<10) 
    {
      dd='0'+dd;
    } 
  
    if(mm<10) 
    {
      mm='0'+mm;
    } 
    return mm+'-'+dd+'-'+yyyy;
  }

  calculateDue(amount,apr,months){
    var principal = amount
    var interest = apr / 100 / 12;
    var payments = months;
    var x = Math.pow(1 + interest, payments);
    var monthly:any = (principal*x*interest)/(x-1);
    if (!isNaN(monthly) && 
        (monthly != Number.POSITIVE_INFINITY) &&
        (monthly != Number.NEGATIVE_INFINITY)) {
          return this.round(monthly);
        }
  }
 
  round(x) {
    return Math.round(x*100)/100;
  }

  restart(){
    window.top.postMessage(7,'*');
  }

}
