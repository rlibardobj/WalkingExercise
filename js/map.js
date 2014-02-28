window.map = null;
window.latlngBounds = new google.maps.LatLngBounds();
window.coordinates = new Array();
//Intialize the Direction Service
var service = new google.maps.DirectionsService();

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
    drawRoutes(drawSection);
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

function drawRoutes(drawSection) {

    //Notifies when to finish building the route
    var keepBuildingRoute = true;

    //Starting point of a specific array with the coordinates for a partial section of the route
    var beginningOfSection = 0;

    //Used for managing the time between calls to the DirectionsService
    var timeOut = 0;

    //While not reaching the end of the coordinates array
    while (keepBuildingRoute) {
        var routeSection = coordinates.slice(beginningOfSection,beginningOfSection + 3);
        var waypointsArray = [];
        var waypoints = routeSection.slice(1,2);
        for (var i = 0; i < waypoints.length; i++) {
            waypointsArray.push({
                location: waypoints[i],
                stopover: true
            });
        }
        drawSection(timeOut,routeSection[0],routeSection[routeSection.length - 1],waypointsArray);
        timeOut += 1000;
        if (beginningOfSection + 2 >= coordinates.length)
            keepBuildingRoute = false;
        else
            beginningOfSection += 2;
    }
}

function drawSection(timeout,beginning,end,waypoints) {
    setTimeout( function() {
        service.route({
            origin: beginning,
            destination: end,
            waypoints: waypoints,
            travelMode: google.maps.DirectionsTravelMode.WALKING
        }, function (result, status) {
            if (status == google.maps.DirectionsStatus.OK) {
                new google.maps.Polyline({
                    map: this.map,
                    strokeColor: '#0B3B17',
                    path: result.routes[0].overview_path
                });
            }
        }.bind(this))}, timeout);
}