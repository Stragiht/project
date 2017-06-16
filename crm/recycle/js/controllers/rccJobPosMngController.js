/**
 * Created by lenovo on 2016/9/9.
 */
app.controller('rccJobPosController', ['$scope', 'NgTableParams', 'comApi', '$modal', '$sessionStorage', '$stateParams',function($scope, NgTableParams, comApi, $modal, $sessionStorage, $stateParams){

    var counts = comApi.getPageCounts();
    var pageNum = 1;
    var pageSize = counts[0];
    var isBack = $stateParams.isBack && ($stateParams.isBack == "true" || $stateParams.isBack == true);

    //查询职位列表
    $scope.searchPosList = function() {

        pageSize = $sessionStorage.rccPosPageSizeCopy > 0 ? angular.copy($sessionStorage.rccPosPageSizeCopy) : pageSize;
        if(isBack == true){
            $scope.rccPosList= angular.copy($sessionStorage.rccPos);
            $scope.gydst = angular.copy($sessionStorage.rccPosDataLengthCopy);
            pageNum = $sessionStorage.rccPosPageNumCopy > 0 ? angular.copy($sessionStorage.rccPosPageNumCopy) : pageNum;
            $scope.tableParams1 = getTableParams(pageNum, pageSize, $scope.rccPosList, counts, true);
            isBack = false;
        }else {
            comApi.post("recycle/pos/search", $scope.rccPosData, function (data) {
                $scope.rccPosList = data.data;
                $scope.gydstPos = data.data.length;
                $scope.tableParams1 = getTableParams(pageNum, pageSize, data.data, counts);
                $sessionStorage.rccPosDataLengthCopy = angular.copy($scope.gydst);
                $sessionStorage.rccPos = angular.copy($scope.rccPosList);
            });
        }
    };

    //查询职位等级列表
    $scope.searchPosLvlList = function() {

        comApi.post("recycle/posLvl/search", $scope.rccPosLvlData, function (data) {
            $scope.rccPosLvlList = data.data;
            $scope.gydstPosLvl = data.data.length;
            $scope.tableParams2 = getTableParams(pageNum, pageSize, data.data, counts, false);
        });
    };


    function getTableParams(pageNum, pageSize, data, counts, flg){
        var arr = comApi.buildTableParams(pageNum, pageSize, data, counts, function(pageIndex, pageCount){
            pageNum = pageIndex;
            pageSize = pageCount;
            /*if (flg) {
                $sessionStorage.rccDPosPageNumCopy = angular.copy(pageIndex);
                $sessionStorage.rccPosPageSizeCopy = angular.copy(pageCount);
            }*/

        });
        var tableParams = new NgTableParams(arr[0], arr[1]);
        return tableParams;
    }

    $scope.init = function(){

        //查询职位列表参数
        $scope.rccPosData = {
            "pageNum": 1,
            "pageSize": "",
            "params": {
                "posNum": "",
                "posNm": ""
            }
        };

        //查询职位等级列表参数
        $scope.rccPosLvlData = {
            "pageNum": 1,
            "pageSize": "",
            "params": {
                "depNum":"",
                "depNm": "",
                "posGrd": "",
                "posGrdNm": ""
            }
        };

        $scope.searchPosList();

        $scope.searchPosLvlList();
    };

    $scope.init();

    // 还原职位
    $scope.restorePos = function(posNum){
        comApi.openRestoreWindow(function(){
            comApi.post("recycle/pos/restore", [posNum], function(data){
                //消息提示
                comApi.successMessage('msg.common.00058');
                setTimeout(function() {
                    $scope.searchPosList();
                },1000);
            })
        });
    };

    // 还原职位等级
    $scope.restorePoslvl = function(posGrdNum){
        comApi.openRestoreWindow(function(){
            comApi.post("recycle/posLvl/restore", [posGrdNum], function(data){
                //消息提示
                comApi.successMessage('msg.common.00058');
                setTimeout(function() {
                    $scope.searchPosLvlList();
                },1000);
            })
        });
    };
}]);