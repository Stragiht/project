/**
 * Created by lenovo on 2016/4/15.
 */
app.controller("gdsBrdIndsertCtrl", ['$scope', '$state', 'comApi', 'fileUploadApi',function($scope, $state,comApi,fileUploadApi){
    //参数
    $scope.gdsBrdInsert = {
        "brdDesc":'',
        "brdLogo":fileUploadApi.newSingleFileUpload(fileUploadApi.fileType.GDS_THUM),
        "brdNm":'',
        "brdWebsite":''
    };

    //新增商品品牌
    $scope.insertGdsBrd  = function() {
        $scope.gdsBrdInsertCopy =  angular.copy($scope.gdsBrdInsert);
        $scope.gdsBrdInsertCopy.brdLogo = fileUploadApi.getUploadSuccFileUrl($scope.gdsBrdInsertCopy.brdLogo);
        comApi.post("gdsBrd/insertGdsBrd", $scope.gdsBrdInsertCopy, function(data){
            comApi.successMessage('msg.goods.10004');
            setTimeout(function() {
                    $state.go('app.goods.gdsBrd')
            },1000);
        });
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
}])
