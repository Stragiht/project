/**
 * 查看审批排班申请流程
 */
app.controller('baShiftMngInfoController', function($scope, $stateParams,
    NgTableParams, comApi) {
  $scope.oneAtATime = true;
  $scope.status = {
    baseInfoOpen : true,
    entBaseInfoOpen : true,
    entInfoOpen : true,
    apprHisDisplay : false
  };
  $scope.baShiftMngInfo = {};
  // 初始化
  function initBaShiftMngInfo() {
    comApi.post("staff/getBaShiftMngInfo", {
        schNum : $stateParams.schNum
    }, function(data) {
        
      // 申请信息
      $scope.baShiftMngInfo = data.baShiftMngInfo;
      //console.log($scope.baShiftMngInfo[0].bySchStf);
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
    });
  }
  // 初始化
  initBaShiftMngInfo();
});