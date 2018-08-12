var OrderType = { "objectdelivery": 1, "course": 2, "backathome": 3, "personalized": 4, "default": 0 };

class OrderWaypoint {
	constructor(address = "", position = null) {
		this.address = address;
		this.position = position;
	}

	get isValid() {
		var validity = false;
		validity |= this.address != "";
		validity &= this.position != null;

		return validity;

	}
}

class Order {
	constructor() {
		// 0: default
		// 1: personalized
		this.orderType = 0;
		
		this._startWaypoint = null;
		this._endWaypoint = null;
		this._weight =  0;
		this._urgency =  false;
		this._donation = 0;

		this.clientName = "";
		this.clientAddress = "";
		this.clientAddressComplement = "";
		this.clientMail = "";
		this.clientNumber = "";
		

		this.paid = false;

		this.distance =  0;
		this.distancePrice = 0;
		this.elevation =  0;

		this.startDate = null;
		this.startTime = null;
		this.startInstruction = null;

		this.endDate = null;
		this.endTime = null;
		this.endInstruction = null;

		this.refreshUI = null;
	}

	get printableOrderType() {
		if (this.orderType == 0) {
			return "Défaut"
		} else if (this.orderType == 1) {
			return "Livraison d'objets";
		}
	}

	get startWaypoint() {
		return this._startWaypoint;
	}

	set startWaypoint(value) {
		this._startWaypoint = value;

		this.refreshDistance();
	}

	get elevationPrice() {
		var elevationPrice = this.elevation * 0.02;
		
		return Math.round(this.elevation * 0.02 * 100) / 100;
	}

	get endWaypoint() {
		return this._endWaypoint;
	}

	set endWaypoint(value) {
		this._endWaypoint = value;

		this.refreshDistance();
	}

	get weight() {
		return this._weight;
	}

	get printableWeight() {
		if (this._weight == 1) {
			return "0-1";
		} else if (this._weight == 2) {
			return "1-5";
		} else if (this._weight == 3) {
			return "5-15";
		} else if (this._weight == 4) {
			return "+15";
		}

		return 0;
	}

	set weight(value) {
		this._weight = value;

		this.refreshUI();
	}

	get weightPrice() {
		if (this._weight == 1) {
			return 0.5;
		} else if (this._weight == 2) {
			return 1;
		} else if (this._weight == 3) {
			return 2;
		} else if (this._weight == 4) {
			return 3;
		}

		return 0;
	}

	get printableUrgency() {
		if (this.urgency) {
			return "Oui";
		} else {
			return "Non";
		}
	}

	set urgency(value) {
		this._urgency = value;

		this.refreshUI();
	}

	get urgency() {
		return this._urgency;
	}

	set donation(value) {
		if (value) {
			this._donation = value;

			this.refreshUI();
		}
	}

	get donation() {
		return this._donation;
	}

	get totalPrice() {
		var price = 1;
		price += this.distancePrice;
		price += this.weightPrice;
		price += this.donation;
		price += this.elevationPrice;

		if (this._urgency) {
			price += 0.5;
		}
		
		return Math.round(price * 100) / 100;
	}

	//https://www.geodatasource.com/developers/javascript
	refreshDistance() {
		if (this._startWaypoint && this._endWaypoint) {
			var startLatitude = this._startWaypoint.position.latitude;
			var startLongitude = this._startWaypoint.position.longitude;

			var endLatitude = this._endWaypoint.position.latitude;
			var endLongitude = this._endWaypoint.position.longitude;

			var radlat1 = Math.PI * startLatitude / 180
			var radlat2 = Math.PI * endLatitude / 180
			var theta = startLongitude - endLongitude
			var radtheta = Math.PI * theta / 180
			var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
			
			if (dist > 1) {
				dist = 1;
			}

			dist = Math.acos(dist);
			dist = dist * 180/Math.PI;
			dist = dist * 60 * 1.1515 * 1.609344;

			this.distance = Math.round(dist * 100) / 100;
		}

		this.refreshDistancePrice();
		this.refreshElevation();
	}

	refreshDistancePrice() {
		var valmin = 3.5;
		var valeur = 2.33;
		var factor = 2;
		var price = Math.pow(this.distance, factor) * (valmin / Math.pow(valeur, factor));

		this.distancePrice = Math.round(price * 100) / 100;
	}

	refreshElevation() {
		var _this = this;

		var elevation = Map.getElevation(function(elevation) {
			_this.elevation = Math.round(elevation);

			_this.refreshUI();
		});
	}
}