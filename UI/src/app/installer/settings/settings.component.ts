import { Component, OnInit } from '@angular/core';
import {  CurrencyPipe} from '@angular/common';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  f1:any ={}
  maxDate: Date;
  constructor(private currencyPipe : CurrencyPipe) { }

  ngOnInit(): void {
  }

  namedata(data){
    data.target.value = data.target.value.replace(/[^A-Za-z.]/g, '');
   return data.target.value ? data.target.value.charAt(0).toUpperCase() + data.target.value.substr(1).toLowerCase() : '';
  }

  number(data){
    return data.target.value = data.target.value.replace(/[^0-9.]/g,'')
  }

  onSubmit() {}

  transformAmount(data){
    let v = data.target.value.split('.')
    if(v.length>2){
      return "";
    }
    return this.currencyPipe.transform(data.target.value, '$');
}

}
