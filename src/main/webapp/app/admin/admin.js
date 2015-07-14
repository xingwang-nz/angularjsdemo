angular.module('mainApp').controller('adminController', function($rootScope, $scope, userService, featureService) {
	
	$scope.showMode = "";
	
	$scope.users = {};
	$scope.features = {};
	
	$scope.loadAllUsers = function() {
		userService.getAllUsers({}, function(data){
			$scope.users = data
			$scope.showMode = "users"
		});
	}
	
	$scope.loadAllFeatures = function() {
		featureService.getAllFeatures({}, function(data){
			$scope.features = data
			$scope.showMode = "features"
		});
	}
	
	
 
});