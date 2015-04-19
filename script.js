
var debts = [
	{
		"name"				: 'Great Lakes',
		"bal" 				: 271565,
		"payment"			: 2987,
		"totalInterestPaid"	: 0,
		"totalPaid"			: 0,
		"months"			: 0,
		"intRate"			: 6
	},
	{
		"name"				: 'Chase',
		"bal" 				: 9187,
		"payment"			: 163.69,
		"totalInterestPaid"	: 0,
		"totalPaid"			: 0,
		"months"			: 0,
		"intRate"			: 12.15
	},
	{
		"name"				: 'AES',
		"bal" 				: 11094,
		"payment"			: 167.82,
		"totalInterestPaid"	: 0,
		"totalPaid"			: 0,
		"months"			: 0,
		"intRate"			: 4.82
	},
	{
		"name"				: 'Sallie Mae',
		"bal" 				: 101514,
		"payment"			: 1600,
		"totalInterestPaid"	: 0,
		"totalPaid"			: 0,
		"months"			: 0,
		"intRate"			: 8	
	},
];

function gettotalBal(list){
	for (i = 0; i < list.length; i++) {
		list.totalBal += list[i].bal;
	}
	list.originalAmountOwed = list.totalBal;
}

function sumTotals(list, idx, payment){
	list[idx].totalPaid += payment;
	list[idx].months += 1;
	list.months = list[idx].months > list.months ? list[idx].months : list.months;
	list.totalPaid += payment;
}

function allocateExtraMoney(list, extraMoney){
	if (list.payMinimum){
		// console.log('no reallocate!');
		return;
	}
	for (i = 0; i < list.length; i++) {
		debt = list[i];
		if (debt.bal > 0){
			debt.payment += extraMoney;
			break;
		}
	}
}

function lowestBal(a,b) {
  if (a.bal > b.bal) {
    return 1;
  }
  if (a.bal < b.bal) {
    return -1;
  }
  // a must be equal to b
  return 0;
}

function highestInterest(a,b){
	
	if (a.intRate > b.intRate){
		return -1;
	}
	if (a.intRate < b.intRate){
		return 1;
	}
	return 0;
}

function moneyRound(amount){
	return Math.ceil(amount * 100) / 100;
}

function calculateMonthlyInterest(debt) {
	var r, t, n, principal, newAmount, interestForMonth;
	r = debt.intRate / 100;
	t = 1/12;
	n = 365;
	principal = debt.bal;
	newAmount =  principal * Math.pow(1 + r/n , n * t);

	interestForMonth = moneyRound(newAmount - principal);

	return interestForMonth;
}

function addMonthlyInterest(list, debt){
	var monthlyInterest;
	monthlyInterest = calculateMonthlyInterest(debt);
	debt.bal += monthlyInterest;
	list.totalBal += monthlyInterest;
	debt.totalInterestPaid += monthlyInterest; 
}


function makeMonthlyPayments(list){
	var payment, monthlyInterest, isFinalPayment;
	while(list.totalBal - 0.5 > 0){
		for (i = 0; i < list.length; i ++){
			debt = list[i];
			if (debt.bal > 0){
				addMonthlyInterest(list, debt);
				payment = debt.payment;
				if (debt.bal - payment < 0){
					isFinalPayment = true;
					payment = debt.bal;
				}
				debt.bal -= payment;
				list.totalBal -= payment;
				sumTotals(list, i, payment);
				if(isFinalPayment) {
					allocateExtraMoney(list, debt.payment);
					isFinalPayment = false;
				}
			}
		}
	}

}

function addProperties(list){
	list.totalPaid = 0;
	list.totalBal = 0;
	list.months = 0;
}

function runSimulation(list, method, extraMoney, payMinimum){
	var summaryList = JSON.parse( JSON.stringify( list ) );
	summaryList.payMinimum = payMinimum;
	console.log(summaryList.payMinimum);

	addProperties(summaryList);
	gettotalBal(summaryList);
	switch(method){
		case 'interest':
			summaryList.sort(highestInterest);
			break;
		case 'balance':
			summaryList.sort(lowestBal);
			break;
		default :
			extraMoney = 0;
	}

	allocateExtraMoney(summaryList, extraMoney);
	makeMonthlyPayments(summaryList);
	return(summaryList);
}


a1 = JSON.parse( JSON.stringify( debts ) );
a2 = JSON.parse( JSON.stringify( debts ) );
a3 = JSON.parse( JSON.stringify( debts ) );

var run1 = runSimulation(a1,'interest', 500, false);
var run2 = runSimulation(a2,'balance', 500, false);
var run3 = runSimulation(a3,'', 0, true);

function ConvertFormToJSON(form){
    var array = jQuery(form).serializeArray();
    var json = {};

    console.log(array);
    
    jQuery.each(array, function() {
        json[this.name] = parseInt(this.value) || '';
    });
    json.totalInterestPaid = 0;
    json.totalPaid = 0;
    json.months = 0;
    
    return json;
}
jQuery.fn.formToJson = function (fieldsPerItem){
	var userInput = this.serializeArray();
	console.log("user input", userInput)
	var array = [];
	var json = {};
	var key, val;
	$(userInput).each(function(i, field){
		key = field.name;
		val = field.name === 'name' ? field.value : parseInt(field.value);
		json[key] = val;
		if ( (i+1) %  fieldsPerItem === 0 ) {
			json.months = 0;
			array.push(json);
			json = {};
		}
	});
	return(array);
}

function mySubmit (item) {
	var debtList;

    debtList = $("#loanEntryForm").formToJson(4);
      

	var interestFirst = runSimulation(debtList,'interest', 0, false);
	var balanceFirst = runSimulation(debtList,'balance', 0, false);
	var minimum = runSimulation(debtList,'', 0, true);

	displayResults('interest-first', interestFirst);
	displayResults('balance-first', balanceFirst);
	displayResults('minimum', minimum);

	console.log(item.name.value);
}

function displayResults(method, list){
	//minimum, //interest //balance
	var $container;
	$container = $('#' + method);
	$container.find('.total-paid').html(list.totalPaid);
	$container.find('.total-months').html(list.months);
}

console.log("run1", run1);
console.log("run2", run2);
console.log("run3", run3);

var single = [
	{
		"name"				: 'cc 1',
		"bal" 				: 2466.36,
		"payment"			: 87,
		"totalInterestPaid"	: 0,
		"totalPaid"			: 0,
		"months"			: 0,
		"intRate"			: 15.99
	},
		{
		"name"				: 'cc 1',
		"bal" 				: 2466.36,
		"payment"			: 87,
		"totalInterestPaid"	: 0,
		"totalPaid"			: 0,
		"months"			: 0,
		"intRate"			: 15.99
	}
];

var runSingle = runSimulation(single,'balance', 0, false);
console.log("single", runSingle);