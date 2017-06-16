/**
 *查看员工工资信息
 *Created by shinchan on 2016-4-10.
 */
app.controller('salarySelectCtrl',['$scope','$http','$element','$stateParams','comApi','$filter',function($scope, $http, $element,$stateParams,comApi,$filter) {
  $scope.status = {baseopen: true,netsalopen: true,fixsalopen: true,attendanceopen: true,summationopen: true,totdeduopen: true};
  comApi.get("staff/stfSalarySelectByKey/"+$stateParams.oId, function(data){
    $scope.salarybykey = data;
    $scope.salarybykey.oId = $stateParams.oId;
  });
							
  //返回一览页面
  $scope.backSelect = function() {
      $location.path("/app/staff/stfSalary");
  }
} ]);