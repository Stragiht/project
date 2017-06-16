/**
 * 离职流程列表
 */
app.controller('dimiApplController', function($scope, $state, NgTableParams,
    comApi) {

  $scope.oneAtATime = true;
  $scope.status = {
    open : true
  };
  $scope.selectedApprStat = "0000";
  // 取得审批状态选项
  $scope.apprStatList = comApi.getSelectBoxDic("C018", "2");

  // 查询方法
  $scope.selectDimiAppl = function(apprStat) {
    $scope.selectedApprStat = apprStat;
    comApi.get("dimiAppl/selectDimiApplList/" + apprStat, function(data) {
      // 总件数
      $scope.recordCount = data.dimiApplList.length;
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
        dataset : data.dimiApplList,
        // 可以点击的显示自己想要一页显示多少条
        counts : [ 20, 50, 100, 200 ]
      });
    });
  }
  // 画面初始化直接查询
  $scope.selectDimiAppl($scope.apprStatList[0].key);

  // 删除处理
  $scope.deleteDimiAppl = function(dimiApplNum, updtTm) {
    comApi.openDelWindow(function() {
      comApi.post("dimiAppl/deleteDimiAppl", {
        dimiApplNum : dimiApplNum,
        updtTm : updtTm
      }, function() {
        comApi.HintMessage([ "success", "离职流程信息" ], "", "msg.common.00031",
            3000, "");
        // 重新查询
        $scope.selectDimiAppl($scope.selectedApprStat);
      });
    });
  };

  // 取消处理
  $scope.cancelDimiAppl = function(dimiApplNum, updtTm) {
    comApi.openCancelWindow(function() {
      comApi.post("dimiAppl/cancelDimiAppl", {
        dimiApplNum : dimiApplNum,
        updtTm : updtTm
      }, function() {
        comApi.HintMessage([ "success", "离职流程信息" ], "", "msg.common.00032",
            3000, "");
        // 重新查询
        $scope.selectDimiAppl($scope.selectedApprStat);
      });
    });
  };

  // 编辑
  $scope.updateDimiAppl = function(dimiApplNum, updtTm) {
    $state.go("app.staff.dimiApplUpdate", {
      dimiApplNum : dimiApplNum,
      updtTm : updtTm
    });
  };

  // 查看
  $scope.infoDimiAppl = function(dimiApplNum) {
    $state.go("app.staff.dimiApplInfo", {
      dimiApplNum : dimiApplNum
    });
  };

  // 审批
  $scope.apprDimiAppl = function(dimiApplNum, updtTm) {
    $state.go("app.staff.dimiApplAppr", {
      dimiApplNum : dimiApplNum,
      updtTm : updtTm
    });
  };
});