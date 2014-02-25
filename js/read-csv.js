function handleFiles(files) {
    // Check for the various File API support.
    if (window.FileReader) {
        // FileReader is supported.
        getFileAsText(files[0]);
    } else {
        alert('FileReader is not supported in this browser.');
    }
}

function getFileAsText(fileToRead) {
    var reader = new FileReader();
    // Read file into memory as UTF-8      
    reader.readAsText(fileToRead);
    // Handle errors load
    reader.onload = loadHandler;
    reader.onerror = errorHandler;
}

function loadHandler(event) {
    var csv = event.target.result;
    displayCoordinatesAndDrawRoutes(csv);             
}

function errorHandler(evt) {
    if(evt.target.error.name == "NotReadableError") {
        alert("Cannot read file!");
    }
}