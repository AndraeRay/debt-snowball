describe("Debt calculator", function() {

  var debts;


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

  it('can calculate the monthly interest due', function(){

  });
});
