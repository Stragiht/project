/**
 * Created by lenovo on 2016/9/29.
 */
app.controller('configFuncOrderController', ['$state','toaster','$scope','NgTableParams','comApi','$state', function($state,toaster,$scope,NgTableParams,comApi,$state) {

    var counts = comApi.getPageCounts();
    var pageNum = 1;
    var pageSize = counts[0];


    //查询功能模块
    $scope.searchFuncModule = function() {
        comApi.post("funcSeqMng/selectFuncModule", $scope.funcModuleData, function(data){
            $scope.funcModules = data.data;
        })
    };

    //查询功能点
    $scope.searchFuncPoint = function() {
        comApi.post("funcSeqMng/selectFuncPoint", $scope.funcPointData, function(data){
            $scope.funcPoints = data.data;
            $scope.tableParamsFP = getTableParams(pageNum, pageSize, data.data, counts, false);
        })
    };

    //查询功能点明细
    $scope.searchFuncPointDetail = function() {
        comApi.post("funcSeqMng/selectFuncPointDetail", $scope.funcPointDetailData, function(data){
            $scope.funcPointDetails = data.data;
            $scope.tableParamsFPD = getTableParams(pageNum, pageSize, data.data, counts, false);
        })
    };

    function getTableParams(pageNum, pageSize, data, counts){
        var arr = comApi.buildTableParams(pageNum, pageSize, data, counts, function(pageIndex, pageCount){
            pageNum = pageIndex;
            pageSize = pageCount;
        });
        var tableParams = new NgTableParams(arr[0], arr[1]);
        return tableParams;
    }

    //初始化
    $scope.init = function() {

        $scope.tabFlg = 1;

        //查询功能模块参数
        $scope.funcModuleData = {
            "pageNum": 1,
            "pageSize": "",
            "params": {
                "funcModuleNum": "",
                "funcModuleName": ""
            }
        };

        //查询功能点参数
        $scope.funcPointData = {
            "pageNum": 1,
            "pageSize": "",
            "params": {
                "funcModuleNum": "",
                "funcModuleName": "",
                "funcPointNum": "",
                "funcPointName": ""
            }
        };

        //查询功能点明细参数
        $scope.funcPointDetailData = {
            "pageNum": 1,
            "pageSize": "",
            "params": {
                "funcModuleNum": "",
                "funcModuleName": "",
                "funcPointNum": "",
                "funcPointName": "",
                "funcPointDetailNum": "",
                "funcPointDetailName": ""
            }
        };

        $scope.searchFuncModule();
        $scope.searchFuncPoint();
        $scope.searchFuncPointDetail();
    };

    $scope.init();

    //提交保存
    $scope.updateFuncSeqMng = function() {
        //提交保存的参数/funcSeqMng/updateFuncSeqMng
        $scope.funcSeqMngData = {};
        $scope.funcSeqMngData.funcModuleEntityList = $scope.funcModules;
        $scope.funcSeqMngData.funcPointEntityList = $scope.funcPoints;
        $scope.funcSeqMngData.funcPointDetailEntityList = $scope.funcPointDetails;

        comApi.post("funcSeqMng/updateFuncSeqMng", $scope.funcSeqMngData, function(data) {
            comApi.successMessage("msg.common.20010");
            $scope.searchFuncModule();
            $scope.searchFuncPoint();
            $scope.searchFuncPointDetail();
        });
    };
}]);