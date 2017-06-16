/**
 * Created by lenovo on 2016/9/9.
 */
app.controller('rccDepMngController', ['$scope', 'NgTableParams', 'comApi', '$modal', '$sessionStorage', '$stateParams',function($scope, NgTableParams, comApi, $modal, $sessionStorage, $stateParams){

    var counts = comApi.getPageCounts();
    var pageNum = 1;
    var pageSize = counts[0];
    var isBack = $stateParams.isBack && ($stateParams.isBack == "true" || $stateParams.isBack == true);

    //查询部分列表
    $scope.searchRccDepList = function() {

        pageSize = $sessionStorage.rccDepPageSizeCopy > 0 ? angular.copy($sessionStorage.rccDepPageSizeCopy) : pageSize;
        if(isBack == true){
            $scope.rccDepList= angular.copy($sessionStorage.rccDep);
            $scope.gydst = angular.copy($sessionStorage.rccDepDataLengthCopy);
            pageNum = $sessionStorage.rccDepPageNumCopy > 0 ? angular.copy($sessionStorage.rccDepPageNumCopy) : pageNum;
            $scope.tableParams = getTableParams(pageNum, pageSize, $scope.rccDepList, counts);
            isBack = false;
        }else {
            comApi.post("recycle/department/search", $scope.rccDepData, function (data) {
                $scope.rccDepList = data.data;
                $scope.gydst = data.data.length;
                $scope.tableParams = getTableParams(pageNum, pageSize, data.data, counts);
                $sessionStorage.rccDepDataLengthCopy = angular.copy($scope.gydst);
                $sessionStorage.rccDep = angular.copy($scope.rccDepList);
            });
        }
    };

    function getTableParams(pageNum, pageSize, data, counts){
        var arr = comApi.buildTableParams(pageNum, pageSize, data, counts, function(pageIndex, pageCount){
            pageNum = pageIndex;
            pageSize = pageCount;
            //$sessionStorage.rccDepPageNumCopy = angular.copy(pageIndex);
            //$sessionStorage.rccDepPageSizeCopy = angular.copy(pageCount);
        });
        var tableParams = new NgTableParams(arr[0], arr[1]);
        return tableParams;
    }


    $scope.init = function(){

        //查询部分列表参数
        $scope.rccDepData = {
            "pageNum": 1,
            "pageSize": "",
            "params":{
                "depNum": "",
                "depNm": ""
            }
        };

        $scope.searchRccDepList();
    };

    $scope.init();

    // 还原部门
    $scope.restoreDep = function(depNum){
        comApi.openRestoreWindow(function(){
            comApi.post("recycle/department/restore", [depNum], function(data){
                //消息提示
                comApi.successMessage('msg.common.00058');
                setTimeout(function() {
                    $scope.searchRccDepList();
                },1000);
            })
        });
    };
}]);