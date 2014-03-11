/*
 * Takes a file selected by the user, checks if there's suport for FileReader, 
 * checks the file extension and finally, handles the file to another function 
 * in order to proccess its contents.
 */

function handleFiles(fileObject) {
    // Check for the various File API support.
    if (window.FileReader) {        
        if (fileObject.value.substr(fileObject.value.lastIndexOf('.')+1) == "csv")
            getFileAsText(fileObject.files[0]);
        else
            alert("Wrong file extension! Only .csv files supported! Try again!");
    } else {
        alert('FileReader is not supported in this browser.');
    }
}

/*
 * Gets the file's contents and sets the behaviour for when
 * the contents are fully loaded and for when there is any
 * error during the load.
 */

function getFileAsText(fileToRead) {
    var reader = new FileReader();
    // Read file into memory as UTF-8      
    reader.readAsText(fileToRead);
    // Handle errors load
    reader.onload = loadHandler;
    reader.onerror = errorHandler;
}

/*
 * Once the file's contents are loaded, this function fires 
 * the proccess of giving them a meaning.
 */

function loadHandler(event) {
    var csv = event.target.result;
    displayCoordinatesAndDrawRoutes(csv);             
}

/*
 * If there are any errors during the reading of the 
 * file's contents, the user will be properly notified
 * of it.
 */

function errorHandler(evt) {
    if(evt.target.error.name == "NotReadableError") {
        alert("Cannot read file!");
    }
}