import { Component, OnInit,TemplateRef,ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from '../../_service/http.service';
import { first } from 'rxjs/operators';
import { Router } from "@angular/router";
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-usersdetails',
  templateUrl: './usersdetails.component.html',
  styleUrls: ['./usersdetails.component.scss']
})
export class UsersdetailsComponent implements OnInit {
  modalRef: BsModalRef;
  @ViewChild('messagebox', { read: TemplateRef }) messagebox:TemplateRef<any>;
  constructor(private route: ActivatedRoute,private service: HttpService,private modalService: BsModalService,public router:Router) { }

 data:any=[];
  message:any = [];
  ngOnInit(): void {
    this.get(this.route.snapshot.paramMap.get('id'))
  }

  get(id){
    this.service.authget('users/'+id,'admin')
    .pipe(first())
    .subscribe(res=>{
      if(res['statusCode']==200){
        this.data= res['data']
        console.log(this.data)
      }else{
        this.message = res['message']
        this.modalRef = this.modalService.show(this.messagebox);
        this.router.navigate(['admin/users']);
      }
    },err=>{
      if(err['error']['message'].isArray){
        this.message = err['error']['message']
      }else{
        this.message = [err['error']['message']]
      }
      this.modalRef = this.modalService.show(this.messagebox);
      this.router.navigate(['admin/users']);
    })
  }

  active(){
    let id = this.route.snapshot.paramMap.get('id')
    this.service.authget('users/active/'+id,'admin')
    .pipe(first())
    .subscribe(res=>{
      if(res['statusCode']==200){
        this.get(id)
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

  deactive(){
    let id = this.route.snapshot.paramMap.get('id')
    this.service.authget('users/deactive/'+id,'admin')
    .pipe(first())
    .subscribe(res=>{
      if(res['statusCode']==200){
        this.get(id)
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

  delete(){
    let id = this.route.snapshot.paramMap.get('id')
    this.service.authget('users/delete/'+id,'admin')
    .pipe(first())
    .subscribe(res=>{
      if(res['statusCode']==200){
        this.router.navigate(['admin/users']);
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

  close(): void {
    this.modalRef.hide();
    
  }

}
