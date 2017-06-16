
    app.controller('gdsBrdUpdateCtrl',['$scope','NgTableParams','comApi','$stateParams', '$state', 'fileUploadApi', function($scope,NgTableParams,comApi,$stateParams,$state,fileUploadApi){
        var oId = $stateParams.oId;
        $scope.gdsBrdUpd = {};
        var singleImgUpload = fileUploadApi.newSingleFileUpload(fileUploadApi.fileType.GDS_THUM);
        $scope.gdsBrdUpd.brdLogo = singleImgUpload;

        comApi.get("gdsBrd/selectGdsBrd/"+oId, function(data){
            $scope.gdsBrdUpd = data;
            //单图片代码
            if($scope.gdsBrdUpd.brdLogo !='' && $scope.gdsBrdUpd.brdLogo != null) {
                fileUploadApi.insertUploadSuccFile(singleImgUpload, $scope.gdsBrdUpd.brdLogo);
            }
            $scope.gdsBrdUpd.brdLogo = singleImgUpload;
        });

        $scope.updateGdsBrd = function(){
            $scope.gdsBrdUpdCopy =  angular.copy($scope.gdsBrdUpd);
            $scope.gdsBrdUpdCopy.brdLogo = fileUploadApi.getUploadSuccFileUrl($scope.gdsBrdUpdCopy.brdLogo);
            comApi.post("gdsBrd/updateGdsBrd", $scope.gdsBrdUpdCopy, function(data){
                comApi.successMessage('msg.goods.10005');
                setTimeout(function() {
                    $state.go('app.goods.gdsBrd')
                },1000);
            })

        }
        //上传文件标志
        $scope.uploadFlag = fileUploadApi.uploadFlag;

        //选择图片
        $scope.selectImg = function(evt, imgData){
            fileUploadApi.selectFile(evt, imgData, fileUploadApi.checkImgFileFormat, fileUploadApi, $scope, comApi);
        };

        //删除图片
        $scope.delImgItem = function(imgData, imgItem){
            fileUploadApi.delFileItem(imgData, imgItem, $scope);
        };

        //上传图片
        $scope.uploadImg = function(imgData){
            fileUploadApi.uploadFile(imgData, fileUploadApi);
        };
    }]);
