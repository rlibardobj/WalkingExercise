var app = window.app = window.app || {};

app.controlModule = (function (mapModule, distanceDisplayModule, readingModule) {
    'use strict';

    function initialize() {
        mapModule.initialize();
        distanceDisplayModule.initialize();
        var inputFile = document.getElementById('csv-input');
        inputFile.onchange = function () {
            handleFiles(inputFile);
        };
    }

    function handleFiles(fileObject) {
        if (window.FileReader) {
            if (fileObject.value.substr(fileObject.value.lastIndexOf('.') + 1) === "csv") {

                /*
                     * Once the file's contents are loaded, loadHandler fires 
                     * the proccess of displaying their information on the map.
                     */

                var readLoadHandler = function (event) {
                    var csv = event.target.result;

                    /*
                         * Behaviour for when a marker is clicked
                         */

                    var markerClickHandler = function(marker) {
                        if (mapModule.isOriginSet()) {
                            if (marker.getPosition().equals(mapModule.getOriginPosition())) {
                                mapModule.clearDestination();
                                mapModule.clearOrigin();
                                distanceDisplayModule.cleanAll();
                            }
                            else {
                                if (!(marker.getPosition().equals(mapModule.getDestinationPosition()))) {
                                    new google.maps.DistanceMatrixService().getDistanceMatrix({
                                        origins: [mapModule.getOriginPosition()],
                                        destinations: [marker.getPosition()],
                                        travelMode: google.maps.TravelMode.WALKING
                                    }, function (response, status) {
                                        distanceDisplayModule.setOrigin(response.originAddresses[0]);
                                        distanceDisplayModule.setDestination(response.destinationAddresses[0]);
                                        distanceDisplayModule.setDistance(response.rows[0].elements[0].distance.text);
                                    });
                                    mapModule.clearDestination();
                                    mapModule.setDestination(marker);
                                }
                            }
                        }
                        else {
                            mapModule.setOrigin(marker.getPosition());
                        };
                    };
                    distanceDisplayModule.cleanAll();
                    mapModule.displayCoordinates(csv, markerClickHandler);
                    mapModule.drawRoute(10);
                };

                /*
                     * If there are any errors during the reading of the 
                     * file's contents, the user will be properly notified about it.
                     */

                var readErrorHandler = function (event) {
                    if(event.target.error.name == "NotReadableError") {
                        alert("Cannot read file!");
                    }
                };

                readingModule.getFileAsText(fileObject.files[0], readLoadHandler, readErrorHandler);
            }
            else
                alert("Wrong file extension! Only .csv files supported! Try again!");
        }
        else {
            alert('FileReader is not supported in this browser.');
        }
    }

    return {

        /* 
         * Initialize the state for the application.
         */

        initialize: initialize,

        /*
         * Takes a file selected by the user, checks if there's suport for FileReader, 
         * checks the file extension and finally, handles the file to another function 
         * in order to proccess its contents.
         */

        handleFiles: handleFiles 
    };
}(app.mapModule, app.distanceDisplayModule, app.readingModule));