import { Component, OnInit } from '@angular/core';
import { HttpService} from '../_service/http.service';

@Component({
  selector: 'app-installersidebar',
  templateUrl: './installersidebar.component.html',
  styleUrls: ['./installersidebar.component.scss']
})
export class InstallersidebarComponent implements OnInit {

  constructor(private service:HttpService) { }

  ngOnInit(): void {
  }

  logout(){
    this.service.logout()
  }

}
