
app.controller("configRolePermissController", function ($scope, comApi, $state, NgTableParams, $modal) {

    var counts = comApi.getPageCounts();
    var pageNum = 1;
    var pageSize = counts[0];


    $scope.searchAllRoleInfo = function() {
        comApi.post("roleConfig/selectAllRoleInfo", $scope.selectAllRoleInfoData, function(data) {
            $scope.allRoleInfos = data.data;
            $scope.gydst = data.data.length;
            $scope.tableParams = getTableParams(pageNum, pageSize, data.data, counts);

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

    $scope.init = function() {
        $scope.selectAllRoleInfoData = {
            "pageNum": 1,
            "pageSize": "",
            "params": {
                "roleName": ""
            }
        };

        $scope.searchAllRoleInfo();
    };

    $scope.init();

    //删除操作
    $scope.delRole = function(roleId) {

        comApi.openDelWindow(function(){
            comApi.get("roleConfig/deleteRoleInfo/"+roleId, function(data){
                $scope.searchAllRoleInfo();
            })
        });
    };


});