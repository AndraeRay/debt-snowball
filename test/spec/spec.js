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
    amount = 1.456
    roundedAmount = moneyRound(amount);
    expect(roundedAmount).toBe(1.46);

    amount = 1.9226
    roundedAmount = moneyRound(amount);
    expect(roundedAmount).toBe(1.93);

    amount = 1.999
    roundedAmount = moneyRound(amount);
    expect(roundedAmount).toBe(2.0);

  });

  it('is able to sort by highest Interest', function(){
    debts.sort(highestInterest);
    expect(debts[0].name).toBe('AMEX');
    expect(debts[1].name).toBe('Toyota');
    expect(debts[2].name).toBe('Chase');
  });

  it('is able to sort by lowest amount', function(){
    debts.sort(lowestBal);
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
        }

      }())

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
  })

  
});
