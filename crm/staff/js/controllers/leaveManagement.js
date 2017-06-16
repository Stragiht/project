/**
 * Created by 小张 on 2016-4-25.
 */
app.controller("leaveManagementController", function ($scope,$filter,comApi, $state, NgTableParams) {
    $scope.oneAtATime = true;
    $scope.status = {
        open: true
    };
    $scope.selectedApprStat = "0000";
    // 取得审批状态选项
    $scope.apprStatList = comApi.getSelectBoxDic("C018", "2");

    // 查询方法
    function selectEntryAppl(status) {
        $scope.selectedApprStat = status;
        comApi.get("LeaveManagementController/selectLeaveALL/" +status, function(data) {
            // 总件数
            $scope.recordCount = data.length;
            // 没有查询到数据时提示
            if (data.length == 0) {
                //comApi.HintMessage("error", "", "NoDatas", 3000, "");
            }
            // ng-table的实现绑定
            for(var i=0;i<data.length;i++){
              data[i].sbmtTm = $filter("date")(data[i].sbmtTm,'yyyy-MM-dd');
            }
            $scope.tableParams = new NgTableParams({
                // 显示的第几页
                page : 1,
                // 一页显示多少条
                count : 20
            }, {
                // 把data数据集绑定前台
                dataset : data,
                // 可以点击的显示自己想要一页显示多少条
                counts : [ 20, 50, 100, 200 ]
            });
        });
    }

    /**
     * 切换按钮
     */
    $scope.buttonSelect = function(key){
        selectEntryAppl(key);
    };

    $scope.selectLeave = function(oid) {
        $state.go("app.staff.leaveManagementSelect", {
            oid : oid
        });
    };

    $scope.selectLeaveDeit = function(oid,updt) {
        $state.go("app.staff.leaveManagementDeit", {
            oid : oid,
            updtTm : updt
        });
    };
    // 画面初始化直接查询
    selectEntryAppl($scope.apprStatList[0].key);

});