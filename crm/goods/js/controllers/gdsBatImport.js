
app.controller('gdsBatImportCtrl',['$scope','$http','$element','comApi','$filter', '$rootScope', 'Upload','toaster','$state','$timeout',function($scope,$http,element,comApi,$filter,$rootScope, Upload, toaster, $state,$timeout){
    //1.获取本地添加的文件
    var handleFileSelect = function(evt) {
        var file = evt.currentTarget.files[0];
       // $scope.fileInput = file;
        if (file) {
            $scope.fileInput = file;
            $scope.gdsBatFileName=file.name;
            $scope.$apply();
        }
    };

    //抓取上传控件在状态改变时,执行1的函数事件
    angular.element(document.querySelector('#fileInputGdsBat')).on('change',
        handleFileSelect);

    //文件导入
    $scope.importFile = function(){
        if($scope.fileInput==null||$scope.fileInput==undefined||$scope.fileInput==""){
            comApi.HintMessage("error","错误","msg.common.20006",0,function () {});
            return;
        }
        Upload.upload({
            url : '/CrmWeb/api/gdsInfo/insertGdsByImportExcel',
            data : {
                file:$scope.fileInput
            }

        }).then(function(resp) {
            if(resp && resp.data && resp.data.meta && resp.data.meta != null){
                var result = resp.data;
                if(result.meta.success == true){
                    comApi.HintMessage( "success", "", "msg.common.20004",3000, "");
                    //setTimeout(function() {
                    //    $state.go("app.goods.gdsBas");}, "1000");
                }else if(result.data && result.data != null && result.data != ""){
                    $scope.csvFileName = "商品信息excel导入错误日志.txt";
                    var errorMsg = [];
    				var msg = result.data.split("\r\n");
    				for(i = 0; i < msg.length; i++){
    					errorMsg[i] = {"a":msg[i]};
    				}
    				$scope.csvData = errorMsg;
                    $timeout(function(){angular.element(document.querySelector("#outGdsExcelImportErrorMsg")).triggerHandler("click");}, 1000);
                }else{
                    comApi.myConsoleLog("出错原因：" + result.meta.message);
                    toaster.pop('error', '错误', result.meta.message, 0, 'trustedHtml', function(){});
                }
            }else{
                console.log("后台出错或前端判断出错了");
            }

        }, function(resp) {
            //$scope.figured = "文件上传失败！";
        });

    }


}]);
