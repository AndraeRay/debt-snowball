describe("Debt calculator", function() {

  var debts, AR;


  beforeEach(function() {
    debts = [
      {
        "name"        : 'Chase',
        "bal"         : 2466.36,
        "payment"     : 39,
        "totalInterestPaid" : 0,
        "totalPaid"     : 0,
        "months"      : 0,
        "intRate"     : 15.99
      },
      {
        "name"        : 'Toyota',
        "bal"         : 15000,
        "payment"     : 425.10,
        "totalInterestPaid" : 0,
        "totalPaid"     : 0,
        "months"      : 0,
        "intRate"     : 16
      },
      {
        "name"        : 'AMEX',
        "bal"         : 72.36,
        "payment"     : 35,
        "totalInterestPaid" : 0,
        "totalPaid"     : 0,
        "months"      : 0,
        "intRate"     : 17.24
      }
    ];

    debtsV2 = [
      {
        "name"        : 'Chase',
        "bal"         : 2466.36,
        "payment"     : 39,
        "totalInterestPaid" : 0,
        "totalPaid"     : 0,
        "months"      : 0,
        "intRate"     : 15.99
      },
      {
        "name"        : 'Gardner',
        "bal"         : 72.36,
        "payment"     : 35,
        "totalInterestPaid" : 0,
        "totalPaid"     : 0,
        "months"      : 0,
        "intRate"     : 17.24
      },
      {
        "name"        : 'Toyota',
        "bal"         : 15000,
        "payment"     : 425.10,
        "totalInterestPaid" : 0,
        "totalPaid"     : 0,
        "months"      : 0,
        "intRate"     : 16
      },
      {
        "name"        : 'AMEX',
        "bal"         : 72.36,
        "payment"     : 35,
        "totalInterestPaid" : 0,
        "totalPaid"     : 0,
        "months"      : 0,
        "intRate"     : 17.24
      }
    ];

    debtsV3 = [
      {
        "name"        : 'auto',
        "bal"         : 3765,
        "payment"     : 116.25,
        "totalInterestPaid" : 0,
        "totalPaid"     : 0,
        "months"      : 0,
        "intRate"     : 7.00
      }
    ];

    debtsV4 = [
      {
        "name"        : 'Capital 1',
        "bal"         : 5000,
        "payment"     : 372.96,
        "totalInterestPaid" : 0,
        "totalPaid"     : 0,
        "months"      : 0,
        "intRate"     : 7.00
      },
      {
        "name"        : 'Toyota',
        "bal"         : 15000,
        "payment"     : 425.10,
        "totalInterestPaid" : 0,
        "totalPaid"     : 0,
        "months"      : 0,
        "intRate"     : 16
      }
    ];

    debtsV5 = [
      {
        "name"        : 'random',
        "bal"         : 10936.42,
        "payment"     : 798.46,
        "totalInterestPaid" : 0,
        "totalPaid"     : 0,
        "months"      : 0,
        "intRate"     : 7.00
      }
    ];

    debtsNK = [
      {
        "name"        : 'first',
        "bal"         : 2400,
        "payment"     : 240,
        "totalPaid"   : 0,
        "months"      : 0,
        "intRate"     : 2
      },
      {
        "name"        : 'second',
        "bal"         : 750,
        "payment"     : 50,
        "totalPaid"   : 0,
        "months"      : 0,
        "intRate"     : 2.5
      },
      {
        "name"        : 'third',
        "bal"         : 1400,
        "payment"     : 20,
        "totalPaid"   : 0,
        "months"      : 0,
        "intRate"     : 3
      },
      {
        "name"        : 'forth',
        "bal"         : 5000,
        "payment"     : 78,
        "totalPaid"   : 0,
        "months"      : 0,
        "intRate"     : 4.5
      },
      {
        "name"        : 'fifth',
        "bal"         : 370,
        "payment"     : 20,
        "totalPaid"   : 0,
        "months"      : 0,
        "intRate"     : 1.5
      }
    ];

  });

  it("should round hundreth place up to the nearest tenth", function() {
    var amount, roundedAmount;
    amount = 1.456;
    roundedAmount = moneyRound(amount);
    expect(roundedAmount).toBe(1.46);

    amount = 1.9226;
    roundedAmount = moneyRound(amount);
    expect(roundedAmount).toBe(1.93);

    amount = 1.999;
    roundedAmount = moneyRound(amount);
    expect(roundedAmount).toBe(2.0);

  });

  it('is able to sort by highest Interest', function(){
    debtsV2.sort(compareInterest);
    expect(debtsV2[0].name).toBe('Gardner');
    expect(debtsV2[1].name).toBe('AMEX');
    expect(debtsV2[2].name).toBe('Toyota');
    expect(debtsV2[3].name).toBe('Chase');
  });

  it('is able to sort by lowest amount', function(){
    debtsV2.sort(compareBal);
    expect(debtsV2[0].name).toBe('Gardner');
    expect(debtsV2[1].name).toBe('AMEX');
    expect(debtsV2[2].name).toBe('Chase');
    expect(debtsV2[3].name).toBe('Toyota');
  });

  it('should calculate the monthly interest due on an account', function(){
    var intPayment;
    intPayment = calculateMonthlyInterest(debts[0]);
    expect(intPayment).toBe(33.08);
    /*
    compared with
    http://www.thecalculatorsite.com/finance/calculators/compoundinterestcalculator.php
    */

  });

  describe('it should keep summary information about entire debt list', function(){

    it('should get the total balance owed for all debts in object', function(){
      addSummaryProperties(debts);
      getTotalBal(debts);
      expect(debts.totalBal).toBe(17538.72);

      addSummaryProperties(debts);
      debts[1].bal = 20000;
      getTotalBal(debts);
      expect(debts.totalBal).toBe(22538.72);
    });

    it('should record total months required to pay off all debts', function(){

      var interestFirst, EXTRA_MONEY;
      EXTRA_MONEY = 0;

      interestFirst = runSimulation(debtsV4, 'balance', EXTRA_MONEY);
      expect(interestFirst.months).toBe(interestFirst[1].months);
      expect(interestFirst.months).toBeGreaterThan(interestFirst[0].months);
    })

  })



  it('should allocate money to the first debt with a balance greater than zero', function(){
    expect(debts[0].payment).toBe(39);
    allocateExtraMoney(debts, 50);
    expect(debts[0].payment).toBe(89);

    //remaining should be unchanged
    expect(debts[1].payment).toBe(425.10);
    expect(debts[2].payment).toBe(35);
  });

  it('should allocate money if debt list is set up to pay minimum', function(){
    debts.payMinimum = true;
    expect(debts[0].payment).toBe(39);
    allocateExtraMoney(debts, 50);
    expect(debts[0].payment).toBe(39);

    //remaining should be unchanged
    expect(debts[1].payment).toBe(425.10);
    expect(debts[2].payment).toBe(35);
  });

  it('should add monthly interest to individual debt, and overall debt list', function(){
    addSummaryProperties(debts);
    getTotalBal(debts);
    expect(debts.totalBal).toBe(17538.72);
    expect(debts[0].bal).toBe(2466.36);

    addMonthlyInterest(debts, debts[0]);

    //interest payment is 33.08 see preivous test

    expect(debts[0].totalInterestPaid).toBe(33.08);
    expect(moneyRound(debts.totalBal)).toBe(17571.81);
    expect(debts[0].bal).toBe(2499.44);
  });

  it('should make monthly payments', function(){
    var netPayment, debtBal, totalBal;

    addSummaryProperties(debts);
    getTotalBal(debts);

    totalBal = debts.totalBal;
    debtBal = debts[0].bal;
    
    netPayment = (debts[0].payment - calculateMonthlyInterest(debts[0])).toFixed(2);
    addMonthlyInterest(debts, debts[0]);
    
    makeMonthlyPayment(debts, debts[0]);

    expect(debts.totalBal).toBe( moneyRound(totalBal - netPayment) );
    expect(debts[0].bal).toBe( moneyRound(debtBal - netPayment) ) ;

  });

  it('should pay exact amount of last payment,', function(){

    var monthlyInterest, finalPayment;

    debts[0].bal = 1;

    addSummaryProperties(debts);
    getTotalBal(debts);

    totalBal = debts.totalBal;

    monthlyInterest = calculateMonthlyInterest(debts[0]);;

    totalBal += monthlyInterest;

    netPayment = debts[0].payment - monthlyInterest;
    expect(netPayment).toBeGreaterThan(debts[0].bal);

    addMonthlyInterest(debts, debts[0]);

    finalPayment = debts[0].bal;
    
    makeMonthlyPayment(debts, debts[0]);

    expect(debts[0].bal).toBe(0);

  });

  it('should take remaining funds of last payment, and apply to next non zero debt', function(){
    var totalBal, debtBal1, surplusMoney, monthlyInterest;

    debts[0].bal = 1;
    addSummaryProperties(debts);
    getTotalBal(debts);

    
    debtBal1 = debts[1].bal;
    totalBal = debts.totalBal;

    monthlyInterest = calculateMonthlyInterest(debts[0]);


    surplusMoney =  (debts[0].payment)  - debts[0].bal;
    expect(surplusMoney).toBeGreaterThan(0);

    /*surplus money bypasses interest since paid out of cycle*/
    makeMonthlyPayment(debts, debts[0]);
    expect(parseInt(debts[0].bal)).toBe(0);
    expect(debts[1].bal).toBe(debtBal1 - surplusMoney);

    expect(debts.totalBal).toBe(totalBal - debts[0].payment);

  });

  it('should allocate surplus money left over after final payment of debt to another non zero debt', function() {
    var surplus, debtBal1, totalBal;

    debts[0].bal = 1;

    addSummaryProperties(debts);
    getTotalBal(debts);

    
    debts[0].payment = 11;

    surplus = 10;
    debtBal1 = debts[1].bal;
    totalBal = debts.totalBal;
    debts[0].bal = 0;

    allocateSurplusPayment(debts, surplus);
    expect(debts[1].bal).toBe(debtBal1 - surplus);
    expect(debts.totalBal).toBe(totalBal - surplus);
  });

  it('should not allocate surplus money if debts are paid with minimum payment strategy', function() {
    var surplus, debtBal1, totalBal;
    debts.payMinimum = true;

    debts[0].bal = 1;

    addSummaryProperties(debts);
    getTotalBal(debts);

    
    debts[0].payment = 11;

    surplus = 10;
    debtBal1 = debts[1].bal;
    totalBal = debts.totalBal;
    debts[0].bal = 0;

    allocateSurplusPayment(debts, surplus);
    expect(debts[1].bal).toBe(debtBal1);
    expect(debts.totalBal).toBe(totalBal);
  });

  it('should pay all of the surplus if there are non zero debts remaining, when sorted by balance', function() {
    var payment, listBalStart, initialDebts;
    debts.sort(compareBal);
    debts[0].bal = 0;
    debts[1].bal = 10;

    initialDebts = JSON.parse(JSON.stringify(debts));

    addSummaryProperties(debts);
    getTotalBal(debts);

    addSummaryProperties(initialDebts);
    getTotalBal(initialDebts);

    payment = debts[0].payment;

    expect(payment).toBe(35);
  

    allocateSurplusPayment(debts, payment);


    expect(debts[1].bal).toBe(0);
    expect(debts[2].bal).toBe(initialDebts[2].bal - 25);
    expect(debts.totalBal).toBe(initialDebts.totalBal - payment );

    expect(debts.totalPaid).toBe(initialDebts.totalPaid + 35);
    expect(debts[1].totalPaid).toBe(10);
    expect(debts[2].totalPaid).toBe(25);



  })

  it('should not pay more than remaning bal if entire debt list has been completely paid off', function(){
    var totalBal, debtbal1;
    addSummaryProperties(debts);

    debts[0].bal = 1;
    debts[1].bal = 1;
    debts[2].bal = 0;

    getTotalBal(debts);

    makeMonthlyPayment(debts, debts[0]);
    expect(parseInt(debts[0].bal)).toBe(0);
    expect(parseInt(debts[1].bal)).toBe(0);
    expect(parseInt(debts[2].bal)).toBe(0);

    expect(parseInt(debts.totalBal)).toBe(0);
    expect(debts.totalPaid).toBe(2);

  });

  it('should iterate though all debts, and call functions to add interest and make payments', function(){
    addSummaryProperties(debts);
    getTotalBal(debts);
    spyOn(window, 'addMonthlyInterest').and.callThrough();
    spyOn(window, 'makeMonthlyPayment').and.callThrough();
    iterateMonths(debts);
    expect(totalBal).toBeGreaterThan(0);
    expect(window.addMonthlyInterest).toHaveBeenCalled();
    expect(window.makeMonthlyPayment).toHaveBeenCalled();
  });

  it('should not iterate though debts if debt list balance is zero', function(){
    addSummaryProperties(debts);
    getTotalBal(debts);
    debts.totalBal = 0;
    spyOn(window, 'addMonthlyInterest').and.callThrough();
    spyOn(window, 'makeMonthlyPayment').and.callThrough();
    iterateMonths(debts);
    expect(window.addMonthlyInterest).not.toHaveBeenCalled();
    expect(window.makeMonthlyPayment).not.toHaveBeenCalled();

    debts[0].bal = 0;
    debts[1].bal = 0;
    debts[2].bal = 0;
    debts.totalBal = 100;

    iterateMonths(debts);
    expect(addMonthlyInterest).not.toHaveBeenCalled();
    expect(makeMonthlyPayment).not.toHaveBeenCalled();
  });

  it('should pay off a list of one loan equally for all three method of payment with no extra money paid', function (){
    var interestFirst, balanceFirst, minimum, EXTRA_MONEY;
    EXTRA_MONEY = 0;

    interestFirst = runSimulation(debtsV3, 'interest', EXTRA_MONEY);
    balanceFirst = runSimulation(debtsV3, 'balance', EXTRA_MONEY);
    minimum = runSimulation(debtsV3, 'minimum', EXTRA_MONEY);

    expect(interestFirst.totalPaid).toBe(balanceFirst.totalPaid);
    expect(balanceFirst.totalPaid).toBe(minimum.totalPaid);

    expect(moneyRound(interestFirst.totalPaid)).toBe(4186.69);

    expect(interestFirst.months).toBe(37);
    expect(balanceFirst.months).toBe(37);
    expect(minimum.months).toBe(37);

    // compared with bankrate auto calculator- of 3 year loan. 1 extra month is due to frequency of compounding interest
    // bal 3765, 36 mo, 7% interest
  });

  it('should pay off a loan quicker when extra money is applied', function(){
    var interestFirst, balanceFirst, minimum, EXTRA_MONEY;
    EXTRA_MONEY = 209.52; //enough money to convert a 3 year term to 1 year term, see bankrate

    interestFirst = runSimulation(debtsV3, 'interest', EXTRA_MONEY);
    balanceFirst = runSimulation(debtsV3, 'balance', EXTRA_MONEY);
    minimum = runSimulation(debtsV3, 'minimum', EXTRA_MONEY);

    expect(interestFirst.totalPaid).toBe(balanceFirst.totalPaid);
    expect(minimum.totalPaid).toBe(4186.69);

    expect(moneyRound(interestFirst.totalPaid)).toBe(3909.8);

    expect(interestFirst.months).toBe(13);
    expect(balanceFirst.months).toBe(13);
    expect(minimum.months).toBe(37);
  });

  it('should pay off a list of more than 1 loan', function(){
    //first loan gets paid off in 15 months and adds payment to second loan to make it become
    // bal 10936.42, int rate 7, payment 798.06, the conditions from debtsV5
    var standAlone, EXTRA_MONEY;
    debts.pop(2);
    EXTRA_MONEY = 0;
    interestFirst = runSimulation(debtsV4, 'interest', EXTRA_MONEY);
    standAlone = runSimulation(debtsV5, 'interest', EXTRA_MONEY);

    expect(standAlone.months).toBe(15);
    expect(interestFirst.months).toBe(31);


  });

  it('should pay off debts quicker when we add extra money', function() {
    var EXTRA_MONEY, normalSim, extraMoneySim, basePay;
    EXTRA_MONEY = 0;

    function getTotalRecurring (list) {
      var debt, totalRecurring;
      totalRecurring = 0;
      for (var i = 0; i < list.length; i++){
        debt = list[i];
        totalRecurring += debt.payment;
      }
      return totalRecurring;
    }

    function getMaxPayment (list) {
      var max = 0;
      for (var i = 0; i < list.length; i++){
        debt = list[i];
        if (debt.payment > max) {
          max = debt.payment;
        }
      }
      return max;
    }

    basePay = getTotalRecurring(debtsNK);
    expect(basePay).toBe(408);

    normalSim = runSimulation(debtsNK, 'balance', EXTRA_MONEY);
    expect(getMaxPayment(normalSim)).toBe(basePay + EXTRA_MONEY);

    EXTRA_MONEY = 100;
    extraMoneySim = runSimulation(debtsNK, 'balance', EXTRA_MONEY);
    expect(getMaxPayment(extraMoneySim)).toBe(basePay + EXTRA_MONEY)

    expect(extraMoneySim.months).toBeLessThan(normalSim.months);
    expect(extraMoneySim.totalPaid).toBeLessThan(normalSim.totalPaid);


  });

 it('should allocate tons of extra money', function () {
  expect('this').toBe('tested');
  //only add 1st months interest if allocation is huge
 });

  describe("Display features", function(){
    it('can convert months into years and months', function(){
      var units, AR;

      AR = (function() {

        function unitsToPieces (smallUnit, bigUnit, amount, divisor){
          var units = {};
          if (bigUnit === 'years') {
            divisor = 12;
          }
          if (bigUnit === 'hours') {
            divisor = 60;
          }
          units[bigUnit] = parseInt(amount / divisor);
          units[smallUnit] = amount % divisor;

          return units;
        }

        return {
          unitsToPieces : unitsToPieces
        };

      }());

      expect(AR).toBeDefined();
      units = AR.unitsToPieces('months', 'years', 13);
      expect(units.years).toBe(1);
      expect(units.months).toBe(1);

      units = AR.unitsToPieces('months', 'years', 27);
      expect(units.years).toBe(2);
      expect(units.months).toBe(3);

      units = AR.unitsToPieces('months', 'years', 60);
      expect(units.years).toBe(5);
      expect(units.months).toBe(0);
    });

    it('should format currency and add separators for thousands', function(){
      var entries, entry;
      entries = [
        {
          in: '200.13',
          out: '$200.13'
        },
        {
          in: '5000',
          out: '$5,000'
        },
        {
          in: '200',
          out: '$200'
        },
        {
          in: '10000.13',
          out: '$10,000.13'
        },
        {
          in: '54000',
          out: '$54,000'
        },
        {
          in: '200000.13',
          out: '$200,000.13'
        },
        {
          in: '1000000.13',
          out: '$1,000,000.13'
        },
      ]

      for(var i =0; i < entries.length; i++ ){
        entry = entries[i];
        expect(formatCurrency(entry.in)).toBe(entry.out);
      }
      
    })
  });

  
});
