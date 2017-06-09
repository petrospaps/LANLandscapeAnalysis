var poiModule = (function ($) {
    "use strict";

    $(document).ready(function () {
        $.ajaxSetup({
            error: function (x, status, error) {
                if (x.status != 200) {
                    console.log("Cannot connect to SPARQL. Response text: " + x['statusText'])
                }
            }
        });


    })

    //Find available datasets
    function getSPOIData() {

        var polygonPoints = "-77.03467287095656 38.91280839752332,-77.03467287095656 38.92179160247668,-77.02312712904343 38.92179160247668,-77.02312712904343 38.91280839752332,-77.03467287095656 38.91280839752332";

        var response;

        var url = "http://data.plan4all.eu/sparql";

        var query = [
            "PREFIX geo: <http://www.opengis.net/ont/geosparql#>",
            "PREFIX poi: <http://www.openvoc.eu/poi#>",
            "SELECT DISTINCT ?poi, ?label, ?class",
            "{",
            "?poi rdfs:label ?label .",
            "?poi poi:class ?class .",
            "?poi geo:asWKT ?location .",
            "FILTER( bif:st_within( ?location,'POLYGON((" + polygonPoints + "))'^^geo:wktLiteral) ) .",
            "}"
            ].join(" ");

        console.log("SPOI query" + query);

        var queryUrl = url + "?query=" + encodeURIComponent(query) + "&debug=on";

        $.ajax({
            url: queryUrl,
            dataType: "json",
            success: function (data) {
                console.log(data);
                //response = data;
            }
        })
        return response;
    }


        //Find available datasets
    function getLGDData() {
        var response;
        var polygonPoints = "-77.03005457419056 38.916401679504666,-77.03005457419056 38.918198320495335,-77.02774542580943 38.918198320495335,-77.02774542580943 38.916401679504666,-77.03005457419056 38.916401679504666";

        var url = "http://linkedgeodata.org/sparql";

        // Check the query again, it maybe wrong ****************************
        var query = [
            "PREFIX lgdr:<http://linkedgeodata.org/triplify/>",
            "PREFIX lgdo:<http://linkedgeodata.org/ontology/>",
            "PREFIX geo: <http://www.opengis.net/ont/geosparql#>",
            "PREFIX geom: <http://geovocab.org/geometry#>",
            "SELECT DISTINCT ?poi, ?label, ?type",
            "{",
            "?poi rdfs:label ?label .",
            "?poi a ?type .",
            "?poi geom:geometry [",
            "geo:asWKT ?location",
            "] .",
            "FILTER( bif:st_within( ?location,'POLYGON((" + polygonPoints + "))'^^geo:wktLiteral) ) .",
            "}"
            ].join(" ");

        console.log("LGD query" + query);

        var queryUrl = url + "?query=" + encodeURIComponent(query) + "&debug=on";
        $.ajax({
            url: queryUrl,
            dataType: "json",
            success: function (data) {
                console.log(data);
                //response = data;
            }
        })
        return response;
    }

    return {
        getSPOIData: getSPOIData,
        getLGDData: getLGDData
    };

}(jQuery));
