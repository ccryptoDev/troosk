const transunion = {
  url: 'https://netaccess-test.transunion.com/',
  productCode: '08000',
  version: '2.21',
  processingEnvironment: 'standardTest',
  prefixCode: '0622',
  industryCode: 'F',
  memberCode: '2114329',
  memberCodeHardPull: '2114329',
  password: 'R4Q2',
  certificate: {
    password: 'secure123',
  },
  accountTypeCodes: {
    AF: 'Appliance/Furniture',
    AG: 'Collection Agency/Attorney',
    AL: 'Auto Lease',
    AU: 'Automobile',
    AX: 'Agricultural Loan',
    BC: 'Business Credit Card',
    BL: 'Revolving Business Lines',
    BU: 'Business',
    CB: 'Combined Credit Plan',
    CC: 'Credit Card',
    CE: 'Commercial Line of Credit',
    CH: 'Charge Account',
    CI: 'Commercial Installment Loan',
    CO: 'Consolidation',
    CP: 'Child Support',
    CR: 'Cond. Sales Contract; Refinance',
    CU: 'Telecommunications/Cellular',
    CV: 'Conventional Real Estate Mortgage',
    CY: 'Commercial Mortgage',
    DC: 'Debit Card',
    DR: 'Deposit Account with Overdraft Protection',
    DS: 'Debt Counseling Service',
    EM: 'Employment',
    FC: 'Debt Buyer',
    FD: 'Fraud Identify Check',
    FE: 'Attorney Fees',
    FI: 'FHA Home Improvement',
    FL: 'FMHA Real Estate Mortgage',
    FM: 'Family Support',
    FR: 'FHA Real Estate Mortgage',
    FT: 'Collection Credit Report Inquiry',
    FX: 'Flexible Spending Credit Card',
    GA: 'Government Employee Advance',
    GE: 'Government Fee for Services',
    GF: 'Government Fines',
    GG: 'Government Grant',
    GO: 'Government Overpayment',
    GS: 'Government Secured',
    GU: 'Govt. Unsecured Guar/Dir Ln',
    GV: 'Government',
    HE: 'Home Equity Loan HG Household Goods',
    HI: 'Home Improvement',
    IE: 'ID Report for Employment',
    IS: 'Installment Sales Contract',
    LC: 'Line of Credit',
    LE: 'Lease',
    LI: 'Lender-placed Insurance',
    LN: 'Construction Loan',
    LS: 'Credit Line Secured',
    MB: 'Manufactured Housing',
    MD: 'Medical Debt',
    MH: 'Medical/Health Care',
    NT: 'Note Loan',
    PS: 'Partly Secured',
    RA: 'Rental Agreement',
    RC: 'Returned Check',
    RD: 'Recreational Merchandise',
    RE: 'Real Estate',
    RL: 'Real Estate — Junior Liens',
    RM: 'Real Estate Mortgage',
    SA: 'Summary of Accounts — Same Status',
    SC: 'Secured Credit Card',
    SE: 'Secured',
    SF: 'Secondary Use of a Credit Report for Auto Financing',
    SH: 'Secured by Household Goods',
    SI: 'Secured Home Improvement',
    SM: 'Second Mortgage',
    SO: 'Secured by Household Goods & Collateral',
    SR: 'Secondary Use of a Credit Report',
    ST: 'Student Loan',
    SU: 'Spouse Support',
    SX: 'Secondary Use of a Credit Report for Other Financing',
    TS: 'Time Shared Loan',
    UC: 'Utility Company',
    UK: 'Unknown',
    US: 'Unsecured',
    VM: 'V.A. Real Estate Mortgage',
    WT: 'Individual Monitoring Report Inquiry',
  },
};
// TODO: remove after codes added to default request
transunion.industryCode = 'F';
transunion.prefixCode = '1703';
transunion.memberCode = '5532031';
transunion.memberCodeHardPull = '5532031';
transunion.password = 'PSWD';

export default () => ({ ...transunion });
