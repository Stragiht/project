
app.controller('gdsUpdateOneByOneCtrl',['$scope','$state','NgTableParams','$element','comApi','$filter', '$rootScope', '$modal', 'Upload','fileUploadApi',function($scope,$state,NgTableParams,element,comApi,$filter,$rootScope,$modal,Upload,fileUploadApi){
    //编辑的商品
    //$scope.gdsBatUpdateOneByOne = angular.copy($rootScope.gdsBatUpdateOBO);
    $scope.gdsSpecDtlNums = angular.copy($rootScope.gdsBatUpdateOBO);
    $scope.gdsSpecUnits = comApi.getSelectBoxDic('C031', 0);

    //查询商品规格
    comApi.post('gdsInfo/selectGdsInfoBatch', $scope.gdsSpecDtlNums , function(data){
       // $scope.gdsBatUpdateOneByOne = data;
        //备份数据，用于保存上传的图片路径
       // $scope.gdsBatUpdateOneByOneCopy = angular.copy(data);

        //路径$scope.gdsOBYCopy[i].gdsThum
        for (var i=0; i<data.length;i++) {
            var singleImgUpload = fileUploadApi.newSingleFileUpload(fileUploadApi.fileType.GDS_THUM);
            if(data[i].gdsThum !='' && data[i].gdsThum != null) {
                fileUploadApi.insertUploadSuccFile(singleImgUpload, data[i].gdsThum);
            }
            data[i].gdsThum = singleImgUpload;
        }
        $scope.gdsBatUpdateOneByOne = data;
    });


    //获取索引
    //$scope.getIndex = function(index) {
    //    //当前选中的索引
    //  //  $scope.thisCurIndex = index;
    //    $scope.curIndexNow = index;
    //    //绑定指定的文件对象
    //    angular.element(document.querySelectorAll('#fileInputTh')[index]).on('change',
    //        function(evt){
    //            $scope.figuresMembUpd = "";
    //            $scope.figuredMembUpd = "";
    //            var file = evt.currentTarget.files[0];
    //            if(parseInt(file.size) > 2097152){
    //                comApi.HintMessage( "error", "", "msg.common.10004",3000, "");
    //                return;
    //            }else if(!/\.(jpg|png|JPG|PNG)$/.test(file.name)){
    //                comApi.HintMessage( "error", "", "msg.common.10003",3000, "");
    //                return;
    //            }
    //
    //            var reader = new FileReader();
    //            reader.onload = function(evt) {
    //                $scope.$apply(function($scope) {
    //
    //                    $scope.gdsBatUpdateOneByOne[index].gdsThum = evt.target.result;
    //                });
    //            };
    //
    //            $scope.fileInputOneByOne = file;
    //            reader.readAsDataURL(file);
    //    });
    //
    //};


    $scope.gdsUpdOneByOne = function() {
        //备份数据
        $scope.gdsOBYCopy = angular.copy($scope.gdsBatUpdateOneByOne);
        for (var i=0;i<$scope.gdsOBYCopy.length; i++) {
            $scope.gdsOBYCopy[i].gdsThum =
                fileUploadApi.getUploadSuccFileUrl($scope.gdsOBYCopy[i].gdsThum);
            //$scope.gdsOBYCopy[i].gdsThum = $scope.gdsBatUpdateOneByOneCopy[i].gdsThum;
        }
        //提交的数据
        comApi.post('/gdsInfo/updateSpecDtlBatchByOne', $scope.gdsOBYCopy, function(data){
            //消息提示
        	comApi.successMessage('msg.goods.10014');
            setTimeout(function() {
                $state.go('app.goods.gdsBatUpdate')
            },1000);
        })
    };

    //$scope.uploadImg = function(evt){
    //    //var file = evt.currentTarget.files[0];
    //    //console.log(file.name);
    //    alert("上传");
    //}

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
