/**
 * Created by lenovo on 2016/9/9.
 */
app.controller('rccUrbanDistrictController', ['$scope', 'NgTableParams', 'comApi', '$modal', '$sessionStorage', '$stateParams',function($scope, NgTableParams, comApi, $modal, $sessionStorage, $stateParams){
    var counts = comApi.getPageCounts();
    var pageNum = 1;
    var pageSize = counts[0];
    var isBack = $stateParams.isBack && ($stateParams.isBack == "true" || $stateParams.isBack == true);
    $scope.gydst = 0;

    //查询城市分区列表
    $scope.searchUrbanDistrictList = function() {

        pageSize = $sessionStorage.rccUrbanDistrictPageSizeCopy > 0 ? angular.copy($sessionStorage.rccUrbanDistrictPageSizeCopy) : pageSize;
        if(isBack == true){
            $scope.rccUrbanDistrictList= angular.copy($sessionStorage.rccUrbanDistrict);
            $scope.gydst = angular.copy($sessionStorage.rccUrbanDistrictDataLengthCopy);
            pageNum = $sessionStorage.rccUrbanDistrictPageNumCopy > 0 ? angular.copy($sessionStorage.rccUrbanDistrictPageNumCopy) : pageNum;
            $scope.tableParams = getTableParams(pageNum, pageSize, $scope.rccUrbanDistrictList, counts);
            isBack = false;
        }else {
            comApi.post("recycle/urbDistric/search", $scope.rccUrbanDistrictData, function (data) {
                $scope.rccUrbanDistrictList = data.data;
                $scope.gydst = data.data.length;
                $scope.tableParams = getTableParams(pageNum, pageSize, data.data, counts);
                $sessionStorage.rccUrbanDistrictDataLengthCopy = angular.copy($scope.gydst);
                $sessionStorage.rccUrbanDistrict = angular.copy($scope.rccUrbanDistrictList);
            });
        }
    };

    function getTableParams(pageNum, pageSize, data, counts){
        var arr = comApi.buildTableParams(pageNum, pageSize, data, counts, function(pageIndex, pageCount){
            pageNum = pageIndex;
            pageSize = pageCount;
            //$sessionStorage.rccUrbanDistrictPageNumCopy = angular.copy(pageIndex);
            //$sessionStorage.rccUrbanDistrictPageSizeCopy = angular.copy(pageCount);
        });
        var tableParams = new NgTableParams(arr[0], arr[1]);
        return tableParams;
    }


    $scope.init = function(){

        //查询城市分区列表参数
        $scope.rccUrbanDistrictData = {
            "pageNum": 1,
            "pageSize": "",
            "params": {
                "subChnl": "",
                "partiNum": "",
                "partiNm": "",
                "provinceNum": "",
                "cityNum": ""
            }
        };

        $scope.searchUrbanDistrictList();
    };

    $scope.init();

    // 还原城市分区信息
    $scope.restoreUrbanDistrict = function(partiNum){

        comApi.openRestoreWindow(function(){
            comApi.post("recycle/urbDistric/restore", [partiNum], function(data){
                //消息提示
                comApi.successMessage('msg.common.00058');
                setTimeout(function() {
                    $scope.searchUrbanDistrictList();
                },1000);
            })
        });
    };
}]);