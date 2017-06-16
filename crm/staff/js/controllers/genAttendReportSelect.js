/**
 * Created by 小张 on 2016-4-25.
 */
app.controller("genAttendReportSelect", function ($scope, comApi, $state, NgTableParams, $stateParams) {
    $scope.oneAtATime = true;
    $scope.status = {
        open1: true,
        open2: true,
        open3: true
    };

    $scope.returnUp = function () {
        if($stateParams.type == 1){
            $state.go("app.staff.genAttendReport");
        }else{
            $state.go("app.staff.genAttendReportHistory");
        }
    };

    $scope.selecttabs = function(){
        comApi.get("LeaveManagementController/selectLeaveApproval/" + $scope.ledata.leaveNm , function (data) {
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
            $scope.ledata = data;
            // ng-table的实现绑定
            $scope.tableParams = new NgTableParams({count:999999999999999}, {
                // 把data数据集绑定前台
                dataset: JSON.parse(data.kqmx),
                // 可以点击的显示自己想要一页显示多少条
                counts: []
            });
        });
    }

    // 画面初始化直接查询
    selectEntryAppl($stateParams.oid);
});