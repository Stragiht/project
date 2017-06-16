/**
 * 入职流程列表
 */
app.controller('entryApplController', function($scope, $state, NgTableParams,
    comApi) {

  $scope.oneAtATime = true;
  $scope.status = {
    open : true
  };
  $scope.selectedApprStat = "0000";
  // 取得审批状态选项
  $scope.apprStatList = comApi.getSelectBoxDic("C018", "2");

  // 查询方法
  $scope.selectEntryAppl = function(apprStat) {
    $scope.selectedApprStat = apprStat;
    comApi.get("entryAppl/selectEntryApplList/" + apprStat, function(data) {
      // 总件数
      $scope.recordCount = data.entryApplList.length;
      // 查询结果超过最大件数提示
      if ($scope.recordCount == data.maxCount) {
        comApi.HintMessage([ "success", data.maxCount ], "",
            "msg.common.00021", 3000, "");
      }
      // ng-table的实现绑定
      $scope.tableParams = new NgTableParams({
        // 显示的第几页
        page : 1,
        // 一页显示多少条
        count : 20
      }, {
        // 把data数据集绑定前台
        dataset : data.entryApplList,
        // 可以点击的显示自己想要一页显示多少条
        counts : [ 20, 50, 100, 200 ]
      });
    });
  };
  // 画面初始化直接查询
  $scope.selectEntryAppl($scope.apprStatList[0].key);

  // 删除处理
  $scope.deleteEntryAppl = function(entApplNum, updtTm) {
    comApi.openDelWindow(function() {
      comApi.post("entryAppl/deleteEntryAppl", {
        entApplNum : entApplNum,
        updtTm : updtTm
      }, function() {
        comApi.HintMessage([ "success", "入职流程信息" ], "", "msg.common.00031",
            3000, "");
        // 重新查询
        $scope.selectEntryAppl($scope.selectedApprStat);
      });
    });
  };

  // 取消处理
  $scope.cancelEntryAppl = function(entApplNum, updtTm) {
    comApi.openCancelWindow(function() {
      comApi.post("entryAppl/cancelEntryAppl", {
        entApplNum : entApplNum,
        updtTm : updtTm
      }, function() {
        comApi.HintMessage([ "success", "入职流程信息" ], "", "msg.common.00032",
            3000, "");
        // 重新查询
        $scope.selectEntryAppl($scope.selectedApprStat);
      });
    });
  };

  // 编辑
  $scope.updateEntryAppl = function(entApplNum, updtTm) {
    $state.go("app.staff.entryApplUpdate", {
      entApplNum : entApplNum,
      updtTm : updtTm
    });
  };

  // 查看
  $scope.infoEntryAppl = function(entApplNum) {
    $state.go("app.staff.entryApplInfo", {
      entApplNum : entApplNum
    });
  };

  // 审批
  $scope.apprEntryAppl = function(entApplNum, updtTm) {
    $state.go("app.staff.entryApplAppr", {
      entApplNum : entApplNum,
      updtTm : updtTm
    });
  };
});