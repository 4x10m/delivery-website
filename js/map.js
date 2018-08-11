class Map {
    constructor(map, order, startAddressInput, endAddressInput, lineInfoWindowContent, lineInfoWindowPrice, lineInfoWindowDistance, lineInfoWindowElevation)  {
        Map.self = this;

        this.map = map;
        this.order = order;
        this.startAddressInput = startAddressInput;
        this.endAddressInput = endAddressInput;
        this.lineInfoWindowContent = lineInfoWindowContent;

        this.startAddressMarker = null;
        this.endAddressMarker = null;

        this.validStartAddress = false;
        this.validEndAddress = false;

        this.pointsPath = null;

        this.googleMap = new google.maps.Map(this.map,
            { 
                zoom: 4, 
                center: 
                {
                    lat: 42, 
                    lng: 2 
                }, 
                disableDefaultUI: true, 
                zoomControl: true 
            }
        );

        google.maps.event.addListenerOnce(map, 'idle', function() {
            refreshMapViewPort();
        });

        // Departure autocomplete

        this.startAddressAutoComplete = new google.maps.places.Autocomplete(this.startAddressInput);
        this.startAddressAutoComplete.bindTo('bounds', this.googleMap);
        this.startAddressAutoComplete.setFields(['address_components', 'geometry', 'icon', 'name']);
        this.startAddressAutoComplete.setTypes([]);
        this.startAddressAutoComplete.setBounds(this.googleMap.getBounds());
        this.startAddressAutoComplete.addListener('place_changed', function() {
            Map.self.handleStartAddressAutocomplete();
        });

        // Destination autocomplete

        this.endAddressAutocomplete = new google.maps.places.Autocomplete(this.endAddressInput);
        this.endAddressAutocomplete.bindTo('bounds', this.googleMap);
        this.endAddressAutocomplete.setFields(['address_components', 'geometry', 'icon', 'name']);
        this.endAddressAutocomplete.setTypes([]);
        this.endAddressAutocomplete.addListener('place_changed', function() {
            Map.self.handleEndAddressAutocomplete();
        });

        this.lineInfoWindow = new google.maps.InfoWindow();
        this.lineInfoWindow.setContent(Map.self.lineInfoWindowContent);
    }

    static refreshMapViewPort() {
        if (Map.self.startAddressMarker && Map.self.endAddressMarker) {
            var bounds = new google.maps.LatLngBounds(Map.self.startAddressMarker.getPosition());
            bounds.extend(Map.self.endAddressMarker.getPosition());
            Map.self.googleMap.fitBounds(bounds);
            //fitBoundsWithPadding(map, bounds, {top:500, right: 30, bottom: 50});
        } else if (Map.self.startAddressMarker) {
            Map.self.googleMap.setZoom(17);
            Map.self.googleMap.setCenter(Map.self.startAddressMarker.getPosition());
        } else if (Map.self.endAddressMarker) {
            Map.self.googleMap.setZoom(17);
            Map.self.googleMap.setCenter(Map.self.endAddressMarker.getPosition());
        }
    }

    static refreshLine() {
        if (Map.self.startAddressMarker && Map.self.endAddressMarker) {
            if (Map.self.pointsPath) {
                Map.self.pointsPath.setMap(null);
                Map.self.pointsPath= null;
            }

            var points = [
                Map.self.startAddressMarker.getPosition(),
                Map.self.endAddressMarker.getPosition()
            ];

            Map.self.pointsPath = new google.maps.Polyline({
              path: points,
              geodesic: true,
              strokeColor: '#3C0874',
              strokeOpacity: 1.0,
              strokeWeight: 2
            });

            Map.self.pointsPath.setMap(Map.self.googleMap);

            var inBetween = google.maps.geometry.spherical.interpolate(Map.self.startAddressMarker.getPosition(), Map.self.endAddressMarker.getPosition(), 0.5);  
            Map.self.lineInfoWindowContent.classList.remove("hidden");

            Map.self.lineInfoWindow.setPosition(inBetween);
            Map.self.lineInfoWindow.open(Map.self.googleMap);
            //lineInfoWindowContent.setVisible(true);

            //Map.self.map.dispatchEvent(new Event("orderchanged"));
        }
    }

    static extractPlaceAddress(place) {
        if(place && place.address_components) {
            return [
                (place.address_components[0] && place.address_components[0].short_name || ''),
                (place.address_components[1] && place.address_components[1].short_name || ''),
                (place.address_components[2] && place.address_components[2].short_name || '')
            ].join(' ');
        }

        return "";
    }

    handleStartAddressAutocomplete() {
        Map.handleAutocomplete( Map.self.startAddressInput, "start-place",  Map.self.startAddressAutoComplete,  Map.self.startAddressMarker, function(autocompleteResult) {
            if (autocompleteResult) {
                Map.self.startAddressMarker = autocompleteResult.marker;
                Map.self.order.startWaypoint = new OrderWaypoint(autocompleteResult.address, { latitude: autocompleteResult.location.lat, longitude: autocompleteResult.location.lng });
                Map.self.order.validStartAddress = true;
            }
        });
    }

    handleEndAddressAutocomplete() {
        Map.handleAutocomplete( Map.self.endAddressInput, "end-place",  Map.self.endAddressAutocomplete,  Map.self.endAddressMarker, function(autocompleteResult) {
            if (autocompleteResult) {
                Map.self.endAddressMarker = autocompleteResult.marker;
                Map.self.order.endWaypoint = new OrderWaypoint(autocompleteResult.address, { latitude: autocompleteResult.location.lat, longitude: autocompleteResult.location.lng });
                Map.self.order.validEndAddress = true;
            }    
        });
    }

    static handleAutocomplete(input, storagekey, searchBox, marker, after) {
        if (input.value == "") {
            if (marker) {
                marker.setMap(null);
                marker = null;
            }

            if (window.sessionStorage.getItem(storagekey)) {
                window.sessionStorage.removeItem(storagekey);   
            }
            
            return;
        }

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

        place = JSON.parse(window.sessionStorage.getItem(storagekey));

        if (marker == null) {
            marker = new google.maps.Marker({position: place.geometry.location, map: Map.self.googleMap});
        } else {
            marker.setVisible(false); 
            marker.setPosition(place.geometry.location);
            marker.setVisible(true);
        }

        var address = '';
        if (place.address_components) {
            address = Map.extractPlaceAddress(place);
        }

        after({ location: place.geometry.location, marker: marker, address: address });

        Map.refreshMapViewPort();
        Map.refreshLine();
    }

    static getElevation(after) {
        var elevation = 0;

        if (Map.self.startAddressMarker != null && Map.self.endAddressMarker != null) {
            var elevator = new google.maps.ElevationService;
            var elevations;

            elevator.getElevationAlongPath({
                'path': [Map.self.startAddressMarker.getPosition(), Map.self.endAddressMarker.getPosition()],
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

                after(elevation);
            });
        }
    }
}







