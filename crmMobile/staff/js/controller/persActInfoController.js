/**
 * BA晋升督导流程详情
 */
app.controller('persActInfoController', function($scope, $sessionStorage, $ionicPopup,$state, comApi,$stateParams) {
  
	var navMenu = comApi.showFooterMenu("");
	$scope.$emit('navMenu.type', navMenu); 
	
	$scope.persActInfo={};
  $scope.baPromoteInfo={};
  $scope.status=[];
  //管理人员
  $scope.superItems=[];
  //管理门店
  $scope.storeItems=[];
  $scope.persActInfoShow = true; // 请假信息是否显示
  $scope.apprShow = false; // 审批页面是否显示
  $scope.init = function(){
    comApi.post('BaPromote/selectPersActInfo', {
      applicant : $sessionStorage.userId,
      applNum : $stateParams.applNum
      }, function(data) {
        //BA晋升督导信息
        $scope.persActInfo = data[0];
        //管理人员
        var mngStf = data[0].mngStf.split(",");
        if(mngStf.length > 0){
            for(var i = 0 ; i<mngStf.length;i++ ){
                $scope.superItems.push({mngStf:mngStf[i]});
            }
        }
        //管理门店
        var mngStr = data[0].mngStr.split(",");
        if(mngStr.length > 0){
            for(var i = 0 ; i<mngStr.length;i++ ){
                $scope.storeItems.push({mngStr:mngStr[i]});
            }
        }
    });
    //审批历史
      comApi.post('BaPromote/approvalListSelect', {
        applNum : $stateParams.applNum
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
    $scope.persActInfoShow = false;
    $scope.apprShow = true;
  }
  // 返回
  $scope.goBack = function() {
    $scope.persActInfoShow = true;
    $scope.apprShow = false;
  };
  $scope.apprLeaveAppl = function(apprRst){
    $scope.baPromoteInfo.applNum=$scope.persActInfo.applNum;
    $scope.baPromoteInfo.updtTm=$scope.persActInfo.updtTm;
    $scope.baPromoteInfo.apprCommonts=$scope.persActInfo.apprCommonts;
    $scope.baPromoteInfo.apprRst=apprRst;
    comApi.post("BaPromote/apprBaPromoteApplM", $scope.baPromoteInfo, function(data) {
      comApi.showMessage("success", "msg.common.10010", 3000);
      setTimeout(function(){
        $state.go("persActSelect")
      },"3000");
    });
    
  }
//调用打电话
  $scope.callPhone = function() {
    var data = '{"phone" : ' + $scope.persActInfo.phone + '}';
    var resultJson = JSON.parse(window.bdk.callNumber(data));
  }
//提交
  $scope.submitPersAct=function(){
    comApi.post("BaPromote/submitBaPromoteUpdate", 
        {
          applNum:$scope.persActInfo.applNum,
          posChgStf:$scope.persActInfo.posChgStfNum,
          newPos:$scope.persActInfo.newPosNum,
          posGrdNum:$scope.persActInfo.gradNum,
          supvrStfNum:$scope.persActInfo.supvrStfNum1,
          mngStf:$scope.persActInfo.mngStfNum,
          mngStr:$scope.persActInfo.mngStrNum,
          updtTm:$scope.persActInfo.updtTm
        },
        function(data) {
        comApi.showMessage("success", "msg.common.10001", 3000);
        setTimeout(function(){
          $state.go("persActSelect");
        },"3000");
    },true);
  }
//取消晋升申请
  $scope.cancelBaPormoteAppl = function(){
    var confirmPopup = $ionicPopup.confirm({
      title : '提示',
      template : '确定取消BA晋升督导申请？',
      okText : '确定',
      cancelText : '取消'
    });
    confirmPopup
    .then(function(res) {
      if (res) {
        comApi.post("BaPromote/cancelBaPormoteAppl",
            {
              applNum : $scope.persActInfo.applNum,
              updtTm : $scope.persActInfo.updtTm
            },
            function(data){
            	comApi.showMessage("success", "msg.common.10003", 3000);
              setTimeout(function(){
                $state.go("persActSelect")
              },"3000");
          });
      }
    });
    
  }
});
