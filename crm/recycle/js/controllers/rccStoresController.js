/**
 * Created by lenovo on 2016/9/9.
 */
app.controller('rccStoresController', ['$scope', 'NgTableParams', 'comApi', '$modal', '$sessionStorage', '$stateParams',function($scope, NgTableParams, comApi, $modal, $sessionStorage, $stateParams){
    var counts = comApi.getPageCounts();
    var pageNum = 1;
    var pageSize = counts[0];
    var isBack = $stateParams.isBack && ($stateParams.isBack == "true" || $stateParams.isBack == true);
    $scope.gydst = 0;

    //查询销售门店列表
    $scope.searchStoresList = function() {

        pageSize = $sessionStorage.rccStoresPageSizeCopy > 0 ? angular.copy($sessionStorage.rccStoresPageSizeCopy) : pageSize;
        if(isBack == true){
            $scope.rccStoresList= angular.copy($sessionStorage.rccStores);
            $scope.gydst = angular.copy($sessionStorage.rccStoresDataLengthCopy);
            pageNum = $sessionStorage.rccStoresPageNumCopy > 0 ? angular.copy($sessionStorage.rccStoresPageNumCopy) : pageNum;
            $scope.tableParams = getTableParams(pageNum, pageSize, $scope.rccStoresList, counts);
            isBack = false;
        }else {
            comApi.post("recycle/store/search", $scope.rccStoresData, function (data) {
                $scope.rccStoresList = data.data;
                $scope.gydst = data.data.length;
                $scope.tableParams = getTableParams(pageNum, pageSize, data.data, counts);
                $sessionStorage.rccStoresDataLengthCopy = angular.copy($scope.gydst);
                $sessionStorage.rccStores = angular.copy($scope.rccStoresList);
            });
        }
    };

    function getTableParams(pageNum, pageSize, data, counts){
        var arr = comApi.buildTableParams(pageNum, pageSize, data, counts, function(pageIndex, pageCount){
            pageNum = pageIndex;
            pageSize = pageCount;
            //$sessionStorage.rccStoresPageNumCopy = angular.copy(pageIndex);
            //$sessionStorage.rccStoresPageSizeCopy = angular.copy(pageCount);
        });
        var tableParams = new NgTableParams(arr[0], arr[1]);
        return tableParams;
    }


    $scope.init = function(){

        //查询销售门店列表参数
        $scope.rccStoresData = {
            "pageNum": 1,
            "pageSize": "",
            "params": {
                "partiNum": "",
                "provinceNum": "",
                "cityNum": "",
                "strNum": "",
                "strNm": ""
            }
        };

        $scope.searchStoresList();
    };

    $scope.init();

    // 还原销售门店信息
    $scope.restoreStores = function(strNum){
        comApi.openRestoreWindow(function(){
            comApi.post("recycle/store/restore", [strNum], function(data){
                //消息提示
                comApi.successMessage('msg.common.00058');
                setTimeout(function() {
                    $scope.searchStoresList();
                },1000);
            })
        });
    };
}]);