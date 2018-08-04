// Retrieve order details from url arguments and inject them into Fields

var orderTypeField = document.getElementById('order-type-radio');
var orderStartAddressField = document.getElementById('start-address-input');
var orderEndAddressField = document.getElementById('end-address-input');
var orderWeightField = document.getElementById('choice-weight');
var orderUrgencyField = document.getElementById('urgency-checkbox');
var orderTipField = document.getElementById('order-tip-input');

var clientNameField = document.getElementById('client-name-input');
var clientAddressField = document.getElementById('client-address-input');
var clientAddressComplementField = document.getElementById('client-address-complement-input');
var clientMailField = document.getElementById('client-mail-input');
var clientNumberField = document.getElementById('client-number-input');

var url = new URL(window.location.href);

var orderType = url.searchParams.get("order-type-radio");
var orderStartAddress = url.searchParams.get("start-address-input");
var orderEndAddress = url.searchParams.get("end-address-input");
var orderWeight = url.searchParams.get("choice-weight");
var orderUrgency = url.searchParams.get("urgency-checkbox");
var orderTip = url.searchParams.get("order-tip-inputt");

var clientName = url.searchParams.get("client-name-input");
var clientAddress = url.searchParams.get("client-address-input");
var clientAddressComplement = url.searchParams.get("client-address-complement-input");
var clientMail = url.searchParams.get("client-mail-input");
var clientNumber = url.searchParams.get("client-number-input");

orderTypeField.textContent = orderType;
orderStartAddressField.textContent = orderStartAddress;
orderEndAddressField.textContent = orderEndAddress;
orderWeightField.textContent = orderWeight;
orderUrgencyField.textContent = orderUrgency;
orderTipField.textContent = orderTip;

clientNameField.textContent = clientName;
clientAddressField.textContent = clientAddress;
clientAddressComplementField.textContent = clientAddressComplement;
clientMailField.textContent = clientMail;
clientNumberField.textContent = clientNumber;