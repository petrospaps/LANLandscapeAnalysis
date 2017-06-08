(function () {
    "use strict";

    var file_el = null;

    // Wait until the page is loaded
    window.onload = function () {
        checkFileAPISupport();
        file_el = document.getElementById("json_file");
        console.log(file_el);
        document.getElementById("json_file").addEventListener("change", handleFileSelect, false);
    }

    function checkFileAPISupport() {

        // Check for the various File API support.
        if (window.File && window.FileReader && window.FileList && window.Blob) {
            // Great success! All the File APIs are supported.
            console.log("File functionality is supported");
        } else {
            alert('The File APIs are not fully supported in this browser.');
        }

    }

    var JsonObj = null;

    function handleFileSelect(evt) {
        var files = evt.target.files; // FileList object
        var f = null;
        f = files[0];
        var reader = new FileReader();

        // Closure to capture the file information.
        reader.onload = (function (theFile) {
            return function (e) {
                // Render thumbnail.
                JsonObj = JSON.parse(e.target.result);
                console.log(JsonObj);
            };
        })(f);

        // Read in the image file as a data URL.
        reader.readAsText(f);
    }


    return {
        checkFileAPISupport: checkFileAPISupport
    };

}());
