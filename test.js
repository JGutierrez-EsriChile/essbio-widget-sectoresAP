var acc = document.getElementsByClassName("accordion");
var i;

for (i = 0; i < acc.length; i++) {
    acc.onclick = function () {
        this.classList.toggle("active");
        this.nextElementSibling.classList.toggle("show");
    }
}

require([
    "dojo/dom", 
    "dojo/on",
    "esri/map",
    "dojo/parser",
    "esri/layers/FeatureLayer",
    "esri/graphicsUtils",
    "esri/symbols/SimpleMarkerSymbol",
    "esri/symbols/SimpleLineSymbol",
    "esri/Color",
    "esri/dijit/FeatureTable",
    "esri/tasks/query",
    "esri/tasks/QueryTask",
    "dojo/ready",
    "dojo/domReady!"
], function (dom, on, Map, parser, FeatureLayer, graphicsUtils, SimpleMarkerSymbol, SimpleLineSymbol, Color, FeatureTable,Query,QueryTask,ready) {

    parser.parse();

    ready(function () {

        // Create the feature layer
        var myFeatureLayer = new FeatureLayer("*datasourcehere*", {
            mode: FeatureLayer.MODE_ONDEMAND,
            outFields: ["*"],
            visible: true,
            id: "fLayer"
        });

        var selectionSymbol = new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE, 7,
            new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([0, 255, 197, 1])));

        myFeatureLayer.setSelectionSymbol(selectionSymbol);

        myFeatureLayer.on("click", function (evt) {
            var idProperty = myFeatureLayer.objectIdField,
                feature,
                featureId,
                query;

            if (evt.graphic && evt.graphic.attributes && evt.graphic.attributes[idProperty]) {
                feature = evt.graphic,
                    featureId = feature.attributes[idProperty];

                query = new Query();
                query.returnGeometry = false;
                query.objectIds = [featureId];
                query.where = "1=1";

                myFeatureLayer.selectFeatures(query, FeatureLayer.SELECTION_NEW);
            }
        });

        map.addLayer(myFeatureLayer);


        myTable = new FeatureTable({
            featureLayer: myFeatureLayer,
            showGridMenu: false,
            hiddenFields: [] // field that end-user can show, but is hidden on startup
        }, "myTableNode");

        myTable.startup();


    });

    var queryTask = new QueryTask("*datasourcehere*");

    var query = new Query();
    query.returnGeometry = false;
    query.outFields = ["*"
    ];

    on(dom.byId("execute"), "click", execute);
    on(dom.byId("SitesCheck"), "click", changecheck);

    map = new Map("map", {
        center: [-94.560647, 39.121954],
        zoom: 7,
        basemap: "dark-gray"
    });

    var featureLayer = new FeatureLayer("*datasourcehere");

    map.addLayer(featureLayer);

    function changecheck() {
        if (dom.byId("SitesCheck").checked) {
            featureLayer.show();
        } else {
            featureLayer.hide();
        }
    }

    function execute() {
        query.where = "Site_ID LIKE '%" + dom.byId("stateName").value + "%'";
        queryTask.execute(query, showResults);
    }

    function showResults(results) {
        var resultItems = [];
        var resultCount = results.features.length;
        for (var i = 0; i < resultCount; i++) {
            var featureAttributes = results.features.attributes;
            var activity_id = results.features.attributes.Activity_ID;
            var activity_status = results.features.attributes.Activity_Status;
            var code = results.features.attributes.Code;
            var activity_name = results.features.attributes.Activity_Name;
            var latitude = results.features.attributes.Lat;
            var longitude = results.features.attributes.Long;
            var status = results.features.attributes.Status;
            var pdf = results.features.attributes.PDF_LINKS;
            for (var attr in featureAttributes) {
                resultItems.push(
                    "<b>" + attr + ":</b> " + featureAttributes[attr]);
            }
            resultItems.push("<br>");
        }
        dom.byId("activityID").innerHTML = activity_id;
        dom.byId("activitystatus").innerHTML = activity_status;
        dom.byId("code").innerHTML = code;
        dom.byId("activityname").innerHTML = activity_name;
        dom.byId("status").innerHTML = status;
        dom.byId("pdfwindow").src = pdf;
        dom.byId("video").src = ""
        initialize(latitude, longitude);
        dom.byId("calendar").style.visibility = "visible";

    }
});


var panorama;
function initialize(latitude, longitude) {
    panorama = new google.maps.StreetViewPanorama(
        document.getElementById('streetviewpane'),
        {
            position: { lat: latitude, lng: longitude },
            pov: { heading: 165, pitch: 0 },
            zoom: 1
        });
}