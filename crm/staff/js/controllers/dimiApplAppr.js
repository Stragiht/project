/**
 * 审批离职流程
 */
app.controller('dimiApplApprController', function($scope, $stateParams, $state,
    NgTableParams, comApi) {

  $scope.oneAtATime = true;
  $scope.status = {
    baseInfoOpen : true,
    dimiBaseInfoOpen : true,
    apprOperationOpen : true,
    apprHisDisplay : false
  };
  $scope.dimiInfo = {};

  // 初始化
  $scope.initdimiApplInfo = function() {
    comApi.post("dimiAppl/getDimiApplInfoForInfoPage", {
      dimiApplNum : $stateParams.dimiApplNum,
      updtTm : $stateParams.updtTm
    }, function(data) {
      // 申请信息
      $scope.dimiInfo = data.dimiApplInfo;
      // 离职人列表数据
      $scope.stfList = data.stfList;
      // 审批历史
      if (data.approvalList.length > 0) {
        $scope.status.apprHisDisplay = true;
      }
      // ng-table的实现绑定
      $scope.tableParams = new NgTableParams({
        // 显示的第几页
        page : 1,
        // 一页显示多少条
        count : 20
      }, {
        // 把data数据集绑定前台
        dataset : data.approvalList,
        // 可以点击的显示自己想要一页显示多少条
        counts : [ 20, 50, 100, 200 ]
      });
      // 取得是否通过选项列表
      var apprRstDataList = comApi.getSelectBoxDic("C002", "0");
      $scope.apprRstList = apprRstDataList;
      // 设置是否通过初始值
      $scope.dimiInfo.apprRst = apprRstDataList[0].key;
    });
  }
  // 执行初始化
  $scope.initdimiApplInfo();

  // 提交操作
  $scope.apprDimiAppl = function() {
    comApi.post("dimiAppl/apprDimiAppl", $scope.dimiInfo, function(data) {

      comApi.searchUnReadMessage($scope);

      comApi.HintMessage([ "success", "离职流程信息" ], "", "msg.common.00024", 3000,
          "");
      // 跳转到离职流程页面
      $state.go("app.staff.dimiAppl");
    });
  }
});