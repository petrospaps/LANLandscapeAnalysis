var mainModule = (function () {
    "use strict";

    var file_el = null;
    var JsonObj = null;
    var locations = [];
    var locationCrime = [];
    var areaCrime = [];
    var allCallsReturned = false;
    var firstCallReturned = false;
    var receivedAreaData = false;
    var receivedLocationData = false;

    // Wait until the page is loaded and do some checks
    window.onload = function () {
        checkFileAPISupport();

        console.log(math.derivative('2x^2 + 3x + 4', 'x').toString());

        poiModule.getSPOIData();
        poiModule.getLGDData();

        let myPromise = new Promise((resolve, reject) => {
            // We call resolve(...) when what we were doing made async successful, and reject(...) when it failed.
            // In this example, we use setTimeout(...) to simulate async code.
            // In reality, you will probably be using something like XHR or an HTML5 API.
            setTimeout(function () {
                resolve("Success!"); // Everything went well!
            }, 2500);
        });

        myPromise.then((successMessage) => {
                // successMessage is whatever we passed in the resolve(...) function above.
                // It doesn't have to be a string, but if it is only a succeed message, it probably will be.
                console.log("promise resolved with message: " + successMessage);
            })
            .catch((reason) => {
                console.log("promise did not resolve with message: " + reason);
            });

        // Make HTML elements that will be used to upload, parse, and evaluate locations
        var fileInput = document.createElement('input');
        fileInput.type = "file";
        fileInput.name = "json_file_story";
        fileInput.id = "json_file";
        fileInput.addEventListener("change", handleFileSelect, false);

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
        //Add the HTML elements in the selected divs
        document.getElementById("file_input").appendChild(fileInput);
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

        var numOfLocations = locations.length;

        if (numOfLocations > 0) {
            for (var i = 0; i < numOfLocations; i++) {
                console.log(locations[i].lon + " " + locations[i].lat);
            }
            var result = "this is the text to display"
            showResults(result);

            crimeModule.crimesAtLocation(50.89967, -1.403664);
            crimeModule.streetLevelCrimes(50.89967, -1.403664);

        } else {
            console.log("Please upload a JSON file and parse the locations");
        }
    }

    function calculateCrimeScore(areaCrimeP, locationCrimeP) {
        var outcome = 0;

        var numOfLocations = locationCrimeP.length;
        var numOfLocationsArea = areaCrimeP.length;
        var listOfIdArea = [];
        var listOfIdAreaUnique = [];
        var num_listOfIdAreaUnique = 0;
        var temp_var1 = null;
        var temp_var2 = null;

        // The array of unique ids is empty, so the first element will be unique and we add it below
        listOfIdAreaUnique.push(areaCrimeP[0].location.street.id);

        for (var i = 0; i < numOfLocationsArea; i++) {
            console.log("loop for : " + numOfLocationsArea + " current loop: " + i);
            num_listOfIdAreaUnique = listOfIdAreaUnique.length;
            for (var j = 0; j < num_listOfIdAreaUnique; j++) {
                console.log("loop for : " + num_listOfIdAreaUnique + " current loop: " + j);
                temp_var1 = areaCrimeP[i].location.street.id;
                temp_var2 = listOfIdAreaUnique[j];

                if (temp_var2 !== temp_var1) {
                    if (num_listOfIdAreaUnique -1 === j) {
                        listOfIdAreaUnique.push(areaCrimeP[i].location.street.id);
                        console.log("Added to the unique list " + areaCrimeP[j].location.street.id);
                    }
                } else {
                    console.log("Already in the list");
                    break;
                }
            }
        }

        console.log(listOfIdAreaUnique);

        // Find how many unique streets in the area
        // Find the mean of the area
        // Calculate the Standard deviation
        // calculate the z score
        // transform the z score to a rank
    }

    function getAllCrimeData(data1, data2) {
        //data1 local, data2 area

        // set data2 of area
        if (data1 === 0) {
            areaCrime = data2;
            receivedAreaData = true;
        }
        // set data1 of locations
        if (data2 === 0) {
            locationCrime = data1;
            receivedLocationData = true;
        }

        // When both local and the area data is returned pass them for evaluation
        if (receivedAreaData && receivedLocationData) {
            calculateCrimeScore(areaCrime, locationCrime);
        }
    }

    function calculateCrimeScoreArea(data) {
        areaCrime = data;
    }

    function calculateCrimeScoreLocation(data) {
        locationCrime = data;
    }

    // Display the outcome of the evaluation on the screen
    function showResults(result) {
        document.getElementById("evaluation_output").innerHTML = result;
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

    // if you want to call a function public
    // set a global var and assign the self invoking function e.g. globalvariable.myfunction() to call the function
    //return {myfunction: myfunction};
    return {
        calculateCrimeScore: calculateCrimeScore,
        calculateCrimeScoreArea: calculateCrimeScoreArea,
        calculateCrimeScoreLocation: calculateCrimeScoreLocation,
        getAllCrimeData: getAllCrimeData
    };

}());
