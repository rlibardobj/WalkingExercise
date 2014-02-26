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
    centerMap();
    drawRoutes();
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
    //Intialize the Path Array
    var path = []//new google.maps.MVCArray();

    //Intialize the Direction Service
    var service = new google.maps.DirectionsService();

    //Set the Path Stroke Color
    var poly = new google.maps.Polyline({ map: map, strokeColor: '#4986E7', strokeWeight: 6 });
    poly.setPath(new Array());
    
    var keepBuildingRoute = true;
    var beginningOfSection = 0;
    
    while (keepBuildingRoute) {
        var routeSection = coordinates.slice(beginningOfSection,beginningOfSection + 10);
        var waypointsArray = [];
        var waypoints = routeSection.slice(1,9);
        //poly.getPath().push(routeSection[0]);
        //path.push(routeSection[0]);
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
                for (var i = 0, len = result.routes[0].overview_path.length; i < len; i++) {
                    poly.getPath().push(result.routes[0].overview_path[i]);
                    console.log(result.routes[0].overview_path[i]);
                }
            }
        });
        //keepBuildingRoute = false;
        if (beginningOfSection + 9 >= coordinates.length)
            keepBuildingRoute = false;
        else
            beginningOfSection += 9;
    }
    //console.log(poly.getPath());
}