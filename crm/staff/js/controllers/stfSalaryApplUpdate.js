/**
 *工资审批画面更新员工工资信息
 *Created by shinchan on 2016-4-10.
 */
app.controller('salaryApplUpdateCtrl',['$scope','$http','$element','$stateParams','comApi','$location','$state','toaster','NgTableParams',function($scope, $http, $element,$stateParams,comApi,$location,$state,toaster,NgTableParams) {
  $scope.status = {baseopen: true,netsalopen: true,fixsalopen: true,attendanceopen: true,summationopen: true,totdeduopen: true};
  comApi.get("staff/stfSalaryApplSelect/"+$stateParams.oIdupdate+'/'+$stateParams.applNumupdate, function(data){
    $scope.salarybykey = data.stfSalaryDetail;
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
  // 转为数值型
  $scope.formatfloat = function (s) {   
    return isNaN(Number(s)) ? 0 : Number(s);
  }
  //取得页面所有信息，传入更新接口
  $scope.updateSalary = function () {				
    var inputFlag = 0;
    $scope.salarybykey.apprFlg = "1";
    if(inputFlag === 0){
      comApi.post("staff/updateStfSalary", $scope.salarybykey, function(data){
          comApi.HintMessage([ "success", "工资信息" ], "", "msg.common.00023", 3000, "");
          // 跳转到工资审批页面
          $state.go("app.staff.stfSalaryAppl");
      });
    }
  }
} ]);