/**
 *查看审批员工工资信息
 *Created by shinchan on 2016-4-10.
 */
app.controller('salaryApplSelectCtrl',['$scope','$http','$element','$stateParams','comApi','$filter','NgTableParams',function($scope, $http, $element,$stateParams,comApi,$filter,NgTableParams) {
  $scope.status = {baseopen: true,stfopen: true,netsalopen: true,fixsalopen: true,attendanceopen: true,summationopen: true,totdeduopen: true};
  comApi.get("staff/stfSalaryApplSelect/"+$stateParams.oId+'/'+$stateParams.applNum, function(data){
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
} ]);