var app = window.app = window.app || {};

app.distanceDisplayModule = (function () {
    'use strict';

    var origin = null;
    var destination = null;
    var distance = null;

    function cleanAll () {
        if (!(origin.textContent === "")) {
            origin.textContent = "";
            destination.textContent = "";
            distance.textContent = "";
        }
    }

    function initialize () {
        origin = document.getElementById("origin-text");
        destination = document.getElementById("destination-text");
        distance = document.getElementById("distance-text");
    }

    function setOrigin (text) {
        origin.textContent = text;
    }

    function setDestination (text) {
        destination.textContent = text;
    }

    function setDistance (text) {
        distance.textContent = text;
    }

    return {

        /*
         * Clears any displayed information in the origin, destination and distance
         * fields.
         */

        cleanAll: cleanAll,

        /*
         * Sets the initial state for all the fields
         */

        initialize: initialize,

        /*
         * Sets the text parameter as the text content for the origin field
         */

        setOrigin: setOrigin,

        /*
         * Sets the text parameter as the text content for the destination field
         */

        setDestination: setDestination,

        /*
         * Sets the text parameter as the text content for the distance field
         */

        setDistance: setDistance
    }
}());