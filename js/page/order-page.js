var objectDeliveryOrderContainer = document.getElementById('objectdelivery-order-container');

var map = document.getElementById('map');

var startAddressDiv = document.getElementById('start-address');
var endAddressDiv = document.getElementById('end-address');

var lineInfoWindow;
var lineInfoWindowContent = document.getElementById('line-infowindow');
var lineInfoWindowDistance = document.getElementById('line-infowindow-distance');
var lineInfoWindowElevation = document.getElementById('line-infowindow-elevation');
var lineInfoWindowPrice = document.getElementById('line-infowindow-price');

var personalizedOrderContainer = document.getElementById('personalized-order-container');

var fixedPriceContent = document.getElementById('fixed-price-content');

var orderForm = document.forms['order-form'];

var orderTypeRadio = orderForm.elements['order-type-radio'];

var clientNameInput = orderForm.elements['client-name-input'];
var clientAddressInput = orderForm.elements['client-address-input'];
var clientAddressComplementInput = orderForm.elements['client-address-complement-input'];
var clientMailInput = orderForm.elements['client-mail-input'];
var clientNumberInput = orderForm.elements['client-number-input'];
var validateButton = orderForm.elements['validate-button']; 

var startAddressInput = orderForm.elements['start-address-input'];
var startDateInput = orderForm.elements['start-date-input'];
var startTimeInput = orderForm.elements['start-time-input'];
var startInstructionInput = orderForm.elements['start-instruction-input'];

var endAddressInput = orderForm.elements['end-address-input'];
var endDateInput = orderForm.elements['end-date-input'];
var endTimeInput = orderForm.elements['end-time-input'];
var endInstructionInput = orderForm.elements['end-instruction-input'];

var weightRadio = orderForm.elements['choice-weight'];
var urgencyCheckBox = orderForm.elements['urgency-checkbox'];
var orderTipInput = orderForm.elements['order-tip-input'];

var nextStageButton = orderForm.elements["next-stage-button"];
var backStageButton = orderForm.elements["back-stage-button"];

var clientStageRadio =orderForm.elements["client-form-stage"];
var orderStageRadio = orderForm.elements["order-form-stage"];
var validationStageRadio = orderForm.elements["validation-form-stage"];

// ------- SUMMARY -------

var orderTypeField = document.getElementById('order-type-field');

var orderStartAddressField = document.getElementById('start-address-field');
var orderStartDateField = document.getElementById('start-date-field');
var orderStartTimeField = document.getElementById('start-time-field');
var orderStartInstructionField = document.getElementById('start-instruction-field');

var orderEndAddressField = document.getElementById('end-address-field');
var orderEndDateField = document.getElementById('end-date-field');
var orderEndTimeField = document.getElementById('end-time-field');
var orderEndInstructionField = document.getElementById('end-instruction-field');

var orderDistanceField = document.getElementById('distance-field');
var orderDistancePriceField = document.getElementById('distance-price-field');

var orderElevationField = document.getElementById('elevation-field');
var orderElevationPriceField = document.getElementById('elevation-price-field');

var orderWeightField = document.getElementById('weight-field');
var orderWeightPriceField = document.getElementById('weight-price-field');

var orderUrgencyField = document.getElementById('urgency-field');

var orderTipField = document.getElementById('order-tip-field');

var clientNameField = document.getElementById('client-name-field');
var clientAddressField = document.getElementById('client-address-field');
var clientAddressComplementField = document.getElementById('client-address-complement-field');
var clientMailField = document.getElementById('client-mail-field');
var clientNumberField = document.getElementById('client-number-field');

var orderPriceField = document.getElementById('order-price-field');

order = new Order();
order.refreshUI = function() {
	lineInfoWindowPrice.textContent = String(Math.round((order.distancePrice + order.elevationPrice) * 100) / 100);
    lineInfoWindowDistance.textContent = String(Math.round(order.distance * 100) / 100);
    lineInfoWindowElevation.textContent = String(Math.round(order.elevation * 100) / 100);
    fixedPriceContent.textContent = String(Math.round(order.totalPrice * 100) / 100);
    
    refreshSummary();
};

var googleMap = null;

function refreshSummary() {
	orderTypeField.textContent = order.printableOrderType;

	orderStartAddressField.textContent = startAddressInput.value;
	orderStartDateField.textContent = new Date(startDateInput.value).toLocaleDateString("fr-FR");
	orderStartTimeField.textContent = startTimeInput.value;
	orderStartInstructionField.textContent = startInstructionInput.value;

	orderEndAddressField.textContent = endAddressInput.value;
	orderEndDateField.textContent = new Date(endDateInput.value).toLocaleDateString("fr-FR");
	orderEndTimeField.textContent = endTimeInput.value;
	orderEndInstructionField.textContent = endInstructionInput.value;

	orderDistanceField.textContent = order.distance;
	orderDistancePriceField.textContent = order.distancePrice;

	orderElevationField.textContent = order.elevation;
	orderElevationPriceField.textContent = order.elevationPrice;
	
	orderWeightField.textContent = order.printableWeight;
	orderWeightPriceField.textContent = order.weightPrice;

	orderUrgencyField.textContent = urgencyCheckBox.checked;

	orderTipField.textContent = order.donation;

	clientNameField.textContent = clientNameInput.value;
	clientAddressField.textContent = clientAddressInput.value;
	clientAddressComplementField.textContent = clientAddressComplementInput.value;
	clientMailField.textContent = clientMailInput.value;
	clientNumberField.textContent = clientNumberInput.value;

	orderPriceField.textContent = order.totalPrice;
}

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

		
		var startDate;
		var startTime;

		startDateInput.setCustomValidity("");

		if (!startDateInput.reportValidity()) {
			return;
		} else {
			var today = new Date();
			today.setHours(0,0,0,0);
			startDate = new Date(startDateInput.value);
			
			if (startDate.getTime() < today.getTime()) {
				startDateInput.setCustomValidity("La date de retrait doit être postérieure ou égale à la date actuelle.")
				startDateInput.reportValidity();
				return;
			}
		}

		startTimeInput.setCustomValidity("");

		if (!startTimeInput.reportValidity()) {
			return;
		} else {
			startTime = startTimeInput.value
			var currentTime = new Date(new Date().toDateString() + " " + new Date().toLocaleTimeString());
			var selectedTime = new Date(startDate.toDateString() + " " + startTime);

			if (currentTime.getTime() > selectedTime.getTime()) {
				startTimeInput.setCustomValidity("L'heure selectionnée doit être postérieure à l'heure actuelle.");
				startTimeInput.reportValidity();
				return;
			}
		}

		if (order.endWaypoint == null 
			|| !order.endWaypoint.isValid) {
			endAddressInput.setCustomValidity("Veuillez selectionner le lieu de dépose");
			endAddressInput.reportValidity();
			return;
		}

		endDateInput.setCustomValidity("");
		var endDate;

		if (!endDateInput.reportValidity()) {
			return;
		} else {
			endDate = new Date(endDateInput.value);

			if (endDate.getTime() < startDate.getTime()) {
				endDateInput.setCustomValidity("La date de dépot doit être postérieure ou égale à la date de retrait.")
				endDateInput.reportValidity();
				return;
			}
		}

		endTimeInput.setCustomValidity("");

		if (!endTimeInput.reportValidity()) {
			return;
		} else {
			var startDateTime = new Date(startDate.toDateString() + " " + new Date(new Date().toDateString() + " " + startTime).toLocaleTimeString());
			var selectedDateTime = new Date(endDate.toDateString() + " " + endTimeInput.value);

			if (startDateTime.getTime() > selectedDateTime.getTime()) {
				endTimeInput.setCustomValidity("L'heure de dépot doit être postérieure ou égale à l'heure de retrait.");
				endTimeInput.reportValidity();
				return;
			}
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

		order.clientName = clientNameInput.value;
		order.clientAddress = clientAddressInput.value;
		order.clientAddressComplement = clientAddressComplementInput.value;
		order.clientMail = clientMailInput.value;
		order.clientNumber = clientNumberInput.value;

		refreshSummary();
		renderPaypal();
		validationStageRadio.checked = true;
	}
});

backStageButton.addEventListener("click", function() {
	if (validationStageRadio.checked) {
		clientStageRadio.checked = true;
	} else if (clientStageRadio.checked) {
		orderStageRadio.checked = true;

		Map.refreshMapViewPort();
	}
})

orderForm.addEventListener("reset", function() {
	validateOrderType(null);
});

/*orderForm.addEventListener("submit", function(e) {
	console.log("yop");

	if (e.isDefaultPrevented()) {
		console.log("error");
	} else {
		console.log("no error");
	}
});
*/

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

	validateOrderType();
	validateWeight();

	order.urgency = urgencyCheckBox.checked;
	order.donation = parseFloat(orderTipInput.value);

	renderPaypal();
	refreshSummary();
});
