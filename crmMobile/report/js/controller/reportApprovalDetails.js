/**
 * Created by JiaZhaoYang on 2016-4-21.
 * 人员信息详情画面
 */
app.controller('reportApprovalDetailsCtrl', ['$timeout','$scope','$state', '$http', '$location','$sessionStorage','$ionicPopup','$stateParams','comApi',function ($timeout,$scope,$state, $http, $location,$sessionStorage,$ionicPopup,$stateParams,comApi) {
  
	var navMenu = comApi.showFooterMenu("");
	$scope.$emit('navMenu.type', navMenu); 
	
  $scope.lishis = [];
  $scope.flag = $stateParams.flag;
  $scope.keys = $stateParams.keys;
  //初始化方法
	$scope.init = function(){
	  //初始化条件查询列表
      comApi.get("repAppl/selectRepApplMobileList/" + $stateParams.applNum, function(data) {
        $scope.stfList = data.details[0];
        $scope.achievements = data.relevantPersonnel;
        for(var i=0;i<data.approvalList.length;i++){
          if(i == 0){
              $scope.name = data.approvalList[0].stfNm;
              $scope.zhuangtai = data.approvalList[0].status;
              $scope.time = data.approvalList[0].updtTm;
          }else if(i == data.approvalList.length-1){
              $scope.stfNms = data.approvalList[i].stfNm;
              $scope.dicNms = data.approvalList[i].status;
              $scope.updtTm = data.approvalList[i].updtTm;
          }else{
              $scope.lishis.push(data.approvalList[i]);
          }
        }
      });
	}
	//调用页面初始化
	$scope.init();
	
	//提交
	$scope.soumettrebaobiao = function(){
	  var stf = {};
	  stf.repApplId = $scope.stfList.repApplNum;
	  stf.updtTm = $scope.stfList.updtTm;
	  stf.opreationFlag = "commit";
	  comApi.post("RepApplReport/applyReportManagement",stf,function(data) {
	    $timeout(function () {
	        comApi.showMessage("success", "msg.common.10001", 3000); 
	        // 跳转回【提交报表列表】页面
	        $state.go("reportApproval");}, 3000);
      });
	  
	  
	  
	  $timeout(function () {
        // 跳转回【提交报表列表】页面
        $state.go("reportApproval");
      }, 3000);
	}
	// 调用打电话
	$scope.callPhone = function(phone) {
	  var data = '{"phone" : ' + phone + '}';
	  var resultJson = JSON.parse(window.bdk.callNumber(data));
	}
}]);