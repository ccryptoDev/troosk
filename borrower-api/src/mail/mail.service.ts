import { HttpException, Injectable } from '@nestjs/common';
import { InjectSendGrid, SendGridService } from '@ntegral/nestjs-sendgrid';
import { config } from 'dotenv';
import { MaillogEntity } from '../entities/maillog.entity';
import { MaillogRepository } from '../repository/maillog.repository';
import { InjectRepository } from '@nestjs/typeorm';
config();

@Injectable()
export class MailService {
  data = [
    {
      filename: 'image.jpg',
      type: 'image/png',
      content:
        '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',
      content_id: 'myimagecid',
      disposition: 'inline',
    },
  ];

  html1 = `
  <!doctype html>
<html lang="en">
   <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
      <title></title>
   </head>
   <body>
      <table style="border:1px solid #fe932a; background-color: #fff;box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;padding: 20px;margin: auto; width: 650px;border-radius:8px;border-top:6px solid #fe932a;">
         <tr>
            <td></td>
         </tr>
         <tr>
           <td colspan="7" height="50px" style="font-size: 30px;font-weight: 600;margin:2rem 0px;font-family: Arial, sans-serif; " align="center"><img  style="width: 200px;" src="cid:myimagecid"></td>
         </tr>`;

  html2 = `<tr>
    <td colspan="7" >
        <h4 style="color: #868686;font-weight: 600;font-size: 17px;font-family: Arial, sans-serif;"> By Team ${process.env.title}</h4>
    </td>
  </tr>

</table>
</body>

</html>`;
  constructor(
    @InjectSendGrid() private readonly client: SendGridService,
    @InjectRepository(MaillogRepository)
    private readonly maillogRepository: MaillogRepository = null,
  ) {}

  async passwordResetMail(Email, link) {
    try {
      const body =
        'Hi\nYou requested to reset your password.\nPlease, click the link below to reset your password\n';

      await this.client.send({
        to: Email,
        from: process.env.FromMail,
        subject: `${process.env.title} Reset password`,
        text: body,
        attachments: this.data,
        html:
          this.html1 +
          `
          <tr>
           <td colspan="7" height="70px" style="font-size: 30px;font-weight: 600;margin:2rem 0px;font-family: Arial, sans-serif;">
           Reset password
           </td>
         </tr>
         <tr>

             <p style="list-style: none;line-height: 30px;font-size: 17px;color:#858399;margin:0px 0px 15px;font-family: Arial, sans-serif;">
             Hi
             </p>
             <p style="list-style: none;line-height: 30px;font-size: 17px;color:#858399;margin:0px 0px 15px;font-family: Arial, sans-serif;">
             You requested to reset your password.
             </p>
             <p style="list-style: none;line-height: 30px;font-size: 17px;color:#858399;margin:0px 0px 15px;font-family: Arial, sans-serif;">
             Please, click the link below to reset your password
             </p>
             <p style="list-style: none;line-height: 30px;font-size: 17px;color:#858399;margin:0px 0px 15px;font-family: Arial, sans-serif;">
             <a href="${link}">Reset Password</a>
             </p>

              </td>
         </tr>
            ` +
          this.html2,
      });
    } catch (e) {
      throw new HttpException(
        {
          status: e.status,
          error: e.message,
        },
        e.status,
      );
    }
  }

  async sendOtp(email, otp) {
    try {
      const body = `
      <h2>${process.env.title}</h2>
      <p>To authenticate, please use the following One Time Password(OTP).</p>
      <h3>${otp}</h3>
      <p>This OTP is valid for only 5 min.</p>
      <p>Thank you</p>
      `;
      await this.client.send({
        to: email,
        from: process.env.FromMail,
        subject: `${process.env.title} Login Auth`,
        text: body,
        attachments: this.data,
        html:
          this.html1 +
          `
          <tr>
           <td colspan="7" height="70px" style="font-size: 30px;font-weight: 600;margin:2rem 0px;font-family: Arial, sans-serif;">
           ${process.env.title}
           </td>
         </tr>
         <tr>

             <p style="list-style: none;line-height: 30px;font-size: 17px;color:#858399;margin:0px 0px 15px;font-family: Arial, sans-serif;">
             To authenticate, please use the following One Time Password(OTP).
             </p>
             <p style="list-style: none;line-height: 30px;font-size: 17px;color:#858399;margin:0px 0px 15px;font-family: Arial, sans-serif;">
             ${otp}
             </p>
             <p style="list-style: none;line-height: 30px;font-size: 17px;color:#858399;margin:0px 0px 15px;font-family: Arial, sans-serif;">
             This OTP is valid for only 5 min.
             </p>
             <p style="list-style: none;line-height: 30px;font-size: 17px;color:#858399;margin:0px 0px 15px;font-family: Arial, sans-serif;">
             Thank you
             </p>

              </td>
         </tr>
            ` +
          this.html2,
      });
    } catch (e) {
      throw new HttpException(
        {
          status: e.status,
          error: e.message,
        },
        e.status,
      );
    }
  }

  async payment(Email, amount, status, TransactionId) {
    try {
      const body =
        process.env.title +
        ' Payment\nTransactionId: ' +
        TransactionId +
        '\nAmount : ' +
        amount +
        '\nPayment ' +
        status +
        '\n';
      await this.client.send({
        to: Email,
        from: process.env.FromMail,
        subject: `${process.env.title} Payment`,
        text: body,
        attachments: this.data,
        html:
          this.html1 +
          `
          <tr>
           <td colspan="7" height="70px" style="font-size: 30px;font-weight: 600;margin:2rem 0px;font-family: Arial, sans-serif;">
           ${process.env.title} Payment
           </td>
         </tr>
         <tr>

         <p list-style: none;line-height: 30px;font-size: 17px;color:#858399;margin:0px 0px 15px;font-family: Arial, sans-serif;>TransactionId: ${TransactionId}</p>
         <p list-style: none;line-height: 30px;font-size: 17px;color:#858399;margin:0px 0px 15px;font-family: Arial, sans-serif;>Amount : $${amount}</p>
         <p list-style: none;line-height: 30px;font-size: 17px;color:#858399;margin:0px 0px 15px;font-family: Arial, sans-serif;>Payment ${status}</p>

              </td>
         </tr>
            ` +
          this.html2,
      });
    } catch (e) {
      throw new HttpException(
        {
          status: e.status,
          error: e.message,
        },
        e.status,
      );
    }
  }

  async sendContinueLink(loanId, email, link, firstName) {
    try {
      const emailBody = `
      <!doctype html>
        <html lang="en">
           <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
              <title></title>
              <style>
                .button {
                  background-color: #00b6d6;
                  border: none;
                  color: #fff!important;
                  padding: 15px 32px;
                  text-align: center;
                  text-decoration: none;
                  display: inline-block;
                  border-radius: 4px;
                  font-size: 16px;
                  margin: 4px 2px;
                  cursor: pointer;
                }
              </style>
           </head>
           <body style="margin: 0px;">
              <table style="background-color: #fff;padding: 20px;width: 100%;border-spacing: 0px;">

                  <tr>
                    <td style="text-align: right;font-size: 16px;font-family: Arial, sans-serif;line-height: 22px;color: #000;text-decoration: underline;">Contact Us <span style="color:#00b6d6;padding:0px 5px ;">|</span> <span style="font-weight:bold;">213 833 3050 </span></td>
                 </tr>
                 <tr>
                   <td style="text-align: center;padding-bottom: 20px;">
                     <img src="https://credit-corp.alchemylms.com/assets/logo.svg">
                   </td>
                 </tr>

                 <tr>
                   <td>
                     <p style="font-size: 16px;font-family: Arial, sans-serif;line-height: 22px;color: #000;margin-top: 0px;margin-bottom: 16px;">Hi <span>${firstName}</span>!</p>
                     <p style="font-size: 16px;font-family: Arial, sans-serif;line-height: 22px;color: #000;margin-top: 0px;margin-bottom: 16px;">Click Below to Complete Your Application!</p>
                     <p style="font-size: 16px;font-family: Arial, sans-serif;line-height: 22px;color: #000;margin-top: 0px;margin-bottom: 16px;"><h3><a class="button" href="${link}" target="_blank">Continue</a></h3></p>
                  </td>
                 </tr>
                 <tr>
                 <td>
                  <p style="font-size: 16px;font-family: Arial, sans-serif;line-height: 22px;color: #000;margin-top: 0px;margin-bottom: 16px;">Regards,</p>

                  <h4 style="font-size: 16px;font-family: Arial, sans-serif;line-height: 22px;color: #000;margin-top: 0px;margin-bottom: 16px;">The Wallet Wizard Team</h4>

                  <p style="font-size: 16px;font-family: Arial, sans-serif;line-height: 22px;color: #000;margin-top: 0px;margin-bottom: 16px;"> <span style="color:#00b6d6;">T</span> <span style="text-decoration: underline;"> 213 833 3050</span></p>
                  <p style="font-size: 16px;font-family: Arial, sans-serif;line-height: 22px;color: #000;margin-top: 0px;margin-bottom: 16px;"> <span style="color:#00b6d6;">E </span><a href="#">inquiries@walletwizard.com</a></p>
                 </td>
                 </tr>
              <tr>
               <td style="background-color: #00b6d6;color: #fff;padding: 10px;font-size: 16px;font-family: Arial, sans-serif;line-height: 22px;margin-top: 0px;margin-bottom: 16px;">

        This e-mail and any attachments are from Credit Corp and may contain confidential information intended only for the addressee. If you have received this email in error, you must not distribute, disseminate, copy or otherwise rely on this e-mail and must contact us immediately. Credit Corp accepts no liability for any damage or loss arising from its unauthorized use. Credit Corp is a reference to Credit Corp Financial Services Inc. and its subsidiaries listed on this web page.


               </td>
             </tr>
             <tr>
               <td style="background-color:#201447;padding: 10px;">
              <p style="text-align: center;margin: 0px;color: #fff;margin-bottom: 7px;font-size: 16px;font-family: Arial, sans-serif;line-height: 22px;margin-top: 0px;margin-bottom: 16px;">  © Credit Corp Financial Services Inc. trading as Wallet Wizard CI.0004282-H </p>

        <ul style="padding-left: 0px;display: flex;align-items: center;justify-content: center;list-style: none;margin: 0px;">
          <li style="padding-right: 20px;"><a href="#" style="color: #fff;font-size: 14px;font-family: Arial, sans-serif;line-height: 22px;margin-top: 0px;margin-bottom: 10px;">Terms & Conditions</a></li>
          <li style="padding-right: 20px;color: #fff;"><a href="#" style="color: #fff;font-size: 14px;font-family: Arial, sans-serif;line-height: 22px;margin-top: 0px;margin-bottom: 10px;">Privacy Notice</a></li>
          <li style="color: #fff;"><a href="#" style="color: #fff;font-size: 14px;font-family: Arial, sans-serif;line-height: 22px;margin-top: 0px;margin-bottom: 10px;">Electronic Communications Agreement </a></li>
        </ul>


               </td>
             </tr>

              </table>
        </body>

        </html>
      `;

      await this.client.send({
        to: email,
        from: process.env.FromMail,
        subject: 'Complete Your Application',
        html: emailBody,
      });
      this.maillogs(loanId, email, 'Complete Your Application', emailBody);
    } catch (e) {
      throw new HttpException(
        {
          status: e.status,
          error: e.message,
        },
        e.status,
      );
    }
  }

  async maillogs(loanId, email, subject, body = null) {
    try {
      const maillogen = new MaillogEntity();
      maillogen.body = body;
      maillogen.email = email;
      maillogen.subject = subject;
      maillogen.loan_id = loanId;
      await this.maillogRepository.save(maillogen);
    } catch (e) {
      throw new HttpException(
        {
          status: e.status,
          error: e.message,
        },
        e.status,
      );
    }
  }
}
