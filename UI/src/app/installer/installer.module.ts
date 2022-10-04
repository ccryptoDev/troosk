import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InstallerRoutingModule } from './installer-routing.module';
import { MainComponent } from './main/main.component';
import { CustomersComponent } from './customers/customers.component';
import { ProfileComponent } from './profile/profile.component';
import { NgxBootstrapIconsModule } from 'ngx-bootstrap-icons';
import { cloudArrowUpFill,search,currencyDollar,fileEarmarkFill,folderFill } from 'ngx-bootstrap-icons';
import { ApplicationDetailsComponent } from './application-details/application-details.component';
import { FormsModule } from '@angular/forms';
import { NgxFileDropModule } from 'ngx-file-drop';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ProfileViewComponent } from './profile-view/profile-view.component';
import { SettingsComponent } from './settings/settings.component';
import { NgxMaskModule } from 'ngx-mask'
const icons = {
  cloudArrowUpFill,
  search,
  currencyDollar,
  fileEarmarkFill,
  folderFill
};



@NgModule({
  declarations: [
    MainComponent,
    CustomersComponent,
    ProfileComponent,
    ApplicationDetailsComponent,
    ProfileViewComponent,
    SettingsComponent
  ],
  imports: [
    CommonModule,
    InstallerRoutingModule,
    NgxBootstrapIconsModule.pick(icons),
    FormsModule,
    BsDatepickerModule.forRoot(),
    NgxFileDropModule,
    NgxMaskModule.forRoot()
  ]
})
export class InstallerModule { }
