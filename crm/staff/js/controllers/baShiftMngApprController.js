/**
 * 审批 排班申请流程
 */
app.controller('baShiftMngApprController', function($scope, $stateParams,
        $state, NgTableParams, comApi, toaster) {
  $scope.oneAtATime = true;
  $scope.status = {
    baseInfoOpen : true,
    entBaseInfoOpen : true,
    entInfoOpen : true,
    judgmentBasisOpen : true,
    apprHisDisplay : false,
    apprOperationOpen:true
  };
  $scope.baShiftMngInfo = {};
  // 初始化
  initBaShiftMngAppr();
  // 初始化
  function initBaShiftMngAppr() {
    comApi.post("staff/getBaShiftMngInfo", {
        schNum : $stateParams.schNum,
        updtTm : $stateParams.updtTm
    }, function(data) {
        
      // 申请信息
      $scope.baShiftMngInfo = data.baShiftMngInfo;
      //取得判断是否是区域经理的职位
      $scope.flag = data.flag;
      // 门店列表数据
      $scope.storeList = data.storeList;
      //排班列表数据
      $scope.schedulList= data.schedulList;
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
      $scope.baShiftMngInfo.apprRst = apprRstDataList[0].key;
    });
  }

//提交操作
  $scope.apprBaShiftMngAppl = function() {
    comApi.post("staff/apprBaShiftMngAppl", $scope.baShiftMngInfo, function(data) {
      toaster.pop('success', '提示', "审批排班申请流程信息成功。", 3000, 'trustedHtml',
          function() {
          });
      // 跳转到入职流程页面
      $state.go("app.staff.baShiftMng");
    });
  }
});