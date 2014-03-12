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
}