/**
 * Created by 小张 on 2016-4-25.
 */
app.controller("leaveManagementDeitController", function ($scope,$filter, comApi, $state, NgTableParams, $stateParams) {
    $scope.deit = {};
    $scope.oneAtATime = true;
    $scope.status = {
        open1: true,
        open2: true,
        open3: true,
        open4: true
    };
    var oid = $stateParams.oid;
    var updtTm = $stateParams.updtTm;
    $scope.deit.oid = oid;
    $scope.deit.updtTm = updtTm;
    // 取得是否通过选项列表
    var apprRstDataList = comApi.getSelectBoxDic("C002", "0");
    $scope.apprRstList = apprRstDataList;
    $scope.deit.apprRst = apprRstDataList[0].key;
    //返回上一页
    $scope.returnUp = function () {
        $state.go("app.staff.leaveManagement");
    };

    //tab页面切换
    $scope.selecttabs = function () {
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
        comApi.get("LeaveManagementController/selectLeavedtl/" + oid, function (data) {
            if (!data[0].lapdtl) {
                //comApi.HintMessage("error", "", "NoDatas", 3000, "");
                return false;
            }
            $scope.ledata = data[0];
            // ng-table的实现绑定
            var lapdtl=[];
            lapdtl = JSON.parse(data[0].lapdtl);
            for(var i=0;i<lapdtl.length;i++){
              lapdtl[i].leaveTm = $filter("date")(lapdtl[i].leaveTm,"yyyy.MM.dd");
            }
            $scope.tableParams = new NgTableParams({}, {
                // 把data数据集绑定前台
                dataset: lapdtl,
                // 可以点击的显示自己想要一页显示多少条
                counts: []
            });
            $scope.ledata.sbmtTm = $filter("date")($scope.ledata.sbmtTm,"yyyy-MM-dd");
        });
    }

    $scope.selectLeave = function (entApplNum) {
        $state.go("app.staff.leaveManagementSelect", {});
    };

    // 画面初始化直接查询
    //selectEntryAppl($scope.apprStatList[0].key);
    selectEntryAppl(oid);

    //审批
    $scope.apprLeaveManagement = function(){
        $scope.deit.leaveDays = $scope.ledata.lapdate;
        comApi.post("LeaveManagementController/apprLeaveManagement/",$scope.deit,function(data){
            comApi.HintMessage(["success","请假流程 "], "", "msg.common.00022", 3000, "");
            setTimeout(function(){$state.go("app.staff.leaveManagement");},500);
        });
    }
});