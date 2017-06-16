/**
 * Created by 朱艳春 on 2016-5-10.
 * 编辑请假
 */
app.controller('leaveApplUpdateController', ['$scope','$ionicPopup','comApi','$sessionStorage','$timeout','ionicDatePicker','$filter','$state','$stateParams',function ($scope, $ionicPopup,comApi,$sessionStorage,$timeout,ionicDatePicker,$filter,$state,$stateParams) {
    $scope.leaveApplInfoA=[];
    
	var navMenu = comApi.showFooterMenu("");
	$scope.$emit('navMenu.type', navMenu); 
    
    $scope.leaveFormShow = true; //请假信息表单是否显示
	$scope.reasonSelectShow = false;
	$scope.stateSelectShow = false;//请假状态
    //初始化方法
	$scope.init = function(){
		// 取得请假事由列表
        comApi.getSelectBoxDic("C039", 0).then(function(data) {
          $scope.dicList = data;
        });
        // 取得请假状态列表
        comApi.getSelectBoxDic("C038", 0).then(function(data) {
          $scope.dicStateList = data;
        });
        //获取请假明细数据
        comApi.post('LeaveManagementController/selectEditLeaveApplMobile', {
          leaveNm : $stateParams.leaveNm
        }, function(data) {
          for(var i=0;i<data.length;i++){
            var obj = new Object(); 
            obj.oId=data[i].oId;
            obj.leaveId = data[i].leaveId;
            obj.cancelFlg = data[i].dicNm;
            obj.sbmtTm = data[i].leaveTm;
            obj.reason = data[i].Reason;
            obj.flag = "0";
            obj.reasonNum = data[i].leaveReason;
            obj.stateNum = data[i].cancelFlg;
            obj.updateTm = data[i].updtTm;
            obj.submitTm = data[i].sbmtTm;
            $scope.leaveApplInfoA.push(obj)
            
          }
        });
	}
	var inindex;
	//调用页面初始化
	$scope.init();
	/**
     * 请假事由
     */
    // 显示借调事由选择页面
    $scope.reasonSelect = function(index) {
      inindex = index;
      $scope.reason = $scope.leaveApplInfoA[inindex].reasonNum;

      $scope.leaveFormShow = false;
      $scope.reasonSelectShow = true;
      $scope.stateSelectShow = false;
    };
    // 选定请假事由
    $scope.clickReason = function(dic) {
      $scope.leaveApplInfoA[inindex].reason = dic.text;
      $scope.leaveApplInfoA[inindex].reasonNum = dic.key;
      $scope.goBack();
    };
    /**
     * 请假状态
     */
    // 显示借调状态选择页面
    $scope.stateSelect = function(index) {
      inindex = index;
      $scope.cancelFlg = $scope.leaveApplInfoA[index].stateNum;

      $scope.leaveFormShow = false;
      $scope.reasonSelectShow = false;
      $scope.stateSelectShow = true;
    };
    // 选定请假事由
    $scope.clickState = function(dic) {
      $scope.leaveApplInfoA[inindex].cancelFlg = dic.text;
      $scope.leaveApplInfoA[inindex].stateNum = dic.key;
      $scope.goBack();
    };
    // 返回
    $scope.goBack = function() {
      $scope.leaveFormShow = true;
      $scope.reasonSelectShow = false;
      $scope.stateSelectShow = false;
    };
    
    $scope.openSbmtTm = function (index) {
        inindex = index;
        var ipObj1 = {
          callback: function (val) {  //Mandatory
        	//申请时间处理
            $scope.leaveApplInfoA[inindex].sbmtTm = new Date(val);
            var time = $filter("date")($scope.leaveApplInfoA[inindex].sbmtTm,'yyyy-MM-dd');
            $scope.leaveApplInfoA[inindex].sbmtTm = time;
          },
          inputDate: new Date()
        };
        ionicDatePicker.openDatePicker(ipObj1);
      }
        $scope.fanhui = function(){
          var confirmPopup = $ionicPopup.confirm({
            title : '提示',
            template : '确定要放弃此次编辑？',
            okText : '确定',
            cancelText : '取消'
    
          });
          confirmPopup.then(function(res) {
            if (res) {
              $state.go("leaveApplInfo", {
                applNum:$stateParams.leaveNm
              });
            }
          });
        }
		$scope.add = function(){
		    var obj = new Object(); 
		    obj.cancelFlg = "";
		    obj.sbmtTm = "";
		    obj.reason = "";
		    obj.flag = "1";
		    $scope.leaveApplInfoA.push(obj)
		}
		$scope.save = function(){
		  for(var i=0;i<$scope.leaveApplInfoA.length;i++){
            if($scope.leaveApplInfoA[i].sbmtTm==null|| $scope.leaveApplInfoA[i].sbmtTm==undefined || $scope.leaveApplInfoA[i].sbmtTm==''){
              // 弹出消息
                comApi.showMessage([ "error", "请假时间" ], "msg.common.10002", 3000);
                return;
            }
            if($scope.leaveApplInfoA[i].cancelFlg==null|| $scope.leaveApplInfoA[i].cancelFlg==undefined || $scope.leaveApplInfoA[i].cancelFlg==''){
              // 弹出消息
                comApi.showMessage([ "error", "请假状态" ], "msg.common.10002", 3000);
                return;
            }
            if($scope.leaveApplInfoA[i].reason==null|| $scope.leaveApplInfoA[i].reason==undefined || $scope.leaveApplInfoA[i].reason==''){
              // 弹出消息
                comApi.showMessage([ "error", "请假事由" ], "msg.common.10002", 3000);
                return;
            }
            if($scope.leaveApplInfoA.length>1){
              for(var a in $scope.leaveApplInfoA){
                  if(a != i){
                    if($scope.leaveApplInfoA[i].sbmtTm==$scope.leaveApplInfoA[a].sbmtTm){
                   // 弹出消息
                      comApi.showMessage([ "error", "请假时间" ], "msg.common.10017", 3000);
                      return;
                    }
                  }
                }
            }
          }
		  var type="save";
		  if(!$scope.leaveApplInfoA[0].submitTm){
		    $scope.leaveApplInfoA[0].submitTm = "null";
		  }
		  comApi.post('LeaveManagementController/updateLeaveMoblie', {
		    stfNum : $sessionStorage.userId,
		    leaveApplInfoObj : $scope.leaveApplInfoA,
		    type:type,
		    leaveNm : $stateParams.leaveNm
    	    }, function(data) {
    	      if(data!== null||data!== undefined||data!== ''){
      	        $scope.leaveFormShow = true; //请假信息表单是否显示
                  $scope.reasonSelectShow = false; // 请假事由页面是否显示
                  $scope.stateSelectShow = false;
                  comApi.showMessage("success", "msg.common.10001", 3000);
                  setTimeout(function(){
                    $state.go("leaveApplInfo", {
                      applNum:$stateParams.leaveNm
                    });
                },"1000");
    	      }else{
    	     // 弹出消息
                var alertPopup = $ionicPopup
                .alert({
                title : '<span class="popheader"><i class="fa fa-times-circle-o"></i>提示</span>',
                template : '您所选择的数据已被修改',
                okText : '我知道了'
                });
                setTimeout(function(){
                  $state.go("leaveApplInfo", {
                    applNum:$stateParams.leaveNm
                  });
              },"1000");
    	      }
    	        
    	    },true);
		}
    $scope.submitLeaveAppl = function(){
      for(var i=0;i<$scope.leaveApplInfoA.length;i++){
        if($scope.leaveApplInfoA[i].sbmtTm==null|| $scope.leaveApplInfoA[i].sbmtTm==undefined || $scope.leaveApplInfoA[i].sbmtTm==''){
          // 弹出消息
            comApi.showMessage([ "error", "请假时间" ], "msg.common.10002", 3000);
            return;
        }
        if($scope.leaveApplInfoA[i].cancelFlg==null|| $scope.leaveApplInfoA[i].cancelFlg==undefined || $scope.leaveApplInfoA[i].cancelFlg==''){
          // 弹出消息
            comApi.showMessage([ "error", "请假状态" ], "msg.common.10002", 3000);
            return;
        }
        if($scope.leaveApplInfoA[i].reason==null|| $scope.leaveApplInfoA[i].reason==undefined || $scope.leaveApplInfoA[i].reason==''){
          // 弹出消息
            comApi.showMessage([ "error", "请假事由" ], "msg.common.10002", 3000);
            return;
        }
        if($scope.leaveApplInfoA.length>1){
          for(var a in $scope.leaveApplInfoA){
              if(a != i){
                if($scope.leaveApplInfoA[i].sbmtTm==$scope.leaveApplInfoA[a].sbmtTm){
               // 弹出消息
                  comApi.showMessage([ "error", "请假时间" ], "msg.common.10017", 3000);
                  return;
                }
              }
            }
        }
      }
      var day=0;
      var type="submit";
      //编辑页面提交标识
      var flagS="2";
      if(!$scope.leaveApplInfoA[0].submitTm){
        $scope.leaveApplInfoA[0].submitTm = "null";
      }
      for(var i =0;i<$scope.leaveApplInfoA.length;i++){
        if($scope.leaveApplInfoA[i].stateNum=="0"){
          day=day+1;
        }
      }
      comApi.post('LeaveManagementController/submitLeaveApplEdit', {
        stfNum : $sessionStorage.userId,
        leaveDay:day,
        flagS:flagS,
        type:type,
        leaveNm : $stateParams.leaveNm,
        leaveApplInfoObj : $scope.leaveApplInfoA
      }, function(data) {
          $scope.leaveFormShow = true; //请假信息表单是否显示
          $scope.reasonSelectShow = false; // 请假事由页面是否显示
          $scope.stateSelectShow = false;
          comApi.showMessage("success", "msg.common.10001", 3000);
          setTimeout(function(){
            $state.go("leaveApplInfo", {
              applNum:$stateParams.leaveNm
            });
        },"1000");
      },true);
    }
}]);