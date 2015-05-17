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
function recordPayment(list, debt, payment){
	debt.totalPaid += payment;
	debt.months += 1;
	list.months = debt.months;
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
		if (debt.bal > 0.1){
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

/**
* @description Iterates through all non zero debts, while the debt list total balance is greater than zero
* it calls functions to add monthly interest and make monthly payments. Each interation represents a month.
* @param {object} list - The list of debts
*
*/
function iterateMonths(list){
	var months = 0;
	while((list.totalBal - 0.5 > 0) && (months < 1200)){
		for (var i = 0; i < list.length; i ++){
			var debt = list[i];
			if (debt.bal > 0){
				addMonthlyInterest(list, debt);
				makeMonthlyPayment(list, debt);
			}
		}
		months++;
	}
}

/**
* Makes a monthly payment for a specific debt in the list. If debt is paid off, it calls functions to handle surplus
* and extra money from monthly payment
* @param {object} debt - The debt that will receive monthly payment
* @param {number} debt.bal - The balance of the debt
* @param {number} debt.payment - The monthly payment amount
* @param {object} list - The debt list
* @param {number} list.totalBal - The total balance of the debtList
*
*/
function makeMonthlyPayment(list, debt) {
	var payment, isFinalPayment, surplus;
		// console.log('total bal ctrl', list.totalBal)

	payment = debt.payment;
	if (debt.bal - payment < 0.1){
		isFinalPayment = true;
		payment = debt.bal;
		surplus = debt.payment - payment
	}
	debt.bal = moneyRound(debt.bal - payment);
	list.totalBal = moneyRound(list.totalBal - payment);
	recordPayment(list, debt, payment);
	if(isFinalPayment) {
		allocateExtraMoney(list, debt.payment);
		allocateSurplusPayment(list, surplus);
		isFinalPayment = false;
	}
}

function allocateSurplusPayment(list, surplus){
	var remainingSurplus, debt;
	if (list.payMinimum){
		return;
	}
	if (list.totalBal > 0) {
		for(var i=0; i<list.length; i++){
			debt = list[i];
			if (debt.bal > 0.1) {
				if (debt.bal - surplus > 0) {
					debt.bal -= surplus;
					list.totalBal -= surplus;
					list.totalPaid += surplus;
					debt.totalPaid += surplus;
					break;
				} else {
					remainingSurplus = surplus - debt.bal;
					list.totalBal -= debt.bal
					list.totalPaid += debt.bal
					debt.totalPaid += debt.bal
					debt.bal = 0;
					allocateExtraMoney(list, debt.payment);
					allocateSurplusPayment(list, remainingSurplus);
					break;
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

function runSimulation(list, method, extraMoney){
	var summaryList = JSON.parse( JSON.stringify( list ) );
	summaryList.payMinimum = false;
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
			summaryList.payMinimum = true;
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
      
	var interestFirst = runSimulation(debtList,'interest', extraMoney);
	var balanceFirst = runSimulation(debtList,'balance', extraMoney);
	var minimum = runSimulation(debtList,'minimum', 0);

	displayResults('interest-first', interestFirst);
	displayResults('balance-first', balanceFirst);
	displayResults('minimum', minimum);

}

function displayResults(method, list){
	//minimum, //interest //balance
	var $container, units, now;
	now = new Date();
	units = AR.unitsToPieces('months', 'years', list.months);
	now.setFullYear(now.getFullYear() + units.years);
	now.setMonth(now.getMonth() + units.months - 1);
	$('#results-container').show();
	$('#original-bal').html(formatCurrency(list.originalAmountOwed));
	$container = $('#' + method);
	$container.find('.total-paid').html(formatCurrency(moneyRound(list.totalPaid)));
	$container.find('.total-months').html(units.years + ' year(s) and '+ units.months + ' month(s)' + ' -- ' + now.toDateString());
}

String.prototype.insert = function (index, string) {
  if (index > 0)
    return this.substring(0, index) + string + this.substring(index, this.length);
  else
    return string + this;
};

/**
* Formats a number to include $ and commas for thousands
* @param {number | string} input number. eg 5000
* @returns {string} formatted version with $ and commas. $5,000
*/
function formatCurrency(input){
	input = input.toString();
	var lastWholeNumPos, decimalPos, length, baseTenPos;
	length = input.length;
	decimalPos = input.indexOf('.');
	lastWholeNumPos = decimalPos > -1 ? decimalPos : input.length;

	if (lastWholeNumPos < 4){
		return input.insert(0, '$');
	} else {
		for (var i = lastWholeNumPos; i > 0; i--) {
			baseTenPos = lastWholeNumPos - i;
			if ( ( baseTenPos % 3 == 0)  && (baseTenPos > 0)) {
				input = input.insert( i, ",");
			}
		}
		return input.insert(0, '$');;
	}
}

$(document).ready(function(){
	$('#delete').on('click touch', function(el){
		el.preventDefault();
		if( $('table tr').length > 2) {
			$('table tr:last').remove();
		}
	});

	$('#add').on('click touch', function(el){
		el.preventDefault();
		$('table tbody').append( '<tr>' + $('table tr:last').html() + '</tr>');
	});
});



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
