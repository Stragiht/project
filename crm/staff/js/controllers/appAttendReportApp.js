/**
 * Created by 小张 on 2016-4-25.
 */
app.controller("appAttendReportAppController", function ($scope, comApi, $state, NgTableParams, $stateParams) {
    $scope.deit = {};
    $scope.oneAtATime = true;
    $scope.status = {
        open1: true,
        open2: true,
        open3: true,
        open4: true,
        open5: true
    };

    $scope.selecttabs = function () {
        comApi.get("LeaveManagementController/selectLeaveApproval/" + $scope.myDatas.applNum, function (data) {
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
            $scope.myDatas = data;
            if (!data.kqmx) {
                data.kqmx = "[]"
            }
            if (!data.StoresList) {
                data.StoresList = "[]"
            }
            // ng-table的实现绑定
            $scope.tableParams = new NgTableParams({count: 999999999999999}, {
                // 把data数据集绑定前台
                dataset: JSON.parse(data.kqmx),
                // 可以点击的显示自己想要一页显示多少条
                counts: []
            });

            $scope.tableParamsStoresList = new NgTableParams({count: 999999999999999}, {
                // 把data数据集绑定前台
                dataset: JSON.parse(data.StoresList),
                // 可以点击的显示自己想要一页显示多少条
                counts: []
            })


        });
    }

    // 画面初始化直接查询
    var oid = $stateParams.oid;
    var updtTm = $stateParams.updtTm;
    $scope.deit.oid = oid;
    $scope.deit.updtTm = updtTm;
    // 取得是否通过选项列表
    var apprRstDataList = comApi.getSelectBoxDic("C002", "0");
    $scope.apprRstList = apprRstDataList;
    $scope.deit.apprRst = apprRstDataList[0].key;

    selectEntryAppl(oid);

    //审批
    $scope.apprAttend = function(){
        comApi.post("GenAttendReport/updateApprAttendReportOne",$scope.deit,function(data){
          comApi.HintMessage([ "success", "考勤信息" ], "", "msg.common.00022", 3000, "");
            setTimeout(function(){$state.go("app.staff.appAttendReport");},500);
        });
    };

});