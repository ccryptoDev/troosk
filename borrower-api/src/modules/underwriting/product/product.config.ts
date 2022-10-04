const productConfig = {
  lastDuePastInMonth: 6,
  deniedLastInDays: 90,
  minimumAnnualIncome: 20000,
  minimumAverageBalance: 250,
  maximumOverdraftsLast3Month: 3,
  minimumTURating: 900,
  minimumBankruptcies: 0,
  minimumDelinquencies: 0,
  minimumCollectionsRecordsOver100: 0,
  minimumPublicRecordsOver100: 0,
  maximumInquiriesIn6Month: 7,
  minimumFICO: 620,
  maximumDTI: 40,
  maximumPTI: 10,
  grossIncomeModifier: 1.35,
  incomeVerificationCoefficient: 1.2,
  minimumLoanAmount: 1000,
  minimumLoanTerm: 24,
  tier: scoreFICO => {
    switch (true) {
      case scoreFICO >= 780:
        return 0.099;
      case scoreFICO >= 750 && scoreFICO <= 779:
        return 0.149;
      case scoreFICO >= 720 && scoreFICO <= 749:
        return 0.189;
      case scoreFICO >= 690 && scoreFICO <= 719:
        return 0.219;
      case scoreFICO >= 660 && scoreFICO <= 689:
        return 0.239;
      case scoreFICO >= 620 && scoreFICO <= 779:
        return 0.239;
      default:
        return 0.239;
    }
  },
  factorB: score => {
    switch (true) {
      case score >= 620 && score <= 659:
        return 5000;
      case score >= 660 && score <= 719:
        return 7500;
      case score >= 720:
        return 10000;
    }
  },
  loanTerm: loanAmount => {
    switch (true) {
      case loanAmount >= 6000:
        return 48;
      case loanAmount >= 3000:
        return 36;
      default:
        return 24;
    }
  },
  stage1Rules: {
    rule1: {
      ruleId: 's1_D1',
      description: 'Loan had charged-off or settled anytime in the past',
      declinedIf: 'eq',
      value: true,
      disabled: false,
    },
    rule2: {
      ruleId: 's1_D2',
      description:
        'Loan was past-due by 30 days or more within the past 6 months',
      declinedIf: 'lte',
      value: 6,
      disabled: false,
    },
    rule3: {
      ruleId: 's1_D3',
      description: 'Was denied within the last 90 days',
      declinedIf: 'lt',
      value: 90,
      disabled: false,
    },
    rule4: {
      ruleId: 's1_D4',
      description: 'Annual Income',
      declinedIf: 'lt',
      value: 20000,
      disabled: false,
    },
    rule5: {
      ruleId: 's1_D5',
      description: 'Average 3-mth bank balance < $250',
      declinedIf: 'lt',
      value: 250,
      disabled: false,
    },
    rule6: {
      ruleId: 's1_D6',
      description: 'Number of overdrafts over last 3 months >= 3',
      declinedIf: 'gte',
      value: 3,
      disabled: false,
    },
  },
  stage2Rules: {
    rule7: {
      ruleId: 's2_D7',
      description: 'OFAC match potential hit',
      declinedIf: 'eq',
      value: true,
      disabled: false,
    },
    rule8: {
      ruleId: 's2_D8',
      description: `Length of credit file / credit usage: Missing or <6 mths`,
      declinedIf: 'lt',
      value: 6,
      disabled: false,
    },
    rule9: {
      ruleId: 's2_D9',
      description: 'Months since 90-day or worse rating between 0 and 900',
      declinedIf: 'lt',
      value: 900,
      disabled: false,
    },
    rule10: {
      ruleId: 's2_D10',
      description: 'Number of Bankruptcies > 0',
      declinedIf: 'gt',
      value: 0,
      disabled: false,
    },
    rule11: {
      ruleId: 's2_D11',
      description: 'Number of 30 days+ delinquencies in past 2 years > 0',
      declinedIf: 'gt',
      value: 0,
      disabled: false,
    },
    rule12: {
      ruleId: 's2_D12',
      description:
        'Number of non-medical Collections records over $100 [S073B] > 0',
      declinedIf: 'gt',
      value: 0,
      disabled: false,
    },
    rule13: {
      ruleId: 's2_D13',
      description:
        'Number of public records or derog items over $100 [S059] > 0',
      declinedIf: 'gt',
      value: 0,
      disabled: false,
    },
    rule14: {
      ruleId: 's2_D14',
      description: 'Number of Inquiries in last 6 months [G098] > 7',
      declinedIf: 'gt',
      value: 7,
      disabled: false,
    },
    rule15: {
      ruleId: 's2_D15',
      description: 'FICO: Missing or < 620',
      declinedIf: 'lt',
      value: 620,
      disabled: false,
    },
    rule16: {
      ruleId: 's2_D16',
      description: 'DTI (Debt-to-Income) > 40%',
      declinedIf: 'gt',
      value: 40,
      disabled: false,
    },
    rule17: {
      ruleId: 's2_D17',
      description: 'PTI (Payment-to-Income) > 10%',
      declinedIf: 'gt', // todo calculation should be checked
      value: 10,
      disabled: false,
    },
    rule18: {
      ruleId: 's2_D18',
      description: 'Income Verification fails',
      declinedIf: 'ne',
      value: true,
      disabled: false,
    },
  },
};
export default () => ({ ...productConfig });
