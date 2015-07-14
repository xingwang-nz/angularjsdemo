angular.module('mainApp').controller('adminController', function($scope, $rootScope, $location, Upload, ngProgress) {
    

});

angular.module('mainApp').controller('uploadController', function($scope, $rootScope, $location, Upload, ngProgress) {
    ngProgress.height("5px");
    ngProgress.color("#6666FF");

    $scope.upoladFileText = "Upload File";
    $scope.showSpinner = false;
    
    
    $scope.$watch('files', function () {
        $scope.uploadFile($scope.files);
    });
    
    $scope.uploader = {};
    
    $scope.uploadInProgress = false;
    
    $scope.abortUpload = function() {
        if($scope.uploadInProgress && $scope.uploader) {
            $scope.uploader.abort();
            ngProgress.stop();
            $scope.uploadInProgress = false;
        }
    }

    $scope.uploadFile = function (files, evt) {
        if (files && files.length) {
            
            ngProgress.start();
            $scope.uploadInProgress = true;
            
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                $scope.uploader = Upload.upload({
                    url: $rootScope.getServiceFullUrl('file/upload'),
                    fields: {'username': $rootScope.user.username},
                    file: file
                }).progress(function (evt) {
                    var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                    ngProgress.set(progressPercentage);
                }).success(function (data, status, headers, config) {
                    console.log('file ' + config.file.name + 'uploaded. Response: ' + data);
                    ngProgress.complete();
                    ngProgress.stop();
                    $scope.uploadInProgress = false;
                }).error(function (data, status, headers, config) {
                    console.log('error status: ' + status);
                    ngProgress.stop();
                    $scope.uploadInProgress = false;
                })
            }
        }
    };

});