var app = window.app = window.app || {};

app.readingModule = (function() {
    'use strict';
    
    return {
        
        /*
         * Gets the file's contents and sets the behaviour for when
         * the contents are fully loaded and for when there is any
         * error during the load.
         */
        
        getFileAsText: function(fileToRead, loadHandler, errorHandler) {
            var reader = new FileReader();
            // Read file into memory as UTF-8      
            reader.readAsText(fileToRead);
            // Handle errors load
            reader.onload = loadHandler;
            reader.onerror = errorHandler;
        }
    }
}());