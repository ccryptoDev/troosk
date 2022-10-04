import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-consentscreen',
  templateUrl: './consentscreen.component.html',
  styleUrls: ['./consentscreen.component.scss']
})
export class ConsentscreenComponent implements OnInit {
  panelOpenState: boolean = false;

  constructor() { }

  ngOnInit(): void {

  }

}
