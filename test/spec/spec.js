describe("Debt calculator", function() {

  var debts, AR;


  beforeEach(function() {
    debts = [
      {
        "name"        : 'Chase',
        "bal"         : 2466.36,
        "payment"     : 25,
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
    debts.sort(compareInterest);
    expect(debts[0].name).toBe('AMEX');
    expect(debts[1].name).toBe('Toyota');
    expect(debts[2].name).toBe('Chase');
  });

  it('is able to sort by lowest amount', function(){
    debts.sort(compareBal);
    expect(debts[0].name).toBe('AMEX');
    expect(debts[1].name).toBe('Chase');
    expect(debts[2].name).toBe('Toyota');
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

  it('should get the total balance owed for all debts in object', function(){
    addSummaryProperties(debts);
    getTotalBal(debts);
    expect(debts.totalBal).toBe(17538.72);

    addSummaryProperties(debts);
    debts[1].bal = 20000;
    getTotalBal(debts);
    expect(debts.totalBal).toBe(22538.72);
  });

  it('should allocate money to the first debt with a balance greater than zero', function(){
    expect(debts[0].payment).toBe(25);
    allocateExtraMoney(debts, 50);
    expect(debts[0].payment).toBe(75);

    //remaining should be unchanged
    expect(debts[1].payment).toBe(425.10);
    expect(debts[2].payment).toBe(35);
  });

  it('should allocate money if debt list is set up to pay minimum', function(){
    debts.payMinimum = true;
    expect(debts[0].payment).toBe(25);
    allocateExtraMoney(debts, 50);
    expect(debts[0].payment).toBe(25);

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
    

    netPayment = debts[0].payment - calculateMonthlyInterest(debts[0]);
    
    makeMonthyPayments(debts, debt);

    expect(debts.totalBal).toBe(totalBal - netPayment);
    expect(debts[0].bal).toBe(debtBal - netPayment);

  });

  it('should pay exact amount of last payment,', function(){

    var monthlyInterest, finalPayment;

    addSummaryProperties(debts);
    getTotalBal(debts);

    totalBal = debts.totalBal;

    netPayment = debts[0].payment - calculateMonthlyInterest(debts[0]);
    expect(netPayment).toBeGreaterThan(debts[0].bal);

    finalPayment = debts[0].bal + calculateMonthlyInterest(debts[0]);
    
    makeMonthyPayments(debts, debt);

    expect(debts.totalBal).toBe(totalBal - finalPayment);
    expect(debts[0].bal).toBe(0);

  });

  it('should take remaining funds of last payment, and apply to next non zero debt', function(){
    var totalBal, debtbal1;
    addSummaryProperties(debts);
    getTotalBal(debts);

    debts[0].bal = 1;
    debtbal1.bal = debts[1].bal;
    totalBal = debts.totalBal;

    extraPayment =  calculateMonthlyInterest(debts[0]) - debts[0].payment;

    makeMonthyPayments(debts, debt);
    expect(debts[0].bal).toBe(0);
    expect(debts[1].bal).toBe(debtbal1 - extraPayment);

    expect(debts.totalBal).toBe(totalBal - debts[0].payment);

  });

  it('should only pay remaning bal and nothing else if debt list has been completely paid off', function(){
    var totalBal, debtbal1;
    addSummaryProperties(debts);
    getTotalBal(debts);

    debts[0].bal = 1;
    debts[1].bal = 0;
    debts[2].bal = 0;

    extraPayment =  calculateMonthlyInterest(debts[0]) - debts[0].payment;

    makeMonthyPayments(debts, debt);
    expect(debts[0].bal).toBe(1);
    expect(debts[1].bal).toBe(0);
    expect(debts[2].bal).toBe(0);

    expect(debts.totalBal).toBe(0).payment);
    expect(debts.totalPaid).toBe(1);

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
  });

  
});
