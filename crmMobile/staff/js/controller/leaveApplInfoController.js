/**
 * 请假管理详情
 */
app.controller('leaveApplInfoController', function($scope, $sessionStorage, $ionicPopup,$state, comApi,$stateParams,$timeout) {
 
	var navMenu = comApi.showFooterMenu("");
	$scope.$emit('navMenu.type', navMenu); 
	
	$scope.leaveApplInfo={};
  $scope.deit={};
  $scope.detailItems=[];
  $scope.status=[];
  $scope.leaveApplInfoShow = true; // 请假信息是否显示
  $scope.apprShow = false; // 审批页面是否显示
  $scope.init = function(){
    comApi.post('LeaveManagementController/selectLeaveApplInfoMobile', {
      stfNum : $sessionStorage.userId,
      leaveNm : $stateParams.applNum
      }, function(data) {
        $scope.leaveApplInfo = data[0];
    });
      comApi.post('LeaveManagementController/selectLeaveApplDtlMobile', {
        leaveNm : $stateParams.applNum
        }, function(data) {
          for(var i=0;i<data.length;i++){
            var time = data[i].leaveTm.substring(5,10);
            $scope.detailItems.push({leaveTm:time,dicNm:data[i].dicNm});
          }
    });
      comApi.post('LeaveManagementController/approvalListSelect', {
        leaveNm : $stateParams.applNum
        }, function(data) {
          if (data.length > 0) {
            $scope.status.apprHisDisplay = true;
          }
          $scope.approvalList = data;
    });
  }
  //调用页面初始化
  $scope.init();
  //显示审批页面
  $scope.apprOpen = function() {
    $scope.leaveApplInfoShow = false;
    $scope.apprShow = true;
  }
  // 返回
  $scope.goBack = function() {
    $scope.leaveApplInfoShow = true;
    $scope.apprShow = false;
  };
  $scope.apprLeaveAppl = function(apprRst){
    //请假天数
    $scope.deit.leaveDays = $scope.leaveApplInfo.days;
    //请假id
    $scope.deit.oid = $scope.leaveApplInfo.oId;
    //请假更新时间
    $scope.deit.updtTm = $scope.leaveApplInfo.updtTm;
    //是否通过
    $scope.deit.apprRst = apprRst;
    //审批意见
    $scope.deit.apprCommonts = $scope.leaveApplInfo.apprCommonts;
    comApi.post("LeaveManagementController/apprLeaveManagementM/",$scope.deit,function(data){
      comApi.showMessage("success", "msg.common.10010", 3000);
      // 3秒后跳转
      $timeout(function() {
        // 跳转到入职流程页面
        $state.go("leaveApplManager");
      }, 3000);
    });
  }
//  取消请假申请
  $scope.cancelLeaveAppl = function(){
    var confirmPopup = $ionicPopup.confirm({
      title : '提示',
      template : '确定取消请假申请？',
      okText : '确定',
      cancelText : '取消'
    });
    confirmPopup
    .then(function(res) {
      if (res) {
        comApi.post("LeaveManagementController/cancelLeaveManagement",
            {leaveNm : $stateParams.applNum,
            stfNum : $sessionStorage.userId,
            updtTm : $scope.leaveApplInfo.updtTm},
            function(data){
              comApi.showMessage("success", "msg.common.10003", 3000);
              // 3秒后跳转
              $timeout(function() {
                // 跳转到入职流程页面
                $state.go("leaveApplManager");
              }, 3000);
          });
      }
    });
    
  }
  //提交方法
  $scope.submitLeaveAppl=function(){
    if(!$scope.leaveApplInfo.sbmtTm){
      $scope.leaveApplInfo.sbmtTm = " ";
    }
    //详情页面的提交标识
    var flagS="1";
    comApi.post('LeaveManagementController/submitLeaveApplEdit', {
      stfNum : $sessionStorage.userId,
      leaveNm : $stateParams.applNum,
      flagS:flagS,
      leaveDay:$scope.leaveApplInfo.days,
      updtTm:$scope.leaveApplInfo.updtTm,
      sbmtTm:$scope.leaveApplInfo.sbmtTm
    }, function(data) {
      comApi.showMessage("success", "msg.common.10001", 3000);
      // 3秒后跳转
      $timeout(function() {
        // 跳转到入职流程页面
        $state.go("leaveApplManager");
      }, 1000);
    },true);
  }
//调用打电话
  $scope.callPhone = function() {
    var data = '{"phone" : ' + $scope.leaveApplInfo.phone + '}';
    var resultJson = JSON.parse(window.bdk.callNumber(data));
  }
});