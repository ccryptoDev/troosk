export const getLoanAgreement = (
  { customerInfo, bankDetails, loanDetails, amortizationSchedule },
  loanId,
  endDate,
) => {
  const part1 = `
<h1 style='margin-top:0cm;margin-right:0cm;margin-bottom:6.0pt;margin-left:0cm;text-align:center;font-size:16px;font-family:"Times New Roman",serif;'><strong><span style='font-size:13px;font-family:"Arial Bold",serif;color:black;'>CREDIT AVAILABILITY DISCLOSURE AND ACCOUNT AGREEMENT</span></strong></h1>
<table style="width: 83%; margin-left: calc(5%); border-collapse: collapse; border: none; margin-right: calc(12%);">
    <tbody>
        <tr>
            <td style="width: 46.2434%; border: 1pt solid windowtext; padding: 0cm 5.4pt; vertical-align: top;">
                <p style='margin-top:0cm;margin-right:0cm;margin-bottom:6.0pt;margin-left:0cm;text-align:left;font-size:16px;font-family:"Times New Roman",serif;'><strong><u><span style='font-size:12px;font-family:"Arial Bold",serif;color:black;'>Lender</span></u></strong></p>
                <p style='margin-top:0cm;margin-right:0cm;margin-bottom:.0001pt;margin-left:0cm;text-align:left;font-size:16px;font-family:"Times New Roman",serif;'><strong><span style='font-size:12px;font-family:"Arial Bold",serif;color:black;'>Troosk, Inc.</span></strong></p>
                <p style='margin-top:0cm;margin-right:0cm;margin-bottom:.0001pt;margin-left:0cm;text-align:left;font-size:16px;font-family:"Times New Roman",serif;'><strong><span style='font-size:12px;font-family:"Arial Bold",serif;color:black;'>Address: 81 Lancaster Ave, Suite 312, Malvern, PA 19355</span></strong></p>
                <p style='margin-top:0cm;margin-right:0cm;margin-bottom:.0001pt;margin-left:0cm;text-align:left;font-size:16px;font-family:"Times New Roman",serif;'><strong><span style='font-size:12px;font-family:"Arial Bold",serif;color:black;'>&nbsp;</span></strong></p>
                <p style='margin-top:0cm;margin-right:0cm;margin-bottom:.0001pt;margin-left:0cm;text-align:left;font-size:16px;font-family:"Times New Roman",serif;'><strong><span style='font-size:12px;font-family:"Arial Bold",serif;color:black;'>&nbsp;</span></strong></p>
                <p style='margin-top:0cm;margin-right:0cm;margin-bottom:.0001pt;margin-left:0cm;text-align:left;font-size:16px;font-family:"Times New Roman",serif;'><strong><span style='font-size:12px;font-family:"Arial Bold",serif;color:black;'>Phone: (484) 320-8541</span></strong></p>
                <p style='margin-top:0cm;margin-right:0cm;margin-bottom:.0001pt;margin-left:0cm;text-align:left;font-size:16px;font-family:"Times New Roman",serif;'><strong><span style='font-size:12px;font-family:"Arial Bold",serif;color:black;'>Fax: (484) 723-4066 &nbsp;</span></strong></p>
                <p style='margin-top:0cm;margin-right:0cm;margin-bottom:.0001pt;margin-left:0cm;text-align:left;font-size:16px;font-family:"Times New Roman",serif;'><strong><span style='font-size:12px;font-family:"Arial Bold",serif;color:black;'>Website: www.troosk.com</span></strong></p>
            </td>
            <td style="width: 53.6247%; border-top: 1pt solid windowtext; border-right: 1pt solid windowtext; border-bottom: 1pt solid windowtext; border-image: initial; border-left: none; padding: 0cm 5.4pt; vertical-align: top;">
                <p style='margin-top:0cm;margin-right:0cm;margin-bottom:6.0pt;margin-left:0cm;text-align:left;font-size:16px;font-family:"Times New Roman",serif;'><strong><u><span style='font-size:12px;font-family:"Arial Bold",serif;color:black;'>Borrower</span></u></strong></p>
                <p style='margin-top:0cm;margin-right:0cm;margin-bottom:6.0pt;margin-left:0cm;text-align:left;font-size:16px;font-family:"Times New Roman",serif;'><strong><span style='font-size:12px;font-family:"Arial Bold",serif;color:black;'>Name: ${
                  customerInfo.name
                }</span></strong></p>
                <p style='margin-top:0cm;margin-right:0cm;margin-bottom:6.0pt;margin-left:0cm;text-align:left;font-size:16px;font-family:"Times New Roman",serif;'><strong><span style='font-size:12px;font-family:"Arial Bold",serif;color:black;'>Address: ${
                  customerInfo.address
                }</span></strong></p>
                <p style='margin-top:0cm;margin-right:0cm;margin-bottom:6.0pt;margin-left:0cm;text-align:left;font-size:16px;font-family:"Times New Roman",serif;'><strong><span style='font-size:12px;font-family:"Arial Bold",serif;color:black;'>Phone: ${
                  customerInfo.phone
                }</span></strong></p>
                <p style='margin-top:0cm;margin-right:0cm;margin-bottom:6.0pt;margin-left:0cm;text-align:left;font-size:16px;font-family:"Times New Roman",serif;'><strong><span style='font-size:12px;font-family:"Arial Bold",serif;color:black;'>&nbsp;</span></strong></p>
            </td>
        </tr>
        <tr>
            <td style="width: 46.2434%; border-right: 1pt solid windowtext; border-bottom: 1pt solid windowtext; border-left: 1pt solid windowtext; border-image: initial; border-top: none; padding: 0cm 5.4pt; vertical-align: top;">
                <p style='margin-top:0cm;margin-right:0cm;margin-bottom:6.0pt;margin-left:0cm;text-align:left;font-size:16px;font-family:"Times New Roman",serif;'><strong><u><span style='font-size:12px;font-family:"Arial Bold",serif;color:black;'>Loan Number</span></u></strong><strong><span style='font-size:12px;font-family:"Arial Bold",serif;color:black;'> ${loanId}</span></strong></p>
            </td>
            <td style="width: 53.6247%; border-top: none; border-left: none; border-bottom: 1pt solid windowtext; border-right: 1pt solid windowtext; padding: 0cm 5.4pt; vertical-align: top;">
                <p style='margin-top:0cm;margin-right:0cm;margin-bottom:6.0pt;margin-left:0cm;text-align:left;font-size:16px;font-family:"Times New Roman",serif;'><strong><u><span style='font-size:12px;font-family:"Arial Bold",serif;color:black;'>Date</span></u></strong><strong><span style='font-size:12px;font-family:"Arial Bold",serif;color:black;'>: ${
                  loanDetails.date
                }</span></strong></p>
            </td>
        </tr>
    </tbody>
</table>
<p style='margin-top:0cm;margin-right:0cm;margin-bottom:6.0pt;margin-left:0cm;text-align:center;font-size:16px;font-family:"Times New Roman",serif;'><strong><span style='font-size:13px;font-family:"Arial Bold",serif;color:black;'>&nbsp;</span></strong></p>
<p style='margin-top:0cm;margin-right:0cm;margin-bottom:6.0pt;margin-left:0cm;text-align:center;font-size:16px;font-family:"Times New Roman",serif;'><span style='font-size:13px;font-family:"Arial",sans-serif;'>TRUTH-IN-LENDING DISCLOSURES</span></p>
<table style="width: 91%; margin-left: calc(3%); border-collapse: collapse; border: none; margin-right: calc(6%);">
    <tbody>
        <tr>
            <td style="width: 517.4pt;border: 1pt solid windowtext;padding: 0cm 5.4pt;height: 123.65pt;vertical-align: top;">
                <p style='margin-top:0cm;margin-right:0cm;margin-bottom:6.0pt;margin-left:0cm;text-align:justify;font-size:16px;font-family:"Times New Roman",serif;'><span style='font-size:13px;font-family:"Arial",sans-serif;'>&nbsp;</span></p>
                <table style="width: 97%; margin-left: 0.55pt; border-collapse: collapse; border: none; margin-right: calc(3%);">
                    <tbody>
                        <tr>
                            <td style="width: 128.25pt;border: 2.25pt solid windowtext;background: rgb(208, 206, 206);padding: 0cm 5.4pt;height: 109.35pt;vertical-align: top;">
                                <p style='margin-top:0cm;margin-right:0cm;margin-bottom:6.0pt;margin-left:0cm;text-align:center;font-size:16px;font-family:"Times New Roman",serif;'><strong><span style='font-size:13px;font-family:"Arial",sans-serif;'>ANNUAL PERCENTAGE</span></strong></p>
                                <p style='margin-top:0cm;margin-right:0cm;margin-bottom:6.0pt;margin-left:0cm;text-align:center;font-size:16px;font-family:"Times New Roman",serif;'><strong><span style='font-size:13px;font-family:"Arial",sans-serif;'>RATE</span></strong></p>
                                <p style='margin-top:0cm;margin-right:0cm;margin-bottom:6.0pt;margin-left:0cm;text-align:left;font-size:16px;font-family:"Times New Roman",serif;'><strong><span style='font-size:13px;font-family:"Arial",sans-serif;'>The cost of your credit as a yearly rate.</span></strong></p>
                                <p style='margin-top:0cm;margin-right:0cm;margin-bottom:6.0pt;margin-left:0cm;text-align:left;font-size:16px;font-family:"Times New Roman",serif;'><strong><span style='font-size:13px;font-family:"Arial",sans-serif;'>&nbsp;</span></strong></p>
                                <p style='margin-top:0cm;margin-right:0cm;margin-bottom:6.0pt;margin-left:0cm;text-align:center;font-size:16px;font-family:"Times New Roman",serif;'><span style='font-size:13px;font-family:"Arial",sans-serif;'>${
                                  loanDetails.apr
                                }%</span></p>
                            </td>
                            <td style="width: 139.5pt;border-top: 2.25pt solid windowtext;border-right: 2.25pt solid windowtext;border-bottom: 2.25pt solid windowtext;border-image: initial;border-left: none;background: rgb(208, 206, 206);padding: 0cm 5.4pt;height: 109.35pt;vertical-align: top;">
                                <p style='margin-top:0cm;margin-right:0cm;margin-bottom:6.0pt;margin-left:0cm;text-align:center;font-size:16px;font-family:"Times New Roman",serif;'><strong><span style='font-size:13px;font-family:"Arial",sans-serif;'>FINANCE</span></strong></p>
                                <p style='margin-top:0cm;margin-right:0cm;margin-bottom:6.0pt;margin-left:0cm;text-align:center;font-size:16px;font-family:"Times New Roman",serif;'><strong><span style='font-size:13px;font-family:"Arial",sans-serif;'>CHARGE</span></strong></p>
                                <p style='margin-top:0cm;margin-right:0cm;margin-bottom:6.0pt;margin-left:0cm;text-align:left;font-size:16px;font-family:"Times New Roman",serif;'><strong><span style='font-size:13px;font-family:"Arial",sans-serif;'>The dollar amount the credit will cost you.</span></strong></p>
                                <p style='margin-top:0cm;margin-right:0cm;margin-bottom:6.0pt;margin-left:0cm;text-align:left;font-size:16px;font-family:"Times New Roman",serif;'><strong><span style='font-size:13px;font-family:"Arial",sans-serif;'>&nbsp;</span></strong></p>
                                <p style='margin-top:0cm;margin-right:0cm;margin-bottom:6.0pt;margin-left:0cm;text-align:center;font-size:16px;font-family:"Times New Roman",serif;'><span style='font-size:13px;font-family:"Arial",sans-serif;'>$${
                                  loanDetails.financeCharge
                                }</span></p>
                            </td>
                            <td style="width: 115pt;border-top: 2.25pt solid windowtext;border-right: 2.25pt solid windowtext;border-bottom: 2.25pt solid windowtext;border-image: initial;border-left: none;padding: 0cm 5.4pt;height: 109.35pt;vertical-align: top;">
                                <p style='margin-top:0cm;margin-right:0cm;margin-bottom:6.0pt;margin-left:0cm;text-align:center;font-size:16px;font-family:"Times New Roman",serif;'><strong><span style='font-size:13px;font-family:"Arial",sans-serif;'>Amount Financed</span></strong></p>
                                <p style='margin-top:0cm;margin-right:0cm;margin-bottom:6.0pt;margin-left:0cm;text-align:left;font-size:16px;font-family:"Times New Roman",serif;'><strong><span style='font-size:13px;font-family:"Arial",sans-serif;'>The amount of credit provided to you or on your behalf.</span></strong></p>
                                <p style='margin-top:0cm;margin-right:0cm;margin-bottom:6.0pt;margin-left:0cm;text-align:center;font-size:16px;font-family:"Times New Roman",serif;'><span style='font-size:13px;font-family:"Arial",sans-serif;'>&nbsp;</span></p>
                                <p style='margin-top:0cm;margin-right:0cm;margin-bottom:6.0pt;margin-left:0cm;text-align:center;font-size:16px;font-family:"Times New Roman",serif;'><span style='font-size:13px;font-family:"Arial",sans-serif;'>$${
                                  loanDetails.amountFinanced
                                }</span></p>
                            </td>
                            <td style="width: 4cm;border-top: 2.25pt solid windowtext;border-right: 2.25pt solid windowtext;border-bottom: 2.25pt solid windowtext;border-image: initial;border-left: none;padding: 0cm 5.4pt;height: 109.35pt;vertical-align: top;">
                                <p style='margin-top:0cm;margin-right:0cm;margin-bottom:6.0pt;margin-left:0cm;text-align:center;font-size:16px;font-family:"Times New Roman",serif;'><strong><span style='font-size:13px;font-family:"Arial",sans-serif;'>Total of Payments</span></strong></p>
                                <p style='margin-top:0cm;margin-right:0cm;margin-bottom:6.0pt;margin-left:0cm;text-align:left;font-size:16px;font-family:"Times New Roman",serif;'><strong><span style='font-size:13px;font-family:"Arial",sans-serif;'>The amount you will have paid after you have made all payments as scheduled.</span></strong></p>
                                <p style='margin-top:0cm;margin-right:0cm;margin-bottom:6.0pt;margin-left:0cm;text-align:left;font-size:16px;font-family:"Times New Roman",serif;'><strong><span style='font-size:13px;font-family:"Arial",sans-serif;'>&nbsp;</span></strong></p>
                                <p style='margin-top:0cm;margin-right:0cm;margin-bottom:6.0pt;margin-left:0cm;text-align:center;font-size:16px;font-family:"Times New Roman",serif;'><span style='font-size:13px;font-family:"Arial",sans-serif;'>$${
                                  loanDetails.totalOfPayments
                                }</span></p>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <p style='margin-top:0cm;margin-right:0cm;margin-bottom:6.0pt;margin-left:0cm;text-align:justify;font-size:16px;font-family:"Times New Roman",serif;'><span style='font-size:13px;font-family:"Arial",sans-serif;'>&nbsp;</span></p>
                <p style='margin-top:0cm;margin-right:0cm;margin-bottom:6.0pt;margin-left:0cm;text-align:justify;font-size:16px;font-family:"Times New Roman",serif;'><span style='font-size:13px;font-family:"Arial",sans-serif;'>Your Payment Schedule will be:</span></p>
                <table style="border-collapse: collapse; border: none; margin-right: calc(10%); width: 85%; margin-left: calc(5%);">
                    <tbody>
                        <tr>
                            <td style="width: 29.5538%; border: 1pt solid windowtext; padding: 0cm 5.4pt; vertical-align: top;">
                                <p style='margin-top:0cm;margin-right:0cm;margin-bottom:6.0pt;margin-left:0cm;text-align:justify;font-size:16px;font-family:"Times New Roman",serif;'><strong><span style='font-size:13px;font-family:"Arial",sans-serif;'>Number of Payments</span></strong></p>
                            </td>
                            <td style="width: 35.6196%; border-top: 1pt solid windowtext; border-right: 1pt solid windowtext; border-bottom: 1pt solid windowtext; border-image: initial; border-left: none; padding: 0cm 5.4pt; vertical-align: top;">
                                <p style='margin-top:0cm;margin-right:0cm;margin-bottom:6.0pt;margin-left:0cm;text-align:justify;font-size:16px;font-family:"Times New Roman",serif;'><strong><span style='font-size:13px;font-family:"Arial",sans-serif;'>Amount of Each Payment</span></strong></p>
                            </td>
                            <td style="width: 34.671%; border-top: 1pt solid windowtext; border-right: 1pt solid windowtext; border-bottom: 1pt solid windowtext; border-image: initial; border-left: none; padding: 0cm 5.4pt; vertical-align: top;">
                                <p style='margin-top:0cm;margin-right:0cm;margin-bottom:6.0pt;margin-left:0cm;text-align:justify;font-size:16px;font-family:"Times New Roman",serif;'><strong><span style='font-size:13px;font-family:"Arial",sans-serif;'>Payment Due Date</span></strong></p>
                            </td>
                        </tr>
                        <tr>
                            <td style="width: 29.5538%; border-right: 1pt solid windowtext; border-bottom: 1pt solid windowtext; border-left: 1pt solid windowtext; border-image: initial; border-top: none; padding: 0cm 5.4pt; height: 22.45pt; vertical-align: top;">
                                <p style='margin-top:0cm;margin-right:0cm;margin-bottom:6.0pt;margin-left:0cm;text-align:center;font-size:16px;font-family:"Times New Roman",serif;'><span style='font-size:13px;font-family:"Arial",sans-serif;'>${
                                  loanDetails.numberOfPayments
                                }</span></p>
                            </td>
                            <td style="width: 35.6196%; border-top: none; border-left: none; border-bottom: 1pt solid windowtext; border-right: 1pt solid windowtext; padding: 0cm 5.4pt; height: 22.45pt; vertical-align: top;">
                                <p style='margin-top:0cm;margin-right:0cm;margin-bottom:6.0pt;margin-left:0cm;text-align:justify;font-size:16px;font-family:"Times New Roman",serif;'><span style='font-size:13px;font-family:"Arial",sans-serif;'>$${
                                  loanDetails.amountOfEachPayment
                                }</span></p>
                            </td>
                            <td style="width: 34.671%; border-top: none; border-left: none; border-bottom: 1pt solid windowtext; border-right: 1pt solid windowtext; padding: 0cm 5.4pt; height: 22.45pt; vertical-align: top;">
                                <p style='margin-top:0cm;margin-right:0cm;margin-bottom:6.0pt;margin-left:0cm;text-align:justify;font-size:16px;font-family:"Times New Roman",serif;'><span style='font-size:13px;font-family:"Arial",sans-serif;'>${
                                  loanDetails.paymentDueDate.dayOfMonth
                                }<sup>th</sup> of every month, through ${endDate}</span></p>
                            </td>
                        </tr>
                        <tr>
                            <td style="width: 29.5538%; border-right: 1pt solid windowtext; border-bottom: 1pt solid windowtext; border-left: 1pt solid windowtext; border-image: initial; border-top: none; padding: 0cm 5.4pt; height: 22.45pt; vertical-align: top;">
                                <p style='margin-top:0cm;margin-right:0cm;margin-bottom:6.0pt;margin-left:0cm;text-align:center;font-size:16px;font-family:"Times New Roman",serif;'><span style='font-size:13px;font-family:"Arial",sans-serif;'>&nbsp;</span></p>
                            </td>
                            <td style="width: 35.6196%; border-top: none; border-left: none; border-bottom: 1pt solid windowtext; border-right: 1pt solid windowtext; padding: 0cm 5.4pt; height: 22.45pt; vertical-align: top;">
                                <p style='margin-top:0cm;margin-right:0cm;margin-bottom:6.0pt;margin-left:0cm;text-align:justify;font-size:16px;font-family:"Times New Roman",serif;'><span style='font-size:13px;font-family:"Arial",sans-serif;'>&nbsp;</span></p>
                            </td>
                            <td style="width: 34.671%; border-top: none; border-left: none; border-bottom: 1pt solid windowtext; border-right: 1pt solid windowtext; padding: 0cm 5.4pt; height: 22.45pt; vertical-align: top;">
                                <p style='margin-top:0cm;margin-right:0cm;margin-bottom:6.0pt;margin-left:0cm;text-align:justify;font-size:16px;font-family:"Times New Roman",serif;'><span style='font-size:13px;font-family:"Arial",sans-serif;'>&nbsp;</span></p>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <p style='margin-top:0cm;margin-right:0cm;margin-bottom:6.0pt;margin-left:0cm;text-align:justify;font-size:16px;font-family:"Times New Roman",serif;'><span style='font-size:13px;font-family:"Arial",sans-serif;'>&nbsp;</span></p>
                <p style='margin-top:0cm;margin-right:0cm;margin-bottom:6.0pt;margin-left:0cm;text-align:justify;font-size:16px;font-family:"Times New Roman",serif;'><span style='font-size:13px;font-family:"Arial",sans-serif;'>Security: &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; This loan is unsecured.</span></p>
                <p style='margin-top:0cm;margin-right:0cm;margin-bottom:6.0pt;margin-left:0cm;text-align:justify;font-size:16px;font-family:"Times New Roman",serif;'><span style='font-size:13px;font-family:"Arial",sans-serif;'>Late Charge: &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; If a payment is more than 10 Business Days late, you will be charged 5% of the past due amount.</span></p>
                <p style='margin-top:0cm;margin-right:0cm;margin-bottom:6.0pt;margin-left:0cm;text-align:justify;font-size:16px;font-family:"Times New Roman",serif;'><span style='font-size:13px;font-family:"Arial",sans-serif;'>Prepayment: &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;If you pay this loan off early you will not have to pay a penalty, however, you may be entitled to a refund of the finance charge.&nbsp;</span></p>
                <p style='margin-top:0cm;margin-right:0cm;margin-bottom:6.0pt;margin-left:0cm;text-align:justify;font-size:16px;font-family:"Times New Roman",serif;'><span style='font-size:13px;font-family:"Arial",sans-serif;'>&nbsp;</span></p>
                <p style='margin-top:0cm;margin-right:0cm;margin-bottom:6.0pt;margin-left:0cm;text-align:justify;font-size:16px;font-family:"Times New Roman",serif;'><span style='font-size:13px;font-family:"Arial",sans-serif;'>See the terms of this Agreement for any additional information about nonpayment, default, prepayment refunds and charges.</span></p>
                <p style='margin-top:0cm;margin-right:0cm;margin-bottom:6.0pt;margin-left:0cm;text-align:justify;font-size:16px;font-family:"Times New Roman",serif;'><span style='font-size:13px;font-family:"Arial",sans-serif;'>&nbsp;</span></p>
            </td>
        </tr>
    </tbody>
</table>
<p style='margin-top:0cm;margin-right:0cm;margin-bottom:6.0pt;margin-left:0cm;text-align:justify;font-size:16px;font-family:"Times New Roman",serif;'><span style='font-size:13px;font-family:"Arial",sans-serif;'>&nbsp;</span></p>
<p style='margin:0cm;margin-bottom:.0001pt;font-size:13px;font-family:"Arial",sans-serif;'><strong><span style="font-size:13px;">Itemization of amount financed of $${
    loanDetails.amountFinanced
  }</span></strong></p>
<p style='margin:0cm;margin-bottom:.0001pt;font-size:13px;font-family:"Arial",sans-serif;'><span style="font-size:13px;">$ ${
    loanDetails.amountFinanced
  } &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp;Amount given to You on your ${
    bankDetails.bankName
  } Account ${bankDetails.accountNumber}</span></p>
<p style='margin:0cm;margin-bottom:.0001pt;font-size:13px;font-family:"Arial",sans-serif;'><span style="font-size:13px;">&nbsp;</span></p>
<p style='margin:0cm;margin-bottom:.0001pt;font-size:13px;font-family:"Arial",sans-serif;'><span style="font-size:13px;">&nbsp;</span></p>
<p style='margin-top:0cm;margin-right:0cm;margin-bottom:6.0pt;margin-left:0cm;text-align:center;font-size:16px;font-family:"Times New Roman",serif;'><strong><span style='font-size:13px;font-family:"Arial",sans-serif;color:black;'>Account Agreement</span></strong></p>
<p style='margin-top:0cm;margin-right:0cm;margin-bottom:.0001pt;margin-left:0cm;text-align:justify;font-size:16px;font-family:"Times New Roman",serif;'><strong><span style='font-size:13px;font-family:"Arial",sans-serif;'>The Parties.&nbsp;</span></strong><span style='font-size:13px;font-family:"Arial",sans-serif;'>This credit availability agreement (this &ldquo;Agreement&rdquo;) is between <u>${
    customerInfo.name
  }</u> (&ldquo;you&rdquo;, &ldquo;your&rdquo;) and Troosk, Inc. (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;, &ldquo;Troosk&rdquo; a Credit Availability Lender located at 81 Lancaster Ave, Suite 312, Malvern, PA 19355 (Phone # 484-320-8541) and licensed and regulated by the District of Columbia Department of Insurance, Securities and Banking (DISB), 1050 First Street, NE, Suite 801, Washington, DC 20002.</span></p>
<p style='margin-top:0cm;margin-right:0cm;margin-bottom:.0001pt;margin-left:0cm;text-align:justify;font-size:16px;font-family:"Times New Roman",serif;'><span style='font-size:13px;font-family:"Arial",sans-serif;'>&nbsp;</span></p>
<p style='margin-top:0cm;margin-right:0cm;margin-bottom:.0001pt;margin-left:0cm;text-align:justify;font-size:16px;font-family:"Times New Roman",serif;'><strong><span style='font-size:13px;font-family:"Arial",sans-serif;'>Your Loan</span></strong><span style='font-size:13px;font-family:"Arial",sans-serif;'>. We agree to loan you $ ${
    loanDetails.amountFinanced
  } to be repaid monthly on the ${
    loanDetails.paymentDueDate.dayOfMonth
  }<sup>th</sup> day of the month for a period of ${
    loanDetails.numberOfPayments
  } months (the &ldquo;Loan&rdquo;).&nbsp;</span></p>
<p style='margin-top:0cm;margin-right:0cm;margin-bottom:.0001pt;margin-left:0cm;text-align:justify;font-size:16px;font-family:"Times New Roman",serif;'><span style='font-size:13px;font-family:"Arial",sans-serif;'>&nbsp;</span></p>
<p style='margin-top:0cm;margin-right:0cm;margin-bottom:.0001pt;margin-left:0cm;text-align:justify;font-size:16px;font-family:"Times New Roman",serif;'><strong><span style='font-size:13px;font-family:"Arial",sans-serif;'>Promise to Pay</span></strong><span style='font-size:13px;font-family:"Arial",sans-serif;'>. You promise to pay us the Total of Payments set forth above in the Truth in Lending Disclosures, which is the amount financed plus finance charges (including interest) as provided below. We will compute and charge interest on the unpaid amount of the Amount Financed from the Effective Date at the daily rate of ${
    loanDetails.apr
  }% (the &ldquo;Interest Rate&rdquo;). You promise to pay interest at the Interest Rate on the unpaid amount of the Amount Financed until it is paid in full. You promise to pay the amounts due on the payment due dates listed in the Payment Schedule above (&quot;Due Date(s)&quot;). If the Due Date falls on a weekend or bank holiday, then such payment shall be considered timely paid if paid on the following business day. A business day is defined as any day of the week excluding Saturdays, Sundays, and all official national holidays recognized by the federal government (&ldquo;Business Day&rdquo;). You also promise to pay any other fees provided for under this Agreement to us or any assignee. On the Due Date, you will pay us at the address indicated above, or at such other address as we direct you in writing or as otherwise agreed between the parties in writing.&nbsp;</span></p>
<p style='margin-top:0cm;margin-right:0cm;margin-bottom:.0001pt;margin-left:0cm;text-align:justify;font-size:16px;font-family:"Times New Roman",serif;'><span style='font-size:13px;font-family:"Arial",sans-serif;'>&nbsp;</span></p>
<p style='margin:0cm;margin-bottom:.0001pt;font-size:13px;font-family:"Arial",sans-serif;text-align:justify;'><strong><span style="font-size:13px;">Finance Charge</span></strong><strong><span style="font-size:13px;">:&nbsp;</span></strong><span style="font-size:13px;">The Finance Charges include the interest on your loan. The interest on your loan accrues daily on the outstanding principal balance, beginning on the Effective Date. We calculate the interest on Your loan by multiplying the outstanding principal balance by the daily interest rate. The daily interest rate for Your loan is ${loanDetails.apr /
    loanDetails.numberOfPayments /
    12 /
    365}%.</span><span style="font-size:13px;">&nbsp;Finance Charges are not payable in advance or compounded.&nbsp;The total Finance Charge disclosed above is based on all payments being made as scheduled. Payments will be first applied to fees,&nbsp;interest, and then principal.</span></p>
<p style='margin-top:0cm;margin-right:0cm;margin-bottom:.0001pt;margin-left:0cm;text-align:justify;font-size:16px;font-family:"Times New Roman",serif;'><span style='font-size:13px;font-family:"Arial",sans-serif;'>&nbsp;</span></p>
<p style='margin-top:0cm;margin-right:0cm;margin-bottom:.0001pt;margin-left:0cm;text-align:justify;font-size:16px;font-family:"Times New Roman",serif;'><strong><span style='font-size:13px;font-family:"Arial",sans-serif;'>Loan Origination Fee.&nbsp;</span></strong><span style='font-size:13px;font-family:"Arial",sans-serif;'>You will be not charged an origination fee.</span></p>
<p style='margin-top:0cm;margin-right:0cm;margin-bottom:.0001pt;margin-left:0cm;text-align:justify;font-size:16px;font-family:"Times New Roman",serif;'><span style='font-size:13px;font-family:"Arial",sans-serif;'>&nbsp;</span></p>
<p style='margin-top:0cm;margin-right:0cm;margin-bottom:.0001pt;margin-left:0cm;text-align:justify;font-size:16px;font-family:"Times New Roman",serif;'><strong><span style='font-size:13px;font-family:"Arial",sans-serif;'>Right of Rescission.&nbsp;</span></strong><span style='font-size:13px;font-family:"Arial",sans-serif;'>You have the right to rescind this Loan within one (1) Business Day. If you accept funds from the Loan during the right of rescission period, you are not entitled to a refund of the Origination Fee.</span></p>
<p style='margin-top:0cm;margin-right:0cm;margin-bottom:.0001pt;margin-left:0cm;text-align:justify;font-size:16px;font-family:"Times New Roman",serif;'><strong><span style='font-size:13px;font-family:"Arial",sans-serif;'>&nbsp;</span></strong></p>
<p style='margin-top:0cm;margin-right:0cm;margin-bottom:.0001pt;margin-left:0cm;text-align:justify;font-size:16px;font-family:"Times New Roman",serif;'><strong><span style='font-size:13px;font-family:"Arial",sans-serif;color:black;'>Prepayment.</span></strong><span style='font-size:13px;font-family:"Arial",sans-serif;color:black;'>&nbsp;</span><span style='font-size:13px;font-family:"Arial",sans-serif;'>You may prepay this Loan in whole or in part at any time without penalty and doing so may reduce the Finance Charge you owe under this Agreement. The amount of the refund will be dependent in part on the date of any prepayment.&nbsp;</span></p>
<p style="text-align:justify;"><strong><span style="font-size:13px;">&nbsp;</span></strong></p>
<p style="text-align:justify;"><strong><span style="font-size:13px;">Bank Account</span></strong><span style="font-size:13px;">: For purposes of this Agreement, your Bank Account information is as follows:</span></p>
<p style="text-align:justify;"><span style="font-size:13px;">Bank Routing Number: ${
    bankDetails.routingNumber
  } and Bank Account Number: ${bankDetails.routingNumber}</span></p>
<p style='margin-top:0cm;margin-right:0cm;margin-bottom:.0001pt;margin-left:0cm;text-align:justify;font-size:16px;font-family:"Times New Roman",serif;'><span style='font-size:13px;font-family:"Arial",sans-serif;'>&nbsp;</span></p>
<p style='margin-top:0cm;margin-right:0cm;margin-bottom:.0001pt;margin-left:0cm;text-align:justify;font-size:16px;font-family:"Times New Roman",serif;'><span style='font-size:13px;font-family:"Arial",sans-serif;'>&nbsp;</span></p>
<p style='margin:0cm;margin-bottom:.0001pt;font-size:13px;font-family:"Arial",sans-serif;text-align:justify;'><strong><span style="font-size:13px;">Payment Methods.&nbsp;</span></strong><span style="font-size:13px;">If you elect to make your payments by ACH debit <em>as described below</em>, then your payments will be automatically initiated by us in accordance with this Agreement and any separate authorization that you submit to Us. If you elect to mail your payments by check or money order (i) all payments must be mailed to: 81 Lancaster Avenue, Suite 312, Malvern, PA 19355 and (ii) payments must reach this address by the scheduled Due Date(s). &nbsp; We also accept one-time electronic fund transfers initiated using information from a consumer&apos;s check or bank account. Please contact Us at 1-888-827-0178 for other payment methods that may be available.</span></p>
<p style='margin-top:0cm;margin-right:0cm;margin-bottom:.0001pt;margin-left:0cm;text-align:justify;font-size:16px;font-family:"Times New Roman",serif;'><strong><span style='font-size:13px;font-family:"Arial",sans-serif;color:red;'>&nbsp;</span></strong></p>
<p style='margin:0cm;margin-bottom:.0001pt;font-size:13px;font-family:"Arial",sans-serif;text-align:justify;'><strong><span style="font-size:13px;">Return Fee.&nbsp;</span></strong><span style="font-size:13px;">If&nbsp;any check or instrument&nbsp;is&nbsp;returned&nbsp;to&nbsp;us&nbsp;from&nbsp;your&nbsp;financial&nbsp;institution&nbsp;for any reason,&nbsp;we&nbsp;will not charge a returned check or instrument fee, however, if the returned check or instrument results in a payment being late, you will be responsible for any late fee assessed in accordance with this Agreement.</span></p>
<p style='margin:0cm;margin-bottom:.0001pt;font-size:13px;font-family:"Arial",sans-serif;text-align:justify;'><span style="font-size:13px;">&nbsp;</span></p>
<p style='margin-top:0cm;margin-right:0cm;margin-bottom:.0001pt;margin-left:0cm;text-align:justify;font-size:16px;font-family:"Times New Roman",serif;'><strong><span style='font-size:13px;font-family:"Arial",sans-serif;'>Late Fee.&nbsp;</span></strong><span style='font-size:13px;font-family:"Arial",sans-serif;'>If a payment is more than ten (10) Business Days past due, you will owe a late fee of five percent (5%) of the past-due amount. We will not charge more than one (1) late fee on a past-due payment regardless of the length of default. You will not incur any additional fees in conjunction with the late fee.</span></p>
<p style='margin-top:0cm;margin-right:0cm;margin-bottom:.0001pt;margin-left:0cm;text-align:justify;font-size:16px;font-family:"Times New Roman",serif;'><span style='font-size:13px;font-family:"Arial",sans-serif;'>&nbsp;</span></p>
<p style='margin:0cm;margin-bottom:.0001pt;font-size:13px;font-family:"Arial",sans-serif;text-align:justify;'><strong><span style="font-size:13px;">Electronic Check Re-Presentment Policy.&nbsp;</span></strong><span style="font-size:13px;">In the event you pay with a check and the check is returned unpaid for insufficient or uncollected funds, we may re-present the check electronically as described in the Check Conversion Notification below. In the ordinary course of business, your original check will not be available for receipt with your bank statement, but a copy of the electronic check can be retrieved by contacting your financial institution.&nbsp;</span></p>
<p style='margin:0cm;margin-bottom:.0001pt;font-size:13px;font-family:"Arial",sans-serif;text-align:justify;'><strong><span style="font-size:13px;">&nbsp;</span></strong></p>
<p style='margin:0cm;margin-bottom:.0001pt;font-size:13px;font-family:"Arial",sans-serif;text-align:justify;'><strong><span style="font-size:13px;">Check Conversion Notification.&nbsp;</span></strong><span style="font-size:13px;">If you provide a check as payment, you authorize us, our servicers or agents to use information from your check to make a one-time electronic fund transfer from your account in certain circumstances, such as for technical or processing reasons, or we may process the payment as a check transaction. When we use information from your check to make an electronic funds transfer, funds may be withdrawn from your account as soon as the same day we receive your payment, and you will not receive your original check back from your financial institution.&nbsp;</span></p>
<p style='margin:0cm;margin-bottom:.0001pt;font-size:13px;font-family:"Arial",sans-serif;text-align:justify;'><span style="font-size:13px;">&nbsp;</span></p>
<p style='margin:0cm;margin-bottom:.0001pt;font-size:13px;font-family:"Arial",sans-serif;text-align:justify;'><strong><span style="font-size:13px;">Consumer Reports:</span></strong><span style="font-size:13px;">&nbsp;You authorize us to obtain consumer reports about you in connection with your request for credit, and at any time that you owe us money under this or any Agreement. You agree that we may investigate your credit history and credit capacity in connection with establishing, modifying, extending, and/or enforcing your Loan and may share information about you and your Loan with credit reporting agencies and others as allowed by applicable law. In accordance with state law, we will report favorable credit and payment information when payments are made timely.&nbsp;</span></p>
<p style='margin:0cm;margin-bottom:.0001pt;font-size:13px;font-family:"Arial",sans-serif;text-align:justify;'><span style="font-size:13px;"><br> <strong>Notice of Furnishing Negative Information:&nbsp;</strong>WE MAY REPORT INFORMATION ABOUT YOUR ACCOUNT TO CREDIT BUREAUS. LATE PAYMENTS, MISSED PAYMENTS, OR OTHER DEFAULTS ON YOUR ACCOUNT MAY BE REFLECTED IN YOUR CREDIT REPORT.</span></p>
<p style='margin:0cm;margin-bottom:.0001pt;font-size:13px;font-family:"Arial",sans-serif;text-align:justify;'><span style="font-size:13px;">&nbsp;</span></p>
<p style='margin-top:0cm;margin-right:0cm;margin-bottom:.0001pt;margin-left:0cm;text-align:justify;font-size:16px;font-family:"Times New Roman",serif;'><strong><span style='font-size:13px;font-family:"Arial",sans-serif;'>Default and Authorization.&nbsp;</span></strong><span style='font-size:13px;font-family:"Arial",sans-serif;'>You</span><span style='font-size:13px;font-family:"Arial",sans-serif;'>&nbsp;</span><span style='font-size:13px;font-family:"Arial",sans-serif;'>will</span><span style='font-size:13px;font-family:"Arial",sans-serif;'>&nbsp;</span><span style='font-size:13px;font-family:"Arial",sans-serif;'>be</span><span style='font-size:13px;font-family:"Arial",sans-serif;'>&nbsp;</span><span style='font-size:13px;font-family:"Arial",sans-serif;'>in</span><span style='font-size:13px;font-family:"Arial",sans-serif;'>&nbsp;</span><span style='font-size:13px;font-family:"Arial",sans-serif;'>default</span><span style='font-size:13px;font-family:"Arial",sans-serif;'>&nbsp;</span><span style='font-size:13px;font-family:"Arial",sans-serif;'>under</span><span style='font-size:13px;font-family:"Arial",sans-serif;'>&nbsp;</span><span style='font-size:13px;font-family:"Arial",sans-serif;'>this</span><span style='font-size:13px;font-family:"Arial",sans-serif;'>&nbsp;</span><span style='font-size:13px;font-family:"Arial",sans-serif;'>Agreement</span><span style='font-size:13px;font-family:"Arial",sans-serif;'>&nbsp;</span><span style='font-size:13px;font-family:"Arial",sans-serif;'>if</span><span style='font-size:13px;font-family:"Arial",sans-serif;'>&nbsp;</span><span style='font-size:13px;font-family:"Arial",sans-serif;'>you</span><span style='font-size:13px;font-family:"Arial",sans-serif;'>&nbsp;</span><span style='font-size:13px;font-family:"Arial",sans-serif;'>do</span><span style='font-size:13px;font-family:"Arial",sans-serif;'>&nbsp;</span><span style='font-size:13px;font-family:"Arial",sans-serif;'>not</span><span style='font-size:13px;font-family:"Arial",sans-serif;'>&nbsp;</span><span style='font-size:13px;font-family:"Arial",sans-serif;'>pay</span><span style='font-size:13px;font-family:"Arial",sans-serif;'>&nbsp;</span><span style='font-size:13px;font-family:"Arial",sans-serif;'>us</span><span style='font-size:13px;font-family:"Arial",sans-serif;'>&nbsp;</span><span style='font-size:13px;font-family:"Arial",sans-serif;'>what</span><span style='font-size:13px;font-family:"Arial",sans-serif;'>&nbsp;</span><span style='font-size:13px;font-family:"Arial",sans-serif;'>you</span><span style='font-size:13px;font-family:"Arial",sans-serif;'>&nbsp;</span><span style='font-size:13px;font-family:"Arial",sans-serif;'>owe</span><span style='font-size:13px;font-family:"Arial",sans-serif;'>&nbsp;</span><span style='font-size:13px;font-family:"Arial",sans-serif;'>us</span><span style='font-size:13px;font-family:"Arial",sans-serif;'>&nbsp;</span><span style='font-size:13px;font-family:"Arial",sans-serif;'>under</span><span style='font-size:13px;font-family:"Arial",sans-serif;'>&nbsp;</span><span style='font-size:13px;font-family:"Arial",sans-serif;'>this</span><span style='font-size:13px;font-family:"Arial",sans-serif;'>&nbsp;</span><span style='font-size:13px;font-family:"Arial",sans-serif;'>Agreement, you provide false information about yourself or your financial condition or you file bankruptcy.&nbsp;</span></p>
<p style='margin-top:0cm;margin-right:0cm;margin-bottom:.0001pt;margin-left:0cm;text-align:justify;font-size:16px;font-family:"Times New Roman",serif;'><span style='font-size:13px;font-family:"Arial",sans-serif;'>&nbsp;</span></p>
<p style='margin-top:0cm;margin-right:0cm;margin-bottom:.0001pt;margin-left:0cm;text-align:justify;font-size:16px;font-family:"Times New Roman",serif;'><strong><span style='font-size:13px;font-family:"Arial",sans-serif;'>Attorney Fees &amp; Court Costs.</span></strong><span style='font-size:13px;font-family:"Arial",sans-serif;'>&nbsp;If the Loan is more than 60 days in default and it becomes necessary to file suit to collect the Loan, you agree to pay reasonable attorney&rsquo;s fees, courts costs, and court-awarded damages, including reasonable attorney&rsquo;s fees and court costs incurred on appeal.</span></p>
<p style='margin-top:0cm;margin-right:0cm;margin-bottom:6.0pt;margin-left:0cm;text-align:justify;font-size:16px;font-family:"Times New Roman",serif;'><strong><span style='font-size:13px;font-family:"Arial",sans-serif;color:black;'>&nbsp;</span></strong></p>
<p style='margin-top:0cm;margin-right:0cm;margin-bottom:6.0pt;margin-left:0cm;text-align:justify;font-size:16px;font-family:"Times New Roman",serif;'><strong><span style='font-size:13px;font-family:"Arial",sans-serif;color:black;'>&nbsp;</span></strong></p>
<p style='margin-top:0cm;margin-right:0cm;margin-bottom:6.0pt;margin-left:0cm;text-align:justify;font-size:16px;font-family:"Times New Roman",serif;'><strong><span style='font-size:13px;font-family:"Arial",sans-serif;color:black;'>&nbsp;</span></strong></p>
<p style='margin-top:0cm;margin-right:0cm;margin-bottom:6.0pt;margin-left:0cm;text-align:justify;font-size:16px;font-family:"Times New Roman",serif;'><strong><span style='font-size:13px;font-family:"Arial",sans-serif;color:black;'>&nbsp;</span></strong></p>
<p style='margin-top:0cm;margin-right:0cm;margin-bottom:6.0pt;margin-left:0cm;text-align:justify;font-size:16px;font-family:"Times New Roman",serif;'><strong><span style='font-size:13px;font-family:"Arial",sans-serif;color:black;'>&nbsp;</span></strong></p>
<p style='margin-top:0cm;margin-right:0cm;margin-bottom:6.0pt;margin-left:0cm;text-align:justify;font-size:16px;font-family:"Times New Roman",serif;'><strong><span style='font-size:13px;font-family:"Arial",sans-serif;color:black;'>&nbsp;</span></strong></p>
<p style='margin-top:0cm;margin-right:0cm;margin-bottom:6.0pt;margin-left:0cm;text-align:justify;font-size:16px;font-family:"Times New Roman",serif;'><strong><span style='font-size:13px;font-family:"Arial",sans-serif;color:black;'>&nbsp;</span></strong></p>
<p style='margin-top:0cm;margin-right:0cm;margin-bottom:6.0pt;margin-left:0cm;text-align:center;font-size:16px;font-family:"Times New Roman",serif;'><strong><span style='font-size:13px;font-family:"Arial",sans-serif;color:black;'>AMORTIZATION SCHEDULE</span></strong></p>
<table style="border-collapse:collapse;border:none;">
  <tbody>
    <tr>
        <td style="width: 9.4147%; border: 1pt solid windowtext; padding: 0cm 5.4pt; vertical-align: top;">
            <p style='margin-top:0cm;margin-right:0cm;margin-bottom:6.0pt;margin-left:0cm;text-align:justify;font-size:16px;font-family:"Times New Roman",serif;'><strong><span style='font-size:13px;font-family:"Arial",sans-serif;color:black;'>Payment number</span></strong></p>
        </td>
        <td style="width: 17.6094%; border-top: 1pt solid windowtext; border-right: 1pt solid windowtext; border-bottom: 1pt solid windowtext; border-image: initial; border-left: none; padding: 0cm 5.4pt; vertical-align: top;">
            <p style='margin-top:0cm;margin-right:0cm;margin-bottom:6.0pt;margin-left:0cm;text-align:justify;font-size:16px;font-family:"Times New Roman",serif;'><strong><span style='font-size:13px;font-family:"Arial",sans-serif;color:black;'>Payment due date</span></strong></p>
        </td>
        <td style="width: 16.5659%; border-top: 1pt solid windowtext; border-right: 1pt solid windowtext; border-bottom: 1pt solid windowtext; border-image: initial; border-left: none; padding: 0cm 5.4pt; vertical-align: top;">
            <p style='margin-top:0cm;margin-right:0cm;margin-bottom:6.0pt;margin-left:0cm;text-align:justify;font-size:16px;font-family:"Times New Roman",serif;'><strong><span style='font-size:13px;font-family:"Arial",sans-serif;color:black;'>Scheduled payment</span></strong></p>
        </td>
        <td style="width: 15.5443%; border-top: 1pt solid windowtext; border-right: 1pt solid windowtext; border-bottom: 1pt solid windowtext; border-image: initial; border-left: none; padding: 0cm 5.4pt; vertical-align: top;">
            <p style='margin-top:0cm;margin-right:0cm;margin-bottom:6.0pt;margin-left:0cm;text-align:justify;font-size:16px;font-family:"Times New Roman",serif;'><strong><span style='font-size:13px;font-family:"Arial",sans-serif;color:black;'>Principal</span></strong></p>
        </td>
        <td style="width: 19.4666%; border-top: 1pt solid windowtext; border-right: 1pt solid windowtext; border-bottom: 1pt solid windowtext; border-image: initial; border-left: none; padding: 0cm 5.4pt; vertical-align: top;">
            <p style='margin-top:0cm;margin-right:0cm;margin-bottom:6.0pt;margin-left:0cm;text-align:justify;font-size:16px;font-family:"Times New Roman",serif;'><strong><span style='font-size:13px;font-family:"Arial",sans-serif;color:black;'>INTEREST</span></strong></p>
        </td>
        <td style="width: 21.2377%; border-top: 1pt solid windowtext; border-right: 1pt solid windowtext; border-bottom: 1pt solid windowtext; border-image: initial; border-left: none; padding: 0cm 5.4pt; vertical-align: top;">
            <p style='margin-top:0cm;margin-right:0cm;margin-bottom:6.0pt;margin-left:0cm;text-align:justify;font-size:16px;font-family:"Times New Roman",serif;'><strong><span style='font-size:13px;font-family:"Arial",sans-serif;color:black;'>ending balance</span></strong></p>
        </td>
    </tr>
`;

  const part2 = amortizationSchedule.map(
    (item, index) => `
    <tr>
      <td style="width: 9.4147%; border-right: 1pt solid windowtext; border-bottom: 1pt solid windowtext; border-left: 1pt solid windowtext; border-image: initial; border-top: none; padding: 0cm 5.4pt; vertical-align: top;">
          <p style='margin-top:0cm;margin-right:0cm;margin-bottom:6.0pt;margin-left:0cm;text-align:justify;font-size:16px;font-family:"Times New Roman",serif;'><span style='font-size:13px;font-family:"Arial",sans-serif;color:black;'>${index +
            1}</span></p>
      </td>
      <td style="width: 17.6094%; border-top: none; border-left: none; border-bottom: 1pt solid windowtext; border-right: 1pt solid windowtext; padding: 0cm 5.4pt; vertical-align: top;">
          <p style='margin-top:0cm;margin-right:0cm;margin-bottom:6.0pt;margin-left:0cm;text-align:justify;font-size:16px;font-family:"Times New Roman",serif;'><span style='font-size:13px;font-family:"Arial",sans-serif;color:black;'>${
            item.scheduleDate
          }</span></p>
      </td>
      <td style="width: 16.5659%; border-top: none; border-left: none; border-bottom: 1pt solid windowtext; border-right: 1pt solid windowtext; padding: 0cm 5.4pt; vertical-align: top;">
          <p style='margin-top:0cm;margin-right:0cm;margin-bottom:6.0pt;margin-left:0cm;text-align:justify;font-size:16px;font-family:"Times New Roman",serif;'><span style='font-size:13px;font-family:"Arial",sans-serif;color:black;'>${
            item.unpaidPrincipal
          }</span></p>
      </td>
      <td style="width: 15.5443%; border-top: none; border-left: none; border-bottom: 1pt solid windowtext; border-right: 1pt solid windowtext; padding: 0cm 5.4pt; vertical-align: top;">
          <p style='margin-top:0cm;margin-right:0cm;margin-bottom:6.0pt;margin-left:0cm;text-align:justify;font-size:16px;font-family:"Times New Roman",serif;'><span style="font-size:13px;color:black;">&nbsp;$${
            item.principal
          }&nbsp;</span></p>
      </td>
      <td style="width: 19.4666%; border-top: none; border-left: none; border-bottom: 1pt solid windowtext; border-right: 1pt solid windowtext; padding: 0cm 5.4pt; vertical-align: top;">
          <p style='margin-top:0cm;margin-right:0cm;margin-bottom:6.0pt;margin-left:0cm;text-align:justify;font-size:16px;font-family:"Times New Roman",serif;'><span style="font-size:13px;color:black;">&nbsp;${
            item.interest
          }&nbsp;</span></p>
      </td>
      <td style="width: 21.2377%; border-top: none; border-left: none; border-bottom: 1pt solid windowtext; border-right: 1pt solid windowtext; padding: 0cm 5.4pt; vertical-align: bottom;">
          <p style='margin-top:0cm;margin-right:0cm;margin-bottom:6.0pt;margin-left:0cm;text-align:justify;font-size:16px;font-family:"Times New Roman",serif;'><span style='font-size:13px;font-family:"Calibri",sans-serif;color:black;'>$${
            item.amount
          }&nbsp;</span></p>
      </td>
          </tr>
    `,
  );

  const part3 = `
      </tbody>
    </table>
  <p style='margin-top:0cm;margin-right:0cm;margin-bottom:6.0pt;margin-left:0cm;text-align:justify;font-size:16px;font-family:"Times New Roman",serif;'><strong><span style='font-size:13px;font-family:"Arial",sans-serif;color:black;'>&nbsp;</span></strong></p>
<p style='margin-top:0cm;margin-right:1.75pt;margin-bottom:.0001pt;margin-left:0cm;text-align:justify;font-size:16px;font-family:"Times New Roman",serif;'><strong><span style='font-size:13px;font-family:"Arial",sans-serif;color:black;'>Ways we can Contact You.&nbsp;</span></strong><span style='font-size:13px;font-family:"Arial",sans-serif;color:black;'>You expressly consent and agree that we, our affiliates, agents, and service providers may use written, electronic, or verbal means to contact you for account management purposes, specifically including but not limited to via manual or auto dialed telephone calls, emails, text message and all messaging and phone systems as allowed by law. You also agree that we and our affiliates, agents, and service providers may use any email address or any telephone number you provide, now or in the future, including a number for a cellular phone or other wireless device, regardless of whether you incur charges as a result. <u>Furthermore, by initialing this paragraph you hereby agree opt into TCPA consent</u> and to be contacted by us for account management and marketing or other purpose allowed by law via robocalls/robotexts, prerecorded or artificial voice messages, ringless voice messages, text messages, emails, apps, live chat and/or automatic telephone dialing systems to the phone number(s) provided on your loan application. You further agree to open and review <u>all</u> messages, communications and contacts from us in a confidential manner to ensure that you are the only recipient.&nbsp;This TCPA authorization is in addition to any authorization or consent you separately have provided or may provide to us to send you text messages or to call you using an automatic telephone dialing system or an artificial prerecorded voice. You further understand that this TCPA consent is not required in order to obtain a loan from us and that you may withdraw your TCPA consent from us ONLY by doing so in writing by mailing us at Troosk, Inc., 81 Lancaster Avenue, Suite 312, Malvern, PA 19355.</span></p>
<p style='margin-top:0cm;margin-right:1.75pt;margin-bottom:.0001pt;margin-left:0cm;text-align:justify;font-size:16px;font-family:"Times New Roman",serif;'><strong><span style='font-size:13px;font-family:"Arial",sans-serif;'>Initial:</span></strong><strong><span style='font-size:13px;font-family:"Arial",sans-serif;'>JS (optional)</span></strong></p>
<p style='margin-top:0cm;margin-right:1.75pt;margin-bottom:.0001pt;margin-left:0cm;text-align:justify;font-size:16px;font-family:"Times New Roman",serif;'><span style='font-size:13px;font-family:"Arial",sans-serif;color:black;'>&nbsp;</span></p>
<p style='margin:0cm;margin-bottom:.0001pt;font-size:13px;font-family:"Arial",sans-serif;text-align:justify;vertical-align:baseline;'><strong><span style="font-size:13px;color:black;">Assignment</span></strong><span style="font-size:13px;color:black;">. We may sell or transfer this Agreement or any of our rights under this Agreement to any party, including a collection agency in our sole and absolute discretion.</span></p>
<p style='margin:0cm;margin-bottom:.0001pt;font-size:13px;font-family:"Arial",sans-serif;text-align:justify;vertical-align:baseline;'><span style="font-size:13px;color:black;">&nbsp;</span></p>
<p style='margin:0cm;margin-bottom:.0001pt;font-size:13px;font-family:"Arial",sans-serif;text-align:justify;vertical-align:baseline;'><strong><span style="font-size:13px;color:black;">Governing</span></strong><span style="font-size:13px;color:black;">&nbsp;<strong>Law.&nbsp;</strong>You agree that except for the Waiver of Jury Trial and Arbitration Agreement (&ldquo;Arbitration Agreement&rdquo;), which shall be governed by the Federal Arbitration Act, 9 U.S.C. Section 1, et seq.,</span><span style="font-size:13px;">&nbsp;<span style="color:black;">and applicable federal consumer lending law, this Agreement and any transaction between you and Troosk will be governed by District of Columbia law including, without limitation, its statutes of limitations, without giving effect to any choice or conflict of law provision or rule whether of District of Columbia or any other jurisdiction that would cause the application of laws of any other jurisdiction.</span></span></p>
<p style='margin:0cm;margin-bottom:.0001pt;font-size:13px;font-family:"Arial",sans-serif;text-align:justify;vertical-align:baseline;'><span style="font-size:13px;">&nbsp;</span></p>
<p style='margin:0cm;margin-bottom:.0001pt;font-size:13px;font-family:"Arial",sans-serif;text-align:justify;vertical-align:baseline;'><strong><span style="font-size:13px;">Arbitration Agreement</span></strong><span style="font-size:13px;">. You agree that this Agreement and any transaction between you and Troosk are and will be subject to the Arbitration Agreement as it may be amended from time to time and that all disputes between Troosk and you will be resolved by binding arbitration unless you elect to opt-out pursuant to the terms and procedures set forth in the Arbitration Agreement. A copy of the Arbitration Agreement has been provided to you with this Agreement. You acknowledge that you have received complete copies of this Agreement including, without limitation, the Arbitration Agreement, including opt out rights, and have had the opportunity to read this Agreement and the Arbitration Agreement and consult with your attorney or legal advisor about the meaning of these agreements and your duties and obligations under them. The Arbitration Agreement is incorporated by reference as an essential part of this Agreement.&nbsp;</span></p>
<p style='margin:0cm;margin-bottom:.0001pt;font-size:13px;font-family:"Arial",sans-serif;text-align:justify;vertical-align:baseline;'><span style="font-size:13px;color:black;">&nbsp;</span></p>
<p style='margin:0cm;margin-bottom:.0001pt;font-size:13px;font-family:"Arial",sans-serif;text-align:justify;vertical-align:baseline;'><strong><span style="font-size:13px;color:black;">Severability Clause</span></strong><span style="font-size:13px;color:black;">. If any provision of this Agreement is held unenforceable, void or invalid for any reason, such provision will be severed and deemed unenforceable, and the remainder of this Agreement will remain operative, valid, enforceable and binding on you and us.</span></p>
<p style='margin:0cm;margin-bottom:.0001pt;font-size:13px;font-family:"Arial",sans-serif;text-align:justify;vertical-align:baseline;'><span style="font-size:13px;color:black;">&nbsp;</span></p>
<p style='margin:0cm;margin-bottom:.0001pt;font-size:13px;font-family:"Arial",sans-serif;text-align:justify;vertical-align:baseline;'><strong><span style="font-size:13px;">No Waiver</span></strong><span style="font-size:13px;">. No failure to exercise, or delay in exercising, any right, power or privilege hereunder shall operate as a waiver thereof, nor shall any single or partial exercise thereof preclude any other or further exercise thereof or the exercise of any other right, power or privilege.</span></p>
<p style='margin:0cm;margin-bottom:.0001pt;font-size:13px;font-family:"Arial",sans-serif;text-align:justify;vertical-align:baseline;'><span style="font-size:13px;color:black;">&nbsp;</span></p>
<p style='margin-top:0cm;margin-right:0cm;margin-bottom:.0001pt;margin-left:0cm;text-align:justify;font-size:16px;font-family:"Times New Roman",serif;'><strong><span style='font-size:13px;font-family:"Arial",sans-serif;color:black;'>Privacy Policy</span></strong><span style='font-size:13px;font-family:"Arial",sans-serif;color:black;'>: Federal law requires us to tell you why and how we collect, share, and protect your personal information in a Privacy Policy. Troosk&rsquo;s Privacy Policy is posted on our website at&nbsp;</span><span style='font-size:13px;font-family:"Arial",sans-serif;'>www.troosk.com<span style="color:black;">&nbsp;By signing this Agreement, you acknowledge receipt of the Privacy Policy in connection with this Agreement. &nbsp;You further agree to download and/or print a copy for your records today. If you would like us to send you a printed copy of the Privacy Policy, you may request one by writing to us at 81 Lancaster Avenue, Suite 312, Malvern, PA 19355 or calling us at 1-888-827-0178.</span></span></p>
<p style='margin-top:0cm;margin-right:0cm;margin-bottom:.0001pt;margin-left:0cm;text-align:justify;font-size:16px;font-family:"Times New Roman",serif;'><span style='font-size:13px;font-family:"Arial",sans-serif;'>&nbsp;</span></p>
<p style='margin-top:0cm;margin-right:0cm;margin-bottom:.0001pt;margin-left:0cm;text-align:justify;font-size:16px;font-family:"Times New Roman",serif;'><strong><span style='font-size:13px;font-family:"Arial",sans-serif;'>Notice, Delays in Payment Processing.&nbsp;</span></strong><em><span style='font-size:13px;font-family:"Arial",sans-serif;'>We are not responsible for any delays in processing payments or requests to revoke payment authorizations, to the extent such delays occur due to &ldquo;acts of God&rdquo;; &ldquo;acts of terror&rdquo;; acts of civil or military authority; government regulations; quarantine or shelter-in-place restrictions or guidelines including, but not limited to, those issued by the World Health Organization (WHO) or Center for Disease Control; pandemics; or any other event beyond our control.</span></em></p>
<p style='margin-top:0cm;margin-right:0cm;margin-bottom:.0001pt;margin-left:0cm;text-align:justify;font-size:16px;font-family:"Times New Roman",serif;'><strong><span style='font-size:13px;font-family:"Arial",sans-serif;'>&nbsp;</span></strong></p>
<p style='margin-top:0cm;margin-right:0cm;margin-bottom:.0001pt;margin-left:0cm;text-align:justify;font-size:16px;font-family:"Times New Roman",serif;'><strong><span style='font-size:13px;font-family:"Arial",sans-serif;'>This Agreement Contains a Binding Arbitration Provision.&nbsp;</span></strong><span style='font-size:13px;font-family:"Arial",sans-serif;'>You agree that this Agreement and any transaction between you and Troosk are and will be subject to the Arbitration Agreement as it may be amended from time to time and that all disputes between Troosk and you will be resolved by binding arbitration unless you elect to opt-out pursuant to the terms and procedures set forth in the Arbitration Agreement, that a copy of the Arbitration Agreement has been provided to you with this Agreement, and acknowledge that you have had the opportunity to read the Agreement and the Arbitration Agreement and consult with your attorney or legal advisor about the meaning of these agreements and your duties and obligations under them. You agree that the information you provided to us prior to entering into this Agreement is accurate.&nbsp;</span></p>
<p style='margin-top:0cm;margin-right:0cm;margin-bottom:.0001pt;margin-left:0cm;text-align:justify;font-size:16px;font-family:"Times New Roman",serif;'><span style='font-size:13px;font-family:"Arial",sans-serif;'>&nbsp;</span></p>
<p style='margin-top:0cm;margin-right:0cm;margin-bottom:.0001pt;margin-left:0cm;text-align:justify;font-size:16px;font-family:"Times New Roman",serif;'><strong><span style='font-size:13px;font-family:"Arial",sans-serif;'>JS</span></strong><span style='font-size:13px;font-family:"Arial",sans-serif;'>&nbsp;Initial&nbsp;</span></p>
<p style='margin-top:0cm;margin-right:0cm;margin-bottom:.0001pt;margin-left:0cm;text-align:justify;font-size:16px;font-family:"Times New Roman",serif;'><span style='font-size:13px;font-family:"Arial",sans-serif;'>&nbsp;</span></p>
<p style='margin-top:0cm;margin-right:0cm;margin-bottom:.0001pt;margin-left:0cm;text-align:justify;font-size:16px;font-family:"Times New Roman",serif;'><strong><span style='font-size:13px;font-family:"Arial",sans-serif;'>Representations and Warranties, Ability to Repay, No Bankruptcy.&nbsp;</span></strong><span style='font-size:13px;font-family:"Arial",sans-serif;'>You represent that the amount and term of this loan fulfills your request for credit from us, and that you have the ability to repay the Loan in full on the Due Dates as set forth herein. You further acknowledge and warrant that you are not a debtor under any proceeding in bankruptcy and have no intention to file a petition for relief under any chapter of the United States Bankruptcy Code.&nbsp;</span></p>
<p style='margin-top:0cm;margin-right:0cm;margin-bottom:.0001pt;margin-left:0cm;text-align:justify;font-size:16px;font-family:"Times New Roman",serif;'><span style='font-size:13px;font-family:"Arial",sans-serif;'>&nbsp;</span></p>
<p style='margin-top:0cm;margin-right:0cm;margin-bottom:.0001pt;margin-left:0cm;text-align:justify;font-size:16px;font-family:"Times New Roman",serif;'><strong><span style='font-size:13px;font-family:"Arial",sans-serif;'>By signing this Agreement, you acknowledge that it was filled in before you did so and that you have received a completed copy of it. You further acknowledge that you have read, understand, and agree to all of the terms on this Agreement, including the provisions Arbitration Agreement and payment selection and that you have printed or saved a copy of this entire Agreement for your records, including our Privacy Policy.</span></strong></p>
<p style='margin-top:0cm;margin-right:0cm;margin-bottom:.0001pt;margin-left:0cm;text-align:justify;font-size:16px;font-family:"Times New Roman",serif;'><strong><span style='font-size:13px;font-family:"Arial",sans-serif;'>&nbsp;</span></strong></p>
<p style='margin-top:0cm;margin-right:0cm;margin-bottom:.0001pt;margin-left:0cm;text-align:justify;font-size:16px;font-family:"Times New Roman",serif;'><strong><span style='font-size:13px;font-family:"Arial",sans-serif;'>${customerInfo.name}&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;${loanDetails.date}</span></strong></p>
<p style='margin-top:0cm;margin-right:0cm;margin-bottom:.0001pt;margin-left:0cm;text-align:justify;font-size:16px;font-family:"Times New Roman",serif;'><strong><span style='font-size:13px;font-family:"Arial",sans-serif;'>&nbsp;</span></strong></p>
<table style="border: none;width:100.0%;border-collapse:collapse;">
    <tbody>
        <tr>
            <td style="width: 40%;border-right: none;border-bottom: none;border-left: none;border-image: initial;border-top: 1pt solid windowtext;padding: 0cm;vertical-align: top;">
                <p style='margin:0cm;margin-bottom:.0001pt;font-size:13px;font-family:"Arial",sans-serif;text-align:justify;'><span style="font-size:13px;">BORROWER NAME &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; DATE&nbsp;</span></p>
            </td>
            <td style="width: 10%;padding: 0cm;vertical-align: top;">
                <p style='margin:0cm;margin-bottom:.0001pt;font-size:13px;font-family:"Arial",sans-serif;text-align:justify;'><span style="font-size:13px;">&nbsp;</span></p>
            </td>
            <td style="width: 40%;border-right: none;border-bottom: none;border-left: none;border-image: initial;border-top: 1pt solid windowtext;padding: 0cm;vertical-align: top;">
                <p style='margin:0cm;margin-bottom:.0001pt;font-size:13px;font-family:"Arial",sans-serif;text-align:justify;'><span style="font-size:13px;">BORROWER NAME &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; DATE</span></p>
            </td>
        </tr>
    </tbody>
</table>
<p style='margin-top:0cm;margin-right:0cm;margin-bottom:.0001pt;margin-left:0cm;text-align:justify;font-size:16px;font-family:"Times New Roman",serif;'><strong><span style='font-size:13px;font-family:"Arial",sans-serif;'>&nbsp;&nbsp;</span></strong></p>
<p style='margin-top:0cm;margin-right:0cm;margin-bottom:6.0pt;margin-left:0cm;text-align:justify;font-size:16px;font-family:"Times New Roman",serif;'><span style='font-size:13px;font-family:"Arial",sans-serif;'>&nbsp;</span></p>
<div align="right" style='margin:0cm;margin-bottom:.0001pt;font-size:13px;font-family:"Arial",sans-serif;'>
    <table style="border: none;width:50.0%;border-collapse:collapse;">
        <tbody>
            <tr>
                <td colspan="2" style="width: 100%;padding: 0cm;vertical-align: top;">
                    <p style='margin:0cm;margin-bottom:.0001pt;font-size:13px;font-family:"Arial",sans-serif;text-align:justify;'><span style="font-size:13px;">Troosk, Inc.</span></p>
                    <p style='margin:0cm;margin-bottom:.0001pt;font-size:13px;font-family:"Arial",sans-serif;text-align:justify;'><span style="font-size:13px;">&nbsp;</span></p>
                    <p style='margin:0cm;margin-bottom:.0001pt;font-size:13px;font-family:"Arial",sans-serif;text-align:justify;'><span style="font-size:13px;">&nbsp;</span></p>
                </td>
            </tr>
            <tr>
                <td style="width: 13.84%;padding: 0cm;vertical-align: top;">
                    <p style='margin:0cm;margin-bottom:.0001pt;font-size:13px;font-family:"Arial",sans-serif;text-align:justify;'><span style="font-size:13px;">By</span></p>
                </td>
                <td style="width: 86.16%;border-top: none;border-right: none;border-left: none;border-image: initial;border-bottom: 1pt solid windowtext;padding: 0cm;vertical-align: top;">
                    <p style='margin:0cm;margin-bottom:.0001pt;font-size:13px;font-family:"Arial",sans-serif;text-align:justify;'><span style="font-size:13px;">Rajat Moorjani</span></p>
                </td>
            </tr>
            <tr>
                <td style="width: 13.84%;padding: 0cm;vertical-align: top;">
                    <p style='margin:0cm;margin-bottom:.0001pt;font-size:13px;font-family:"Arial",sans-serif;text-align:justify;'><span style="font-size:13px;">Name</span></p>
                </td>
                <td style="width: 86.16%;border-top: none;border-right: none;border-left: none;border-image: initial;border-bottom: 1pt solid windowtext;padding: 0cm;vertical-align: top;">
                    <p style='margin:0cm;margin-bottom:.0001pt;font-size:13px;font-family:"Arial",sans-serif;text-align:justify;'><span style="font-size:13px;">Rajat Moorjani</span></p>
                </td>
            </tr>
            <tr>
                <td style="width: 13.84%;padding: 0cm;vertical-align: top;">
                    <p style='margin:0cm;margin-bottom:.0001pt;font-size:13px;font-family:"Arial",sans-serif;text-align:justify;'><span style="font-size:13px;">Its</span></p>
                </td>
                <td style="width: 86.16%;border-top: none;border-right: none;border-left: none;border-image: initial;border-bottom: 1pt solid windowtext;padding: 0cm;vertical-align: top;">
                    <p style='margin:0cm;margin-bottom:.0001pt;font-size:13px;font-family:"Arial",sans-serif;text-align:justify;'><span style="font-size:13px;">CEO</span></p>
                </td>
            </tr>
        </tbody>
    </table>
</div>
  `;

  return part1 + part2 + part3;
};
