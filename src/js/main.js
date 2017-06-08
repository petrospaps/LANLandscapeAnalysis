var module = (function () {
    "use strict";

    var file_el = null;
    var JsonObj = null;
     var locations = [];

    // Wait until the page is loaded and do some checks
    window.onload = function () {
        checkFileAPISupport();
        document.getElementById("json_file").addEventListener("change", handleFileSelect, false);

        var btnParse = document.createElement('button');
        btnParse.type = "button";
        btnParse.textContent = "parse story locations";
        btnParse.id = "parse_btn";
        btnParse.addEventListener('click', getStoryLocations);

        var btnEval = document.createElement('button');
        btnEval.type = "button";
        btnEval.textContent = "evaluate story locations";
        btnEval.id = "eval_btn";
        btnEval.addEventListener('click', evaluateLocation);

        //document.body.appendChild(btn);
        document.getElementById("parse_locations").appendChild(btnParse);
        document.getElementById("evaluate_locations").appendChild(btnEval);
    };

    // Function that checks that the required file API is supported
    function checkFileAPISupport() {

        // Check for the various File API support.
        if (window.File && window.FileReader && window.FileList && window.Blob) {
            // Great success! All the File APIs are supported.
            console.log("File functionality is supported");
        } else {
            alert('The File APIs are not fully supported in this browser.');
        }

    }

    // Function to parse all the locations from a story
    function getStoryLocations() {

        if (JsonObj) {
            var numOfLocations = JsonObj.locations.length;
            for (var i = 0; i < numOfLocations; i++) {
                locations.push(JsonObj.locations[i]);
            }
            console.log(locations);

        } else {
            console.log("Please upload a story");
        }
    }

    // Function that will evaluate each point of the locations
    function evaluateLocation() {

    }

    // Function that handles the json file upload
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
        reader.readAsText(f);
    }

    // if you want to make a function available from html
    //window.myfunction = myfunction;

}());
