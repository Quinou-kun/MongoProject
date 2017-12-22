let map;
let marker;
let vliboul = true;
let parkingboul = true;
const markers = [];
const markersVelib = [];
const markersEvent = [];
const markersParking = [];
let infoWindow;
const geocoder = new google.maps.Geocoder();
const events = eventPug;
const velibs = velibPug;
const parkings = parkingPug;
console.log(parkings);
var controlUI;
const searchbar = document.getElementById('pac-input');

searchbar.addEventListener("keypress", keyPressed);

function keyPressed(k) {
  if (k.code == 'Enter'){ 
	//let i = 0;
	  for(let evt in events){
		if(searchbar.value == events[evt].title){
			let pos = {
				lat: events[evt].lat,
				lng: events[evt].lng
			};
			map.panTo(pos);
			//let infowindow = new google.maps.InfoWindow();
			//let html = '<h1>'+events[evt].title+'</h1> <p>'+events[evt].date+'</p><p>'+events[evt].description+"</p><p><a href='' onclick='render(event,\""+events[evt].title+"\")'>Comment m'y rendre ?</a></p>";
			//infowindow.setContent(html);			
			//infowindow.open(map, markersEvent[i]);
		}
		//i++;
	  }
  }
  return false;  // no propagation or default
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

        // Set CSS for the control border.
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

        // Set CSS for the control interior.
        var controlText = document.createElement('div');
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
		for(let i in markersEvent){
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

function render(e, n) {
	e.preventDefault();
	alert(n);
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
				    var centerControlDiv = document.createElement('div');
					var centerControl = new CenterControl(centerControlDiv, map);

					centerControlDiv.index = 1;
				map.controls[google.maps.ControlPosition.TOP_LEFT].push(centerControlDiv);

				
				for(let mark in velibs){
					//createMarkers();
					//console.log(velibs[mark].lat);
					var infowindow = new google.maps.InfoWindow();
					var nametransfo = velibs[mark].name.replace(/[0-9]/g, '').replace(/-/g, "").replace(/\s*\(.*?\)\s*/g, '').slice( 2 );
					var html = '<h1>'+nametransfo+'</h1> <p>'+ velibs[mark].address +'</p><p>Nombre de vélos :'+ velibs[mark].number +"</p><p><a href='' onclick='render(event,\""+nametransfo+"\")'>Comment m'y rendre ?</a></p>";
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
					var infowindow = new google.maps.InfoWindow();
					var html = '<h1>'+events[evt].title+'</h1> <p>'+events[evt].date+'</p><p>'+events[evt].description+"</p><p><a href='' onclick='render(event,\""+events[evt].title+"\")'>Comment m'y rendre ?</a></p>";
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
					var infowindow = new google.maps.InfoWindow();
					var html = '<h1>'+parkings[park].title+'</h1> <p> info </p>'
					marker = new google.maps.Marker({
						map: map,
						position: {lat: parkings[park].lat, lng: parkings[park].lng},
						title: parkings[park].title,
						icon: '../img/parking.png'
					});
					bindInfoWindow(marker, map, infowindow, html);
					markersParking.push(marker);
				}
				if (navigator.geolocation) {
					navigator.geolocation.getCurrentPosition(function(position) {
						marker = new google.maps.Marker({
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
