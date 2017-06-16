/**
 * 审批入职流程
 */
app.controller('entryApplApprController', function($scope, $stateParams,
    $state, NgTableParams, comApi) {

  $scope.oneAtATime = true;
  $scope.status = {
    baseInfoOpen : true,
    entBaseInfoOpen : true,
    entInfoOpen : true,
    judgmentBasisOpen : true,
    apprOperationOpen : true,
    apprHisDisplay : false
  };
  $scope.entryInfo = {};

  // 初始化
  $scope.initEntryApplAppr = function() {
    comApi.post("entryAppl/getEntryApplInfoForInfoPage", {
      entApplNum : $stateParams.entApplNum,
      updtTm : $stateParams.updtTm
    }, function(data) {
      // 申请信息
      $scope.entryInfo = data.entApplInfo;
      // 直属主管上级人员信息
      $scope.supvrStfList = data.supvrStfList;
      // 门店列表数据
      $scope.storeList = data.storeList;
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
      $scope.entryInfo.apprRst = apprRstDataList[0].key;
    });
  }
  // 初始化
  $scope.initEntryApplAppr();

  // 提交操作
  $scope.apprEntryAppl = function() {
    comApi.post("entryAppl/apprEntryAppl", $scope.entryInfo, function(data) {

      comApi.searchUnReadMessage($scope);

      comApi.HintMessage([ "success", "入职流程信息" ], "", "msg.common.00024", 3000,
          "");
      // 跳转到入职流程页面
      $state.go("app.staff.entryAppl");
    });
  }
});