angular.module('mainApp').controller('adminController', function($scope, $rootScope, $location, Upload) {

    $scope.upoladFileText = "Upload File";
    
    $scope.$watch('files', function () {
        $scope.uploadFile($scope.files);
    });

    $scope.uploadFile = function (files, evt) {
        if (files && files.length) {
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                Upload.upload({
                    url: $rootScope.getServiceFullUrl('file/upload'),
                    fields: {'username': $rootScope.user.username},
                    file: file
                }).progress(function (evt) {
                    var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                    console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
                }).success(function (data, status, headers, config) {
                    console.log('file ' + config.file.name + 'uploaded. Response: ' + data);
                }).error(function (data, status, headers, config) {
                    console.log('error status: ' + status);
                })
            }
        }
    };

});