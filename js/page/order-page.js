
var map = document.getElementById('map');
var orderForm = document.forms['order-form'];
var orderTypeRadio = document.forms['order-form'].elements['order-type-radio'];
var weightRadio = document.forms['order-form'].elements['choice-weight'];
var urgencyCheckBox = document.forms['order-form'].elements['urgency-checkbox'];
var orderTipInput = document.forms['order-form'].elements['order-tip-input'];

var clientNameInput = document.forms['order-form'].elements['client-name-input'];
var clientAddressInput = document.forms['order-form'].elements['client-address-input'];
var clientAddressComplementInput = document.forms['order-form'].elements['client-address-complement-input'];
var clientMailInput = document.forms['order-form'].elements['client-mail-input'];
var clientNumberInput = document.forms['order-form'].elements['client-number-input'];
var validateButton = document.forms['order-form'].elements['validate-button']; 

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
var backStageButton = document.forms['order-form'].elements["back-stage-button"];
var clientStageRadio = document.forms['order-form'].elements["client-form-stage"];
var orderStageRadio = document.forms['order-form'].elements["order-form-stage"];
var validationStageRadio = document.forms['order-form'].elements["validation-form-stage"];

var objectDeliveryOrderContainer = document.getElementById('objectdelivery-order-container');
var personalizedOrderContainer = document.getElementById('personalized-order-container');

var pointsPath;

function refreshSummary() {
	// Retrieve order details from url arguments and inject them into Fields

	var orderTypeField = document.getElementById('order-type-field');
	var orderStartAddressField = document.getElementById('start-address-field');
	var orderEndAddressField = document.getElementById('end-address-field');
	var orderDistanceField = document.getElementById('distance-field');
	var orderElevationField = document.getElementById('elevation-field');
	var orderDistancePriceField = document.getElementById('distance-price-field');
	var orderWeightField = document.getElementById('weight-field');
	var orderUrgencyField = document.getElementById('urgency-field');
	var orderTipField = document.getElementById('order-tip-field');

	var clientNameField = document.getElementById('client-name-field');
	var clientAddressField = document.getElementById('client-address-field');
	var clientAddressComplementField = document.getElementById('client-address-complement-field');
	var clientMailField = document.getElementById('client-mail-field');
	var clientNumberField = document.getElementById('client-number-field');

	var orderPriceField = document.getElementById('order-price-field');

	orderTypeField.textContent = orderTypeRadio.value;
	orderStartAddressField.textContent = startAddressInput.value;
	orderEndAddressField.textContent = endAddressInput.value;
	orderDistanceField.textContent = order.distance;
	orderElevationField.textContent = order.elevation;
	orderDistancePriceField.textContent = order.distancePrice;
	orderWeightField.textContent = weightRadio.value;
	orderUrgencyField.textContent = urgencyCheckBox.checked;
	orderTipField.textContent = orderTipInput.value;

	clientNameField.textContent = clientNameInput.value;
	clientAddressField.textContent = clientAddressInput.value;
	clientAddressComplementField.textContent = clientAddressComplementInput.value;
	clientMailField.textContent = clientMailInput.value;
	clientNumberField.textContent = clientNumberInput.value;

	orderPriceField.textContent = order.totalPrice;
}

	order = new Order();
	order.refreshUI = function() {
		lineInfoWindowPrice.textContent = String(Math.round(order.distancePrice * 100) / 100);
	    lineInfoWindowDistance.textContent = String(Math.round(order.distance * 100) / 100);
	    lineInfoWindowElevation.textContent = String(Math.round(order.elevation * 100) / 100);
	    fixedPriceContent.textContent = String(Math.round(order.totalPrice * 100) / 100);
	    refreshSummary();
	};
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
	if (orderStageRadio.checked) {
		if (order.startWaypoint == null 
			|| !order.startWaypoint.isValid) {
			startAddressInput.setCustomValidity("Veuillez selectionner le lieu de retrait");
			startAddressInput.reportValidity();
			return;
		}

		if (order.endWaypoint == null 
			|| !order.endWaypoint.isValid) {
			endAddressInput.setCustomValidity("Veuillez selectionner le lieu de dépose");
			endAddressInput.reportValidity();
			return;
		}

		if (!weightRadio[0].reportValidity()) {
			return;
		}

		clientStageRadio.checked = true;
	} else if (clientStageRadio.checked) {
		if (!clientNameInput.reportValidity()
			|| !clientAddressInput.reportValidity()
			|| !clientMailInput.reportValidity()
			|| !clientNumberInput.reportValidity()) {
			return;
		}

		refreshSummary();
		validationStageRadio.checked = true;
	}
});

backStageButton.addEventListener("click", function() {
	if (validationStageRadio.checked) {
		clientStageRadio.checked = true;
	} else if (clientStageRadio.checked) {
		orderStageRadio.checked = true;
	}
})

/*function checkAddressValidity() {

}*/

//startAddressInput.addEventListener("change", checkAddressValidity);
//startAddressInput.addEventListener("input", checkAddressValidity);


orderForm.addEventListener("reset", function() {
	validateOrderType(null);
});

orderForm.addEventListener("submit", function(e) {
	console.log("yop");
	  if (e.isDefaultPrevented()) {
	  	console.log("error");
    // handle the invalid form...
  } else {
  	console.log("no error");
    // everything looks good!
  }
});


orderForm.addEventListener("invalid", function(e) {
	console.log("yop");
});

window.addEventListener("load", function() {
	if (typeof(Storage) === "undefined") {
		console.log("no storage");
	}



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

	refreshSummary();
});


