// Function to determine marker size based on population
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";
var cityMarkers = [];
function markerSize(mag) {
  return mag * 15000;
}

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  console.log(data.features[1].properties.mag);
  console.log(data.features[1].geometry.coordinates);
    for (var i = 0; i < data.features.length; i++) {
        // Setting the marker radius for the state by passing population into the markerSize function
        lat = data.features[i].geometry.coordinates[1]; 
        lng = data.features[i].geometry.coordinates[0];  
        coordinates = [lat,lng];         
        var color = "";
        if (data.features[i].properties.mag > 5) {
            color = "red";
        }
        else if (data.features[i].properties.mag > 4 && data.features[i].properties.mag < 5) {
            color = "orange";
        }
        else if (data.features[i].properties.mag > 3 && data.features[i].properties.mag < 4) {
            color = "yellow";
        }
        else if (data.features[i].properties.mag > 2 && data.features[i].properties.mag < 3) {
            color = "green";
        }
        else if (data.features[i].properties.mag > 1 && data.features[i].properties.mag < 2) {
            color = "blue";
        }
        else if (data.features[i].properties.mag > 0 && data.features[i].properties.mag < 1) {
            color = "indigo";
        }
        
        // Setting the marker radius for the city by passing population into the markerSize function
        cityMarkers.push(
            L.circle(coordinates, {
            stroke: false,
            fillOpacity: 0.75,
            color: "white",
            fillColor: color,
            radius: markerSize(data.features[i].properties.mag)
            }).bindPopup("<h1>" + data.features[i].properties.place + "</h1> <hr> <h3>Time: " + new Date(data.features[i].properties.time) + "</h3>")
        );
    }
    var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.streets",
        accessToken: API_KEY
    });
    var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.dark",
        accessToken: API_KEY
    });
    var cities = L.layerGroup(cityMarkers);

    // Create a baseMaps object
        var baseMaps = {
        "Street Map": streetmap,
        "Dark Map": darkmap
        };

    // Create an overlay object
    var overlayMaps = {
    "Earthquakes": cities
    };
    // Create a baseMaps object
    var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap
    };
    var myMap = L.map("map", {
        center: [37.09, -95.71],
        zoom: 5,
        layers: [streetmap, cities]
    });
      
      // Pass our map layers into our layer control
      // Add the layer control to the map

      // Set up the legend
    var legend = L.control({ position: "bottomright" });
    legend.onAdd = function() {
        var div = L.DomUtil.create("div", "info legend");
        var limits = [0,6];
        var colors = ["#ffffb2", "#b10026"];
        var labels = [];

        // Add min & max
        var legendInfo = "<h1>Median Income</h1>" +
        "<div class=\"labels\">" +
            "<div class=\"min\">" + limits[0] + "</div>" +
            "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
        "</div>";

        div.innerHTML = legendInfo;

        limits.forEach(function(limit, index) {
        labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
        });

        div.innerHTML += "<ul>" + labels.join("") + "</ul>";
        return div;
    };

    L.control.layers(baseMaps, overlayMaps, legend, {
        collapsed: true
    }).addTo(myMap);

})      

