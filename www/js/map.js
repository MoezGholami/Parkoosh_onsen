//map.js

map=null;
parkingMarker=null;
infowindow=null;
userMarker=null;
userLogoWindow=null;

(function() {
    var app = angular.module('myApp', ['onsen']);
  
    //Map controller
    app.controller('MapController', function($scope, $timeout){
      
          
        //Map initialization  
        $timeout(function initialize(){
      
            var latlng = new google.maps.LatLng(userCords.latitude, userCords.longitude);
            var myOptions = {
                zoom: 15,
                center: latlng,
		mapTypeControl:false,
		streetViewControl:false,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            map = new google.maps.Map(document.getElementById("map_canvas"), myOptions); 
            $scope.overlay = new google.maps.OverlayView();
            $scope.overlay.draw = function() {}; // empty function required
            $scope.overlay.setMap(map);
            $scope.element = document.getElementById('map_canvas');
	    $scope.initMarkers();
	    $scope.getParkingInfo();
	    google.maps.event.addDomListener(window, 'load', initialize);
        },100);

	$scope.initMarkers = function()
	{
            var parkingPos = new google.maps.LatLng(parkingCords.latitude, parkingCords.longitude);
	    infowindow = new google.maps.InfoWindow({content:'ظرفیت ندارد.'});
	    parkingMarker = new google.maps.Marker(
		    {
			title: 'ظرفیت',
		    	map: map,
		    	position: parkingPos,
		    	icon: yellowDotUrl
		    }
		    );
	    google.maps.event.addListener(parkingMarker, 'click', function(){infowindow.open(map, parkingMarker);});
	    var userPos = new google.maps.LatLng(userCords.latitude, userCords.longitude);
	    userLogoWindow = new google.maps.InfoWindow({content:'شما اینجا هستید.'});
	    userMarker = new google.maps.Marker(
			    {
				title: 'مکان شما',
		    		map: map,
		    		position: userPos,
		    		icon:pegmanMapLogoUrl
			    }
			    );
	    google.maps.event.addListener(userMarker, 'click', function(){userLogoWindow.open(map, userMarker);});
	}

        //Get Selected Map Markers
	$scope.getParkingInfo = function(){
		if($scope.isInBound(parkingMarker.getPosition())!=true)
		{
			ons.notification.alert({message:'در این محدوده پارکینگی وجود ندارد'});
		}
		var xmlParkingList;
		xmlParkingList=new XMLHttpRequest();
		xmlParkingList.onreadystatechange=function()
		{
			if (xmlParkingList.readyState==4 && xmlParkingList.status==200)
			{
				var numberof=parseInt(xmlParkingList.responseText);
				if(numberof==0)
					parkingMarker.setIcon(redDotUrl);
				else
					parkingMarker.setIcon(greenDotUrl);
				infowindow.content='ظرفیت: '+numberof;
			}
		}
		xmlParkingList.open("GET",serverMapUrl+"?throwaway="+Math.random(),true);
		xmlParkingList.send();
	};
	$scope.isInBound = function(MarkerPosition)
	{
		return map.getBounds().contains(MarkerPosition);
	};
    });
})();
