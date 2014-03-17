(function($) {
    controlModule = (function() {
        return {
            displayStringInContainer: function (containerID) {
                var string = $('#string').val();
                $.fn.appendString(string, containerID);
            },

            initializeState: function() {
                $('#correct-display').click(function(displayStringInContainer) {
                    return function() {
                        displayStringInContainer("correct-container");
                    }
                }(this.displayStringInContainer));
                $('#fail-display').click(function(displayStringInContainer) {
                    return function() {
                        displayStringInContainer("incorrect-container");
                    }
                }(this.displayStringInContainer));
            }
        }
    }());
}(jQuery))

controlModule.initializeState();