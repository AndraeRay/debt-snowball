"use strict";

var jQuery, $;

/**
* Calculates total total balance, and stores it in the object 
* @param {object} debtList - List of all the debts
* @param {number} debtList.bal - The Balance of each debt in the list
*/
function getTotalBal(list){
	for (var i = 0; i < list.length; i++) {
		list.totalBal += list[i].bal;
	}
	list.originalAmountOwed = list.totalBal;
}

/**
* Records payment in individual debt, and debt list. Increments months of payment for individual debt and debt list
* @param {object} list - list of all the debts
* @param {number} list.totalPaid - the total paid for entire debt list
* @param {number} list.months - the total amount of months for which payments have been made for entire list
* @param {number} list[].months - the amount of monthly payments that have been made on debt
* @param {number} list[].totalPaid - the total payments made toward this debt
* @param {number} idx - the index of the debt where a payment was made
* @param {number} payment - the payment amount
*
*/
function recordPayment(list, idx, payment){
	list[idx].totalPaid += payment;
	list[idx].months += 1;
	list.months = list[idx].months > list.months ? list[idx].months : list.months;
	list.totalPaid += payment;
}

/**
* Adds additional money to the first loan with balance greater than zero
* @param {object} debtList - list of all debts
* @param {boolean} debtList.payMinimum - boolean to see if extra money should be reallocated
* @param {number} debtList.[].bal - the balance of a specific debt in list
* @param {number} extraMoney - amount of money that should be added
*/
function allocateExtraMoney(list, extraMoney){
	if (list.payMinimum){
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

/**
* Comparator to sort by balance
* @param {object} a - the first debt object
* @param {number} a.bal - Balance of the first debt
* @param {object} b - the second debt object
* @param {number} b.bal - Balance of the second debt
*/
function compareBal(a,b) {
  if (a.bal > b.bal) {
    return 1;
  }
  if (a.bal < b.bal) {
    return -1;
  }
  // a must be equal to b
  return 0;
}

/**
* Comparator to sort by interest rates
* @param {object} a - the first debt object
* @param {number} a.intRate - Interest rate of the first debt
* @param {object} b - the second debt object
* @param {number} b.intRate - Interest rate of the second debt
*/
function compareInterest(a,b){
	
	if (a.intRate > b.intRate){
		return -1;
	}
	if (a.intRate < b.intRate){
		return 1;
	}
	return 0;
}

/**
* Returns the number rounded up to the nearest tenth
* @param {number} amount
* @returns {number} - the number rounded up to the nearest tenth 
*/
function moneyRound(amount){
	return Math.ceil(amount * 100) / 100;
}

/**
* Returns the monthly interest of an debt
* @param {object} debt - the debt record
* @param {number} debt.intRate - The interest rate of the debt
* @param {number} debt.bal - The Balance of the debt
* @description Compounds interest daily and uses the compound Interst formula.
* A = P (1 + r/n)^(nt)
* @returns {number} monthly interst of a debt
*/
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

/**
* Adds monthly interest to debt's balance, list's overall balance, and overall interest paid
* @param {object} list - The list of debts
* @param {number} list.totalBal - The total Balance owed
* @param {object} debt - the individual debt
* @param {number} debt.bal - The current balance on the individual debt
* @param {number} debt.totalInterestPaid - The total interest paid thus far for the individual debt
*
*/
function addMonthlyInterest(list, debt){
	var monthlyInterest;
	monthlyInterest = calculateMonthlyInterest(debt);
	debt.bal += monthlyInterest;
	list.totalBal += monthlyInterest;
	debt.totalInterestPaid += monthlyInterest;
}


function iterateMonths(list){
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
				recordPayment(list, i, payment);
				if(isFinalPayment) {
					allocateExtraMoney(list, debt.payment);
					isFinalPayment = false;
				}
			}
		}
	}

}

/**
* Adds properties to overall debt list to keep track of overall change
* @params {object} list - the list of debts
*
*/
function addSummaryProperties(list){
	list.totalPaid = 0;
	list.totalBal = 0;
	list.months = 0;
}

function runSimulation(list, method, extraMoney, payMinimum){
	var summaryList = JSON.parse( JSON.stringify( list ) );
	summaryList.payMinimum = payMinimum;
	addSummaryProperties(summaryList);

	getTotalBal(summaryList);
	switch(method){
		case 'interest':
			summaryList.sort(compareInterest);
			break;
		case 'balance':
			summaryList.sort(compareBal);
			break;
		default :
			extraMoney = 0;
	}

	allocateExtraMoney(summaryList, extraMoney);
	iterateMonths(summaryList);
	return(summaryList);
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
}

function displayResults(method, list){
	//minimum, //interest //balance
	var $container, units;
	units = AR.unitsToPieces('months', 'years', list.months);
	$('#results-container').show();
	$container = $('#' + method);
	$container.find('.total-paid').html(moneyRound(list.totalPaid));
	$container.find('.total-months').html(units.years + ' year(s) and '+ units.months + ' month(s)');
}

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
	};

}());
