//map.js

(function() {
    var app = angular.module('myApp', ['onsen']);
  
    //Map controller
    app.controller('MapController', function($scope, $timeout){
      
        $scope.map;
        $scope.markers = [];
	$scope.Parkings = [];
        $scope.markerId = 1;
          
        //Map initialization  
        $timeout(function(){
      
            var latlng = new google.maps.LatLng(35.724, 51.386);
            var myOptions = {
                zoom: 12,
                center: latlng,
		mapTypeControl:false,
		streetViewControl:false,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            $scope.map = new google.maps.Map(document.getElementById("map_canvas"), myOptions); 
            $scope.overlay = new google.maps.OverlayView();
            $scope.overlay.draw = function() {}; // empty function required
            $scope.overlay.setMap($scope.map);
            $scope.element = document.getElementById('map_canvas');
        },100);

        //Delete all Markers
        $scope.deleteAllMarkers = function(){

            if($scope.markers.length == 0){
                return;
            }

            for (var i = 0; i < $scope.markers.length; i++) {

                //Remove the marker from Map                  
                $scope.markers[i].setMap(null);
            }

            //Remove the marker from array.
            $scope.markers.length = 0;
            $scope.markerId = 0;
        };

        //Get Selected Map Markers
	$scope.getParkingsInfo = function(){
		var xmlParkingList;
		xmlParkingList=new XMLHttpRequest();
		xmlParkingList.onreadystatechange=function()
		{
			if (xmlParkingList.readyState==4 && xmlParkingList.status==200)
			{
				$scope.deleteAllMarkers();
				document.getElementById("myDiv").innerHTML=xmlParkingList.responseText;
			}
		}
		xmlParkingList.open("GET",serverMapUrl+"?bounds="+map.getBounds().replace(/ /g,''),true);
		xmlParkingList.send();
	};
    });
})();
