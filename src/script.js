"use strict";

var debts = [
	{
		"name"				: 'Chase',
		"bal" 				: 100,
		"payment"			: 10,
		"totalInterestPaid"	: 0,
		"totalPaid"			: 0,
		"months"			: 0,
		"intRate"			: 1
	},
	{
		"name"				: 'Capital 1',
		"bal" 				: 2000,
		"payment"			: 25,
		"totalInterestPaid"	: 0,
		"totalPaid"			: 0,
		"months"			: 0,
		"intRate"			: 2
	},
	{
		"name"				: 'Toyota',
		"bal" 				: 300,
		"payment"			: 33,
		"totalInterestPaid"	: 0,
		"totalPaid"			: 0,
		"months"			: 0,
		"intRate"			: 3
	},
];

function gettotalBal(list){
	for (var i = 0; i < list.length; i++) {
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
	for (var i = 0; i < list.length; i++) {
		var debt = list[i];
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
		for (var i = 0; i < list.length; i ++){
			var debt = list[i];
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


var a1 = JSON.parse( JSON.stringify( debts ) );
var a2 = JSON.parse( JSON.stringify( debts ) );
var a3 = JSON.parse( JSON.stringify( debts ) );

var run1 = runSimulation(a1,'interest', 0, false);
var run2 = runSimulation(a2,'balance', 0, false);
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
};

function mySubmit (item) {
	var debtList, extraMoney;

    debtList = $("#loanEntryForm").formToJson(6);
    // console.log('debtList', debtList);
    extraMoney = $('#extraMoney').val() || 0;
    extraMoney = parseInt(extraMoney);
      
	var interestFirst = runSimulation(debtList,'interest', extraMoney, false);
	var balanceFirst = runSimulation(debtList,'balance', extraMoney, false);
	var minimum = runSimulation(debtList,'', 0, true);

	displayResults('interest-first', interestFirst);
	displayResults('balance-first', balanceFirst);
	displayResults('minimum', minimum);

	console.log("int first", interestFirst);
	console.log("bal first", balanceFirst);
	console.log("min", minimum);
//	console.log("minimum", runSimulation);
}

function displayResults(method, list){
	//minimum, //interest //balance
	var $container, units;
	units = AR.unitsToPieces('months', 'years', list.months)
	$('#results-container').show();
	$container = $('#' + method);
	$container.find('.total-paid').html(moneyRound(list.totalPaid));
	$container.find('.total-months').html(units.years + ' year(s) and '+ units.months + ' month(s)');
}



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

var AR = (function() {

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
