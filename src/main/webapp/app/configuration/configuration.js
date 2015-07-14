angular.module('mainApp').controller('configurationController', function($scope, $rootScope, $location, Upload, ngProgress) {
    

});

angular.module('mainApp').controller('fileUploadController', function($scope, $rootScope, Upload, ngProgress, toaster) {
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
                    toaster.pop({type: 'success', title: '', body: "File was uploaded successfully"});
                    ngProgress.complete();
                    ngProgress.stop();
                    $scope.uploadInProgress = false;
                    
                }).error(function (data, status, headers, config) {
                    toaster.pop({type: 'error', title: 'File Upload', body: "File uploaded failed " + status});
                    console.log('error status: ' + status);
                    ngProgress.stop();
                    $scope.uploadInProgress = false;
                })
            }
        }
    };

});

angular.module('mainApp').controller('configFileController', function($scope, $rootScope, s3FileService, toaster) {

    $scope.sendConfigFile = function() {
        delete $scope.saveConfigFileMsg;
        s3FileService.saveConfigFile({}, {
            filename : $scope.configFile.filename,
            content : $scope.configFile.content
        }, function(data, status) {
            toaster.pop({type: 'success', title:'', body:$scope.configFile.filename + " was saved file successfully"});
            $scope.configFile.filename = "";
            $scope.configFile.content = "";
            
            //$scope.saveConfigFileMsg = $scope.configFile.filename + " was saved successfully";
            //$scope.saveConfigFileMsgClass = "alert alert-success";
        }, function(error, status){
            toaster.pop({type: 'error', title: '', body:$scope.configFile.filename + " saved failed: " + error});
            console.log('error status: ' + status);
            
            //$scope.saveConfigFileMsg ="Save " + $scope.configFile.filename + " failed (" + status +"): " + error ;
            //$scope.saveConfigFileMsgClass = "alert alert-danger";
        });
    }
    
    $scope.pop = function () {
        alert(1);
        toaster.pop('success', "title", "text");
    }
    
});