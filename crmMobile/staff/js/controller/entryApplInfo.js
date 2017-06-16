/**
 * 入职流程详情
 */
app.controller('entryApplInfoCtrl', function($scope, $sessionStorage,
    $ionicPopup, $stateParams, $state, $timeout, $modal, comApi) {

	var navMenu = comApi.showFooterMenu("");
	$scope.$emit('navMenu.type', navMenu); 
	
  $scope.status = {
    apprHisDisplay : false
  };

  $scope.frontPage = $stateParams.frontPage; // 前画面
  $scope.entInfoShow = true; // 入职流程信息是否显示
  $scope.apprShow = false; // 审批页面是否显示

  // 初始化
  $scope.init = function() {
    comApi.post("entryAppl/getEntryApplInfoForInfoPageM", {
      entApplNum : $stateParams.applNum
    }, function(data) {
      // 申请信息
      $scope.entryInfo = data.entApplInfo;
      // 门店列表数据
      $scope.storeList = data.storeList;
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
  $scope.submitEntryAppl = function() {
    comApi.post("entryAppl/submitEntryApplUpdate", {
      entApplNum : $scope.entryInfo.entApplNum,
      stfIdNum : $scope.entryInfo.stfIdNum,
      stfPos : $scope.entryInfo.stfPos,
      supvrStfNum : $scope.entryInfo.supvrStfNum,
      subStore : $scope.entryInfo.subStore,
      subStoreNm : $scope.entryInfo.subStoreNm,
      isInfoPageSubmit : true,
      updtTm : $scope.entryInfo.updtTm
    }, function(data) {
      // 弹出提示消息
      comApi.showMessage("success", "msg.common.10001", 3000);
      // 3秒后跳转
      $timeout(function() {
        // 跳转到入职流程页面
        $state.go("entryAppl");
      }, 3000);
    },true);
  };

  // 取消处理
  $scope.cancelEntryAppl = function() {
    var confirmPopup = $ionicPopup.confirm({
      title : '提示',
      template : '确定取消入职流程信息？',
      okText : '确定',
      cancelText : '取消'
    });
    confirmPopup.then(function(res) {
      if (res) {
        comApi.post("entryAppl/cancelEntryAppl", {
          entApplNum : $scope.entryInfo.entApplNum,
          updtTm : $scope.entryInfo.updtTm
        }, function(data) {
          // 弹出提示消息
          comApi.showMessage("success", "msg.common.10003", 3000);
          // 3秒后跳转
          $timeout(function() {
            // 跳转到入职流程页面
            $state.go("entryAppl");
          }, 3000);
        });
      }
    });
  };

  // 显示审批页面
  $scope.apprOpen = function() {
    $scope.entInfoShow = false;
    $scope.apprShow = true;
  };

  // 返回
  $scope.goBack = function() {
    $scope.entInfoShow = true;
    $scope.apprShow = false;
  };

  // 审批操作
  $scope.apprEntryAppl = function(apprRst) {
    comApi.post("entryAppl/apprEntryAppl", {
      entApplNum : $scope.entryInfo.entApplNum,
      apprRst : apprRst,
      apprCommonts : $scope.entryInfo.apprCommonts,
      updtTm : $scope.entryInfo.updtTm
    }, function(data) {
      // 弹出提示消息
      comApi.showMessage("success", "msg.common.10001", 3000);
      // 3秒后跳转
      $timeout(function() {
        // 跳转到前页面
        if ($scope.frontPage != "entryApplApprList") {
          $state.go("entryAppl");
        } else {
          $state.go("entryApplApprList");
        }
      }, 3000);
    },true);
  };

//  // 显示图片
//  $scope.showImg = function(imgUrl) {
//    $scope.imgUrl = imgUrl;
//    var modalInstance = $modal.open({
//      templateUrl : 'showImg.html',
//      controller : 'showImgController',
//      scope : $scope,
//      resolve : {
//        // 配置需要注入JS
//        deps : [ '$ocLazyLoad', function($ocLazyLoad) {
//          return $ocLazyLoad.load([ 'common/js/controllers/showImg.js' ]);
//        } ]
//      }
//    });
//  };

  $scope.pictureShow = function(imgUrl) {
    $scope.pictureShowDiv = true;
    //显示的当前图片
    $scope.showImgUrl = comApi.getFileServerPath() + imgUrl;
  };
  
  $scope.cancelPicture = function() {
    $scope.pictureShowDiv = false;
  };

  // 调用打电话
  $scope.callPhone = function() {
    var data = '{"phone" : ' + $scope.entryInfo.applSbmtPhone + '}';
    var resultJson = JSON.parse(window.bdk.callNumber(data));
  }
});