/**
 * 审批BA晋升督导流程
 */
app.controller('baPormoteApprController', function($scope, $stateParams,
        $state, NgTableParams, comApi, toaster) {
  $scope.oneAtATime = true;
  $scope.status = {
    baseInfoOpen : true,
    entBaseInfoOpen : true,
    judgmentBasisOpen : true,
    apprOperationOpen : true,
    apprHisDisplay : false
  };
  $scope.baPromoteInfo = {};
  
  // 提交操作
  $scope.apprBaPromoteAppl = function() {
    comApi.post("BaPromote/apprBaPromoteAppl", $scope.baPromoteInfo, function(data) {

      comApi.searchUnReadMessage($scope);

      toaster.pop('success', '提示', "审批BA晋升督导流程信息成功。", 3000, 'trustedHtml',
          function() {
          });
      // 跳转到入职流程页面
      $state.go("app.staff.baPromote");
    });
  }
  
  // 初始化
  function initapprBaPromoteAppl() {
    comApi.post("BaPromote/getBaPromoteInfoForInfoPage", {
        applNum : $stateParams.applNum,
        updtTm : $stateParams.updtTm
    }, function(data) {
      // 申请信息
      $scope.baPromoteInfo = data.baPromoteInfo;
      // 门店列表数据
      $scope.storeList = data.storeList;
      // 人员列表数据
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
      $scope.baPromoteInfo.apprRst = apprRstDataList[0].key;
    });
  }
  // 初始化
  initapprBaPromoteAppl();
});