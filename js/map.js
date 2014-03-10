var map = null;
var latlngBounds = null;
var service = null;
var bouncingMarker = null;

var mapOverlays = {
    circle: null,
    markers: [],
    routeLines: []
}

function initialize() {
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
    bouncingMarker = new google.maps.Marker();
    mapOverlays.circle = new google.maps.Circle({
        map: map,
        fillColor: '#01DF74',
        radius: 100,
        strokeColor: '#01DF74',
        visible: false
    });
}

function displayCoordinatesAndDrawRoutes(csv) {
    cleanInformation();
    clearMap();
    clearLatLngBounds();
    var allCoordinates = csv.split(/\r\n|\n/);
    for (var i=0; i<allCoordinates.length-1 ; i++) {
        var Latlng = allCoordinates[i].split(',');
        createAndDisplayMarker(Latlng[0],Latlng[1],i);
    }
    drawRoute();
    centerMap();
}

function createAndDisplayMarker(lat, long, index) {
    var latlng = new google.maps.LatLng(lat,long);
    var marker = new google.maps.Marker({
        position: latlng,
        map: map,
        title: 'This is marker #' + (index + 1)
    });
    google.maps.event.addListener(marker, 'click', function() {
        if (mapOverlays.circle.getVisible()) {
            if (marker.getPosition().equals(mapOverlays.circle.getCenter())) {
                bouncingMarker.setAnimation(null);
                mapOverlays.circle.setVisible(false);
            }
            else {
                if (!(marker.getPosition().equals(bouncingMarker.getPosition()))) {
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
                        console.log(response.originAddresses[0]);
                        console.log(response.destinationAddresses[0]);
                        console.log(response.rows[0].elements[0].distance.text);
                    });
                    bouncingMarker.setAnimation(null);
                    marker.setAnimation(google.maps.Animation.BOUNCE);
                    bouncingMarker = marker;
                }
            }
        }
        else {
            mapOverlays.circle.setCenter(marker.getPosition());
            mapOverlays.circle.setVisible(true);
        };
    });
    mapOverlays.markers.push(marker);
    latlngBounds.extend(marker.getPosition());
}

function centerMap() {
    map.setCenter(latlngBounds.getCenter());
    map.fitBounds(latlngBounds);
}

function drawRoute() {
    //Determines the size of every section of the route to be drawn
    var sectionSize = 10;

    //Starting point of a specific array with the coordinates for a partial section of the route
    var beginningOfSection = 0;

    //Used for managing the time between calls to the DirectionsService
    var timeOut = 0;

    //While not reaching the end of the coordinates array
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
}

function clearMap() {
    for (var i = 0; i < mapOverlays.markers.length; i++)
        mapOverlays.markers[i].setMap(null);
    for (var i = 0; i < mapOverlays.routeLines.length; i++)
        mapOverlays.routeLines[i].setMap(null);
    mapOverlays.markers = [];
    mapOverlays.routeLines = [];
}

function clearLatLngBounds() {
    latlngBounds = new google.maps.LatLngBounds();
}

function cleanInformation() {
    if (!(document.getElementById("origin-text").textContent === "")) {
        var origin = document.getElementById("origin-text");
        var destination = document.getElementById("destination-text");
        var distance = document.getElementById("distance-text");
        origin.textContent = "";
        destination.textContent = "";
        distance.textContent = "";
    }
    if (mapOverlays.circle.getVisible())
        mapOverlays.circle.setVisible(false);
}