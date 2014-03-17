(function($) {
    $.fn.appendString = function(string, containerID) {
        var container = $('#' + containerID);
        if (container.is("div")) {
            var canvasWithString = $('<canvas style="height: 400px; width: 800px;">');
            canvasContext = canvasWithString[0].getContext('2d');
            canvasContext.font = "50pt Helvetica";
            canvasContext.fillStyle = "#071907";
            canvasContext.fillText(string, 50, 100); 
            container.html(canvasWithString);
        }
        return this;
    }
}(jQuery))