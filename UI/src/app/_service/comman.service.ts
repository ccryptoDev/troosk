export class FinanceMath {
    findPaymentAmount(loanAmount: number, apr :number, duration: number) :number {
        var monthly :any;
        var principal = (loanAmount) ? loanAmount : 0;
        var interest = Number((apr) ? apr : 0) / 100 / 12;
        var payments = Number((duration) ? duration : 0);
        var x = Math.pow(1 + interest, payments);
        monthly = (principal * x * interest) / (x - 1);
        if (! isNaN(monthly) && (monthly != Number.POSITIVE_INFINITY) && (monthly != Number.NEGATIVE_INFINITY)) {
            monthly = this.round(monthly);   
        }
        monthly = (isNaN(monthly)) ? 0 : monthly;
        return monthly;
    }
    round(x) :number {
        //let res = parseFloat(parseFloat(x).toFixed(2));
        let res = Math.round(x * 100) / 100;
        return res;
    }
    RealAPR(loanAmount,monthlyPayment, term, apr, originFess) {
        var rate_per_period = apr / 100 /12;
        var interest = rate_per_period;
        var futureValue = 0;
        var dueEndOrBeginning = 0;
        var paymentsPerYear = term;
        var paymentAmount = -monthlyPayment.toFixed(2);
        var presentValue = loanAmount - originFess;
        var FINANCIAL_MAX_ITERATIONS = 128;//Bet accuracy with 128
        var FINANCIAL_PRECISION = 0.0000001;//1.0e-8
        
        var y, y0, y1, x0, x1 = 0, f = 0, i = 0;
        var rate = interest;
        if (Math.abs(rate) < FINANCIAL_PRECISION) {
            y = presentValue * (1 + paymentsPerYear * rate) + paymentAmount * (1 + rate * dueEndOrBeginning) * paymentsPerYear + futureValue;
        } else {
            f = Math.exp(paymentsPerYear * Math.log(1 + rate));
            y = presentValue * f + paymentAmount * (1 / rate + dueEndOrBeginning) * (f - 1) + futureValue;
        }
        y0 = presentValue + paymentAmount * paymentsPerYear + futureValue;
        y1 = presentValue * f + paymentAmount * (1 / rate + dueEndOrBeginning) * (f - 1) + futureValue;
    
        // find root by Newton secant method
        i = x0 = 0.0;
        x1 = rate;
        while ((Math.abs(y0 - y1) > FINANCIAL_PRECISION) && (i < FINANCIAL_MAX_ITERATIONS)) {
            rate = (y1 * x0 - y0 * x1) / (y1 - y0);
            x0 = x1;
            x1 = rate;
            if (Math.abs(rate) < FINANCIAL_PRECISION) {
                y = presentValue * (1 + paymentsPerYear * rate) + paymentAmount * (1 + rate * dueEndOrBeginning) * paymentsPerYear + futureValue;
            } else {
                f = Math.exp(paymentsPerYear * Math.log(1 + rate));
                y = presentValue * f + paymentAmount * (1 / rate + dueEndOrBeginning) * (f - 1) + futureValue;
            }
            y0 = y1;
            y1 = y;
            ++i;
        }
        return (rate * 100 * 12);
    }
    /*
    https://www.calculator.net/personal-loan-calculator.html?cloanamount=10000&cinterestrate=12&cinsurance=0&cyears=0&cmonths=24&cstartmonth=10&cstartyear=2021&corigpaid=deduct&corigisa=amount&corigamount=2000&printit=0&x=42&y=26#result
    fta = monthpayment*term+orge;
    RealAPR 
    originationAmount must be less then loanAmount
    */
    findPaymentAmountWithOrigination(loanAmount: number, apr :number, duration: number, originationAmount: number) {
        let result:any = {}, realAPR, monthlyAmount, totalAmount;
        monthlyAmount = this.findPaymentAmount(loanAmount, apr, duration);
        totalAmount = monthlyAmount * duration;
        //console.log("l", loanAmount, "m", monthlyAmount, "d", duration, "a", apr, "o", originationAmount);
        realAPR = this.RealAPR(loanAmount, monthlyAmount, duration, apr, originationAmount);
        //result
        result.monthlyAmount = this.round(monthlyAmount);
        result.totalAmount = this.round(totalAmount);
        result.realAPR = this.round(realAPR);
        result.totalInerst = this.round(totalAmount - loanAmount);
        result.totalInerstPlusFee = this.round(result.totalInerst + originationAmount);
        result.actuallyReceived = this.round(totalAmount - result.totalInerstPlusFee);
        console.log(result, "result");
        return result;
    }
    get durationMonths() :any {
        let data = [12, 24, 36, 42, 48, 49, 50, 60];
        return data;
    }
    createPaymentSchedule(amount, apr, term, createdAt, paymentfrequency = 'M'){
        let paymentScheduler = [];
        var principal = Number(amount);
        var interest = Number(apr) / 100 / 12;
        var payments = Number(term)
        var x = Math.pow(1 + interest, payments);
        var monthly:any = (principal * x * interest) / (x-1);
        if (!isNaN(monthly) && (monthly != Number.POSITIVE_INFINITY) && (monthly != Number.NEGATIVE_INFINITY)) {
          monthly = this.round(monthly);
          for (let i = 0; i < payments; i++) {
            let inter = this.round((principal * Number(apr)) / 1200)
            let pri = this.round(monthly - inter)
            let scheduleDate:any = ""
            if (paymentfrequency == 'M'){
              scheduleDate = new Date(new Date(createdAt).setMonth(new Date(createdAt).getMonth() + (i + 0)))
            }
            if (paymentfrequency == 'B') {
              scheduleDate = new Date(new Date(createdAt).setDate(new Date(createdAt).getDate() + (i * 14)))
            }
            if (paymentfrequency == 'S') {
              scheduleDate = new Date(new Date(createdAt).setDate(new Date(createdAt).getDate() + (i * 15)))
            }
            if (paymentfrequency == 'W') {
              scheduleDate = new Date(new Date(createdAt).setDate(new Date(createdAt).getDate() + (i * 7)))
            }
            paymentScheduler.push({
              //loan_id: this.loanId,
              unpaidPrincipal:principal,
              principal:pri,
              interest:inter,
              fees:0,
              amount:monthly,
              scheduleDate: scheduleDate
            })
            principal = this.round(principal- pri);
          }
          
        }
        return paymentScheduler;
    }
} 
export class FinaceCommonData {
    documentsTypes(requiredOnly = false) :any {
        let data = [
            { documentType: "Government Issued ID Front", title:"Government Issued ID", details: "Front", uploadedFiles:[], download:[] },
            { documentType: "Government Issued ID Back", title:"Government Issued ID", details: "Back", uploadedFiles:[], download:[]  },
            { documentType: "Paystub1", title:"Paystub1", details: "Most Recent", uploadedFiles:[], download:[] },
            { documentType: "Paystub2", title:"Paystub2", details: "Most Recent", uploadedFiles:[], download:[] },
            { documentType: "Bank Statement", title:"Bank Statement", details: "All pages showing 30 Days of Activity and Ending Balance", uploadedFiles:[], download:[] }
        ];
        if (!requiredOnly) {
            data.push({ documentType: "Income Document", title:"Income Document", details: "", uploadedFiles:[], download:[] });
            data.push({ documentType: "Driving licence", title:"Driving licence", details: "", uploadedFiles:[], download:[] });
            data.push({ documentType: "Other", title:"Other", details: "", uploadedFiles:[], download:[] });
        }
        return data;
    }
    stateList() {
        let data = [
            {"id":"Arizona","displayName":"Arizona"},
            {"id":"Colorado","displayName":"Colorado"},
            {"id":"Florida","displayName":"Florida"},
            {"id":"Georgia","displayName":"Georgia"},
            {"id":"Iowa","displayName":"Iowa"},
            {"id":"Massachusetts","displayName":"Massachusetts"},
            {"id":"Mississippi","displayName":"Mississippi"},
            {"id":"Missouri","displayName":"Missouri"},
            {"id":"Nevada","displayName":"Nevada"},
            {"id":"New York","displayName":"New York"},
            {"id":"Oklahoma","displayName":"Oklahoma"},
            {"id":"Tennessee","displayName":"Tennessee"},
            {"id":"Texas","displayName":"Texas"},
            {"id":"Wisconsin","displayName":"Wisconsin"}
        ];
        return data;
    }
    sourceOfIncome(){
        let data = [
            {"id":"salaried","displayName":"Salaried"},
            {"id":"hourly","displayName":"Hourly"},
            {"id":"contractor","displayName":"Independent Contractor"},
            {"id":"self-employed","displayName":"Self-Employed"},
            {"id":"disability","displayName":"Disability"},
            {"id":"retirement","displayName":"Retirement"},
            {"id":"pension","displayName":"Pension Account"},
            {"id":"government-assistance","displayName":"Government Assistance/Unemployment Benefits"},
            {"id":"other","displayName":"Other"}
        ];
        return data;
    }
    payFrequency() {
        let data = [
            {"id":"M","displayName":"Monthly"},
        ];
        return data;
    }
    dayOfMonth(){
        let data = [{"id":1,"displayName":1},{"id":2,"displayName":2},{"id":3,"displayName":3},{"id":4,"displayName":4},{"id":5,"displayName":5},{"id":6,"displayName":6},{"id":7,"displayName":7},{"id":8,"displayName":8},{"id":9,"displayName":9},{"id":10,"displayName":10},{"id":11,"displayName":11},{"id":12,"displayName":12},{"id":13,"displayName":13},{"id":14,"displayName":14},{"id":15,"displayName":15},{"id":16,"displayName":16},{"id":17,"displayName":17},{"id":18,"displayName":18},{"id":19,"displayName":19},{"id":20,"displayName":20},{"id":21,"displayName":21},{"id":22,"displayName":22},{"id":23,"displayName":23},{"id":24,"displayName":24},{"id":25,"displayName":25},{"id":26,"displayName":26},{"id":27,"displayName":27},{"id":28,"displayName":28},{"id":29,"displayName":29},{"id":30,"displayName":30},{"id":31,"displayName":31}];
        return data;
    }
    paymethod() {
        let data = [
            {"id":"deposit","displayName":"Direct Deposit"},
            {"id":"check","displayName":"Check"},
        ];
        return data;
    }
    get stageList() {
        let data = {
            waiting: 'Incomplete',
            pending: "Pending",
            approved: 'Approved',
            fundingcontract: 'Funding Contract',
            performingcontract: 'Performing Contract',
            canceled: 'canceled',
        }
        return data;
    }
}
export class PayamentSchedules{
    calendarApi:any;
    schedules:any;
    paymentStartDate:any;
    loanInfo:any;
    calendarOptions:any = {
        selectable: false,
        initialDate: new Date(),
        initialView: 'dayGridMonth', //listWeek
        dateClick: this.handleDateClick.bind(this), // bind is important!
        events: [],
        customButtons: {
          myCustomButton: {
            text: 'Edit',
            click: this.editToggle.bind(this)
          }
        },
        headerToolbar: {
          left: 'prev,next today myCustomButton',
          center: 'title',
          right: 'dayGridMonth,listYear'
        },
        select: this.selectDate.bind(this)
    };
    calc = new FinanceMath();
    paymentfrequency:any;
    constructor(schedules = null) {
        this.schedules = schedules;
    }
    createEvents(schedules) {
        this.schedules = schedules;
        let result :any = [];
        if (schedules) {
            for(let i = 0; i < schedules.length; i++) {
                result.push({
                    title: `Payment $${schedules[i].amount}`,
                    date: new Date(schedules[i].scheduleDate),
                    classNames:["highlight-green"],
                    allDay:true
                });
            }
        }
        this.calendarOptions.events = result;
        this.calendarOptions.initialDate = new Date(schedules[0].scheduleDate);
        this.paymentStartDate = new Date(schedules[0].scheduleDate);
        return result;
    }
    handleDateClick(arg) {
        //alert('date click! ' + arg.dateStr)
    }
    selectDate(info) {
        let selectDate = new Date(info.startStr), today = new Date();
        if (selectDate > today) {
            this.paymentStartDate = selectDate;
            this.changePaymentfrequency();
        } else {
            alert("Please select future date");
        }
        //alert('selected ' + info.startStr + ' to ' + info.endStr);
    }
    changePaymentfrequency() {
        //amount, apr, term, createdAt, paymentfrequency = 'M'
        let obj:any = this.loanInfo, value = this.paymentfrequency.value;
        //console.log(value, obj, this.paymentStartDate);
        let result = this.calc.createPaymentSchedule(obj.amount, obj.apr, obj.term, this.paymentStartDate,value);
        this.createEvents(result);
    }
    editToggle(){
        if (this.calendarOptions.selectable) {
            this.calendarOptions.selectable = false;
            this.calendarOptions.customButtons.myCustomButton.text="Edit";
        } else {
            this.calendarOptions.selectable = true;
            this.calendarOptions.customButtons.myCustomButton.text="Read";
        }
    }
}
//intance
export var FinanceInatance = new FinanceMath();
export var CommonDataInatance = new FinaceCommonData();