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
var service = new google.maps.DirectionsService();
function drawRoutes(drawSection) {
    //Intialize the Direction Service
    

    //Notifies when to finish building the route
    var keepBuildingRoute = true;

    //Beginning for a specific array with a partial route coordinates
    var beginningOfSection = 0;

    var timeOut = 1000;

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
        console.log(timeOut);
        setTimeout(function() {
            service.route({
                origin: routeSection[0],
                destination: routeSection[routeSection.length - 1],
                waypoints: waypointsArray,
                travelMode: google.maps.DirectionsTravelMode.WALKING
            }, function (result, status) {
                if (status == google.maps.DirectionsStatus.OK) {
                    drawSection(result.routes[0].overview_path);
                }
            });
        },timeOut);
        timeOut += 1000;
        if (beginningOfSection + 9 >= coordinates.length)
            keepBuildingRoute = false;
        else
            beginningOfSection += 9;
    }
}

function drawSection(overview_path) {
    new google.maps.Polyline({
        map: map,
        strokeColor: '#0B3B17',
        path: overview_path
    });
    console.log(overview_path);
}