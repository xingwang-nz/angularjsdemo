angular.module('restServices', ['ngResource'])
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
}).factory('s3FileService', function($rootScope, $resource) {
    return $resource($rootScope.getServiceFullUrl('file/:action/:id'), {id: '@id'},
            {
                saveConfigFile: {
                    method: 'POST',
                    params: {'action' : 'saveContent'}
                }
            }
        );
}).factory('siteService', function($rootScope, $resource) {
    
    return $resource($rootScope.getServiceFullUrl('site/:action'), {},
            {
                getAllSites: {
                    method: 'GET',
                    params: {'action' : 'list'},
                    isArray: true
                }
            }
        );
}).factory('targetService', function($rootScope, $resource) {
    
    return $resource($rootScope.getServiceFullUrl('target/:id/configFile/:action/:filename'), {'id': '@id', 'filename': '@filename'},
            {
                getAllConfigFiles: {
                    method: 'GET',
                    params: {'action' : 'list'},
                    isArray: true
                },
                getconfigFileContent: {
                    method: 'GET',
                    params: {'action' : 'content'},
                    transformResponse: function(data, headersGetter, status) { //the response is text
                        return {content: data};
                    }
                }
            }
        );
});