var crimeModule = (function ($) {
    "use strict";

    $(document).ready(function () {
        $.ajaxSetup({
            error: function (x, status, error) {
                if (x.status != 200) {
                    console.log("Cannot connect to Police API. Response text: " + x['statusText'])
                }
            }
        });

        testScript();
    })


    //Test script connection
    function testScript() {
        console.log("Testing connection...");
        $.ajax({
            url: "https://data.police.uk/api/crimes-street-dates",
            data: "json",
            success: function () {
                console.log('Connection successfully made to https://data.police.co.uk/api/')
            }
        })
    }




    //Find available datasets
    function availableData() {
        var response;
        $.ajax({
            url: "https://data.police.uk/api/crimes-street-dates",
            dataType: "json",
            success: function (data) {
                console.log(data);
                //response = data;
            }
        })
        return response;
    }




    //Gather force info
    function getForces() {
        var response;
        $.ajax({
            url: "https://data.police.uk/api/forces",
            dataType: "json",
            success: function (data) {
                console.log(data)
                //response = data;
            }
        })
        return response;
    }

    function getForceInfo(force) {
        var response;
        $.ajax({
            url: "https://data.police.uk/api/forces/" + force,
            dataType: "json",
            success: function (data) {
                console.log(data)
                //response = data;
            }
        })
        return response;
    }

    function getForceSeniors(force) {
        var response;
        $.ajax({
            url: "https://data.police.uk/api/forces/" + force + "/people",
            dataType: "json",
            success: function (data) {
                console.log(data);
                //response = data;
            }
        })
        return response;
    }


    //Crime data
    function streetLevelCrimes(lat, lon) {
        var response;
        $.ajax({
            url: "https://data.police.uk/api/crimes-street/all-crime?lat=" + lat + "&lng=" + lon + "",
            dataType: "json",
            success: function (data) {
                console.log(data)
                //response = data;
            }
        })
        return response;
    }

    function streetLevelOutcomes() {

    }

    function crimesAtLocation(lat, lon) {
        // Data police example
        //https: //data.police.uk/api/crimes-at-location?date=2012-02&lat=52.629729&lng=-1.131592
        var response;
        $.ajax({
            url: "https://data.police.uk/api/crimes-at-location?lat=" + lat + "&lng=" + lon + "",
            dataType: "json",
            success: function (data) {
                console.log(data)
                //response = data;
            }
        })
        return response;
    }

    function crimesNoLocation() {

    }

    function crimeCategories() {

    }

    function lastUpdated() {

    }

    function outcomeSpecific() {

    }

    //Neighbourhood data
    function locateNeighbourhood(lat, lon) {
        var response;
        $.ajax({
            url: "https://data.police.uk/api/locate-neighbourhood?q=" + lat + " ," + lon + "",
            dataType: "json",
            success: function (data) {
                console.log(data)
                //response = data;
            }
        })
        return response;
    }

    function latlongConvert() {
        //postcodes.io
    }

    return {
        crimesAtLocation: crimesAtLocation,
        locateNeighbourhood: locateNeighbourhood,
        streetLevelCrimes: streetLevelCrimes
    };

}(jQuery));
