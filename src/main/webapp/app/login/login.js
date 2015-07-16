angular.module('mainApp').controller('loginController', function($scope, $rootScope, $location, $cookieStore, userService) {
    $scope.rememberMe = false;

    $scope.login = function() {
        // $httpParamSerializer(formDataObj)
        userService.authenticate({}, $.param({
            username : $scope.username,
            password : $scope.password
        }), function(authenticationResult) {
            var authToken = authenticationResult.token;
            $rootScope.authToken = authToken;
            if ($scope.rememberMe) {
                $cookieStore.put('authToken', authToken);
            }
            // get current user
            userService.get(function(user) {
                $rootScope.user = user;
                $rootScope.isAdmin = user.userRoles.indexOf("ROLE_ADMIN") != -1;
                delete $rootScope.authError;
                $rootScope.hideSlidePanel();
                $location.path("/site");
                // $location.path("/admin");
            });

        });
    };
});