angular.module('mainApp').controller('configurationController', function($scope, $rootScope, $location, Upload, ngProgress, siteService, targetService, s3FileService, toaster) {
    
    $scope.sites = {};
    $scope.processInProgress = true;
    
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
            
            //check if current open config belongs to the current target
            if(angular.isDefined($scope.selectedConfigFile) && $scope.selectedConfigFile != null) {
                if($scope.selectedConfigFile.targetId != target.id) {
                    delete $scope.selectedConfigFile;
                }else {
                    var containsConfigFile = false;
                    for(var i = 0; i < target.configFiles.length; i++) {
                        if($scope.selectedConfigFile.targetId === target.configFiles[i].targetId) {
                            containsConfigFile = true;
                            break;
                        }
                    }
                    if(containsConfigFile == false) {
                        delete $scope.selectedConfigFile;
                    }
                }
            }
            
        }, function(error) {
            delete $scope.selectedTarget;
            delete $scope.selectedConfigFile;
            $scope.processInProgress = false;
            // TODO display error
            alert(error);
            
        });
    }
    
    $scope.selectConfigFile = function(configFile) {
        
        $scope.processInProgress = true;
        
        targetService.getconfigFileContent({
            id : configFile.targetId,
            filename : configFile.filename
        }, function(data) {
            configFile.content = data.content;
            $scope.selectedConfigFile = configFile;
            $scope.processInProgress = false;
        }, function(error) {
            $scope.processInProgress = false;
            // TODO display error
            alert(error);
        });
        
    }
    
    $scope.saveConfigFile = function() {
        
        if(!$scope.selectedConfigFile) {
            return;
        }
        
        $scope.processInProgress = true;
        
        s3FileService.saveConfigFile({id: $scope.selectedConfigFile.targetId}, {
            filename : $scope.selectedConfigFile.filename,
            content : $scope.selectedConfigFile.content
        }, function(data, status) {
            resetEditConfigFileFormToBeClean();
            toaster.pop({type: 'success', title:'', body:$scope.selectedConfigFile.filename + " was saved successfully"});
            $scope.processInProgress = false;
        }, function(error, status){
            toaster.pop({type: 'error', title: '', body:$scope.configFile.filename + " saved failed: " + error});
            console.log('error status: ' + status);
            $scope.processInProgress = false;
        });
        
    }
    
    $scope.cancelEditConfigFile = function(formDirty) {
        delete $scope.selectedConfigFile;
    }

    function resetEditConfigFileFormToBeClean() {
        //reset form Pristine to true
        $scope.editConfigFileForm.$setPristine(true);
    }
    
    $scope.$watch("selectedConfigFile", function(newSelectedConfigFile, currentSelectedConfigFile){
        var needResetFormState = false;
        if(!currentSelectedConfigFile || !newSelectedConfigFile) {
           //no current config file selected file, or current selected file is unselected
            needResetFormState = true;
        }else if(newSelectedConfigFile.targetId != currentSelectedConfigFile.targetId) {
            needResetFormState = true;
        }else {
            needResetFormState = newSelectedConfigFile.filename != currentSelectedConfigFile.filename ? true : false;
        }
        
        if(needResetFormState) {
            resetEditConfigFileFormToBeClean();
        }
    });
    
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
