import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { AccountComponent } from './account/account.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './account/login/login.component';
import { RegisterComponent } from './account/register/register.component';
import { ModalModule, BsModalService } from 'ngx-bootstrap/modal';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { CurrencyPipe } from '@angular/common';
import { InstallersidebarComponent } from './installersidebar/installersidebar.component';
import { NgxBootstrapIconsModule } from 'ngx-bootstrap-icons';
import { gridFill, person, cardText } from 'ngx-bootstrap-icons';
import { NgxSpinnerModule } from 'ngx-spinner';
import { HttpService } from './_service/http.service';
import { JwtInterceptor } from './_service/jwt.interceptor';
import { AdminsidebarComponent } from './adminsidebar/adminsidebar.component';
import { BorrowerSidebarComponent } from './borrower-sidebar/borrower-sidebar.component';
import { DatePipe, DecimalPipe } from '@angular/common';
import { ReviewComponent } from './review/review.component';
import { NgxMaskModule } from 'ngx-mask';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { HomeComponent } from './home/home.component';
import { NgxFileDragDropModule } from 'ngx-file-drag-drop';
import { NgxPlaidLinkModule } from 'ngx-plaid-link';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { SignaturePadModule } from 'angular2-signaturepad';
import { AccordionModule } from 'ngx-bootstrap/accordion';

const icons = {
  gridFill,
  person,
  cardText,
};

@NgModule({
  declarations: [
    AppComponent,
    AccountComponent,
    DashboardComponent,
    LoginComponent,
    RegisterComponent,
    InstallersidebarComponent,
    AdminsidebarComponent,
    BorrowerSidebarComponent,
    ReviewComponent,
    HomeComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ModalModule.forRoot(),
    NgxBootstrapIconsModule.pick(icons),
    HttpClientModule,
    NgxSpinnerModule,
    BsDatepickerModule.forRoot(),
    NgxMaskModule.forRoot(),
    NgxFileDragDropModule,
    NgxPlaidLinkModule,
    TabsModule.forRoot(),
    SignaturePadModule,
    AccordionModule.forRoot(),
  ],
  providers: [
    CurrencyPipe,
    DatePipe,
    DecimalPipe,
    BsModalService,
    HttpService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
