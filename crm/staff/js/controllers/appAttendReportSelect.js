/**
 * Created by 小张 on 2016-4-25.
 */
app.controller("appAttendReportSelectController", function ($scope, comApi, $state, NgTableParams, $stateParams) {
    $scope.oneAtATime = true;
    $scope.status = {
        open1: true,
        open2: true,
        open3: true,
        open4: true
    };

    $scope.returnUp = function () {
        $state.go("app.staff.appAttendReport");
    };

    $scope.selecttabs = function(){
        comApi.get("LeaveManagementController/selectLeaveApproval/" + $scope.myDatas.applNum , function (data) {
            // ng-table的实现绑定
            $scope.apptableParams = new NgTableParams({}, {
                // 把data数据集绑定前台
                dataset: data,
                // 可以点击的显示自己想要一页显示多少条
                counts: []
            });
        });
    };

    // 查询方法
    function selectEntryAppl(oid) {
        comApi.get("GenAttendReport/selectStfAttendDtlbyStfNum/" + oid, function (data) {
            if(!data.kqmx){
                //comApi.HintMessage("error", "", "NoDatas", 3000, "");
                return false;
            }
            $scope.myDatas = data;
            if(!data.kqmx){data.kqmx = "[]"}
            if(!data.StoresList){data.StoresList = "[]"}
            // ng-table的实现绑定
            $scope.tableParams = new NgTableParams({count:999999999999999}, {
                // 把data数据集绑定前台
                dataset: JSON.parse(data.kqmx),
                // 可以点击的显示自己想要一页显示多少条
                counts: []
            });

            $scope.tableParamsStoresList = new NgTableParams({count:999999999999999}, {
                // 把data数据集绑定前台
                dataset: JSON.parse(data.StoresList),
                // 可以点击的显示自己想要一页显示多少条
                counts: []
            })


        });
    }

    // 画面初始化直接查询
    selectEntryAppl($stateParams.oid);
});