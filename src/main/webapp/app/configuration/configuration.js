angular.module('mainApp').controller('configurationController', function($scope, $rootScope, $location, Upload, ngProgress, siteService, targetService, toaster) {
    
    $scope.sites = {};
    $scope.processInProgress = false;
    
    $scope.$watch('files', function () {
        $scope.uploadFile($scope.files);
    });
    
    $scope.activeTargetClass = function(target) {
        if(!$scope.selectedTarget) {
            return "";
        }
        return $scope.selectedTarget.id === target.id ? "active" : "";
    }
    

    $scope.selectTarget = function(target) {
        $scope.processInProgress = true;
        targetService.getAllConfigFiles({
            id : target.id
        }, function(data) {
            target.configFiles = data;
            $scope.selectedTarget = target;
            $scope.processInProgress = false;
        }, function(error) {
            // TODO display error
            delete $scope.selectedTarget;
            alert(error);
            $scope.processInProgress = false;
        });

    }
    
    $scope.uploadFile = function (files, evt) {
        if(!$scope.selectedTarget) {
            return;
        }
        
        if (files && files.length) {
            
            $scope.processInProgress = true;
            
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                $scope.uploader = Upload.upload({
                    url: $rootScope.getServiceFullUrl('file/upload/' + $scope.selectedTarget.id),
                    fields: {'username': $rootScope.user.username},
                    file: file
                }).progress(function (evt) {
                    var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                }).success(function (data, status, headers, config) {
                    
                    //reload configFiles
                    $scope.selectTarget($scope.selectedTarget);
                    
                    toaster.pop({type: 'success', title: '', body: "File was uploaded successfully"});
                    $scope.processInProgress = false;
                    
                }).error(function (error, status, headers, config) {
                    //TODO display error
                    alert(error);
                    toaster.pop({type: 'error', title: 'File Upload', body: "File uploaded failed " + status});
                    console.log('error status: ' + status);
                    $scope.processInProgress = false;
                })
            }
        }
    };
    
    $scope.init = function() {
        $scope.processInProgress = true;
        siteService.getAllSites({}, function(data) {
            $scope.sites = data;
            if ($scope.sites && $scope.sites.length > 0) {
                $scope.selectTarget($scope.sites[0].targets[0]);
            }
            $scope.processInProgress = false;
        }, function(error) {
            $scope.processInProgress = false;
           //TODO display error
            alert(error);
        });
    }

    $scope.init();
    

});
