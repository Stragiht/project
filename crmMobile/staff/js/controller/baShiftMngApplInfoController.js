/**
 * Created by 朱艳春 on 2016-5-26.
 * 审批排班申请详情
 */
app.controller('baShiftMngApplInfoController', ['$scope','$ionicPopup','$stateParams','comApi','$sessionStorage','$filter','$timeout','$state',function ($scope, $ionicPopup,$stateParams,comApi,$sessionStorage,$filter,$timeout,$state) {
   
	var navMenu = comApi.showFooterMenu("");
	$scope.$emit('navMenu.type', navMenu); 
	
	$scope.scheduleInfo={};
    $scope.scheduleItems=[];
    $scope.status=[];
    $scope.strInfoitem=[];
    $scope.pageNum = 0; // 第几页
    $scope.pageSize = 15; // 每页显示件数
    $scope.moredata = true; // 上拉加载是否可用
    $scope.scheduleInfoShow = true; // 审批排班申请信息是否显示
    $scope.strShow = false; // 当天门店排班情况页面是否显示
    $scope.flag=true;
    if($stateParams.flag){
      $scope.flag=true;
    }
    if(!$stateParams.flag){
      $scope.flag=false;
    }
    // 上拉加载
    $scope.loadMore = function() {
      $scope.pageNum=$scope.pageNum+1;
      comApi.post('staff/bAShiftMngInfoM', {
        pageSize : $scope.pageSize,
        pageNum : $scope.pageNum, // 下一页
        params : {
          bySchStf : $sessionStorage.userId,
          schNum : $stateParams.applNum
        }
        }, function(data) {
          if(data.list.length > 0){
            $scope.scheduleInfo=data.list[0];
            
              for(var i = 0 ; i<data.list.length;i++ ){
            	  var schDtFormat = $filter("date")(data.list[i].schDt,'MM-dd');
            	  var schDtY = data.list[i].schDt;
                  $scope.scheduleItems.push({schDtY:schDtY,schDt:schDtFormat,strNum:data.list[i].strNum,contSchDt:data.list[i].contSchDt,strNm:data.list[i].strNm,schSitu:data.list[i].schSitu});
              }
          }else{
            $scope.moredata = false; // 上拉加载是否可用
          }
          $scope.countList = $scope.scheduleItems.length;
      });
        comApi.post('staff/approvalListSelect', {
          schNum : $stateParams.applNum
          }, function(data) {
            if (data.length > 0) {
              $scope.status.apprHisDisplay = true;
            }
            $scope.approvalList = data;
      });
        $scope.$broadcast("scroll.infiniteScrollComplete");
    }
    $scope.loadMore();
    // 返回
    $scope.goBack = function() {
      $scope.scheduleInfoShow = true;
      $scope.strShow=false;
      $scope.apprShow = false;
      $scope.apprShow1=false;
    };
    $scope.strInfo=function(index){
      $scope.strNm=$scope.scheduleItems[index].strNm;
      var schDt=$scope.scheduleItems[index].schDtY;
      var strNum=$scope.scheduleItems[index].strNum;
      $scope.scheduleInfoShow = false; // 审批排班申请信息是否显示
      $scope.strShow = true; // 当天门店排班情况页面是否显示
      $scope.strInfoItems=[];
      comApi.post('staff/strInfoSelect', {
        schNum : $stateParams.applNum,
        schDt:schDt,
        strNum:strNum
        }, function(data) {
          $scope.strInfoItems=data;
          
    });
    }
    //从单条记录审批页返回到详情页
    $scope.goBack1=function(){
        $scope.scheduleInfoShow = true;
        $scope.strShow=false;
        $scope.apprShow = false;
        $scope.apprShow1=false;
    }
    // 显示审批页面
    $scope.apprOpen = function() {
      $scope.scheduleInfoShow = false;
      $scope.strShow=false;
      //入职时间小于 档期开始时间为长期在职,入职时间大于档期开始时间为中途入职
  	  if($scope.scheduleInfo.stfEntDt<$scope.scheduleInfo.baShiftMngStartTime){
  	      $scope.apprShow = true; 
  	  }else if($scope.scheduleInfo.stfEntDt>$scope.scheduleInfo.baShiftMngStartTime){
  	      $scope.apprShow1=true;
  	  }

    };
    // 审批操作
    $scope.apprEntryAppl = function(apprRst) {
      //初始化出勤天数
      var day=null;
      if($scope.apprShow1==true){
      if($scope.scheduleInfo.dataTime==null||$scope.scheduleInfo.dataTime==''||$scope.scheduleInfo.dataTime==undefined){
          comApi.showMessage(["error","出勤天数"],"msg.common.10002",3000);
    	  return;
      }else if(isNaN($scope.scheduleInfo.dataTime)){
    	  comApi.showMessage(["error","出勤天数"],"msg.common.10004",3000);
    	  return;
      }else{
    	  day=$scope.scheduleInfo.dataTime;
      }
      }
      //组装json数据
      var dataList =[{schNum:$scope.scheduleInfo.schNum,updtTm:$scope.scheduleInfo.schUpTm}];
      comApi.post("staff/apprBaShiftMngpi", {
    	dataList : dataList,
        apprRst : apprRst,
        apprCommonts : $scope.scheduleInfo.apprCommonts,
        reqAttendDays : day
      }, function(data) {
        // 弹出提示消息
        comApi.showMessage("success", "msg.common.10001", 3000);
        // 3秒后跳转
        $timeout(function() {
          // 跳转到前页面
          $state.go("schedulingForApproval");
        }, 3000);
      },true);
    };
 // 调用打电话
    $scope.callPhone = function() {
      var data = '{"phone" : ' + $scope.scheduleInfo.phone + '}';
      var resultJson = JSON.parse(window.bdk.callNumber(data));
    }
 // 提交保存操作
    $scope.saveSubmitSchendule = function() {
    	var flag="1";
    	var type = "submit";
    	if(!$scope.scheduleInfo.sbmtTmDis){
    	      $scope.scheduleInfo.sbmtTmDis = " ";
    	    }
      comApi
          .post(
              "staff/updateSched",{flag:flag,type:type,sbmtTm:$scope.scheduleInfo.sbmtTmDis,schNum :$stateParams.applNum},
              function(data) {
                comApi.showMessage("success", "msg.common.10001", 3000);
                $timeout(function() {
                    // 跳转到前页面
                    $state.go("schedulingForApproval");
                  }, 1000);
              },true);
    };
  //取消
    $scope.cancelAppl = function(){
      var confirmPopup = $ionicPopup.confirm({
        title : '提示',
        template : '确定取消审批排班申请？',
        okText : '确定',
        cancelText : '取消'
      });
      confirmPopup
      .then(function(res) {
        if (res) {
          comApi.post("staff/cancelAppl",
              {
        	  	schNum :$stateParams.applNum,
                updtTm : $scope.scheduleInfo.schUpTm,
                bySchStf: $scope.scheduleInfo.bySchStf
              },
              function(data){
                comApi.showMessage("success", "msg.common.10003", 3000);
                $timeout(function() {
                    // 跳转到前页面
                    $state.go("schedulingForApproval");
                  }, 1000);
            });
        }
      });
      
    }
}]);