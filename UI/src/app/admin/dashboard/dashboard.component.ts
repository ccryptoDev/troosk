import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../_service/http.service';
import { first } from 'rxjs/operators';
import { Router } from "@angular/router";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
data:any = {
  approved_application: 0,
canceled_application: 0,
incomplete_application: 0,
underwriting_application: 0,
waiting_application: 0,
}

tabs:any = {
  "Approved Application":false,
  "Pending Application":false,
  "Incomplete Application":false,
  "Underwriting Application": false,
  "Denied Application":false,
  "Admin Users":false,
  "Needs Review":false
}
  constructor(private service: HttpService,public router:Router) { }

  ngOnInit(): void {
    this.getlist()
  }

  getlist(){
    this.service.authget('dashboard','admin')
    .pipe(first())
    .subscribe(res=>{
      if(res['statusCode']==200){
        this.data= res['data']
      }
    },err=>{
      console.log(err)
    })
  }

  goUnderWriting() {
    this.router.navigate(['admin/underwriting'])
  }
  goPendings(){
    this.router.navigate(['admin/pendings']);
  }

  goincomplete(){
    this.router.navigate(['admin/incomplete']);
  }
  goapproved(){
    this.router.navigate(['admin/approved']);
  }
  godenied(){
    this.router.navigate(['admin/denied']);
  }
}
