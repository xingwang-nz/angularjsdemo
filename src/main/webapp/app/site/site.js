angular.module('mainApp').controller('siteController', function($scope, $rootScope, $location, Upload, ngProgress, siteService) {

    $scope.sites = {};

    $scope.selectedTarget = {};

    $scope.init = function() {
        siteService.getAllSites({}, function(data) {
            $scope.sites = data;
            if ($scope.sites && $scope.sites.length > 0) {
                $scope.selectedTarget = $scope.sites[0].targets[0]
            }
        }, function(error) {
            alert(error);
        });
    }

    $scope.init();

    $scope.activeTargetClass = function(target) {
        return $scope.selectedTarget.id === target.id ? "active" : "";
    }
    
    $scope.selectTarget = function(target) {
        $scope.selectedTarget = target;
    }
    

});
