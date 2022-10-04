import { Injectable } from '@nestjs/common';
import { getManager } from 'typeorm';

@Injectable()
export class PaymentcalculationService {
  findPaymentAmount(loanAmount: number, arr: number, duration: number): number {
    let monthly: any;
    const principal = loanAmount ? loanAmount : 0;
    const interest = Number(arr ? arr : 0) / 100 / 12;
    const payments = Number(duration ? duration : 0);
    const x = Math.pow(1 + interest, payments);
    monthly = (principal * x * interest) / (x - 1);
    if (
      !isNaN(monthly) &&
      monthly != Number.POSITIVE_INFINITY &&
      monthly != Number.NEGATIVE_INFINITY
    ) {
      monthly = this.round(monthly);
    }
    return monthly;
  }
  round(x: number): number {
    return Math.round(x * 100) / 100;
  }

  RealAPR(loanAmount, monthlyPayment, term, apr, originFess) {
    const rate_per_period = apr / 100 / 12;
    const interest = rate_per_period;
    const futureValue = 0;
    const dueEndOrBeginning = 0;
    const paymentsPerYear = term;
    const paymentAmount = -monthlyPayment.toFixed(2);
    const presentValue = loanAmount - originFess;
    const FINANCIAL_MAX_ITERATIONS = 128; //Bet accuracy with 128
    const FINANCIAL_PRECISION = 0.0000001; //1.0e-8

    let y,
      y0,
      y1,
      x0,
      x1 = 0,
      f = 0,
      i = 0;
    let rate = interest;
    if (Math.abs(rate) < FINANCIAL_PRECISION) {
      y =
        presentValue * (1 + paymentsPerYear * rate) +
        paymentAmount * (1 + rate * dueEndOrBeginning) * paymentsPerYear +
        futureValue;
    } else {
      f = Math.exp(paymentsPerYear * Math.log(1 + rate));
      y =
        presentValue * f +
        paymentAmount * (1 / rate + dueEndOrBeginning) * (f - 1) +
        futureValue;
    }
    y0 = presentValue + paymentAmount * paymentsPerYear + futureValue;
    y1 =
      presentValue * f +
      paymentAmount * (1 / rate + dueEndOrBeginning) * (f - 1) +
      futureValue;

    // find root by Newton secant method
    i = x0 = 0.0;
    x1 = rate;
    while (
      Math.abs(y0 - y1) > FINANCIAL_PRECISION &&
      i < FINANCIAL_MAX_ITERATIONS
    ) {
      rate = (y1 * x0 - y0 * x1) / (y1 - y0);
      x0 = x1;
      x1 = rate;
      if (Math.abs(rate) < FINANCIAL_PRECISION) {
        y =
          presentValue * (1 + paymentsPerYear * rate) +
          paymentAmount * (1 + rate * dueEndOrBeginning) * paymentsPerYear +
          futureValue;
      } else {
        f = Math.exp(paymentsPerYear * Math.log(1 + rate));
        y =
          presentValue * f +
          paymentAmount * (1 / rate + dueEndOrBeginning) * (f - 1) +
          futureValue;
      }
      y0 = y1;
      y1 = y;
      ++i;
    }
    return rate * 100 * 12;
  }

  findPaymentAmountWithOrigination(
    loanAmount: number,
    apr: number,
    duration: number,
    originationAmount: number,
  ) {
    const result: any = {};
    const monthlyAmount = this.findPaymentAmount(loanAmount, apr, duration);
    const totalAmount = monthlyAmount * duration;
    const realAPR = this.RealAPR(
      loanAmount,
      monthlyAmount,
      duration,
      apr,
      originationAmount,
    );
    // result
    result.monthlyAmount = this.round(monthlyAmount);
    result.totalAmount = this.round(totalAmount);
    result.realAPR = this.round(realAPR);
    result.totalInerst = this.round(totalAmount - loanAmount);
    result.totalInerstPlusFee = this.round(
      result.totalInerst + originationAmount,
    );
    result.actuallyReceived = this.round(
      totalAmount - result.totalInerstPlusFee,
    );
    return result;
  }

  createPaymentReScheduler(
    amount,
    apr,
    term,
    createdAt,
    paymentfrequency,
    loan_id,
  ) {
    const paymentScheduler = [];
    let principal = Number(amount);
    const interest = Number(apr) / 100 / 12;
    const payments = Number(term);
    const x = Math.pow(1 + interest, payments);
    let monthly: any = (principal * x * interest) / (x - 1);
    if (
      !isNaN(monthly) &&
      monthly != Number.POSITIVE_INFINITY &&
      monthly != Number.NEGATIVE_INFINITY
    ) {
      monthly = this.round(monthly);
      for (let i = 0; i < payments; i++) {
        const inter = this.round((principal * Number(apr)) / 1200);
        const pri = this.round(monthly - inter);
        let scheduleDate: any = '';
        if (paymentfrequency == 'M') {
          scheduleDate = (() => {
            return new Date(
              new Date(createdAt).setMonth(
                new Date(createdAt).getMonth() + (i + 0),
              ),
            )
              .toISOString()
              .substring(0, 10);
          })();
        }
        if (paymentfrequency == 'B') {
          scheduleDate = (() => {
            return new Date(
              new Date(createdAt).setDate(
                new Date(createdAt).getDate() + i * 14,
              ),
            )
              .toISOString()
              .substring(0, 10);
          })();
        }
        if (paymentfrequency == 'S') {
          scheduleDate = (() => {
            return new Date(
              new Date(createdAt).setDate(
                new Date(createdAt).getDate() + i * 15,
              ),
            )
              .toISOString()
              .substring(0, 10);
          })();
        }
        if (paymentfrequency == 'W') {
          scheduleDate = (() => {
            return new Date(
              new Date(createdAt).setDate(
                new Date(createdAt).getDate() + i * 7,
              ),
            )
              .toISOString()
              .substring(0, 10);
          })();
        }
        paymentScheduler.push({
          loan_id: loan_id,
          unpaidPrincipal: principal,
          principal: pri,
          interest: inter,
          fees: 0,
          amount: monthly,
          scheduleDate: scheduleDate,
        });
        principal = this.round(principal - pri);
      }
      return paymentScheduler;
    }
  }
}
