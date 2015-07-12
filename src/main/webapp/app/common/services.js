angular.module('appServices', ['ngResource'])
.factory('userService', function($rootScope, $resource) {
	
	return $resource($rootScope.getServiceFullUrl('user/:action'), {},
			{
				authenticate: {
					method: 'POST',
					params: {'action' : 'auth'},
					headers : {'Content-Type': 'application/x-www-form-urlencoded'}
				},
				getAllUsers: {
					method: 'GET',
					params: {'action' : 'list'},
					isArray: true
				}
			}
		);
}).factory('featureService', function($rootScope, $resource) {
	
	return $resource($rootScope.getServiceFullUrl('feature/:action'), {},
			{
				getAllFeatures: {
					method: 'GET',
					params: {'action' : 'list'},
					isArray: true
				}
			}
		);
});