/**
 *审批员工工资
 *Created by shinchan on 2016-4-10.
 */
app.controller('salaryApplApprCtrl',['$scope','$http','$element','$stateParams','comApi','$filter','NgTableParams','$state','toaster',function($scope, $http, $element,$stateParams,comApi,$filter,NgTableParams,$state,toaster) {
  $scope.status = {baseopen: true,stfopen: true,netsalopen: true,fixsalopen: true,attendanceopen: true,summationopen: true,totdeduopen: true,applopen:true};
  comApi.get("staff/stfSalaryApplSelect/"+$stateParams.oIdappl+'/'+$stateParams.applNumappl, function(data){
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
    // 取得是否通过选项列表
    var apprRstDataList = comApi.getSelectBoxDic("C002", "0");
    $scope.apprRstList = apprRstDataList;
    // 设置是否通过初始值
    $scope.salarybykey.apprRst = apprRstDataList[0].key;
  });
  //审批
  $scope.updateSalaryAppl = function() {
        comApi.post("staff/stfSalaryApplAppr", $scope.salarybykey, function(data){
            comApi.HintMessage([ "success", "工资信息" ], "", "msg.common.00022", 3000, "");
            $state.go("app.staff.stfSalaryAppl");
        });
  }						
} ]);