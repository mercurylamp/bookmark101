var app = angular.module("Bookmark", ['firebase']);
app.controller("Ctrl", function ($scope, $firebaseArray, $http) {
	$scope.url;  

    var firebaseURL = "https://gwmark.firebaseio.com/";

    $scope.getList = function() {
    	var echoRef = new Firebase(firebaseURL);
  		var query = echoRef.orderByChild("url");
  		$scope.urlArr = $firebaseArray(query);
    };

    $scope.add = function() {
    	$.ajax({
    		type:"POST",
    		url: "get_title.php",
    		data: "url=" + $scope.url,
    		success: function(title) {
    			$scope.urlArr.$add({
    				url: $scope.url,
    				title: title,
  				});
    		},
    		error: function() {
    			alert("Invalid");
    		}
    	});
    };

    $scope.remove = function (url) {
      $scope.urlArr.$remove(url);
    };

    $scope.FBLogin = function () {
      var ref = new Firebase(firebaseURL);
      ref.authWithOAuthPopup("facebook", function(error, authData) {
      if (error) {
        console.log("Login Failed!", error);
      } else {
        $scope.$apply(function() {
        $scope.$authData = authData;
      });
      console.log("Authenticated successfully with payload:", authData);

      // do something with the login info
      }
     });
   };

    $scope.FBLogout = function () {
      var ref = new Firebase(firebaseURL);
      ref.unauth();
      delete $scope.$authData;

      // do something after logout
    };

    $scope.getWeather = function(city) {
      //http://api.openweathermap.org/data/2.5/weather?q=seoul,uk&appid=2de143494c0b295cca9337e1e96b00e0
      $http.get('http://api.openweathermap.org/data/2.5/weather', 
        {params: {q: city, appid:'2de143494c0b295cca9337e1e96b00e0'}}).
        success(function(data, status, headers, config) {
          $scope.weatherData = data;
        }).
        error(function(data, status, headers, config) {});

    }

    // load the list!
    $scope.getList()

    // get weather
    $scope.getWeather('seoul');
});