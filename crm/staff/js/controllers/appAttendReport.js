/**
 * Created by 小张 on 2016-4-25.
 */
app.controller("appAttendReportController", function ($scope, comApi, $state, NgTableParams, $modal) {
    $scope.oneAtATime = true;
    $scope.status = {
        open: true
    };
    $scope.selectedApprStat = "0000";
    // 取得审批状态选项
    $scope.apprStatList = comApi.getSelectBoxDic("C018", "2");

    $scope.recordCount = 0;
    // 查询方法
    function selectEntryAppl(status) {
        $scope.selectedApprStat = status;
        comApi.post("GenAttendReport/selectAppAttendReport/"+status, {}, function (data) {
            $scope.checkboxes.checked =false;
            angular.element(".select-all").prop("indeterminate",false);
            angular.forEach($scope.list,function(item) {$scope.checkboxes.items[item.stfNum] = false;});
            // 总件数
            $scope.recordCount = data.length;

            // 取得列表数据
            $scope.list = data;
            // ng-table的实现绑定
            $scope.tableParams = new NgTableParams({
                page: 1,
                count: 20
            }, {
                dataset: data,
                counts: [20, 50, 100, 200]
            });
            
        });
    }

    // 初始化ng-table的checkboxes
    $scope.checkboxes = {
        checked: false,
        items: {}
    };
    // 全选事件
    $scope.checkAll = function () {
        angular.forEach($scope.list,
                function (item) {
                    $scope.checkboxes.items[item.stfNum] = $scope.checkboxes.checked;
                });
    };
    // 单选事件
    $scope.checkItem = function () {
        var checked = 0, unchecked = 0, total = $scope.gydst;
        angular
            .forEach(
                $scope.list,
                function (item) {
                    checked += ($scope.checkboxes.items[item.stfNum]) || 0;
                    unchecked += (!$scope.checkboxes.items[item.stfNum]) || 0;
                });
        if ((unchecked == 0) || (checked == 0)) {
            $scope.checkboxes.checked = (checked == total);
        }
        angular.element(".select-all").prop(
            "indeterminate",
            (checked != 0 && unchecked != 0));
    };

    /**
     * 切换按钮
     */
    $scope.buttonSelect = function (key) {
        selectEntryAppl(key);
    };

    $scope.selectLeave = function (oid) {
        $state.go("app.staff.appAttendReportSelect", {
            oid: oid
        });
    };

    $scope.selectLeaveDeit = function (oid, updt) {
        $state.go("app.staff.appAttendReportEdit", {
            oid: oid,
            updtTm: updt
        });
    };

    $scope.selectLeaveApp = function (oid, updt) {
        $state.go("app.staff.appAttendReportApp", {
            oid: oid,
            updtTm: updt
        });
    };

    // 画面初始化直接查询
    selectEntryAppl($scope.apprStatList[0].key);


    //调用共通画面
    $scope.openAppl = function (size) {
        var stnum = [];
        var stnos = [];
        var selectFlag = false;
        var stateFlag = true;
        angular.forEach($scope.list, function (item) {
            if ($scope.checkboxes.items[item.stfNum] == true) {
                if (item.status=='130') {
                    stnos.push(item.applNum);
                    selectFlag = true
                } else {
                    stateFlag = false;
                }
                var obj  = new Object();
                obj.oid = item.oid;
                obj.updtTm = item.updtTm;
                stnum.push(obj);
            }
        });
        if (!selectFlag) {
          comApi.HintMessage([ "error", "审批" ], "", "msg.common.00020", 0, "");
          return;
        }
        if (!stateFlag) {
          comApi.HintMessage([ "error", "" ], "", "msg.common.00047", 0, "");
          return;
        }
        var modalInstance = $modal.open({
            templateUrl: 'batchapproval.html',
            controller: 'batchapprovalController',
            size: size,
            resolve: {
                //配置需要注入JS
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load(['common/js/controllers/batchapprova.js']);
                }]
            }

        });
        //父子传递参数
        modalInstance.result.then(function (selectedItem) {
            if(stnos.length>0){
                var msgs = "";
                for(var i= 0,j=stnos.length;i<j;i++){
                    msgs += stnos[i];
                }
                //return comApi.HintMessage("error", "","msg.common.20043" , 0, "");
            }
            comApi.post("GenAttendReport/updateApprAttendReportList", {"appList":stnum,"apprRst":selectedItem}, function (data) {
              comApi.HintMessage([ "success", "考勤信息" ], "", "msg.common.00022", 3000, "");
                $scope.buttonSelect($scope.selectedApprStat);
            });
        });

    };

});