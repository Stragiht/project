/**
 * Created by JiaZhaoYang on 2016-4-21.
 * 人员信息详情画面
 */
app.controller('totalDeductionCtrl', ['$scope', '$http', '$location','$sessionStorage','$ionicPopup','$stateParams','comApi',function ($scope, $http, $location,$sessionStorage,$ionicPopup,$stateParams,comApi) {
	
	var navMenu = comApi.showFooterMenu("");
	$scope.$emit('navMenu.type', navMenu); 
	
    //初始化方法
	$scope.init = function(){
	  var applNum = $stateParams.applNum;
	  //初始化条件查询列表
      comApi.get("staff/salaryMobileDeductionOfWages/" + applNum, function(data) {
        //人员列表
        $scope.stfList = data[0];
      });
	}

	//调用页面初始化
	$scope.init();

}]);