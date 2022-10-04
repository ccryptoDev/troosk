import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";

@Component({
  selector: 'app-profile-view',
  templateUrl: './profile-view.component.html',
  styleUrls: ['./profile-view.component.scss']
})
export class ProfileViewComponent implements OnInit {

  constructor(public router:Router) { }

  ngOnInit(): void {
  }

  go(){
    this.router.navigate(['installer/profile/settings']);
  }

}
