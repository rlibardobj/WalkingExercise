var mapObject = (function() {

    var map = null;
    var latlngBounds = null; // Bounds which are used for centering the display of any result for a request.
    var service = null; // Service used for getting routes information.
    var destinationMarker = null; // Used for having a reference for the destination marker when displaying distance information.

    var mapOverlays = {
        circle: null,
        markers: [],
        routeLines: []
    };

    return {

        /*
         * Creates a maker in the map according to the given latitude 
         * and longitude and sets its title to be the index specified.
         * Adds the function to be executed when the marker is clicked and pushes 
         * the marker into the variable that holds the map overlays.
         */

        addMarkerOverlay: function(lat, long, index) {
            var marker = new google.maps.Marker({
                position: new google.maps.LatLng(lat,long),
                map: map,
                title: 'This is marker #' + (index + 1)
            });
            google.maps.event.addListener(marker, 'click', function() {
                if (mapOverlays.circle.getVisible()) {
                    if (marker.getPosition().equals(mapOverlays.circle.getCenter())) {
                        destinationMarker.setAnimation(null);
                        destinationMarker = new google.maps.Marker();
                        cleanInformation();
                    }
                    else {
                        if (!(marker.getPosition().equals(destinationMarker.getPosition()))) {
                            var origin = document.getElementById("origin-text");
                            var destination = document.getElementById("destination-text");
                            var distance = document.getElementById("distance-text");
                            new google.maps.DistanceMatrixService().getDistanceMatrix({
                                origins: [mapOverlays.circle.getCenter()],
                                destinations: [marker.getPosition()],
                                travelMode: google.maps.TravelMode.WALKING
                            }, function (response, status) {
                                origin.textContent = response.originAddresses[0];
                                destination.textContent = response.destinationAddresses[0];
                                distance.textContent = response.rows[0].elements[0].distance.text;
                            });
                            destinationMarker.setAnimation(null);
                            marker.setAnimation(google.maps.Animation.BOUNCE);
                            destinationMarker = marker;
                        }
                    }
                }
                else {
                    mapOverlays.circle.setCenter(marker.getPosition());
                    mapOverlays.circle.setVisible(true);
                };
            });
            mapOverlays.markers.push(marker);
            return marker;
        },

        /*
         * Clears the stored bounds information which was used for the initial
         * display of a specific result.
         */

        clearBounds: function() {
            latlngBounds = new google.maps.LatLngBounds();
        },

        /*
         * Clears all routes and markers that have been displayed in the map.
         */

        clearMap: function() {
            for (var i = 0; i < mapOverlays.markers.length; i++)
                mapOverlays.markers[i].setMap(null);
            for (var i = 0; i < mapOverlays.routeLines.length; i++)
                mapOverlays.routeLines[i].setMap(null);
            mapOverlays.markers = [];
            mapOverlays.routeLines = [];
            if (mapOverlays.circle.getVisible())
                mapOverlays.circle.setVisible(false);
        },

        /*
         * Centers the map according to the current state of the bounds
         * variable.
         */

        centerMap: function() {
            map.setCenter(latlngBounds.getCenter());
            map.fitBounds(latlngBounds);
        },

        /*
         * When markers are displayed and pushed into the overlays, the route is drawn 
         * taking those markers as a reference. This function draws the route by sections, 
         * which are drawn at a specified time interval to avoid any problems with the API's 
         * restrictions. The size for the section must not be higher than 10 because of an API's
         * restriction.
         */

        drawRoute: function (sectionSize) {
            //Starting point of a specific array with the coordinates for a partial section of the route
            var beginningOfSection = 0;

            //Used for managing the time between calls to the DirectionsService
            var timeOut = 0;

            //While not reaching the end of the markers array, draw another section of the route
            while (!(beginningOfSection >= mapOverlays.markers.length)) {
                var endOfSection = (beginningOfSection + sectionSize) - ((((beginningOfSection + sectionSize)  % (mapOverlays.markers.length - 1))) % sectionSize);
                var waypointsArray = [];
                for (var i = beginningOfSection + 1; i < endOfSection - 1; i++) {
                    waypointsArray.push({
                        location: mapOverlays.markers[i].getPosition(),
                        stopover: true
                    });
                }
                setTimeout(function(beginning,end,waypoints) {
                    return function () {
                        service.route({
                            origin: beginning,
                            destination: end,
                            waypoints: waypoints,
                            travelMode: google.maps.DirectionsTravelMode.WALKING
                        }, function (result, status) {
                            if (status == google.maps.DirectionsStatus.OK) {
                                mapOverlays.routeLines.push(new google.maps.Polyline({
                                    map: map,
                                    strokeColor: '#01DF74',
                                    path: result.routes[0].overview_path
                                }));
                            }
                        });
                    };
                }(mapOverlays.markers[beginningOfSection].getPosition(),mapOverlays.markers[endOfSection].getPosition(),waypointsArray), timeOut);
                timeOut += 500;
                beginningOfSection += sectionSize;
            }
        },

        /*
         * Estends the map's bounds to cover the specified position
         */

        extendBounds: function(position) {
            latlngBounds.extend(position);
        },

        /*
         * Initializes the map in a default position, the bounds for displayed results, 
         * the service for getting routes information, the marker used for knowing the destination 
         * maker when displaying distance information and the map's circle.
         */

        initialize: function() {
            var map_canvas = document.getElementById('map');
            var myLatlng = new google.maps.LatLng(-15.353882,131.044922);
            var map_options = {
                center: myLatlng,
                zoom: 10,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            }
            map = new google.maps.Map(map_canvas, map_options);
            service = new google.maps.DirectionsService();
            latlngBounds = new google.maps.LatLngBounds();
            destinationMarker = new google.maps.Marker();
            mapOverlays.circle = new google.maps.Circle({
                map: map,
                fillColor: '#01DF74',
                radius: 100,
                strokeColor: '#01DF74',
                visible: false
            });
        }
    }
}());

/*
 * Gets the file's contents, resets the whole map state and variables
 * that could've been previously used, and finally delegates the creation 
 * and display of both, markers and routes.
 */

function displayCoordinates(csv) {
    cleanInformation();
    mapObject.clearMap();
    mapObject.clearBounds();
    var allCoordinates = csv.split(/\r\n|\n/);
    for (var i=0; i < allCoordinates.length-1; i++) {
        var Latlng = allCoordinates[i].split(',');
        var marker = mapObject.addMarkerOverlay(Latlng[0],Latlng[1],i);
        mapObject.extendBounds(marker.getPosition());
    }
    mapObject.centerMap();
}