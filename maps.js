var map; // map data
var markersArray = []; // marker data

var panorama; // for map canvas

// for APIs
var svService = new google.maps.StreetViewService();

// when the page is loaded, get mapdata and initialize
$(function() {
  $.ajax({
    url: "mapdata.json",
    cache: false,
    dataType: "json",
    success: function(json) {
      var data = jsonRequest(json);
      initialize(data);
    }
  });
});

// Initialize function
// draw map window and put makers
function initialize(data) {
  // Set the center of San Francisco
  var latlng = new google.maps.LatLng(37.779598, -122.420143);
  var myOptions = {
    zoom: 12,
    center: latlng,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  map = new google.maps.Map(document.getElementById("map_canvas"),
      myOptions);

  // create a html for information window of each maker
  for (i in data) {
    var dat = data[i];
    var infohtml =
      '<div id="info"><b>' + dat.Category + '</b><br>' + 
      'IncidentNum: ' + dat.IncidntNum + '<br>' + 'Day Of Week: ' + dat.DayOfWeek + '<br>' +
      'Discript: ' + dat.Descript + '<br>' + 'PD District: ' + dat.PdDistrict + '<br>' +
      'Location: ' + dat.Location + '<br>' + 'Time/Date: ' + dat.Time + ' ' + dat.Date + '<br>' +
      'Resolution: ' + dat.Resolution + '<br>' +
      '<hr><input type="button" value="Street View" onClick="toggleStreetView(' + i + ');">' +
      '<div id="streetview">&nbsp;</div></div>';
    var listhtml =
      '<b><a href="#" onClick="showInfoWindow(' + i + ');">' + dat.Category + '</a></b><br>' +
      dat.Location;

    var marker = new google.maps.Marker({
      position: new google.maps.LatLng(dat.Y, dat.X),
      map: map,
      html: infohtml,
      listhtml: listhtml,
    });
    var infowindow = new google.maps.InfoWindow({
      content: "loading..."
    });

    google.maps.event.addListener(marker, 'click', function() {
      infowindow.setContent(this.html);
      infowindow.open(map, this);
    });
    markersArray.push(marker);
  }
  drawListhtml();
}

// get marker objects from json object
function jsonRequest(json) {
  var data = [];
  if (json.Marker) {
    var n = json.Marker.length;
    for (var i=0; i<n; i++) {
      data.push(json.Marker[i]);
    }
  }
  return data;
}

// Show info window in the map
function showInfoWindow(i) {
  if (panorama != null && panorama.getVisible()) {
    panorama.setVisible(false);
  }
  google.maps.event.trigger(markersArray[i], "click");
}

// Show street view
function toggleStreetView(i) {
  svService.getPanoramaByLocation(markersArray[i].getPosition(), 100, function(result, status) {
    if (status == google.maps.StreetViewStatus.OK) {
      panorama = map.getStreetView();
      panorama.setPosition(result.location.latLng);
      panorama.setVisible(true);
    } else {
      if (panorama != null && panorama.getVisible()) {
        panorama.setVisible(false);
      }
      $("#streetview").html("sorry, street view is not available at this location");
    }
  });
}

// Draw the list of markers 
function drawListhtml() {
  var listhtml = "";
  var alphabetNum = 65; //A
  var bgcolor = ["049cdb", "46a546", "9d261d", "ffc40d", "f89406", "c3325f", "7a43b6"];
  var bgindex = 0;
  for (i in markersArray) {
    if (markersArray[i].getMap() != null) {
      if ((i % 2) == 0) {
        li = '<li class="even"><b>(' + String.fromCharCode(alphabetNum) + ')</b> ';
      } else {
        li = '<li><b>(' + String.fromCharCode(alphabetNum) + ')</b> ';
      }
      listhtml += li + markersArray[i].listhtml + "</li>";
      markersArray[i].setIcon(
        "http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=" +
         String.fromCharCode(alphabetNum) + "|" + bgcolor[bgindex] + "|000000");
      if (alphabetNum == 90) {
        alphabetNum = 65;
        bgindex++;
      } else {
        alphabetNum++;
      }
    }
  }
  var listmem = "<ul>" + listhtml + "</ul>";
  $("#list").html(listmem);
}

