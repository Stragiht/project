/**
 * 离职流程详情
 */
app.controller('dimiApplInfoCtrl', function($scope, $sessionStorage,
    $ionicPopup, $stateParams, $state, $timeout, comApi) {

	var navMenu = comApi.showFooterMenu("");
	$scope.$emit('navMenu.type', navMenu); 
	
  $scope.status = {
    apprHisDisplay : false
  };

  $scope.frontPage = $stateParams.frontPage; // 前画面
  $scope.dimiInfoShow = true; // 离职流程信息是否显示
  $scope.apprShow = false; // 审批页面是否显示

  // 初始化
  $scope.init = function() {
    comApi.post("dimiAppl/getDimiApplInfoForInfoPageM", {
      dimiApplNum : $stateParams.applNum
    }, function(data) {
      // 申请信息
      $scope.dimiInfo = data.dimiApplInfo;
      // 离职人列表
      $scope.leaverList = data.dimiApplInfo.jobLeaverNm.split(",");
      // 审批历史
      if (data.approvalList.length > 0) {
        $scope.status.apprHisDisplay = true;
      }
      $scope.approvalList = data.approvalList;
    });
  };
  // 执行初始化方法
  $scope.init();

  // 提交操作
  $scope.submitDimiAppl = function() {
    comApi.post("dimiAppl/submitDimiApplForUpdatePage", {
      dimiApplNum : $scope.dimiInfo.dimiApplNum,
      jobLeaver : $scope.dimiInfo.jobLeaver,
      jobLeaverNm : $scope.dimiInfo.jobLeaverNm,
      isInfoPageSubmit : true,
      updtTm : $scope.dimiInfo.updtTm
    }, function(data) {
      // 弹出提示消息
      comApi.showMessage("success", "msg.common.10001", 3000);
      // 3秒后跳转
      $timeout(function() {
        // 跳转到离职流程页面
        $state.go("dimiAppl");
      }, 3000);
    },true);
  };

  // 取消处理
  $scope.cancelDimiAppl = function() {
    var confirmPopup = $ionicPopup.confirm({
      title : '提示',
      template : '确定取消离职流程信息？',
      okText : '确定',
      cancelText : '取消'
    });
    confirmPopup.then(function(res) {
      if (res) {
        comApi.post("dimiAppl/cancelDimiAppl", {
          dimiApplNum : $scope.dimiInfo.dimiApplNum,
          updtTm : $scope.dimiInfo.updtTm
        }, function(data) {
          // 弹出提示消息
          comApi.showMessage("success", "msg.common.10003", 3000);
          // 3秒后跳转
          $timeout(function() {
            // 跳转到离职流程页面
            $state.go("dimiAppl");
          }, 3000);
        });
      }
    });
  };

  // 显示审批页面
  $scope.apprOpen = function() {
    $scope.dimiInfoShow = false;
    $scope.apprShow = true;
  }

  // 返回
  $scope.goBack = function() {
    $scope.dimiInfoShow = true;
    $scope.apprShow = false;
  };

  // 审批操作
  $scope.apprDimiAppl = function(apprRst) {
    comApi.post("dimiAppl/apprDimiAppl", {
      dimiApplNum : $scope.dimiInfo.dimiApplNum,
      apprRst : apprRst,
      apprCommonts : $scope.dimiInfo.apprCommonts,
      updtTm : $scope.dimiInfo.updtTm
    }, function(data) {
      // 弹出提示消息
      comApi.showMessage("success", "msg.common.10001", 3000);
      // 3秒后跳转
      $timeout(function() {
        // 跳转到前页面
        if ($scope.frontPage != "entryApplApprList") {
          $state.go("dimiAppl");
        } else {
          $state.go("dimiApplApprList");
        }
      }, 3000);
    },true);
  };

  // 调用打电话
  $scope.callPhone = function() {
    var data = '{"phone" : ' + $scope.dimiInfo.applSbmtPhone + '}';
    var resultJson = JSON.parse(window.bdk.callNumber(data));
  }
});