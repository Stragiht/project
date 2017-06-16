/**
 * Created by lenovo on 2016/9/9.
 */
app.controller('rccMajRgnController', ['$scope', 'NgTableParams', 'comApi', '$modal', '$sessionStorage', '$stateParams',function($scope, NgTableParams, comApi, $modal, $sessionStorage, $stateParams){
    var counts = comApi.getPageCounts();
    var pageNum = 1;
    var pageSize = counts[0];
    var isBack = $stateParams.isBack && ($stateParams.isBack == "true" || $stateParams.isBack == true);
    $scope.gydst = 0;

    //查询销售大区列表
    $scope.searchMajRgnList = function() {

        pageSize = $sessionStorage.rccMajRgnPageSizeCopy > 0 ? angular.copy($sessionStorage.rccMajRgnPageSizeCopy) : pageSize;
        if(isBack == true){
            $scope.rccMajRgnList= angular.copy($sessionStorage.rccMajRgn);
            $scope.gydst = angular.copy($sessionStorage.rccMajRgnDataLengthCopy);
            pageNum = $sessionStorage.rccMajRgnPageNumCopy > 0 ? angular.copy($sessionStorage.rccMajRgnPageNumCopy) : pageNum;
            $scope.tableParams = getTableParams(pageNum, pageSize, $scope.rccMajRgnList, counts);
            isBack = false;
        }else {
            comApi.post("recycle/majReg/search", $scope.rccMajRgnData, function (data) {
                $scope.rccMajRgnList = data.data;
                $scope.gydst = data.data.length;
                $scope.tableParams = getTableParams(pageNum, pageSize, data.data, counts);
                $sessionStorage.rccMajRgnDataLengthCopy = angular.copy($scope.gydst);
                $sessionStorage.rccMajRgn = angular.copy($scope.rccMajRgnList);
            });
        }
    };

    function getTableParams(pageNum, pageSize, data, counts){
        var arr = comApi.buildTableParams(pageNum, pageSize, data, counts, function(pageIndex, pageCount){
            pageNum = pageIndex;
            pageSize = pageCount;
            //$sessionStorage.rccMajRgnPageNumCopy = angular.copy(pageIndex);
            //$sessionStorage.rccMajRgnPageSizeCopy = angular.copy(pageCount);
        });
        var tableParams = new NgTableParams(arr[0], arr[1]);
        return tableParams;
    }


    $scope.init = function(){

        //查询销售大区列表参数
        $scope.rccMajRgnData = {
            "pageNum": 1,
            "pageSize": "",
            "params": {
                "majRgnNm": "",
                "subChnl": "",
                "majRgnMgrNm": ""
            }
        };

        $scope.searchMajRgnList();
    };

    $scope.init();

    // 还原销售大区信息
    $scope.restoreMajRgn = function(majRgnNum){//["majRgnNum",majRgnNumN"]

        comApi.openRestoreWindow(function(){
            comApi.post("recycle/majReg/restore", [majRgnNum], function(data){
                //消息提示
                comApi.successMessage('msg.common.00058');
                setTimeout(function() {
                    $scope.searchMajRgnList();
                },1000);
            })
        });
    };
}]);