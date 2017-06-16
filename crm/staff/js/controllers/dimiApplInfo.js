/**
 * 查看离职流程
 */
app.controller('dimiApplInfoController', function($scope, $stateParams,
    NgTableParams, comApi) {

  $scope.oneAtATime = true;
  $scope.status = {
    baseInfoOpen : true,
    dimiBaseInfoOpen : true,
    apprHisDisplay : false
  };
  $scope.dimiInfo = {};

  // 初始化
  $scope.initdimiApplInfo = function() {
    comApi.post("dimiAppl/getDimiApplInfoForInfoPage", {
      dimiApplNum : $stateParams.dimiApplNum
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
    });
  }
  // 执行初始化
  $scope.initdimiApplInfo();
});