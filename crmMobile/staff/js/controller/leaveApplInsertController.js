/**
 * Created by 朱艳春 on 2016-5-6.
 * 新增请假
 */
app.controller('leaveApplInsertController', ['$scope','$ionicPopup','comApi','$sessionStorage','$timeout','ionicDatePicker','$filter','$state',function ($scope, $ionicPopup,comApi,$sessionStorage,$timeout,ionicDatePicker,$filter,$state) {
    $scope.leaveApplInfoA=[];
    
	var navMenu = comApi.showFooterMenu("");
	$scope.$emit('navMenu.type', navMenu); 
    
    var obj = new Object(); 
    obj.cancelFlg = "";
    obj.sbmtTm = "";
    obj.reason = "";
    $scope.leaveApplInfoA.push(obj)
    
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
            var sbmtTm = new Date(val);
            var time = $filter("date")(sbmtTm,'yyyy-MM-dd');
            //查询入职时间
            comApi.get('LeaveManagementController/selecttime',function(data) {
            	if(time < data[0] ){
            		$scope.leaveApplInfoA[inindex].sbmtTm = "";
            		comApi.showMessage([ "error" ], "msg.common.10044", 3000);
            	}else{
            		$scope.leaveApplInfoA[inindex].sbmtTm = time;
            	}
            })
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
          $state.go("leaveApplManager");
        }
      });
    }
		$scope.add = function(){
		  var obj = new Object(); 
		  obj.cancelFlg = "";
		  obj.sbmtTm = "";
		  obj.reason = "";
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
		  comApi.post('LeaveManagementController/insertLeaveAppl', {
		    stfNum : $sessionStorage.userId,
		    type:type,
		    leaveApplInfoObj : $scope.leaveApplInfoA
    	    }, function(data) {
      	        $scope.leaveFormShow = true; //请假信息表单是否显示
                $scope.reasonSelectShow = false; // 请假事由页面是否显示
                $scope.stateSelectShow = false;
                comApi.showMessage("success", "msg.common.10001", 3000);
                setTimeout(function(){
                  $state.go("leaveApplManager");
              },"1000");
    	    },true);
		}
    $scope.submitLeaveAppl = function(){
      var day=0;
      var type="submit";
      for(var i =0;i<$scope.leaveApplInfoA.length;i++){
        if($scope.leaveApplInfoA[i].stateNum=="0"){
          day=day+1;
        }
      }
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
      comApi.post('LeaveManagementController/submitLeaveAppl', {
        stfNum : $sessionStorage.userId,
        leaveDay:day,
        type:type,
        leaveApplInfoObj : $scope.leaveApplInfoA
      }, function(data) {
          $scope.leaveFormShow = true; //请假信息表单是否显示
          $scope.reasonSelectShow = false; // 请假事由页面是否显示
          $scope.stateSelectShow = false;
          comApi.showMessage("success", "msg.common.10001", 3000);
          setTimeout(function(){
            $state.go("leaveApplManager");
        },"1000");
      },true);
    }
}]);