import { Component, Input, OnInit,TemplateRef,ViewChildren, QueryList, ElementRef } from '@angular/core';
import { Router } from "@angular/router";
import {  CurrencyPipe} from '@angular/common';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { HttpService } from '../../_service/http.service';
import { first } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SignatureFieldComponent } from '../../signature-field/signature-field.component';

@Component({
  selector: 'app-page2',
  templateUrl: './page2.component.html',
  styleUrls: ['./page2.component.scss']
})
export class Page2Component implements OnInit {
  f1:any ={
    loanAmount:sessionStorage.getItem('LoanAmount'),
    loanTerm:sessionStorage.getItem('LoanTerm'),
    apr:sessionStorage.getItem('Apr'),
  };
  f2:any ={}
  Co_Applicant:any=false
  agree:any=false
  maxDate: Date;
  formattedAmount:any;
  modalRef: BsModalRef;
  savedate:any = {};
  public form: FormGroup;

  // for convenience as we don't have a QueryList.index
  public secondSig: SignatureFieldComponent;
  @ViewChildren(SignatureFieldComponent) public sigs: QueryList<SignatureFieldComponent>;
  @ViewChildren('sigContainer1') public sigContainer1: QueryList<ElementRef>;

  constructor(private fb: FormBuilder,private modalService: BsModalService, public router:Router,private currencyPipe : CurrencyPipe,private service: HttpService) {this.maxDate = new Date(); 
    
  }

  ngOnInit(): void {
    window.top.postMessage(2,'*');
    this.f1.co_homeOccupancy="Primary";
    this.f1.co_spokenLanguage="English";
    this.f1.co_homeOwnership="Not Owned";
    this.f1.co_employmentStatus="Employed";
    this.f1.co_citizenshipStatus="Us Citizen";
    this.f1.loanAmount = this.transformAmount({target:{value:this.f1.loanAmount}})
    
  }

  namedata(data){
    data.target.value = data.target.value.replace(/[^A-Za-z.]/g, '');
   return data.target.value ? data.target.value.charAt(0).toUpperCase() + data.target.value.substr(1).toLowerCase() : '';
  }

  number(data){
    return data.target.value = data.target.value.replace(/[^0-9.]/g,'')
  }

  onSubmit(template: TemplateRef<any>) {
    this.form = this.fb.group({
      signatureField1: ['', Validators.required]
    });

    this.savedate = {}
  

    this.savedate.email=this.f1.email;
    this.savedate.firstName=this.f1.firstName;
    this.savedate.lastName=this.f1.lastName;
    this.savedate.socialSecurityNumber=this.f1.socialSecurityNumber;
    this.savedate.birthday=this.changedate(this.f1.birthday);
    this.savedate.phone=this.f1.phone;
    this.savedate.streetAddress=this.f1.streetAddress;
    this.savedate.unit=this.f1.unit;
    this.savedate.city=this.f1.city;
    this.savedate.state=this.f1.state;
    this.savedate.zipCode=this.f1.zipCode;
    this.savedate.annualIncome=this.getamount(this.f1.annualIncome);
    this.savedate.additionalIncome=this.getamount(this.f1.additionalIncome);
    this.savedate.mortgagePayment=this.getamount(this.f1.mortgagePayment);
    //this.savedate.loanAmount=this.getamount(this.f1.loanAmount);
    //this.savedate.loanTerm=Number(this.f1.loanTerm);
    //this.savedate.apr=Number(this.f1.apr);
    this.savedate.isCoApplicant=this.Co_Applicant;
    this.savedate.loanAmount=Number(sessionStorage.getItem('LoanAmount'))
    this.savedate.loanTerm=Number(sessionStorage.getItem('LoanTerm'))
    this.savedate.apr=Number(sessionStorage.getItem('Apr'))
    if(this.Co_Applicant){
      if(this.agree){
        this.savedate.CoApplication = {}
        this.savedate.CoApplication.email=this.f1.co_email;
        this.savedate.CoApplication.firstName=this.f1.co_firstName;
        this.savedate.CoApplication.lastName=this.f1.co_lastName;
        this.savedate.CoApplication.birthday=this.changedate(this.f1.co_birthday);
        this.savedate.CoApplication.phone=this.f1.co_phone;
        this.savedate.CoApplication.additionalIncome=this.getamount(this.f1.co_additionalIncome);
        this.savedate.CoApplication.employer=this.f1.co_employer;
        this.savedate.CoApplication.jobTitle=this.f1.co_jobTitle;
        this.savedate.CoApplication.yearsEmployed=Number(this.f1.co_yearsEmployed);
        this.savedate.CoApplication.monthsEmployed=Number(this.f1.co_monthsEmployed);
        this.savedate.CoApplication.homeOccupancy=this.f1.co_homeOccupancy;
        this.savedate.CoApplication.homeOwnership=this.f1.co_homeOwnership;
        this.savedate.CoApplication.employmentStatus=this.f1.co_employmentStatus;
        this.savedate.CoApplication.citizenshipStatus=this.f1.co_citizenshipStatus;
        this.savedate.CoApplication.spokenLanguage=this.f1.co_spokenLanguage;
        this.modalRef = this.modalService.show(template);
        
     
      }
    }else{
      this.modalRef = this.modalService.show(template);

    }
  }

  transformAmount(data){
    let v = data.target.value.split('.')
    if(v.length>2){
      return "";
    }
    return this.currencyPipe.transform(data.target.value, '$');
  }
 
 
 

  // set the dimensions of the signature pad canvas
  public beResponsive(container: ElementRef, sig: SignatureFieldComponent) {
    sig.signaturePad.set('canvasWidth', container.nativeElement.clientWidth);
    sig.signaturePad.set('canvasHeight', container.nativeElement.clientHeight);
    
  }

 

  


  public onSubmit1() {
    
    this.savedate.signature = this.form.value['signatureField1'];

    this.modalRef.hide();
    this.savedate.loan_id = sessionStorage.getItem("Loan_ID")
  this.service.post("application-form1","sales",this.savedate)
      .pipe(first())
      .subscribe(res=>{
        if(res['statusCode']==200){
          sessionStorage.setItem('Loan_ID',res['Loan_ID'])
          this.router.navigate(['sales/page4']);
        }
      },err=>{
        console.log(err)
      })
  }

  public clear(sig:SignatureFieldComponent) {
    sig.clear()
  }

/*onSubmit1(data){
  console.log(data)
  return true
  this.modalRef.hide();
  this.savedate.loan_id = sessionStorage.getItem("Loan_ID")
  this.service.post("application-form1","sales",this.savedate)
      .pipe(first())
      .subscribe(res=>{
        if(res['statusCode']==200){
          sessionStorage.setItem('Loan_ID',res['Loan_ID'])
          this.router.navigate(['sales/page4']);
        }
      },err=>{
        console.log(err)
      })
}*/

close(): void {
  this.modalRef.hide();
}


changedate(date:Date){
  let today:any = new Date(date);
  let dd:any = today.getDate();

  let mm:any = today.getMonth()+1; 
  let yyyy = today.getFullYear();
  if(dd<10) 
  {
      dd='0'+dd;
  } 

  if(mm<10) 
  {
      mm='0'+mm;
  } 
  today = mm+'-'+dd+'-'+yyyy;
  return today
  }

  getamount(data){
    return Number(data.replace(",","").replace("$",""))
  }

}
