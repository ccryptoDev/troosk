import { SendGridModule } from '@ntegral/nestjs-sendgrid';
import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MaillogRepository } from '../repository/maillog.repository';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    SendGridModule.forRootAsync({
      imports: [ConfigModule, TypeOrmModule.forFeature([MaillogRepository])],
      useFactory: async (cfg: ConfigService) => ({
        apiKey: cfg.get('SENDGRID_API_KEY'),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [MailService, MaillogRepository],
  exports: [MailService],
})
export class MailModule {}
