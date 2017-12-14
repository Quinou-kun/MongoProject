let map;
let marker;
const markers = [];
const markersVelib = [];
let infoWindow;
const geocoder = new google.maps.Geocoder();
const events = eventPug;
const velibs = velibPug;
const parkings = parkingPug;
console.log(events[0].title);
console.log(velibs[0].name);
console.log(velibs[0].lat);


function CenterControl(controlDiv, map) {

        // Set CSS for the control border.
        var controlUI = document.createElement('div');
        controlUI.style.backgroundColor = '#fff';
        controlUI.style.border = '2px solid #fff';
        controlUI.style.borderRadius = '3px';
        controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
        controlUI.style.cursor = 'pointer';
		controlUI.style.marginTop = '15px';
		controlUI.style.marginLeft = '15px';
        controlUI.style.marginBottom = '22px';
        controlUI.style.textAlign = 'center';
        controlUI.title = 'Click to recenter the map';
        controlDiv.appendChild(controlUI);

        // Set CSS for the control interior.
        var controlText = document.createElement('div');
        controlText.style.color = 'rgb(25,25,25)';
        controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
        controlText.style.fontSize = '16px';
        controlText.style.lineHeight = '38px';
        controlText.style.paddingLeft = '5px';
        controlText.style.paddingRight = '5px';
        controlText.innerHTML = 'Menu';
        controlUI.appendChild(controlText);

        // Setup the click event listeners: simply set the map to Chicago.
        controlUI.addEventListener('click', function() {
//          map.setCenter(chicago);
			openNav()
        });

}

function removeVelibs(){
	let chk_ceil= document.getElementById("vlib");       
    if(chk_ceil.checked == true){
		for(let i in markersVelib){
			markersVelib[i].setMap(null);
		}
    }else{
		for(let i in markersVelib){
			markersVelib[i].setMap(map);
		}
	}

}

function bindInfoWindow(marker, map, infowindow, html) {
    marker.addListener('click', function() {
        infowindow.setContent(html);
        infowindow.open(map, this);
    });
} 


function initialize() {
	geocoder.geocode({'address': 'Nancy'}, function(results, status) {
		if (status == google.maps.GeocoderStatus.OK) {
			const myOptions ={
			  center: results[0].geometry.location,
			  zoom: 15,
			  mapTypeId: google.maps.MapTypeId.ROADMAP,
			  mapTypeControl: false,
			  streetViewControl: false,
			  scrollwheel: false,
			  disableDoubleClickZoom: true,
			  styles : [
						  {
							"elementType": "labels",
							"stylers": [
							  {
								"visibility": "off"
							  }
							]
						  },
						  {
							"featureType": "administrative.land_parcel",
							"stylers": [
							  {
								"visibility": "off"
							  }
							]
						  },
						  {
							"featureType": "administrative.neighborhood",
							"stylers": [
							  {
								"visibility": "off"
							  }
							]
						  }
					  ]
			};
			if(document.getElementById("map-canvas")){
				map = new google.maps.Map(document.getElementById("map-canvas"), myOptions);
				    var centerControlDiv = document.createElement('div');
					var centerControl = new CenterControl(centerControlDiv, map);

					centerControlDiv.index = 1;
				map.controls[google.maps.ControlPosition.TOP_LEFT].push(centerControlDiv);

				
				for(let mark in velibs){
					//createMarkers();
					//console.log(velibs[mark].lat);
					var infowindow = new google.maps.InfoWindow();
					var nametransfo = velibs[mark].name.replace(/[0-9]/g, '').replace(/-/g, "").replace(/\s*\(.*?\)\s*/g, '').slice( 2 );
					var html = '<h1>'+nametransfo+'</h1> <p> info </p>'
					marker = new google.maps.Marker({
						map: map,
						position: {lat: velibs[mark].lat, lng: velibs[mark].lng},
						title: nametransfo,
						icon: '../img/velo.png'
					});
					bindInfoWindow(marker, map, infowindow, html);
					markersVelib.push(marker);
				}
				
				for(let evt in events){}
				for(let park in parkings){}
			};
		}
	});
  
 // if(document.getElementById("map-canvas")){
//	  map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
//	};
	 // searchAddress();
	
	if(document.getElementById('infos')){
	
		const infoWindow = new google.maps.InfoWindow({map: map});

        // Try HTML5 geolocation.
		
			if (navigator.geolocation) {
			  navigator.geolocation.getCurrentPosition(function(position) {
				let pos = {
					lat: position.coords.latitude,
					lng: position.coords.longitude
				};

				infoWindow.setPosition(pos);
				infoWindow.setContent("You're here!");
				map.setCenter(pos);
				map.setZoom(9);
			  }, function() {
				handleLocationError(true, infoWindow, map.getCenter());
			  });
			} else {
			  // Browser doesn't support Geolocation
			  handleLocationError(false, infoWindow, map.getCenter());
			}
		}
//	}	
}

google.maps.event.addDomListener(window, "load", initialize);

//AJAX with javascript
function ajaxGet(url, callback) {
    let req = new XMLHttpRequest();
    req.open("GET", url);
    req.addEventListener("load", function () {
        if (req.status >= 200 && req.status < 400) {
            callback(req.responseText);
        } else {
            console.error(req.status + " " + req.statusText + " " + url);
        }
    });
    req.addEventListener("error", function () {
        console.error("Erreur réseau avec l'URL " + url);
    });
    req.send(null);
}

function searchAddress() {
	
	if(document.getElementById('adress')){
	  var addressInput = document.getElementById('adress').innerHTML;
	  var geocoder = new google.maps.Geocoder();
	  
	  geocoder.geocode({address: addressInput}, function(results, status) {
		if (status == google.maps.GeocoderStatus.OK) {
		  var myResult = results[0].geometry.location; // reference LatLng value
		  createMarker(myResult); // call the function that adds the marker
		  map.setCenter(myResult);
		  map.setZoom(17);
		}
	  });
	} else {		
		var addresses = document.getElementById('infos').getElementsByClassName('addresses');
		var names = document.getElementById('infos').getElementsByClassName('titles');
		var des = document.getElementById('infos').getElementsByClassName('descr');
		var img = document.getElementById('infos').getElementsByClassName('imgs');
		var lks = document.getElementById('infos').getElementsByClassName('links');
		var geocoder = new google.maps.Geocoder();
		infoWindow = new google.maps.InfoWindow();
		//var markers = [];
			for(var i = 0; i < addresses.length; i++){
				geocoder.geocode({address: addresses[i].value}, createMarkers(addresses[i].value, names[i].value, des[i].value, img[i].value, lks[i].value,));
			}			
	}
}

function createMarker(latlng) {

   // If the user makes another search you must clear the marker variable
   if(marker != undefined && marker != ''){
    marker.setMap(null);
    marker = '';
   }

   marker = new google.maps.Marker({
      map: map,
      position: latlng
   });

}


function createMarkers(addr, name, descr, lk) {
	
	 return function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            var marker = new google.maps.Marker({
                map: map,
                position: results[0].geometry.location,
                title: name,
            });
			
			var content='<h1>'+name+'</h1>' +	
						'<h2>'+addr+'</h2>' +
						'<p>'+descr+'</p>' +
						'<p><a href="" title="'+name+'" target="_parent">How to get there</a></p>';

			
            (function (marker, addr) {
                google.maps.event.addListener(marker, "click", function (e) {
                    infoWindow.setContent(content);
                    infoWindow.open(map, marker);
                });
            })(marker, addr);
        }
    };
}