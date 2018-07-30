

/*$('.form .stages label').click(function() {
	var radioButtons = $('.form input:radio');
	var selectedIndex = radioButtons.index(radioButtons.filter(':checked'));
	selectedIndex = selectedIndex + 1;
});

$('.form button').click(function() {
	var radioButtons = $('.form input:radio');
	var selectedIndex = radioButtons.index(radioButtons.filter(':checked'));

	selectedIndex = selectedIndex + 2;

	$('.form input[type="radio"]:nth-of-type(' + selectedIndex + ')').prop('checked', true);

	if (selectedIndex == 6) {
		$('button').html('Submit');
	}
});*/



		var OrderType = { "objectdelivery":1, "course":2, "backathome":3, "personalized":4, "default":0 };



		class Order {
			constructor() {
				this.orderType = 0;
				this.price = 0;
				this.distance =  0;
				this.distancePrice =  0;
				this.elevation =  0;
				this.startAddress =  null;
				this.endAddress =  null;
				this.weightvalue =  0;
				this._urgency =  null;
			}

			set weight(value) {
				this.weightvalue = value;
			}

			get weightPrice() {
				if (this.weightvalue == 1) {
					return 0.5;
				} else if (this.weightvalue == 2) {
					return 1;
				} else if (this.weightvalue == 3) {
					return 2;
				} else if (this.weightvalue == 4) {
					return 3;
				}
			}

			set urgency(value) {
				this._urgency = value;
			}

			get urgency() {
				return this._urgency;
			}

			get totalPrice() {
				var price = 0;
				price += this.distancePrice;
				price += this.weightPrice;

				if (this._urgency) {
					price += 0.5;
				}
				
				return price;
			}

			refreshTotalPrice() {

			}
		}

		var map;
 
    	var startAddressMarker;
    	var endAddressMarker;

    	var orderForm = document.forms['order-form'];
    	var orderTypeRadio = document.forms['order-form'].elements['order-type-radio'];
    	var weightRadio = document.forms['order-form'].elements['choice-weight'];
    	var urgencyCheckBox = document.forms['order-form'].elements['urgency-checkbox'];
    	 
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
	
		var startAddressAutoComplete;
		var endAddressAutocomplete;

		var lineInfoWindowContent = document.getElementById('line-infowindow');
        var lineInfoWindowDistance = document.getElementById('line-infowindow-distance');
        var lineInfoWindowElevation = document.getElementById('line-infowindow-elevation');
        var lineInfoWindowPrice = document.getElementById('line-infowindow-price');
        var lineInfoWindow;

		var pointsPath;

		var order = new Order();
		order.refreshTotalPrice = function() {
			fixedPriceContent.textContent = String(Math.round(order.totalPrice * 100) / 100);
		}

		//https://www.geodatasource.com/developers/javascript
    	function calculateDistance(lat1, lon1, lat2, lon2, unit) {
    		var radlat1 = Math.PI * lat1/180
    		var radlat2 = Math.PI * lat2/180
    		var theta = lon1-lon2
    		var radtheta = Math.PI * theta/180
    		var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    		if (dist > 1) {
    			dist = 1;
    		}
    		dist = Math.acos(dist);
    		dist = dist * 180/Math.PI;
			dist = dist * 60 * 1.1515; // Miles
			if (unit=="K") { dist = dist * 1.609344 } // Kilometers
			if (unit=="N") { dist = dist * 0.8684 } // Nautical
				return dist;
		}

		function fitBoundsWithPadding(gMap, bounds, paddingXY) {
	        var projection = gMap.getProjection();
	        if (projection) {
	            var paddings = {
	                top: paddingXY.top,
	                right: paddingXY.right,
	                bottom: paddingXY.bottom,
	                left: paddingXY.left
	            };

	            // copying the bounds object, since we will extend it
	            bounds = new google.maps.LatLngBounds(bounds.getSouthWest(), bounds.getNorthEast());

	            // SW
	            var point1 = projection.fromLatLngToPoint(bounds.getSouthWest());


	            // we must call fitBounds 2 times - first is necessary to set up a projection with initial (actual) bounds
	            // and then calculate new bounds by adding our pixel-sized paddings to the resulting viewport
	            gMap.fitBounds(bounds);

	            var point2 = new google.maps.Point(
	                ( (typeof(paddings.left) == 'number' ? paddings.left : 0) / Math.pow(2, gMap.getZoom()) ) || 0,
	                ( (typeof(paddings.bottom) == 'number' ? paddings.bottom : 0) / Math.pow(2, gMap.getZoom()) ) || 0
	            );

	            var newPoint = projection.fromPointToLatLng(new google.maps.Point(
	                point1.x - point2.x,
	                point1.y + point2.y
	            ));

	            bounds.extend(newPoint);

	            // NE
	            point1 = projection.fromLatLngToPoint(bounds.getNorthEast());
	            point2 = new google.maps.Point(
	                ( (typeof(paddings.right) == 'number' ? paddings.right : 0) / Math.pow(2, gMap.getZoom()) ) || 0,
	                ( (typeof(paddings.top) == 'number' ? paddings.top : 0) / Math.pow(2, gMap.getZoom()) ) || 0
	            );
	            newPoint = projection.fromPointToLatLng(new google.maps.Point(
	                point1.x + point2.x,
	                point1.y - point2.y
	            ));

	            bounds.extend(newPoint);

	            gMap.fitBounds(bounds);
	        }
	    }

    	function refreshDistance() {
    		if(startAddressMarker && endAddressMarker) {
				var distance = calculateDistance(startAddressMarker.getPosition().lat(), startAddressMarker.getPosition().lng(), endAddressMarker.getPosition().lat(), endAddressMarker.getPosition().lng(), "K");

				order.distance = distance;

				return distance;
			}

			return 0;
		}

		function refreshPrice(distance) {
			if(startAddressMarker && endAddressMarker) {
				var valmin = 4.2;
				var valeur = 3.5;
				var factor = 2;
				var price = Math.pow(distance, factor) * (valmin / Math.pow(valeur, factor));

				order.distancePrice = price;
			}
		}

		function refreshElevation() {
			if(startAddressMarker != null && endAddressMarker != null) {
				var elevator = new google.maps.ElevationService;
				var elevations;
				var elevation = 0;

				elevator.getElevationAlongPath({
					'path': [startAddressMarker.getPosition(), endAddressMarker.getPosition()],
					'samples': 40
				}, function(elevations, status) {
					if (status !== 'OK') {
					// Show the error code inside the chartDiv.
						console.log(status);
						return;
					}

					for(var index = 1; index < elevations.length - 1; index++) {
						if(index < elevations.length - 2) {
							var diff = elevations[index].elevation - elevations[index - 1].elevation;
							if (diff > 0) {
								elevation += diff;
							}
						}
					}

					order.elevation = elevation;
				});

/*				elevator.getElevationForLocations({
					'locations': [startAddressMarker.getPosition(), endAddressMarker.getPosition()]
				}, function(results, status) {
					if (status === 'OK') {
						console.log(results);

						if (results[0] && results[1]) {
							var elevation = results[1].elevation - results[0].elevation;
							
							
						} else {
							console.log('No elevation found');
						}
					} else {
						console.log(status);
					}
				});*/
			}
		}



    	function refreshMapViewPort() {
    		if (startAddressMarker && endAddressMarker) {
    			var bounds = new google.maps.LatLngBounds(startAddressMarker.getPosition());
    			bounds.extend(endAddressMarker.getPosition());
    			map.fitBounds(bounds);
    			//fitBoundsWithPadding(map, bounds, {top:500, right: 30, bottom: 50});
    		} else if (startAddressMarker) {
    			map.setZoom(17);
				map.setCenter(startAddressMarker.getPosition());
    		} else if (endAddressMarker) {
    			map.setZoom(17);
				map.setCenter(endAddressMarker.getPosition());
    		}
    	}

    	function extractPlaceAddress(place) {
    		if(place && place.address_components) {
	    		return [
					(place.address_components[0] && place.address_components[0].short_name || ''),
					(place.address_components[1] && place.address_components[1].short_name || ''),
					(place.address_components[2] && place.address_components[2].short_name || '')
				].join(' ');
    		}

    		return "";
    	}

    	function refreshLine() {
    		//lineInfoWindow.close();

			if (startAddressMarker && endAddressMarker) {
				if (pointsPath) {
					pointsPath.setMap(null);
					pointsPath= null;
				}

				var points = [
					startAddressMarker.getPosition(),
					endAddressMarker.getPosition()
				];

				pointsPath = new google.maps.Polyline({
		          path: points,
		          geodesic: true,
		          strokeColor: '#3C0874',
		          strokeOpacity: 1.0,
		          strokeWeight: 2
		        });

   				pointsPath.setMap(map);

   				var inBetween = google.maps.geometry.spherical.interpolate(startAddressMarker.getPosition(), endAddressMarker.getPosition(), 0.5);  
   				lineInfoWindowContent.classList.remove("hidden");

				lineInfoWindowPrice.textContent = String(Math.round(order.distancePrice * 100) / 100);
				lineInfoWindowDistance.textContent = String(Math.round(order.distance * 100) / 100);
				lineInfoWindowElevation.textContent = String(Math.round(order.elevation * 100) / 100);
				fixedPriceContent.textContent = String(Math.round(order.totalPrice * 100) / 100);

				lineInfoWindow.setPosition(inBetween);
				lineInfoWindow.open(map);
				//lineInfoWindowContent.setVisible(true);
			}
    	}

    	function handleStartAddressAutocomplete() {
    		if (startAddressInput.value == "") {
    			if (startAddressMarker) {
    				startAddressMarker.setMap(null);
    				startAddressMarker = null;
    			}

    			if(window.sessionStorage.getItem("start-place")) {
    				window.sessionStorage.removeItem("start-place");	
    			}
    			
    			return;
    		}

    		autocompleteResult = handleAutocomplete("start-place", startAddressAutoComplete, startAddressMarker);
    		startAddressMarker = autocompleteResult.marker;
			order.startAddress = autocompleteResult.address;

			var distance = refreshDistance();
			refreshElevation();
			refreshMapViewPort();
			refreshPrice(distance);
			refreshLine();
			order.refreshTotalPrice();
    	}

		function handleEndAddressAutocomplete() {
    		if (endAddressInput.value == "") {
    			if (endAddressMarker) {
    				endAddressMarker.setMap(null);
    				endAddressMarker = null;
    			}

    			if(window.sessionStorage.getItem("end-place")) {
    				window.sessionStorage.removeItem("end-place");	
    			}
    			
    			return;
    		}

			autocompleteResult = handleAutocomplete("end-place", endAddressAutocomplete, endAddressMarker);
			endAddressMarker = autocompleteResult.marker;
			order.startAddress = autocompleteResult.address;


			var distance = refreshDistance();
			refreshElevation();
			refreshMapViewPort();
			refreshPrice(distance);
			refreshLine();
			order.refreshTotalPrice();
		}

    	function handleAutocomplete(storagekey, searchBox, marker, infowindow) {
        	var place = searchBox.getPlace();
        	if (!place || !place.geometry) {
        		var previousplace = JSON.parse(window.sessionStorage.getItem(storagekey));

				if (previousplace) {
					if(!previousplace.geometry) {
						console.log("no geometry");
						window.sessionStorage.removeItem(storagekey);		
						return;
					}
					place = previousplace;
				} else {
					console.log("no place");
					return;
				}
			} else {
				window.sessionStorage.setItem(storagekey, JSON.stringify(place));
			}

        	if (marker == null) {
        		marker = new google.maps.Marker({position: place.geometry.location, map: map});
        	} else {
				marker.setVisible(false); 
				marker.setPosition(place.geometry.location);
				marker.setVisible(true);
        	}

			var address = '';
			if (place.address_components) {
				address = extractPlaceAddress(place.address_components);
			}


			
/*			icon.src = place.icon;
			name.textContent = place.name;
			address.textContent = address;*/
			//infowindow.open(map, marker);



			return { marker: marker, address: address };
       	}

		function initMap() {
			startAddressAutoComplete = new google.maps.places.Autocomplete(startAddressInput);
			endAddressAutocomplete = new google.maps.places.Autocomplete(endAddressInput);

			endAddressInfoWindow = new google.maps.InfoWindow();

			map = new google.maps.Map(document.getElementById('map'), { zoom: 4, center: { lat: 42, lng: 2 }, disableDefaultUI: true, zoomControl: true });

			// Departure autocomplete

			startAddressAutoComplete.bindTo('bounds', map);
			startAddressAutoComplete.setFields(['address_components', 'geometry', 'icon', 'name']);
            startAddressAutoComplete.setTypes([]);
			startAddressAutoComplete.setBounds(map.getBounds());

	         startAddressAutoComplete.addListener('place_changed', handleStartAddressAutocomplete);

			// Destination autocomplete

			endAddressAutocomplete.setFields(['address_components', 'geometry', 'icon', 'name']);
            endAddressAutocomplete.setTypes([]);
	        endAddressAutocomplete.addListener('place_changed', handleEndAddressAutocomplete);

	        lineInfoWindow = new google.maps.InfoWindow();
   			lineInfoWindow.setContent(lineInfoWindowContent);

   			addressesDiv.index = 1;
        //map.controls[google.maps.ControlPosition.TOP_LEFT].push(addressesDiv);


		}

		function validatePerformanceType(radio) {
			document.getElementById('objectdelivery-order-container').classList.add("hidden");
			//document.getElementById('course-order-container').classList.add("hidden");
			document.getElementById('personalized-order-container').classList.add("hidden");
			//document.getElementById('backathome-order-container').classList.add("hidden");

			if(radio && radio.value) {
				console.log(radio.value);

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
		}

		function validateWeight(radio) {
			console.log(radio.value);

			if (radio.value == "1") {
				order.weight = 1;
			} else if (radio.value == "2") {
				order.weight = 2;
			} else if (radio.value == "3") {
				order.weight = 3;
			} else if (radio.value == "4") {
				order.weight = 4;
			}

			order.refreshTotalPrice();
		}

		function refreshUrgency(checkbox) {
			if(checkbox.checked) {
				order.urgency = true;
			} else {
				order.urgency = false;
			}
			
			order.refreshTotalPrice();
		}

		urgencyCheckBox.onchange = function() {
			refreshUrgency(this);
		}

		for(var i = 0; i < orderTypeRadio.length; i++) {
			orderTypeRadio[i].onchange = function() {
				validatePerformanceType(this);
			}
		}

		for(var i = 0; i < weightRadio.length; i++) {
			weightRadio[i].onchange = function() {
				validateWeight(this);
			}
		}

		orderForm.onreset = function() {
			validatePerformanceType(null);
		}



		window.onload = function() {
			if (typeof(Storage) === "undefined") {
				console.log("no storage");
			}

			handleStartAddressAutocomplete();
			handleEndAddressAutocomplete();

			google.maps.event.addListenerOnce(map, 'idle', function(){
			    refreshMapViewPort();
			});

			for(var i = 0; i < orderTypeRadio.length; i++) {
				if(orderTypeRadio[i].checked) {
					validatePerformanceType(orderTypeRadio[i]);
				}
			}

			for(var i = 0; i < weightRadio.length; i++) {
				if(weightRadio[i].checked) {
					validateWeight(weightRadio[i]);
				}
			}
		};