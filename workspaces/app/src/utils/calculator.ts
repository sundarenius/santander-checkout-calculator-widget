/* eslint-disable */
export const EffectiveRateHelper = {
  Calculate_Effective_InterestRate(
    loanAmount: any,
    months: any,
    termAmount: any,
    monthlyInterestRate: any,
    totalFeePerMonth: any,
    includeMonthyFeeThresholdAmount: any,
  ) {
    // Calculating balance with monthly rate for each month.
    const balanceForMonthlyAmount = CalculateBalance(
      loanAmount,
      months - 1,
      termAmount,
      monthlyInterestRate,
      totalFeePerMonth,
      includeMonthyFeeThresholdAmount,
    );
    // Calculating balance for final month.
    const balanceFinalMonth = CalculateBalance(
      balanceForMonthlyAmount,
      1,
      0,
      monthlyInterestRate,
      totalFeePerMonth,
      includeMonthyFeeThresholdAmount,
    );

    const effectiveRate = Effective_Interest(loanAmount, termAmount, months, balanceFinalMonth);

    return effectiveRate;

    function CalculateBalance(
      balance: any,
      numberOfMonths: any,
      monthlyAmount: any,
      monthlyRate: any,
      monthlyFee: any,
      includeMonthyFeeThresholdAmount: any,
    ) {
      let intCurrentperiod = 0;
      let result = balance;
      while (intCurrentperiod < numberOfMonths) {
        result *= (1 + monthlyRate);
        if (result > includeMonthyFeeThresholdAmount) {
          result += monthlyFee;
        }
        result -= monthlyAmount;
        intCurrentperiod += 1;
      }

      return result;
    }

    function Effective_Interest(loanAmount: any, termAmount: any, months: any, balance: any) {
      const paymentPlanPayment = [];

      for (let i = 0; i < months - 1; i++) {
        paymentPlanPayment.push(termAmount);
      }

      paymentPlanPayment.push(balance);

      const paymentPlanPeriod = [];

      for (let i = 0; i < months - 1; i++) {
        paymentPlanPeriod.push(i + 1);
      }

      paymentPlanPeriod.push(months);

      let dblRate = 0.5;
      let dblRateModifier = dblRate;
      let dblPresetValue = 0;

      while (Math.abs(dblPresetValue - loanAmount) > 0.001) {
        while (dblPresetValue < loanAmount) {
          dblRate += (dblRateModifier * -1);

          let dblSum = 0;
          for (let i = 0; i < months; i++) {
            dblSum += (paymentPlanPayment[i] / Math.pow((1 + dblRate), paymentPlanPeriod[i]));
          }

          dblPresetValue = dblSum;
        }

        dblRateModifier /= 2;

        while (dblPresetValue > loanAmount) {
          dblRate += dblRateModifier;

          let dblSum = 0;

          for (let i = 0; i < months; i++) {
            dblSum += (paymentPlanPayment[i] / Math.pow((1 + dblRate), paymentPlanPeriod[i]));
          }

          dblPresetValue = dblSum;
        }

        dblRateModifier /= 2;
      }

      const result = ((Math.pow((1 + dblRate), 12) - 1) * 100);
      return result.toFixed(2);
    }
  },
};

export const Calculator = {
/**
  *
  * @param {loanAmount} current loan amount
  * @param {interestRate} campaign interest rate
  * @param {termAmount} Target term amount // is the selected monthly amount
  * @param {startupFee} campaign startup fee
  * @param {termFee} campaign term fee
  * @param {minimumLoan} campaign minimum loan
  * @param {minimumLoan} Handles errors
  * @returns {} new object price
  */
  Calculate(
    loanAmount: any,
    interestRate: any,
    termAmount: any,
    startupFee: any,
    termFee: any,
    minimumLoan = 0,
    errorCallback: (err: string) => void = (err) => console.log(err),
  ) {

    const monthlyInterestRate = interestRate / 100 / 12;
    const includeMonthyFeeThresholdAmount = 1000;

    const months: any = Calculate_Months(loanAmount, termAmount, termFee, monthlyInterestRate);
    const totalFeePerMonth: any = (startupFee / months) + termFee;

    const { totalAmount } = Calculate_Total(
      months,
      loanAmount,
      termAmount,
      termFee,
      monthlyInterestRate
    );
    let totalPurchaseCost = Math.ceil(totalAmount) + startupFee;

    const effectiveRate = EffectiveRateHelper.Calculate_Effective_InterestRate(
      loanAmount,
      months,
      termAmount,
      monthlyInterestRate,
      totalFeePerMonth,
      includeMonthyFeeThresholdAmount
    );

    return {
      months,
      totalPurchaseCost: totalPurchaseCost.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,').replace(/,/g, ' '),
      effectiveRate,
    };

    function Calculate_Months(amount: any, payment: any, monthly_fee: any, monthly_interest: any) {
      let months = 0;

      while ((amount + monthly_fee) >= payment) {
        if (amount === 0) {
          break;
        }
        months += 1;
        if (amount >= 1000) {
          amount += monthly_fee;
        }
        let increase = Math.ceil(amount * monthly_interest);
        let decrease = payment;
        if (increase >= decrease) {
          errorCallback(`Can't calculate based on your fee's, the fees can't be higher than the montly payment cost, adjust your interest rate, term or startup fee.`);
          break
        }
        amount += increase;
        amount -= decrease;
      }
      if (amount <= 0) {
        months -= 1;
      }
      months += 1;
      return months;
    }

    function Calculate_Total(
      months: any,
      loanAmount: any,
      downPayment: any,
      termFee: any,
      monthlyInterest: any,
      ) {
      let remainingAmount = loanAmount;
      let totalAmount = 0;

      while (months > 1) {
        months -= 1;
        remainingAmount += monthlyInterest * remainingAmount;
        totalAmount += downPayment;
        if (remainingAmount <= 1000) {
          remainingAmount -= downPayment;
        } else {
          remainingAmount -= (downPayment - termFee);
        }
      }
      if (remainingAmount >= 1000) {
        totalAmount += termFee;
      }

      totalAmount += remainingAmount + (remainingAmount * monthlyInterest);
      return {
        totalAmount: Math.round(totalAmount),
      };
    }

    // Overly complicated function for legitimate rounding
    function roundTo(n: any, digits: any) {
      let negative = false;
      if (digits === undefined) {
        digits = 0;
      }
      if (n < 0) {
        negative = true;
        n *= -1;
      }
      const multiplicator = Math.pow(10, digits);
      n = parseFloat((n * multiplicator).toFixed(11));
      n = (Math.round(n) / multiplicator).toFixed(2);
      if (negative) {
        n = (n * -1).toFixed(2);
      }
      return n;
    }

    function InvalidValueException(code: any, message: any) {
      // @ts-ignore
      this.code = code;
      // @ts-ignore
      this.message = message;
      // @ts-ignore
      this.name = 'InvalidValueException';
    }
  }
};

export default Calculator;
