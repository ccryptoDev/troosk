import { HttpException, Injectable } from '@nestjs/common';
import { InjectSendGrid, SendGridService } from '@ntegral/nestjs-sendgrid';
import { getManager } from 'typeorm';
import { MaillogRepository } from '../repository/maillog.repository';
import { MaillogEntity } from '../entities/maillog.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { config } from 'dotenv';
import { CustomerRepository } from '../repository/customer.repository';
import { CustomerEntity } from '../entities/customer.entity';
config();

@Injectable()
export class MailService {
  constructor(
    @InjectSendGrid() private readonly client: SendGridService,
    @InjectRepository(MaillogRepository)
    private readonly maillogRepository: MaillogRepository = null,
  ) {}

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

  async inviteEmail(Email, password, url) {
    const body =
      'Email:' +
      Email +
      '\nPassword:' +
      password +
      '\nVerify To Your Email:' +
      url;
    try {
      await this.client.send({
        to: Email,
        from: process.env.FromMail,
        subject: 'InfinityEnergy Invite Link',
        text: body,
        html: `
            <table style="text-align:left;">
      <tr>
      <th >Email</th>
      <td>:</td>
      <td>${Email}</td>
      </tr>
      <tr>
      <th>password</th>
      <td>:</td>
      <td>${password}</td>
      </tr>
      <tr>
      <td colspan="3"><a href="${url}">Verify To Your Email</a></td>
      </tr>
      </table>
            `,
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

  async add(Email, password, url) {
    const body =
      'Email:' +
      Email +
      '\nPassword:' +
      password +
      '\nVerify To Your Email:' +
      url;
    try {
      await this.client.send({
        to: Email,
        from: process.env.FromMail,
        subject: 'troosk Login Details',
        text: body,
        html: `
            <table style="text-align:left;">
      <tr>
      <th >Email</th>
      <td>:</td>
      <td>${Email}</td>
      </tr>
      <tr>
      <th>password</th>
      <td>:</td>
      <td>${password}</td>
      </tr>
      <tr>
      <td colspan="3"><a href="${url}">Click To Login</a></td>
      </tr>
      </table>
            `,
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

  async mail(id: string, purposeOfTheMail: string, customer: CustomerEntity) {
    let emailFooter = '';
    let body = '';

    // TODO double check we still need this
    //
    //  if (purposeOfTheMail === 'Invite') {
    //    body = ` <div class="emailBodyMessage">
    //      Congratulations!After revisiting our initial decision,you have new offer from troosk<br><br><br/>
    //     <table align="center" cellpadding="0" cellspacing="0" width="80%" >
    //         <tr>
    //             <td align="center" valign="top">
    //                 <table border="1" cellpadding="0" cellspacing="0" width="100%" class="wrapper">
    //                     <tbody>
    //                         <tr>
    //                             <td align="center" valign="top">
    //                                 Financing Amount
    //                             </td>
    //                             <td align="center" valign="top">
    //                                 ${customer.loanAmount}
    //                             </td>
    //                         </tr>
    //                         <tr>
    //                             <td align="center" valign="top">
    //                                 Monthly Payment
    //                             </td>
    //                             <td align="center" valign="top">
    //                             ${customer.monthlyPayment}
    //
    //                             </td>
    //                         </tr>
    //                         <tr>
    //                             <td align="center" valign="top">
    //                                 APR
    //                             </td>
    //                             <td align="center" valign="top">
    //                             ${customer.apr}%
    //                             </td>
    //                         </tr>
    //                         <tr>
    //                             <td align="center" valign="top">
    //                                 Number of payments
    //                             </td>
    //                             <td align="center" valign="top">
    //                             ${customer.loanTerm}
    //                             </td>
    //                         </tr>
    //                     </tbody>
    //                 </table>
    //             </td>
    //         </tr>
    //     </table>
    //
    // </div>`;
    //    emailFooter = `<div class="emailBodyMessage">
    //            <h3 style="font-weight: bold; font-size: 22px">Please complete the next steps on your loan application by clicking the link below.</h3>
    //            <div style="text-align:center">
    //                  <a class="button" href="${process.env.StagingURL}review/${id}">click here</a>
    //                  <br>OR<br>
    //                  <a  href="${process.env.StagingURL}review/${id}">${process.env.StagingURL}review/${id}</a>
    //            </div>
    //            </div>`;
    //  } else if (purposeOfTheMail === 'Welcome') {
    //    body = ` <div class="emailBodyMessage">
    //      Congratulations!After revisiting our initial decision,you have new offer from troosk<br><br><br/>
    //     <table align="center" cellpadding="0" cellspacing="0" width="80%" >
    //         <tr>
    //             <td align="center" valign="top">
    //                 <table border="1" cellpadding="0" cellspacing="0" width="100%" class="wrapper">
    //                     <tbody>
    //                         <tr>
    //                             <td align="center" valign="top">
    //                                 Financing Amount
    //                             </td>
    //                             <td align="center" valign="top">
    //                                 ${customer.loanAmount}
    //                             </td>
    //                         </tr>
    //                         <tr>
    //                             <td align="center" valign="top">
    //                                 Monthly Payment
    //                             </td>
    //                             <td align="center" valign="top">
    //                             ${customer.monthlyPayment}
    //
    //                             </td>
    //                         </tr>
    //                         <tr>
    //                             <td align="center" valign="top">
    //                                 APR
    //                             </td>
    //                             <td align="center" valign="top">
    //                             ${customer.apr}%
    //                             </td>
    //                         </tr>
    //                         <tr>
    //                             <td align="center" valign="top">
    //                                 Number of payments
    //                             </td>
    //                             <td align="center" valign="top">
    //                             ${customer.loanTerm}
    //                             </td>
    //                         </tr>
    //                     </tbody>
    //                 </table>
    //             </td>
    //         </tr>
    //     </table>
    //
    // </div>`;
    //    emailFooter = '';
    //  } else if (purposeOfTheMail === 'Pending') {
    //    body = `<p><center>Your application is completed and is now pending underwriter approval</center></p>`;
    //    emailFooter = '';
    //  } else if (purposeOfTheMail === 'Plaid Relogin') {
    //    body = '';
    //    emailFooter = `<div class="emailBodyMessage">
    //            <h3 style="font-weight: bold; font-size: 22px">Please complete the next steps on your loan application by clicking the link below.</h3>
    //            <div style="text-align:center">
    //                  <a class="button" href="${process.env.StagingURL}review/${id}">Connect Your Bank</a>
    //                  <br>OR<br>
    //                  <a  href="${process.env.StagingURL}review/${id}">${process.env.StagingURL}review/${id}</a>
    //            </div>
    //            </div>`;
    //  } else

    if (purposeOfTheMail === 'PromissoryNote') {
      body = '';
      emailFooter = `<div class="emailBodyMessage">
              <h3 style="font-weight: bold; font-size: 22px">Please complete the next steps on your loan application by clicking the link below.</h3>
              <div style="text-align:center">
                    <a class="button" href="${process.env.StagingURL}review/${id}">Contract Signature</a>
                    <br>OR<br>
                    <a  href="${process.env.StagingURL}review/${id}">${process.env.StagingURL}review/${id}</a>
              </div>
              </div>`;
    }

    await this.client.send({
      to: customer.email,
      from: process.env.FromMail,
      subject: 'troosk Invite Link',

      html: `<html style="margin: 0;padding: 0;" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="viewport" content="width=device-width" />
  <style>
      .wrapper {
          border: 5px solid #eee;
          border-radius: 5px;
      }
      .emailHeader {
          width: auto;
          background-color: #002f6c;
          color: #FFF;
          height: 90px;
          max-height: 90px;
          text-align: center;
          padding: 10px;
          border-bottom: 4px solid #eb0029;
          font-size: 150%;
      }
      .practiceHeaderName {
          text-align: center;
          color: #FFF;
          font-size: 190%;
      }
      .button {
        background-color: #008CBA;
        border: none;
        color: white !important;
        padding: 15px 32px;
        text-align: center;
        text-decoration: none;
        display: inline-block;
        font-size: 16px;
        margin: 4px 2px;
        cursor: pointer;
      }
      .emailLogo {
          height: 40px;
          max-height: 40px;
          width: auto;
          margin-top: 5px;
          margin-bottom: 5px;
          color: rgb(47,97,183);
          font-size: 30px;
          font-weight: 700;
      }
      .emailLayout {
          margin: 0 auto;
          max-width: 600px;
          min-width: 320px;
          width: auto;
          overflow-wrap: break-word;
          word-wrap: break-word;
          word-break: break-word;
      }
      .emailLayoutMargins {
          margin-bottom: 50px;
      }
      .emailSignature {
          margin-top: 30px;
          text-align: center;
          color: #60666d;
          font-size: 16px;
      }
      .emailBodyOuterDiv {
          color: #60666d;
          font-size: 16px;
          text-align: center;
      }
      .emailGreetings {
          margin-bottom: 30px;
          font-style: normal;
          font-weight: normal;
          color: #60666d;
          font-size: 20px;
          text-align: center;
      }
      .btn-application {
          font-size: 14px;
          webkit-font-smoothing: antialiased;
          cursor: pointer;
          -moz-user-select: none;
          -webkit-user-select: none;
          -o-user-select: none;
          user-select: none;
          display: inline-block;
          font-weight: normal;
          text-align: center;
          text-decoration: none;
          -moz-transition: all .4s ease;
          -webkit-transition: all .4s ease;
          -o-transition: all .4s ease;

          background-color: #002f6c;

          border-radius: 6px;
          border-width: 0px;
          color: rgb(255,255,255);
          font-family: sans-serif;
          height: auto;
          transition: all .4s ease;
          padding: 8px 20px;
          text-shadow: none;
          width: auto;
          line-height: 1.5em;
      }
      .emailBold {
          font-weight: 700;
      }

  table, th, td {
    border: 1px solid black;
  }
  td {
    padding: 5px;
  }
  table {
    margin: auto;
    width: 70%;
    border-collapse: collapse;
  }
  p {
    text-align: left;
    color: #60666d;
  }
  </style>
  <style>
      @media (max-width: 721px) {
          .emailHeader {
              max-height: 700px;
          }
          .modernHealthName {
              font-size: 50%;
          }
          .practiceHeaderName {
              font-size: 80%;
          }
      }
  </style>
</head>

<div class="wrapper">
  <div class="emailHeader">
      <div class="emailHeaderLogo">
          <span class="modernHealthName">troosk</span>
      </div>

  </div>
  <div class="emailLayout">
      <div class="emailLayoutMargins">
          <div class="emailBodyOuterDiv">
      <h2 class="emailGreetings">Hi ${customer.firstName} ${customer.middleName} ${customer.lastName}</h2>
  </div>
            ${body}
            ${emailFooter}
          <div class="emailSignature">
              Thank you,<br /><br>
             ${process.env.HelpMail}
          </div>
      </div>
  </div>
</div>
</html>`,
    });
  }

  async sendOtp(email, otp, firstName, loanId = null) {
    try {
      const emailBody = `
      <!doctype html>
        <html lang="en">
           <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
              <title></title>
           </head>
           <body style="margin: 0px;">
              <table style="background-color: #fff;padding: 20px;width: 100%;border-spacing: 0px;">

                  <tr>
                    <td style="text-align: right;font-size: 16px;font-family: Arial, sans-serif;line-height: 22px;color: #000;text-decoration: underline;">Contact Us <span style="color:#00b6d6;padding:0px 5px ;">|</span> <span style="font-weight:bold;">213 833 3050 </span></td>
                 </tr>
                 <tr>
                   <td style="text-align: center;padding-bottom: 20px;">
                     <img src="https://troosk.alchemylms.com/assets/logo.svg">
                   </td>
                 </tr>

                 <tr>
                   <td>
                     <p style="font-size: 16px;font-family: Arial, sans-serif;line-height: 22px;color: #000;margin-top: 0px;margin-bottom: 16px;">Hi <span>${firstName}</span> !</p>
                     <p style="font-size: 16px;font-family: Arial, sans-serif;line-height: 22px;color: #000;margin-top: 0px;margin-bottom: 16px;">To authenticate, please use the following One Time Password(OTP).</p>
                     <p style="font-size: 16px;font-family: Arial, sans-serif;line-height: 22px;color: #000;margin-top: 0px;margin-bottom: 16px;"><h3>${otp}</h3></p>
                  </td>
                 </tr>
                 <tr>
                 <td>
                  <p style="font-size: 16px;font-family: Arial, sans-serif;line-height: 22px;color: #000;margin-top: 0px;margin-bottom: 16px;">Regards,</p>

                  <h4 style="font-size: 16px;font-family: Arial, sans-serif;line-height: 22px;color: #000;margin-top: 0px;margin-bottom: 16px;">Troosk Team</h4>

                  <p style="font-size: 16px;font-family: Arial, sans-serif;line-height: 22px;color: #000;margin-top: 0px;margin-bottom: 16px;"> <span style="color:#00b6d6;">T</span> <span style="text-decoration: underline;">000000000</span></p>
                  <p style="font-size: 16px;font-family: Arial, sans-serif;line-height: 22px;color: #000;margin-top: 0px;margin-bottom: 16px;"> <span style="color:#00b6d6;">E </span><a href="#">info@troosk.com</a></p>
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

      return await this.client.send({
        to: email,
        from: process.env.FromMail,
        subject: 'Troosk Login Auth',
        html: emailBody,
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

  async passwordResetMail(Email, link) {
    try {
      const body =
        'Hi\nYou requested to reset your password.\nPlease, click the link below to reset your password\n';

      await this.client.send({
        to: Email,
        from: process.env.FromMail,
        subject: 'troosk Reset password',
        text: body,
        html: `
            <p>Hi</p>
            <p>You requested to reset your password.</p>
            <p>Please, click the link below to reset your password</p>
            <a href="${link}">Reset Password</a>
            `,
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

  async invitePromissoryNote(email, html) {
    try {
      const body = `
      <h2>troosk</h2>
      <p>To Read the following contents and sign the promisssory note.</p>
      <h3>${html}</h3>
      <p>Thank you</p>
      `;
      await this.client.send({
        to: email,
        from: process.env.FromMail,
        subject: 'troosk Promissory Note',
        text: body,
        html: `
        <h2>troosk</h2>
        <p>To Read the following contents and sign the promisssory note.</p>
        <h3>${html}</h3>
        <p>Thank you</p>
            `,
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

  async sendCommentToCustomer(id, userEmail, subject, comment) {
    const emailFooter = '';
    const body = ` <div class="emailBodyMessage">
       <table align="center" cellpadding="0" cellspacing="0" width="80%" >
           <tr>
               <td align="center" valign="top">
                   <table border="1" cellpadding="0" cellspacing="0" width="100%" class="wrapper">
                       <tbody>
                           <tr>
                               <td align="center" valign="top">
                                   Subject
                               </td>
                               <td align="center" valign="top">
                                   ${subject}
                               </td>
                           </tr>
                           <tr>
                               <td align="center" valign="top">
                                   Comment
                               </td>
                               <td align="center" valign="top">
                               ${comment}

                               </td>
                           </tr>

                       </tbody>
                   </table>
               </td>
           </tr>
       </table>

   </div>`;
    const entityManager = getManager();
    try {
      const rawdata = await entityManager.query(
        "SELECT * FROM tblcustomer WHERE loan_id = '" + id + "'",
      );
      await this.client.send({
        to: userEmail,
        from: process.env.FromMail,
        subject: 'troosk Info',
        text: body,
        // attachments: this.data,
        html: `
      <html style="margin: 0;padding: 0;" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="viewport" content="width=device-width" />
  <style>
      .wrapper {
          border: 5px solid #eee;
          border-radius: 5px;
      }
      .emailHeader {
          width: auto;
          background-color: #002f6c;
          color: #FFF;
          height: 90px;
          max-height: 90px;
          text-align: center;
          padding: 10px;
          border-bottom: 4px solid #eb0029;
          font-size: 150%;
      }
      .practiceHeaderName {
          text-align: center;
          color: #FFF;
          font-size: 190%;
      }
      .button {
        background-color: #008CBA;
        border: none;
        color: white !important;
        padding: 15px 32px;
        text-align: center;
        text-decoration: none;
        display: inline-block;
        font-size: 16px;
        margin: 4px 2px;
        cursor: pointer;
      }
      .emailLogo {
          height: 40px;
          max-height: 40px;
          width: auto;
          margin-top: 5px;
          margin-bottom: 5px;
          color: rgb(47,97,183);
          font-size: 30px;
          font-weight: 700;
      }
      .emailLayout {
          margin: 0 auto;
          max-width: 600px;
          min-width: 320px;
          width: auto;
          overflow-wrap: break-word;
          word-wrap: break-word;
          word-break: break-word;
      }
      .emailLayoutMargins {
          margin-bottom: 50px;
      }
      .emailSignature {
          margin-top: 30px;
          text-align: center;
          color: #60666d;
          font-size: 16px;
      }
      .emailBodyOuterDiv {
          color: #60666d;
          font-size: 16px;
          text-align: center;
      }
      .emailGreetings {
          margin-bottom: 30px;
          font-style: normal;
          font-weight: normal;
          color: #60666d;
          font-size: 20px;
          text-align: center;
      }
      .btn-application {
          font-size: 14px;
          webkit-font-smoothing: antialiased;
          cursor: pointer;
          -moz-user-select: none;
          -webkit-user-select: none;
          -o-user-select: none;
          user-select: none;
          display: inline-block;
          font-weight: normal;
          text-align: center;
          text-decoration: none;
          -moz-transition: all .4s ease;
          -webkit-transition: all .4s ease;
          -o-transition: all .4s ease;

          background-color: #002f6c;

          border-radius: 6px;
          border-width: 0px;
          color: rgb(255,255,255);
          font-family: sans-serif;
          height: auto;
          transition: all .4s ease;
          padding: 8px 20px;
          text-shadow: none;
          width: auto;
          line-height: 1.5em;
      }
      .emailBold {
          font-weight: 700;
      }

  table, th, td {
    border: 1px solid black;
  }
  td {
    padding: 5px;
  }
  table {
    margin: auto;
    width: 70%;
    border-collapse: collapse;
  }
  p {
    text-align: left;
    color: #60666d;
  }
  </style>
  <style>
      @media (max-width: 721px) {
          .emailHeader {
              max-height: 700px;
          }
          .modernHealthName {
              font-size: 50%;
          }
          .practiceHeaderName {
              font-size: 80%;
          }
      }
  </style>
</head>

<div class="wrapper">
  <div class="emailHeader">
      <div class="emailHeaderLogo">
          <span class="modernHealthName">troosk</span>
      </div>

  </div>
  <div class="emailLayout">
      <div class="emailLayoutMargins">
          <div class="emailBodyOuterDiv">
      <h2 class="emailGreetings">Hi ${rawdata[0].firstName} ${rawdata[0].middleName} ${rawdata[0].lastName}</h2>
  </div>
            ${body}
            ${emailFooter}
          <div class="emailSignature">
              Thank you,<br /><br>
             ${process.env.HelpMail}
          </div>
      </div>
  </div>
</div>
</html> `,
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
  // async maillogs(loan_id,email,subject,body=null){
  //   try{
  //     let maillogen = new MaillogEntity()
  //     maillogen.body = body;
  //     maillogen.email = email;
  //     maillogen.subject = subject;
  //     maillogen.loan_id = loan_id;
  //     await this.maillogRepository.save(maillogen)
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }
}
