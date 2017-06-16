/**
 * Created by lenovo on 2016/9/9.
 */
app.controller('rccSalesScheduleController', ['$scope', 'NgTableParams', 'comApi', '$modal', '$sessionStorage', '$stateParams',function($scope, NgTableParams, comApi, $modal, $sessionStorage, $stateParams){
    var counts = comApi.getPageCounts();
    var pageNum = 1;
    var pageSize = counts[0];
    var isBack = $stateParams.isBack && ($stateParams.isBack == "true" || $stateParams.isBack == true);

    //查询档期组列表
    $scope.searchPhaGrpList = function() {

        pageSize = $sessionStorage.rccPhaGrpPageSizeCopy > 0 ? angular.copy($sessionStorage.rccPhaGrpPageSizeCopy) : pageSize;
        if(isBack == true){
            $scope.rccPhaGrpList= angular.copy($sessionStorage.rccPhaGrp);
            $scope.gydst = angular.copy($sessionStorage.rccPhaGrpDataLengthCopy);
            pageNum = $sessionStorage.rccPhaGrpPageNumCopy > 0 ? angular.copy($sessionStorage.rccPhaGrpPageNumCopy) : pageNum;
            $scope.tableParams1 = getTableParams(pageNum, pageSize, $scope.rccPhaGrpList, counts, true);
            isBack = false;
        }else {
            comApi.post("recycle/phaGrp/search", $scope.rccPhaGrpData, function (data) {
                $scope.rccPhaGrpList = data.data;
                $scope.gydstPhaGrp = data.data.length;
                $scope.tableParams1 = getTableParams(pageNum, pageSize, data.data, counts);
                $sessionStorage.rccPhaGrpDataLengthCopy = angular.copy($scope.gydst);
                $sessionStorage.rccPhaGrp = angular.copy($scope.rccPhaGrpList);
            });
        }
    };

    //查询具体档期列表
    $scope.searchPhaseMngList = function() {

        comApi.post("recycle/phaseMng/search", $scope.rccPhaseMngData, function (data) {
            console.log(angular.toJson(data));
            $scope.rccPhaseMngList = data.data;
            $scope.gydstPhaseMng = data.data.length;
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
            }
*/
        });
        var tableParams = new NgTableParams(arr[0], arr[1]);
        return tableParams;
    }

    $scope.init = function(){

        //查询档期组列表参数
        $scope.rccPhaGrpData = {
            "pageNum": 1,
            "pageSize": "",
            "params": {
                "phaGrpNm": "",
                "remark": ""
            }
        };

        //查询具体档期列表参数
        $scope.rccPhaseMngData = {
            "pageNum": 1,
            "pageSize": "",
            "params": {
                "phaNm": ""
            }
        };

        $scope.searchPhaGrpList();

        $scope.searchPhaseMngList();
    };

    $scope.init();

    // 还原档期组
    $scope.restorePhaGrp = function(oId){
        comApi.openRestoreWindow(function(){
            comApi.post("recycle/phaGrp/restore", [oId], function(data){
                //消息提示
                comApi.successMessage('msg.common.00058');
                setTimeout(function() {
                    $scope.searchPhaGrpList();
                },1000);
            })
        });
    };

    // 还原具体档期
    $scope.restorePhaseMng = function(oId){
        comApi.openRestoreWindow(function(){
            comApi.post("recycle/phaseMng/restore", [oId], function(data){
                //消息提示
                comApi.successMessage('msg.common.00058');
                setTimeout(function() {
                    $scope.searchPhaseMngList();
                },1000);
            })
        });
    };
}]);