/*
 * Clears all routes and markers that have been displayed in the map.
 */

function clearMap() {
    for (var i = 0; i < mapOverlays.markers.length; i++)
        mapOverlays.markers[i].setMap(null);
    for (var i = 0; i < mapOverlays.routeLines.length; i++)
        mapOverlays.routeLines[i].setMap(null);
    mapOverlays.markers = [];
    mapOverlays.routeLines = [];
}

/*
 * Clears the stored bounds information which was used for the initial
 * display of a specific result.
 */

function clearLatLngBounds() {
    latlngBounds = new google.maps.LatLngBounds();
}

/*
 * Clears any displayed information in the origin, destination and distance
 * fields. It also hides the circle from the map in case it has been displayed.
 */

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