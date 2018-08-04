
var map = document.getElementById('map');
var orderForm = document.forms['order-form'];
var orderTypeRadio = document.forms['order-form'].elements['order-type-radio'];
var weightRadio = document.forms['order-form'].elements['choice-weight'];
var urgencyCheckBox = document.forms['order-form'].elements['urgency-checkbox'];
var orderTipInput = document.forms['order-form'].elements['order-tip-input'];
 
var startAddressInput = document.forms['order-form'].elements['start-address'];
var orderDistance = document.getElementById('order-distance');
var orderElevation = document.getElementById('order-elevation');
var orderPrice = document.getElementById('order-price');


var startAddressDiv = document.getElementById('start-address');
var startAddressInput = document.getElementById('start-address-input');
var endAddressDiv = document.getElementById('end-address');
var endAddressInput = document.getElementById('end-address-input');
var addressesDiv = document.getElementById('addresses');
var fixedPriceDiv = document.getElementById('fixed-price');
var fixedPriceContent = document.getElementById('fixed-price-content');

var lineInfoWindowContent = document.getElementById('line-infowindow');
var lineInfoWindowDistance = document.getElementById('line-infowindow-distance');
var lineInfoWindowElevation = document.getElementById('line-infowindow-elevation');
var lineInfoWindowPrice = document.getElementById('line-infowindow-price');
var lineInfoWindow;

var nextStageButton = document.forms['order-form'].elements["next-stage-button"];
var clientStageRadio = document.forms['order-form'].elements["client-form-stage"];
var orderStageRadio = document.forms['order-form'].elements["order-form-stage"];

var objectDeliveryOrderContainer = document.getElementById('objectdelivery-order-container');
var personalizedOrderContainer = document.getElementById('personalized-order-container');

var pointsPath;

var order = null;
var googleMap = null;

function validateOrderType() {
	objectDeliveryOrderContainer.classList.add("hidden");
	personalizedOrderContainer.classList.add("hidden");

	for(var i = 0; i < orderTypeRadio.length; i++) {
		var radio = orderTypeRadio[i];

		if (radio.value == "objectdelivery") {
			order.orderType = OrderType.objectdelivery;

			objectDeliveryOrderContainer.classList.remove("hidden");
		}/* else if (radio.value == "course") {
			order.orderType = OrderType.course;

			document.getElementById('course-order-container').classList.remove("hidden");
		} else if (radio.value == "personalized") {
			order.orderType = OrderType.personalized;

			document.getElementById('personalized-order-container').classList.remove("hidden");
		} else if (radio.value == "backathome") {
			order.orderType = OrderType.backathome;

			document.getElementById('backathome-order-container').classList.remove("hidden");
		}*/
	}
}

/*function validateOrderType(radio) {
	objectDeliveryOrderContainer.classList.add("hidden");
	personalizedOrderContainer.classList.add("hidden");

	if(radio && radio.value) {
		if (radio.value == "objectdelivery") {
			order.orderType = OrderType.objectdelivery;

			document.getElementById('objectdelivery-order-container').classList.remove("hidden");
		} else if (radio.value == "course") {
			order.orderType = OrderType.course;

			document.getElementById('course-order-container').classList.remove("hidden");
		} else if (radio.value == "personalized") {
			order.orderType = OrderType.personalized;

			document.getElementById('personalized-order-container').classList.remove("hidden");
		} else if (radio.value == "backathome") {
			order.orderType = OrderType.backathome;

			document.getElementById('backathome-order-container').classList.remove("hidden");
		}
	}
}*/

function validateWeight() {
	for (var i = 0; i < weightRadio.length; i++) {
		if (weightRadio[i].checked) {
			var radioValue = weightRadio[i].value;
			var weight = null;

			if (radioValue == "1") {
				weight = 1;
			} else if (radioValue == "2") {
				weight = 2;
			} else if (radioValue == "3") {
				weight = 3;
			} else if (radioValue == "4") {
				weight = 4;
			}

			order.weight = weight;
		}
	}
}

urgencyCheckBox.addEventListener("change", function() {
	order.urgency = this.checked;
});

orderTypeRadio.forEach(function(radio) {
	radio.addEventListener("change", function() {
		validateOrderType(this);
	});
});

//May not work
weightRadio.forEach(function(radio) {
	radio.addEventListener("change", function() {
		validateWeight();
	});
});

orderTipInput.addEventListener("change", function() {
	order.donation = parseFloat(orderTipInput.value);
});

nextStageButton.addEventListener("click", function() {
	clientStageRadio.checked = true
});

orderForm.addEventListener("reset", function() {
	validateOrderType(null);
});

window.addEventListener("load", function() {
	if (typeof(Storage) === "undefined") {
		console.log("no storage");
	}

	order = new Order();
	order.refreshUI = function() {
		lineInfoWindowPrice.textContent = String(Math.round(order.distancePrice * 100) / 100);
	    lineInfoWindowDistance.textContent = String(Math.round(order.distance * 100) / 100);
	    lineInfoWindowElevation.textContent = String(Math.round(order.elevation * 100) / 100);
	    fixedPriceContent.textContent = String(Math.round(order.totalPrice() * 100) / 100);
	};

	googleMap = new Map(map, order, startAddressInput, endAddressInput, lineInfoWindowContent);
	googleMap.handleStartAddressAutocomplete();
	googleMap.handleEndAddressAutocomplete();

/*	for(var i = 0; i < orderTypeRadio.length; i++) {
		if(orderTypeRadio[i].checked) {
			validateOrderType(orderTypeRadio[i]);
	}*/

	validateOrderType();
	validateWeight();

	order.urgency = urgencyCheckBox.checked;
	order.donation = parseFloat(orderTipInput.value);
});