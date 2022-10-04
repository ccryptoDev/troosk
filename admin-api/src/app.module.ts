import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './configs/database/typeorm.config';
import { QuestionsModule } from './modules/questions/questions.module';
import { UsersModule } from './modules/users/users.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './guards/roles.guard';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { PendingModule } from './modules/pending/pending.module';
import { IncompleteModule } from './modules/incomplete/incomplete.module';
import { ApprovedModule } from './modules/approved/approved.module';
import { DeniedModule } from './modules/denied/denied.module';
import { MailModule } from './mail/mail.module';
import { ConfigModule } from '@nestjs/config';
import { FilesModule } from './modules/files/files.module';
import { CustomerModule } from './modules/customer/customer.module';
import { StateserviceModule } from './modules/stateservice/stateservice.module';
import { UpdateuserloanModule } from './modules/updateuserloan/updateuserloan.module';
import { ReviewModule } from './modules/review/review.module';
import { PaymentcalculationModule } from './paymentcalculation/paymentcalculation.module';
import { UploadfilesModule } from './modules/uploadfiles/uploadfiles.module';
import { CreditpullModule } from './modules/creditpull/creditpull.module';
import { RolesModule } from './modules/roles/roles.module';
import { AuditlogsModule } from './modules/auditlogs/auditlogs.module';
import { PromissoryNoteModule } from './promissory-note/promissory-note.module';
import { LoanstageModule } from './modules/loanstage/loanstage.module';
import { TwilioModule } from 'nestjs-twilio';
import { twilioDetails } from 'src/configs/configs.constants';
import { RepayModule } from './modules/repay/repay.module';
import { PaymentModule } from './modules/payment/payment.module';
import { FinicityModule } from './modules/finicity/finicity.module';
import { ScheduleModule } from '@nestjs/schedule';
import { PaymentScheduleModule } from './modules/payment-schedule/payment-schedule.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    QuestionsModule,
    UsersModule,
    DashboardModule,
    PendingModule,
    IncompleteModule,
    ApprovedModule,
    DeniedModule,
    MailModule,
    CustomerModule,
    ConfigModule.forRoot({
      isGlobal: true, // no need to import into other modules
    }),
    TwilioModule.forRoot({
      accountSid: twilioDetails.AccountSid,
      authToken: twilioDetails.AuthToken,
    }),
    ScheduleModule.forRoot(),
    FilesModule,
    StateserviceModule,
    UpdateuserloanModule,
    ReviewModule,
    PaymentcalculationModule,
    UploadfilesModule,
    CreditpullModule,
    RolesModule,
    AuditlogsModule,
    PromissoryNoteModule,
    LoanstageModule,
    RepayModule,
    PaymentModule,
    FinicityModule,
    PaymentScheduleModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
