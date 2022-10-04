import {
  Component,
  OnInit,
  NgModule,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { HttpService } from '../../_service/http.service';
import { first } from 'rxjs/operators';
import { readyMade } from '../../../environments/environment';
import { Router } from '@angular/router';
import {
  CommonDataInatance,
  FinanceInatance,
} from '../../_service/comman.service';
@Component({
  selector: 'app-start-application',
  templateUrl: './start-application.component.html',
  styleUrls: ['./start-application.component.scss'],
})
export class StartApplicationComponent implements OnInit {
  data: any = [];
  maxDate: Date;
  apibtn: boolean = false;
  apForm: FormGroup;
  durationMonths = FinanceInatance.durationMonths;
  stateList = [];
  message: any = [];
  modalRef: BsModalRef;
  @ViewChild('messagebox', { read: TemplateRef }) messagebox: TemplateRef<any>;
  constructor(
    private service: HttpService,
    private formBuilder: FormBuilder,
    public router: Router,
    private modalService: BsModalService
  ) {
    console.log(readyMade);
  }
  get apiFormvalidation() {
    return this.apForm.controls;
  }
  ngOnInit(): void {
    this.stateList = CommonDataInatance.stateList();
    //allowed 18 old pepole
    this.maxDate = new Date();
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);
    this.get();
    this.apForm = this.formBuilder.group({
      identificationNumber: ['', [Validators.required]],
      FirstName: [
        '',
        [Validators.required, Validators.pattern(readyMade.pattern.name)],
      ],
      MiddleName: ['', [Validators.pattern(readyMade.pattern.name)]],
      LastName: [
        '',
        [Validators.required, Validators.pattern(readyMade.pattern.name)],
      ],
      streetName: ['', [Validators.required]],
      streetNumber: ['', [Validators.required]],
      UnitApartment: [''],
      City: [
        '',
        [Validators.required, Validators.pattern(readyMade.pattern.name)],
      ],
      State: ['', [Validators.required]],
      ZipCode: [
        '',
        [Validators.required, Validators.pattern(readyMade.pattern.number)],
      ],
      DateofBirth: ['', [Validators.required]],
    });
  }

  get() {
    /*this.service.authget("start-appliction", "admin")
    .pipe(first())
    .subscribe(res=>{
      if(res['statusCode'] == 200) {
        this.data= res['data']
      }
    }, err=>{
      console.log(err);
    });*/
  }
  sendForm(): void {
    this.apibtn = true;
    if (!this.apForm.invalid) {
      console.log(this.apForm.value);
      //data
      let data = this.apForm.value,
        sendData;
      console.log('date', String(data.DateofBirth));
      var dob: any = '';
      dob = String(data.DateofBirth);
      dob = dob.split(' ');
      console.log('dob', dob[1], dob[2], dob[3]);
      sendData = {
        identificationNumber: data.identificationNumber,
        firstName: data.FirstName,
        middleName: data.MiddleName,
        lastName: data.LastName,
        streetName: data.streetName,
        streetNumber: Number(data.streetNumber),
        unitNumber: data.UnitApartment,
        city: data.City,
        state: data.State,
        zipCode: data.ZipCode,
        month: dob[1],
        day: dob[2],
        year: dob[3],
      };

      console.log('send data', sendData);

      this.service
        .authpost('startapplication', 'admin', sendData)
        .pipe(first())
        .subscribe(
          (res) => {
            if (res['statusCode'] == 200) {
              console.log(res);
              this.router.navigate(['admin/dashboard']);
            } else {
              console.log(res['statusCode'], res);
              this.message = [res['message']];
              this.modalRef = this.modalService.show(this.messagebox);
            }
          },
          (err) => {
            console.log(err);
          }
        );
    }
  }
  findPaymentAmount(): number {
    var monthly: any;
    let loanAmount = this.apForm.get('LoanAmount').value,
      arr = this.apForm.get('APR').value,
      duration = this.apForm.get('Duration').value;
    monthly = FinanceInatance.findPaymentAmount(
      Number(loanAmount),
      Number(arr),
      Number(duration)
    );
    this.apForm.get('PaymentAmount').setValue(monthly);
    return monthly;
  }
  close(): void {
    this.modalRef.hide();
  }
}
