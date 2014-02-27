window.map = null;
window.latlngBounds = new google.maps.LatLngBounds();
window.coordinates = new Array();

function initialize() {
    var map_canvas = document.getElementById('map');
    var myLatlng = new google.maps.LatLng(-15.353882,131.044922);
    var map_options = {
        center: myLatlng,
        zoom: 10,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    map = new google.maps.Map(map_canvas, map_options);
}

function displayCoordinatesAndDrawRoutes(csv) {
    var allCoordinates = csv.split(/\r\n|\n/);
    for (var i=0; i<allCoordinates.length-1 ; i++) {
        var Latlng = allCoordinates[i].split(',');
        displayMarker(Latlng[0],Latlng[1],i);
    }
    drawRoutes();
    centerMap();
}

function displayMarker(lat, long, index) {
    var latlng = new google.maps.LatLng(lat,long);
    var marker = new google.maps.Marker({
        position: latlng,
        map: map,
        title: 'This is marker #' + (index + 1)
    });
    coordinates.push(latlng);
    latlngBounds.extend(marker.position);
}

function centerMap() {
    map.setCenter(latlngBounds.getCenter());
    map.fitBounds(latlngBounds);
}

function drawRoutes() {
    //Intialize the Direction Service
    var service = new google.maps.DirectionsService();
    
    //Notifies when to finish building the route
    var keepBuildingRoute = true;
    
    //Beginning for a specific array with a partial route coordinates
    var beginningOfSection = 0;
    
    //While not reaching the end of the coordinates array
    while (keepBuildingRoute) {
        var routeSection = coordinates.slice(beginningOfSection,beginningOfSection + 10);
        var waypointsArray = [];
        var waypoints = routeSection.slice(1,9);
        for (var i = 0; i < waypoints.length; i++) {
            waypointsArray.push({
                location: waypoints[i],
                stopover: true
            });
        }
        service.route({
            origin: routeSection[0],
            destination: routeSection[routeSection.length - 1],
            waypoints: waypointsArray,
            travelMode: google.maps.DirectionsTravelMode.WALKING
        }, function (result, status) {
            if (status == google.maps.DirectionsStatus.OK) {
                new google.maps.DirectionsRenderer({
                    map: map,
                    directions: result
                });
            }
        });
        if (beginningOfSection + 9 >= coordinates.length)
            keepBuildingRoute = false;
        else
            beginningOfSection += 9;
    }
}