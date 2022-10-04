export const generateConsentHtml = (consents, signature, date) => {
  const consentsHtml = consents
    .map(
      consent => `
   <p style='margin-top:0cm;margin-right:0cm;margin-bottom:8.0pt;margin-left:0cm;line-height:107%;font-size:15px;font-family:"Calibri",sans-serif;text-align:center;'>${consent.fileName}</p>
  <p style='margin-top:0cm;margin-right:0cm;margin-bottom:8.0pt;margin-left:0cm;line-height:107%;font-size:15px;font-family:"Calibri",sans-serif;'>${consent.name}</p>
  <p style='margin-top:0cm;margin-right:0cm;margin-bottom:8.0pt;margin-left:0cm;line-height:107%;font-size:15px;font-family:"Calibri",sans-serif;'>&nbsp;</p>
  `,
    )
    .join('');

  const signatureHtml = `
  <table data-darkreader-inline-border-bottom="" data-darkreader-inline-border-left="" data-darkreader-inline-border-right="" data-darkreader-inline-border-top="" style="border-collapse: collapse; border: none; --darkreader-inline-border-top: initial; --darkreader-inline-border-right: initial; --darkreader-inline-border-bottom: initial; --darkreader-inline-border-left: initial;">
    <tbody>
      <tr>
        <td style="width: 225.4pt;padding: 0cm 5.4pt;vertical-align: top;">
            <p style='margin-top:0cm;margin-right:0cm;margin-bottom:.0001pt;margin-left:0cm;line-height:  normal;font-size:15px;font-family:"Calibri",sans-serif;'>${date}</p>
        </td>
        <td style="width: 225.4pt;padding: 0cm 5.4pt;vertical-align: top;">
            <p style='margin-top:0cm;margin-right:0cm;margin-bottom:.0001pt;margin-left:0cm;line-height:normal;font-size:15px;font-family:"Calibri",sans-serif;text-align:right;'><strong><em>${signature}</em></strong></p>
        </td>
      </tr>
    </tbody>
  </table>
  `;

  return consentsHtml + signatureHtml;
};
