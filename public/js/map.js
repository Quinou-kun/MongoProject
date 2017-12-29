let map;
let marker;
let here;
let vliboul = true;
let parkingboul = true;
let directionsService;
let directionsDisplay;
let directionsDisplay2;
let directionsDisplay3;
const markers = [];
const markersVelib = [];
const markersEvent = [];
const markersParking = [];
let infoWindow;
const geocoder = new google.maps.Geocoder();
const geocoder2 = new google.maps.Geocoder();
const events = eventPug;
const velibs = velibPug;
const parkings = parkingPug;
let controlUI;
const searchbar = document.getElementById('pac-input');

searchbar.addEventListener("keypress", keyPressed);

function keyPressed(k) {
  if (k.code == 'Enter'){
		search();
  }
  return false;  // no propagation or default
}

function search(){
	for(let evt in events){
		if(searchbar.value.toLowerCase() == events[evt].title.toLowerCase()){
			let pos = {
				lat: events[evt].lat,
				lng: events[evt].lng
			};
			map.panTo(pos);
		}
	}
}

function openNav() {
      if(menu == 0){
       document.getElementById('mySidenav').style.width = '200px';
       menu = 1;
       controlUI.style.backgroundColor = '#F0F8FF';
      }else{
       document.getElementById('mySidenav').style.width = '0px';
       menu = 0; 
       controlUI.style.backgroundColor = '#fff';
      }
}

function CenterControl(controlDiv, map) {
        controlUI = document.createElement('div');
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

        let controlText = document.createElement('div');
        controlText.style.color = 'rgb(25,25,25)';
        controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
        controlText.style.fontSize = '16px';
        controlText.style.lineHeight = '38px';
        controlText.style.paddingLeft = '5px';
        controlText.style.paddingRight = '5px';
        controlText.innerHTML = '<div class="btntext">Menu</div>';
        controlUI.appendChild(controlText);

        controlUI.addEventListener('click', function() {
			openNav()
        });
}

function removeVelibs(){
	let vliblink = document.getElementById('vlib');	
    if(vliboul == true){
		for(let i in markersVelib){
			markersVelib[i].setMap(null);
			vliboul = false;
			vliblink.setAttribute("class", "clicked");
		}
    }else{
		for(let i in markersVelib){
			markersVelib[i].setMap(map);
			vliboul = true;
			vliblink.setAttribute("class", "unclicked");
		}
	}

}

function removeParkings(){
	let pklink = document.getElementById('prking');		
    if(parkingboul == true){
		for(let i in markersParking){
			markersParking[i].setMap(null);
			parkingboul = false;
			pklink.setAttribute("class", "clicked");
		}
    }else{
		for(let i in markersParking){
			markersParking[i].setMap(map);
			parkingboul = true;
			pklink.setAttribute("class", "unclicked");
		}
	}
}

function bindInfoWindow(marker, map, infowindow, html) {
    marker.addListener('click', function() {
        infowindow.setContent(html);
        infowindow.open(map, this);
    });
} 

function toVelib(e, n){
	e.preventDefault();
	directionsDisplay.setDirections({routes: []});
	directionsDisplay2.setDirections({routes: []});
	directionsDisplay3.setDirections({routes: []});
	
	directionsService.route({
        origin: here.getPosition(),
        destination: {lat: n.lat, lng: n.lng},
        avoidTolls: true,
        avoidHighways: false,
        travelMode: google.maps.TravelMode.WALKING
    }, function (response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            directionsDisplay2.setDirections(response);
        } else {
            window.alert('Directions request failed due to ' + status);
        }
    });	
}

function toParking(e, n){
	e.preventDefault();
	directionsDisplay.setDirections({routes: []});
	directionsDisplay2.setDirections({routes: []});
	directionsDisplay3.setDirections({routes: []});
	
	directionsService.route({
        origin: here.getPosition(),
        destination: {lat: n.lat, lng: n.lng},
        avoidTolls: true,
        avoidHighways: false,
        travelMode: google.maps.TravelMode.DRIVING
    }, function (response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(response);
        } else {
            window.alert('Directions request failed due to ' + status);
        }
    });
}


function rad(x) {return x*Math.PI/180;}

function render(e, n) {
	e.preventDefault();
	if(parkingboul){
		let lat = n.lat;
		let lng = n.lng;
		let R = 6371;
		let distances = [];
		let closest = -1;
		for( i=0;i< events.length; i++ ) {
			let mlat = parkings[i].lat;
			let mlng = parkings[i].lng;
			let dLat  = rad(mlat - lat);
			let dLong = rad(mlng - lng);
			let a = Math.sin(dLat/2) * Math.sin(dLat/2) +
				Math.cos(rad(lat)) * Math.cos(rad(lat)) * Math.sin(dLong/2) * Math.sin(dLong/2);
			let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
			let d = R * c;
			distances[i] = d;
			if ( closest == -1 || d < distances[closest] ) {
				closest = i;
			}
		}
		calculateAndDisplayRoute(directionsService, directionsDisplay, {lat: n.lat, lng: n.lng}, {lat: parkings[closest].lat, lng: parkings[closest].lng});
	}else{
		if(vliboul){
			let lat = here.getPosition().lat();
			let lng = here.getPosition().lng();
			let R = 6371;
			let distances = [];
			let closest = -1;
			for( i=0;i< events.length; i++ ) {
				let mlat = velibs[i].lat;
				let mlng = velibs[i].lng;
				let dLat  = rad(mlat - lat);
				let dLong = rad(mlng - lng);
				let a = Math.sin(dLat/2) * Math.sin(dLat/2) +
					Math.cos(rad(lat)) * Math.cos(rad(lat)) * Math.sin(dLong/2) * Math.sin(dLong/2);
				let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
				let d = R * c;
				distances[i] = d;
				if ( closest == -1 || d < distances[closest] ) {
					closest = i;
				}
			}
			calculateAndDisplayRoute(directionsService, directionsDisplay, {lat: n.lat, lng: n.lng}, {lat: velibs[closest].lat, lng: velibs[closest].lng});			
		}else{
			toVelib(e, n);
		}
	}
}

function calculateAndDisplayRoute(directionsService, directionsDisplay, pointA, pointB) {
	directionsDisplay.setDirections({routes: []});
	directionsDisplay2.setDirections({routes: []});
	directionsDisplay3.setDirections({routes: []});

	if(parkingboul){
		directionsService.route({
			origin: here.getPosition(),
			destination: pointB,
			avoidTolls: true,
			avoidHighways: false,
			travelMode: google.maps.TravelMode.DRIVING
		}, function (response, status) {
			if (status == google.maps.DirectionsStatus.OK) {
				directionsDisplay.setDirections(response);
			} else {
				window.alert('Directions request failed due to ' + status);
			}
		});
				
		directionsService.route({
			origin: pointB,
			destination: pointA,
			travelMode: google.maps.TravelMode.WALKING
		}, function (response, status) {
			if (status == google.maps.DirectionsStatus.OK) {
				directionsDisplay2.setDirections(response);
			} else {
				window.alert('Directions request failed due to ' + status);
			}
		});
	}else{
		directionsService.route({
			origin: here.getPosition(),
			destination: pointB,
			avoidTolls: true,
			avoidHighways: false,
			travelMode: google.maps.TravelMode.WALKING
		}, function (response, status) {
			if (status == google.maps.DirectionsStatus.OK) {
				directionsDisplay2.setDirections(response);
			} else {
				window.alert('Directions request failed due to ' + status);
			}
		});
				
		directionsService.route({
			origin: pointB,
			destination: pointA,
			travelMode: google.maps.TravelMode.WALKING
		}, function (response, status) {
			if (status == google.maps.DirectionsStatus.OK) {
				directionsDisplay3.setDirections(response);
			} else {
				window.alert('Directions request failed due to ' + status);
			}
		});
	}
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
			  fullscreenControl: false,
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
				    let centerControlDiv = document.createElement('div');
					let centerControl = new CenterControl(centerControlDiv, map);

					centerControlDiv.index = 1;
				map.controls[google.maps.ControlPosition.TOP_LEFT].push(centerControlDiv);

				directionsService = new google.maps.DirectionsService;
				directionsDisplay = new google.maps.DirectionsRenderer({
					suppressMarkers: true,
					map: map
				});
				directionsDisplay2 = new google.maps.DirectionsRenderer({
					suppressMarkers: true,
					polylineOptions : {strokeColor:'red'},
					map: map
				});
				directionsDisplay3 = new google.maps.DirectionsRenderer({
					suppressMarkers: true,
					polylineOptions : {strokeColor:'green'},
					map: map
				});				
				for(let mark in velibs){
					let infowindow = new google.maps.InfoWindow();
					let nametransfo = velibs[mark].name.replace(/[0-9]/g, '').replace(/-/g, "").replace(/\s*\(.*?\)\s*/g, '').slice( 2 );
					let html = '<h1>'+nametransfo+'</h1> <p>'+ velibs[mark].address +'</p><p>Nombre de vélos :'+ velibs[mark].number +"</p><p><a href='' onclick='toVelib(event,"+JSON.stringify({lat: velibs[mark].lat, lng: velibs[mark].lng})+")'>Comment m'y rendre ?</a></p>";
					marker = new google.maps.Marker({
						map: map,
						position: {lat: velibs[mark].lat, lng: velibs[mark].lng},
						title: nametransfo,
						icon: '../img/velo.png'
					});
					bindInfoWindow(marker, map, infowindow, html);
					markersVelib.push(marker);
				}
				
				for(let evt in events){
					let jours = events[evt].date.substring(8, 10);
					let mois = events[evt].date.substring(5, 7);
					let ans = events[evt].date.substring(0, 4);
					let dat = jours+'/'+mois+'/'+ans;
					let infowindow = new google.maps.InfoWindow();
					let html = '<h1>'+events[evt].title+'</h1> <p>'+dat+'</p><p>'+events[evt].description+"</p><p><a href='' onclick='render(event,"+JSON.stringify({lat: events[evt].lat, lng: events[evt].lng})+")'>Comment m'y rendre ?</a></p>";
					marker = new google.maps.Marker({
						map: map,
						position: {lat: events[evt].lat, lng: events[evt].lng},
						title: events[evt].title,
						icon: '../img/event.png'
					});
					bindInfoWindow(marker, map, infowindow, html);
					markersEvent.push(marker);
				}
				
				for(let park in parkings){
					let infowindow = new google.maps.InfoWindow();
					let html = '<h1>'+parkings[park].name+'</h1> <p>'+parkings[park].address+"</p><p><a href='' onclick='toParking(event,"+JSON.stringify({lat: parkings[park].lat, lng: parkings[park].lng})+")'>Comment m'y rendre ?</a></p>";
					marker = new google.maps.Marker({
						map: map,
						position: {lat: parkings[park].lat, lng: parkings[park].lng},
						title: parkings[park].name,
						icon: '../img/parking.png'
					});
					bindInfoWindow(marker, map, infowindow, html);
					markersParking.push(marker);
				}
				
				if (navigator.geolocation) {
					navigator.geolocation.getCurrentPosition(function(position) {
						here = new google.maps.Marker({
							map: map,
							position: {lat: position.coords.latitude, lng: position.coords.longitude},
							animation: google.maps.Animation.BOUNCE,
							title: "Vous êtes ici",
							icon: '../img/ici.png'
						});
					});
					
				}
			};
		}
	});
}

google.maps.event.addDomListener(window, "load", initialize);
