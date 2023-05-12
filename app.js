const sample =
  "https://raw.githubusercontent.com/nburwick/Cerulean/main/static/Resources/Tornado_Tracks.geojson"

// Function to create the dropdown options
function createDropDown(data) {
  var features = data.features

  // Access the "yr" values and remove duplicates
  var yrValues = [...new Set(features.map(feature => feature.properties.yr))]

  // Sort the "yr" values in ascending order
  yrValues.sort(function (a, b) {
    return d3.ascending(a, b)
  })

  // Create the dropdown options
  d3.select("#years")
    .selectAll("option")
    .data(yrValues)
    .enter()
    .append("option")
    .text(function (d) {
      return d
    })
}
console.log(createDropDown)
// Fetch the data from the URL using d3.json
d3.json(sample).then(data => {
  // Create a list of dictionaries
  var tornadoes = []
  for (const feature of data.features) {
    const properties = feature.properties
    const tornado = {
      id: properties.OBJECTID,
      elat: properties.elat,
      elon: properties.elon,
      slat: properties.slat,
      slon: properties.slon,
      magnitude: properties.mag,
      year: properties.yr,
    }
    tornadoes.push(tornado)
  }

  // Get the selected year from the dropdown
  var year = d3.select("#years").property("value")

  // Filter the tornadoes array by the year
  var filteredTornadoes = tornadoes.filter(function (tornado) {
    return parseInt(tornado.year) == parseInt(year)
  })

  // Create an array of coordinate pairs for the filtered tornadoes
  var coordinates = filteredTornadoes.map(function (tornado) {
    return [tornado.slat, tornado.slon]
  })

  // Add the heatmap layer to the map
  var heat = L.heatLayer(coordinates, { radius: 20 }).addTo(map)

  // Update the heatmap layer when the year is changed
  function updateHeatMap(year) {
    // Filter the tornadoes array by the year
    var filteredTornadoes = tornadoes.filter(function (tornado) {
      return parseInt(tornado.year) == parseInt(year)
    })

    // Create an array of coordinate pairs for the filtered tornadoes
    var filteredCoordinates = filteredTornadoes.map(function (tornado) {
      return [tornado.slat, tornado.slon]
    })

    // Update the heat layer with the new coordinates
    heat.setLatLngs(filteredCoordinates)
  }

  // Add event listener for the update button
  document.getElementById("update-btn").addEventListener("click", function () {
    var year = document.getElementById("years").value
    updateHeatMap(year)
  })
})

// Fetch the data from the URL using d3.json
d3.json("Tornado_Tracks.geojson").then(data => {
  // Create a list of dictionaries
  var tornadoes = []
  for (const feature of data.features) {
    const properties = feature.properties
    const tornado = {
      id: properties.OBJECTID,
      elat: properties.elat,
      elon: properties.elon,
      slat: properties.slat,
      slon: properties.slon,
      magnitude: properties.mag,
      year: properties.yr,
    }
    tornadoes.push(tornado)
  }

  console.log(tornadoes)

  // Create a Leaflet map object and add the heat map layer
  var myMap = L.map("map").setView([37.0902, -95.7129], 4)

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(myMap)

  // Update the coordinates variable with latitudes and longitudes from the tornado data
  var coordinates = tornadoes.map(function (tornado) {
    return [tornado.slat, tornado.slon]
  })

  console.log(coordinates)

  // Create a heat map layer with a default filter for all years
  let heat = L.heatLayer(
    coordinates.filter(function (tornado) {
      return tornado[2] >= 1950 && tornado[2] <= 2021
    }),
    {
      radius: 25,
      minOpacity: 0.3,
      gradient: {
        0.1: "blue",
        0.3: "green",
        0.6: "yellow",
        0.8: "orange",
        1: "red",
      },
    }
  ).addTo(myMap)

  createDropDown(data)
})

function updateHeatMap(year) {
  // Get the selected year from the dropdown if not passed as an argument
  if (!year) {
    year = d3.select("#years").property("value")
  }

  // Filter the tornadoes array by the year
  var filteredTornadoes = tornadoes.filter(function (tornado) {
    return parseInt(tornado.year) == parseInt(year)
  })

  // Update the coordinates variable with the filtered values
  var filteredCoordinates = filteredTornadoes.map(function (tornado) {
    return [tornado.slat, tornado.slon]
  })

  // filter the data based on the selected year
  var filteredData = data.filter(function (d) {
    return d.year === year
  })

  // clear the previous layer and add new heatmap layer
  if (heatmapLayer) {
    map.removeLayer(heatmapLayer)
  }

  // Update the heat layer with the new coordinates
  heat = L.heatLayer(filteredCoordinates, { radius: 20 }).addTo(map)
}
