import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { HttpService } from '../../_service/http.service';
import { first } from 'rxjs/operators';
import { IpAddressService } from 'src/app/_service/ip-address.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  f1: any = {};
  modalRef: BsModalRef;
  message: any = [];
  constructor(
    private modalService: BsModalService,
    public router: Router,
    private service: HttpService,
    private ip: IpAddressService
  ) { }

  ngOnInit(): void {
  }

  onSubmit(template: TemplateRef<any>){
    this.service.post('users/signin', 'borrower', this.f1)
    .pipe(first())
      .subscribe(res => {
        if (res['statusCode'] === 200){
          sessionStorage.setItem('UserId', res['resuser']['id']);
          sessionStorage.setItem('LoanId', res['loanId']);
          sessionStorage.setItem('UD_firstName', res['resuser']['firstName']);
          sessionStorage.setItem('UD_lastName', res['resuser']['lastName']);
          sessionStorage.setItem('UD_email', res['resuser']['email']);
          if (res['resuser']['twoFactorAuth'] === 'N'){
            sessionStorage.setItem('borrower_token', res['jwtAccessToken']);
            // this.ip.getIPAddress().subscribe((res:any)=>{
            //   this.addLoginLog();
            // });
            this.addLoginLog();
            this.router.navigate(['borrower/overview']);
            window.location.reload();
          }else{
            this.router.navigate(['borrower/twoFactorAuth']);
          }
        }else{
          this.message = res['message'];
          this.modalRef = this.modalService.show(template);
        }
      }, err => {
        console.log(err);
      });
  }

  close(): void {
    this.modalRef.hide();
  }

  addLoginLog(){
    this.service.addLoginLog('borrower').subscribe(res => {}, err => {});
  }

}
