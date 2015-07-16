angular.module('mainApp').controller('configurationController', function($scope, $rootScope, $location, Upload, ngProgress, siteService) {

    $scope.sites = {};

    $scope.selectedTarget = {};
    $scope.loadingTarget = false;

    $scope.init = function() {
        $scope.loadingTarget = true;
        siteService.getAllSites({}, function(data) {
            $scope.sites = data;
            if ($scope.sites && $scope.sites.length > 0) {
                $scope.selectedTarget = $scope.sites[0].targets[0]
            }
            $scope.loadingTarget = false;
        }, function(error) {
            $scope.loadingTarget = false;
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
