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
	    infowindow = new google.maps.InfoWindow({content:'ظرفیت: 1'});
	    parkingMarker = new google.maps.Marker(
		    {
			title: 'ظرفیت',
		    	map: map,
		    	position: parkingPos,
		    	icon:greenDotUrl 
		    }
		    );
	    google.maps.event.addListener(parkingMarker, 'click', function(){infowindow.open(map, parkingMarker);});
	    var userPos = new google.maps.LatLng(userCords.latitude, userCords.longitude);
	    userLogoWindow = new google.maps.InfoWindow({content:'شما اینجا هستید'});
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
			ons.notification.alert({message:'ببخشید. در این محدوده پارکینگ ثبت شده ای نداریم'});
		}
				if(numberof%2==0)
				{
					parkingMarker.setIcon(redDotUrl);
					infowindow.setContent('ظرفیت: 0');
				}
				else
				{
					parkingMarker.setIcon(greenDotUrl);
					infowindow.setContent('ظرفیت: 1');
				}
				numberof=(numberof+1)%2;
	};
	$scope.isInBound = function(MarkerPosition)
	{
		return map.getBounds().contains(MarkerPosition);
	};
    });
})();
