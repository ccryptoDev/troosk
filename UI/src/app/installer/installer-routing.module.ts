import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './main/main.component';
import { CustomersComponent } from './customers/customers.component';
import { ProfileComponent } from './profile/profile.component';
import { ApplicationDetailsComponent } from './application-details/application-details.component';
import { ProfileViewComponent } from './profile-view/profile-view.component';
import { SettingsComponent } from './settings/settings.component';

const routes: Routes = [ 
  { path:'main', component: MainComponent},
  { path:'customers', component: CustomersComponent},
  { path:'profile', component: ProfileComponent},
  { path:'main/applicationdetails', component: ApplicationDetailsComponent},
  { path:'profile/view', component: ProfileViewComponent},
  { path:'profile/settings', component: SettingsComponent},
  { path: "**", redirectTo: "main", pathMatch: "full" },  
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InstallerRoutingModule { }
