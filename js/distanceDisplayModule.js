var distanceDisplayModule = (function() {
    var origin = null;
    var destination = null;
    var distance = null;

    return {

        /*
         * Clears any displayed information in the origin, destination and distance
         * fields.
         */

        cleanAll: function () {
            if (!(origin.textContent === "")) {
                origin.textContent = "";
                destination.textContent = "";
                distance.textContent = "";
            }
        },
        
        /*
         * Sets the initial state for all the fields
         */

        initialize: function() {
            origin = document.getElementById("origin-text");
            destination = document.getElementById("destination-text");
            distance = document.getElementById("distance-text");
        },
        
        /*
         * Sets the text parameter as the text content for the origin field
         */

        setOrigin: function(text) {
            origin.textContent = text;
        },
        
        /*
         * Sets the text parameter as the text content for the destination field
         */

        setDestination: function(text) {
            destination.textContent = text;
        },
        
        /*
         * Sets the text parameter as the text content for the distance field
         */

        setDistance: function(text) {
            distance.textContent = text;
        }
    }
}());