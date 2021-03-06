
app.controller('memBatImportCtrl',['$scope','$http','$element','comApi','$filter', 'Upload','toaster','$state','$timeout',function($scope,$http,element,comApi,$filter, Upload, toaster,$state,$timeout){

    $scope.membFileName = '';
    //1.获取本地添加的文件
    var handleFileSelect = function(evt) {
        var file = evt.currentTarget.files[0];
        if (file) {
        	$scope.fileInput = file;
            $scope.membFileName=file.name;
            $scope.$apply();
        }
    };

    //抓取上传控件在状态改变时,执行1的函数事件
    angular.element(document.querySelector('#fileInputMemBat')).on('change',
        handleFileSelect);

    //文件导入
    $scope.importFile = function(){
        if($scope.fileInput==null||$scope.fileInput==undefined||$scope.fileInput==""){
            comApi.HintMessage("error","错误","msg.common.20006",3000,function () {});
            return;
        }
        Upload.upload({
            url : '/CrmWeb/api/membBas/insertByExcelImport',
            data : {
                //file:$scope.uuidupldFileMng
                file:$scope.fileInput
            }

        }).then(function(resp) {
            if(resp && resp.data && resp.data.meta && resp.data.meta != null){
                var result = resp.data;
                console.log("返回结果：" + result.meta.success);
                if(result.meta.success == true){
                    console.log("导入成功：" + result.meta.message);
                    comApi.HintMessage( "success", "", "msg.common.20004",3000, "");
                    setTimeout(function() {
                        $state.go("app.member.memBas");}, "1000");
                }else if(result.data && result.data != null && result.data != ""){
                	$scope.csvFileName = "会员excel导入错误日志.txt";
                	var errorMsg = [];
    				var msg = result.data.split("\r\n");
    				for(i = 0; i < msg.length; i++){
    					errorMsg[i] = {"a":msg[i]};
    				}
    				$scope.csvData = errorMsg;
                    $timeout(function(){angular.element(document.querySelector("#outMembExcelImportErrorMsg")).triggerHandler("click");}, 1000);
                }else{
                    console.log("出错原因：" + result.meta.message);
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
