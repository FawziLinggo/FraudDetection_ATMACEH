var mymap = L.map('mapid').setView([5.5661, 95.3627], 15);
//L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
//    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
//    maxZoom: 18,
//    id: 'mapbox.streets',
//    accessToken: 'ABCDEFG' //ENTER YOUR ACCESS TOKEN HERE
//}).addTo(mymap);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© OpenStreetMap'
        }).addTo(mymap);


mapMarkers1 = [];
mapMarkers2 = [];
mapLine1 = [];

var source = new EventSource('/topic/ATM_POSSIBLE_FRAUD_JSON'); //ENTER YOUR TOPICNAME HERE
source.addEventListener('message', function(e){
    obj = JSON.parse(e.data);

    // VARIABLES TRANSACTION
    t1LocationLat = obj.T1_LOCATION.split(',')[0];
    t1LocationLon = obj.T1_LOCATION.split(',')[1];
    t1TransactionAmount = obj.T1_AMOUNT;
    t1ATM = obj.T1_ATM;
    t2LocationLat = obj.T2_LOCATION.split(',')[0];
    t2LocationLon = obj.T2_LOCATION.split(',')[1];
    t2TransactionAmount = obj.T2_AMOUNT;
    t2ATM = obj.T2_ATM;

    distance = obj.DISTANCE_BETWEEN_TXN_KM;
    diffInMs = obj.MILLISECONDS_DIFFERENCE;
    diffInSec = diffInMs / 1000;

    console.log(obj);

    // show marker
    marker1 = L.marker([t1LocationLat, t1LocationLon]).addTo(mymap);
    marker2 = L.marker([t2LocationLat, t2LocationLon]).addTo(mymap);

    // show in map
    mymap.setView([t1LocationLat, t1LocationLon], 15);
    mymap.setView([t2LocationLat, t2LocationLon], 15);

    // set popup
    marker1.bindPopup("<b>ATM: " + t1ATM + "</b><br>Amount: " + t1TransactionAmount);
    marker2.bindPopup("<b>ATM: " + t2ATM + "</b><br>Amount: " + t2TransactionAmount);


    // set line
    var latlngs = Array();
    latlngs.push([t1LocationLat, t1LocationLon]);
    latlngs.push([t2LocationLat, t2LocationLon]);
    var polyline = L.polyline(latlngs, {color: 'red'}).addTo(mymap);
    mymap.fitBounds(polyline.getBounds());

    for (var i = 0; i < mapLine1.length; i++) {
      mymap.removeLayer(mapLine1[i]);
    }
    mapLine1.push(polyline);


    // add popup in line
    polyline.bindPopup("<b>Distance: " + distance + " KM</b><br>Time: " + diffInSec + " Sec");
    // add to array
    for (var i = 0; i < mapMarkers1.length; i++) {
      mymap.removeLayer(mapMarkers1[i]);
    }
    mapMarkers1.push(marker1);
    
    for (var i = 0; i < mapMarkers2.length; i++) {
      mymap.removeLayer(mapMarkers2[i]);
    }
    mapMarkers2.push(marker2);

    
}, false);