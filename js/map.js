var map = null;
var latlngBounds = new google.maps.LatLngBounds();
var coordinates = new Array();
var service = new google.maps.DirectionsService();
var circle = null;

function initialize() {
    var map_canvas = document.getElementById('map');
    var myLatlng = new google.maps.LatLng(-15.353882,131.044922);
    var map_options = {
        center: myLatlng,
        zoom: 10,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    map = new google.maps.Map(map_canvas, map_options);
    circle = new google.maps.Circle({map: map, 
                                     visible: false, 
                                     radius: 100});
}

function displayCoordinatesAndDrawRoutes(csv) {
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
    google.maps.event.addListener(marker, 'click', function(position) {
        return function() {
            if (circle.getVisible()) {
                if (position.equals(circle.getCenter()))
                    circle.setVisible(false);
                else {
                    console.log(10);
                }
            }
            else {
                circle.setCenter(position);
                circle.setVisible(true);
            }
        };
    }(marker.getPosition()));
    coordinates.push(latlng);
    latlngBounds.extend(marker.position);
}

function centerMap() {
    map.setCenter(latlngBounds.getCenter());
    map.fitBounds(latlngBounds);
}

function drawRoute() {

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
        //drawSection(timeOut,routeSection[0],routeSection[routeSection.length - 1],waypointsArray);
        setTimeout( function(beginning,end,waypoints) {
            return function () {
                service.route({
                    origin: beginning,
                    destination: end,
                    waypoints: waypoints,
                    travelMode: google.maps.DirectionsTravelMode.WALKING
                }, function (result, status) {
                    if (status == google.maps.DirectionsStatus.OK) {
                        new google.maps.Polyline({
                            map: map,
                            strokeColor: '#0B3B17',
                            path: result.routes[0].overview_path
                        });
                    }
                });
            };
        }(routeSection[0],routeSection[routeSection.length - 1],waypointsArray), timeOut);
        timeOut += 500;
        if (beginningOfSection + 2 >= coordinates.length)
            keepBuildingRoute = false;
        else
            beginningOfSection += 2;
    }
}