app.controller('baShiftMngAppListController', function($scope,$sessionStorage,
    $ionicPopup,$state,$timeout,comApi) {
	$scope.pageNum = 0; // 第几页
	$scope.pageSize = 15; // 每页显示件数
	$scope.moredata = true; // 上拉加载是否可用 
	var navMenu = comApi.showFooterMenu("");
	$scope.$emit('navMenu.type', navMenu); 
	
	var datalist=[];
	
	$scope.baShiftMngAppList = []; // 结果集
	  $scope.checkStatus = true;
    // 全选
    $scope.checkAll = function() {
      for(var k=0;k<$scope.baShiftMngAppList.length;k++){
        for (var i = 0; i < $scope.baShiftMngAppList[k].list.length; i++) {
          $scope.baShiftMngAppList[k].list[i].isCheck = $scope.checkStatus;
        }
      }
    }
    $scope.isCheck = function(){
      for(var k = 0;k<$scope.baShiftMngAppList.length;k++){
        for (var i = 0; i < $scope.baShiftMngAppList[k].list.length; i++) {
          if(!$scope.baShiftMngAppList[k].list[i].isCheck){
            break;
          }
        }
        if(i == $scope.baShiftMngAppList[k].list.length){
          $scope.checkStatus = true;
        }else{
          $scope.checkStatus = false;
          return;
        }
      }
    }
    // 下拉刷新
    $scope.doRefresh = function() {
    	$scope.pageNum = 0;
    	comApi.post('staff/baShiftMngAppListM', {
    		pageSize : $scope.pageSize,
            pageNum : $scope.pageNum + 1,
            params : {
            	bySchStf : $sessionStorage.userId
            }
    	}, function(data) {
    	   $scope.checkStatus = true;
    	   datalist = [];
    	   Array.prototype.push.apply(datalist, data.list);
    	   var bl;
    	   var blphaStartTm;
	       var blphaEndTm;
	       var scheduleList = [];
	       var list = [];
	       if(datalist.length>0){
   	        blphaStartTm = datalist[0].phaStartTm; 
   	        blphaEndTm = datalist[0].phaEndTm; 
   	      }
   	      for(var i =0;i<datalist.length;i++){
   	        if(blphaEndTm==datalist[i].phaEndTm && blphaStartTm==datalist[i].phaStartTm){
   	          list[list.length] = datalist[i];
   	        }else{
   	          scheduleList.push({
   	            phaStartTm : blphaStartTm,
   	            phaEndTm : blphaEndTm,
   	            list : list
   	          });
   	          blphaStartTm = datalist[i].phaStartTm; 
   	          blphaEndTm = datalist[i].phaEndTm; 
   	          list = [];
   	          list[list.length] = datalist[i];
   	        }
   	      }
   	      if(datalist.length>0){
   	        scheduleList.push({
   	          phaStartTm : blphaStartTm,
   	          phaEndTm : blphaEndTm,
   	          list : list
   	        });
   	      }
    		$scope.baShiftMngAppList = scheduleList;
    		for(var k=0;k<$scope.baShiftMngAppList.length;k++){
    		  for (var i = 0; i < $scope.baShiftMngAppList[k].list.length; i++) {
    		    $scope.baShiftMngAppList[k].list[i].isCheck = $scope.checkStatus;
    		  }
    		}
    		$scope.moredata = data.hasNextPage;
	        $scope.pageNum = data.pageNum;
    		$scope.$broadcast("scroll.refreshComplete");
    	});
    }
    var bl;
    var blphaStartTm = "";
    var blphaEndTm = "";
 // 上拉加载
    $scope.loadMore = function() {
    	comApi.post('staff/baShiftMngAppListM', {
    		pageSize : $scope.pageSize,
            pageNum : $scope.pageNum + 1,
            params : {
            	bySchStf : $sessionStorage.userId
            }
    	}, function(data) {
    		Array.prototype.push.apply(datalist, data.list);
    		var list = [];
    		var scheduleList = [];
	    	   if(datalist.length>0){
	    		   blphaStartTm = datalist[0].phaStartTm; 
	    		   blphaEndTm = datalist[0].phaEndTm; 
	    	   }
    	      for(var i =0;i<datalist.length;i++){
    	        if(blphaEndTm==datalist[i].phaEndTm && blphaStartTm==datalist[i].phaStartTm){
    	          list[list.length] = datalist[i];
    	        }else{
    	          scheduleList.push({
    	            phaStartTm : blphaStartTm,
    	            phaEndTm : blphaEndTm,
    	            list : list
    	          });
    	          blphaStartTm = datalist[i].phaStartTm; 
    	          blphaEndTm = datalist[i].phaEndTm; 
    	          list = [];
    	          list[list.length] = datalist[i];
    	        }
    	      }
    	      if(datalist.length>0){
    	        scheduleList.push({
    	          phaStartTm : blphaStartTm,
    	          phaEndTm : blphaEndTm,
    	          list : list
    	        });
    	      }
    		$scope.baShiftMngAppList = scheduleList;
            $scope.moredata = data.hasNextPage;
            $scope.pageNum = data.pageNum;
    		for(var k=0;k<$scope.baShiftMngAppList.length;k++){
    		  for (var i = 0; i < $scope.baShiftMngAppList[k].list.length; i++) {
    		    $scope.baShiftMngAppList[k].list[i].isCheck = $scope.checkStatus;
    		  }
    		}
    		$scope.moredata = data.hasNextPage;
	        $scope.pageNum = data.pageNum;
    		$scope.$broadcast("scroll.infiniteScrollComplete");
    	});
    }
    // 提交操作
    $scope.baShiftMngApp = function(apprRst) {
      //把选中的记录放进数组里
      var dataList=[];
      var isCheck = false;
      for(var k=0;k<$scope.baShiftMngAppList.length;k++){
        for (var i = 0; i < $scope.baShiftMngAppList[k].list.length; i++) {
          if ($scope.baShiftMngAppList[k].list[i].isCheck==true) {
            isCheck = true;
            dataList.push({"updtTm":$scope.baShiftMngAppList[k].list[i].updtTm,"schNum":$scope.baShiftMngAppList[k].list[i].schNum});
          }
        }
      }
      if (isCheck==false) {
        // 弹出消息
        comApi.showMessage(["error","审批"],"msg.common.10005",3000);
      } else {
  		//组装json数数据
  		var json = {dataList:dataList,apprRst:apprRst};
        comApi.post("staff/apprBaShiftMngpi",json,function(
            data) {
          // 弹出提示消息
          comApi.showMessage("success","msg.common.10001",3000);
          // 3秒后跳转
          $timeout(function() {
            // 跳转到排班流程页面
            $state.go("schedulingForApproval");
          }, 3000);
        });
      }
    };
    
})