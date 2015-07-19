angular.module('mainApp').controller('adminController', function($rootScope, $scope, userService, featureService) {
	
	$scope.showMode = "";
	
	$scope.users = {};
	$scope.features = {};
	
	$scope.loadAllUsers = function() {
	var data =	userService.getAllUsers({}, function(){
			$scope.users = data
			$scope.showMode = "users"
		}, function(error){
		    alert("Error(" + error.status +") " + error.data);
		});
	}
	
	$scope.loadAllFeatures = function() {
		featureService.getAllFeatures({}, function(data){
			$scope.features = data
			$scope.showMode = "features"
		}, function(error){
		    alert("Error(" + error.status +") " + error.data);    
        });
	}
	
	
 
});