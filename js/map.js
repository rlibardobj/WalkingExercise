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
    var path = new google.maps.MVCArray();

    //Intialize the Direction Service
    var service = new google.maps.DirectionsService();

    //Set the Path Stroke Color
    var poly = new google.maps.Polyline({ map: map, strokeColor: '#4986E7' });

    var keepBuildingRoute = true;
    var beginningOfSection = 0;
    path.push(coordinates[0]);
    while (keepBuildingRoute) {
        console.log(beginningOfSection);
        var routeSection = coordinates.slice(beginningOfSection,beginningOfSection + 8);
        var waypointsArray = [];
        var waypoints = routeSection.slice(1,7);
        for (var i = 0; i < waypoints.length; i++) {
            waypointsArray.push({
                location: waypoints[i],
                stopover: false
            });
        }
        service.route({
            origin: coordinates[beginningOfSection],
            destination: coordinates[beginningOfSection + 7],
            waypoints: waypointsArray,
            travelMode: google.maps.DirectionsTravelMode.DRIVING
        }, function (result, status) {
            console.log(status);
            if (status == google.maps.DirectionsStatus.OK) {
                for (var i = 0, len = result.routes[0].overview_path.length; i < len; i++) {
                    path.push(result.routes[0].overview_path[i]);
                }
            }
        });
        if (beginningOfSection + 8 >= coordinates.length)
            keepBuildingRoute = false;
        else
            beginningOfSection += 8;
    }/*
    //Loop and Draw Path Route between the Points on MAP
    for (var i = 0; i < coordinates.length; i++) {
        if ((i + 1) < coordinates.length) {
            var src = coordinates[i];
            var des = coordinates[i + 1];
            path.push(coordinates[i]);
            service.route({
                origin: src,
                destination: des,
                travelMode: google.maps.DirectionsTravelMode.DRIVING
            }, function (result, status) {
                console.log(status);
                if (status == google.maps.DirectionsStatus.OK) {
                    for (var i = 0, len = result.routes[0].overview_path.length; i < len; i++) {
                        path.push(result.routes[0].overview_path[i]);
                    }
                }
            });
        }
    }*/
    poly.setPath(path);
    console.log(2);
}