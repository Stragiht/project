/**
 *更新员工工资信息
 *Created by shinchan on 2016-4-10.
 */
app.controller('salaryUpdateCtrl',['$scope','$http','$element','$stateParams','comApi','$location','$state','toaster',function($scope, $http, $element,$stateParams,comApi,$location,$state,toaster) {
  $scope.status = {baseopen: true,netsalopen: true,fixsalopen: true,attendanceopen: true,summationopen: true,totdeduopen: true};
  comApi.get("staff/stfSalarySelectByKey/"+$stateParams.oId, function(data){
    $scope.salarybykey = data;
    $scope.salarybykey.oId = $stateParams.oId;
  });
  // 转为数值型
  $scope.formatfloat = function (s) {   
    return isNaN(Number(s)) ? 0 : Number(s);
  }
  // 取得页面所有信息，传入更新接口
  $scope.updateSalary = function () {				
    var inputFlag = 0;
    $scope.salarybykey.apprFlg = "0";
    if(inputFlag === 0){
      comApi.post("staff/updateStfSalary", $scope.salarybykey, function(data){
          comApi.HintMessage([ "success", "工资信息" ], "", "msg.common.00023", 3000, "");
          // 跳转到工资生成页面
          $state.go("app.staff.stfSalary");
      });
    }
  }
} ]);