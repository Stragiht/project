/**
 * Created by JiaZhaoYang on 2016-4-21.
 * 人员信息详情画面
 */
app.controller('approvalListCtrl', ['$scope','$ionicScrollDelegate','$state', '$location','$sessionStorage','$ionicPopup','$stateParams','comApi',function ($scope,$ionicScrollDelegate,$state, $location,$sessionStorage,$ionicPopup,$stateParams,comApi) {
   
	var navMenu = comApi.showFooterMenu("");
	$scope.$emit('navMenu.type', navMenu); 
    $scope.bottom = "bottom: 0px;"
	$scope.check = {};
    $scope.check.checkallm = true;
	$scope.flag = true;
    $scope.apprStatCnd = "0000";//审批状态赋初始值
    $scope.pageNum = 0; // 第几页
    $scope.pageSize = 15; // 每页显示件数
    $scope.moredata = true; // 上拉加载是否可用
    $scope.stfList = [];
    //初始化方法
	$scope.init = function(){
	  // 取得审批状态列表
      comApi.getSelectBoxDic("C018", 2).then(function(data) {
        $scope.apprStatList = data;
        $scope.apprStatCnd = data[0].key;
      });
	}

	//调用页面初始化
	$scope.init();
	//根据条件查询
	$scope.selectEntryAppl = function(apprStat){
	  if(apprStat == "10" || apprStat == "40" || apprStat == "60" || apprStat == "70"){
        $scope.apprStatCnd = apprStat;
        $scope.moredata = false;
        $scope.stfList = [];
      }else{
        $scope.pageNum = 0;
        $scope.moredata = true;
        $scope.apprStatCnd = apprStat;
        $scope.stfList = [];
        // 回到顶部
        $ionicScrollDelegate.$getByHandle('contentScroll').scrollTop();
      }
	}
	
	$scope.update = function(status){
	  $scope.stf = {};
	  if(status == "50"){
          $scope.stf.apprRst = "1";
      }else{
          $scope.stf.apprRst = "0";
      }
	  var oid = "";
      var applNum = "";
      var updtTm = "";
	  for(var i = 0;i<$scope.stfList.length;i++){
	    if($scope.stfList[i].checked){
	      oid = oid + $scope.stfList[i].oid + ",";
	      applNum = applNum + $scope.stfList[i].applNum + ",";
	      updtTm = updtTm + $scope.stfList[i].updtTm + ",";
	    }
	  }
	  if(oid == ""){
	    comApi.showMessage([ "error", "审批" ], "msg.common.10005", 3000);
	    return;
	  }
	  $scope.stf.oId = oid.substring(0,oid.length - 1);
      $scope.stf.applNum = applNum.substring(0,applNum.length - 1);
      $scope.stf.updtTm = updtTm.substring(0,updtTm.length - 1);
	  
      comApi.post("staff/stfSalaryApplApprAll",$scope.stf,function(data) {
    	  comApi.showMessage("success", "msg.common.10010", 3000);
    	  $scope.moredata = true;
    	  // 回到顶部
          $ionicScrollDelegate.$getByHandle('contentScroll').scrollTop();
    	  $scope.stfList = [];
      });
	}
	
	//批量审批修改flag
	$scope.batchApproval=function(key){
	  if($scope.flag){
	    $scope.bottom = "bottom: 63px;"
	    $scope.flag = false;
	    $scope.keys = key;
	    $scope.pageNum = 0;
        $scope.moredata = true;
        $scope.apprStatCnd = "30";
        $scope.stfList = [];
        // 回到顶部
        $ionicScrollDelegate.$getByHandle('contentScroll').scrollTop();
	  }else{
        $scope.bottom = "bottom: 0px;"
	    $scope.flag = true;
        $scope.pageNum = 0;
        $scope.moredata = true;
        $scope.apprStatCnd = key;
        $scope.stfList = [];
        // 回到顶部
        $ionicScrollDelegate.$getByHandle('contentScroll').scrollTop();
	  }
	}
	//点击全选按钮
    $scope.checkAll = function(){
        for(var i=0;i<$scope.stfList.length;i++){
            $scope.stfList[i].checked = $scope.check.checkallm;
        }
    }
    
    //点击选择按钮
    $scope.checkItem = function(){
        var j = 0
        for(var i=0;i<$scope.stfList.length;i++){
            if($scope.stfList[i].checked){
                j++;
            }
        }
        if(j == $scope.stfList.length){
            $scope.check.checkallm = true;
        }else{
            $scope.check.checkallm = false;
        }
    }
    
    // 下拉刷新
    $scope.doRefresh = function() {
      $scope.pageNum = 0;
      comApi.post('staff/salaryMobileApprovalList', {
        pageSize : $scope.pageSize,
        pageNum : $scope.pageNum + 1,
        params : {
          apprStat : $scope.apprStatCnd
        }
      }, function(data) {
        for (var i = 0; i < data.list.length; i++) {
          data.list[i].checked = $scope.check.checkallm;
        }
        $scope.stfList = data.list;
        $scope.moredata = data.hasNextPage;
        $scope.pageNum = data.pageNum;

        $scope.$broadcast("scroll.refreshComplete");
      });
    };

    // 上拉加载
    $scope.loadMore = function() {
      comApi.post('staff/salaryMobileApprovalList', {
        pageSize : $scope.pageSize,
        pageNum : $scope.pageNum + 1,
        params : {
          apprStat : $scope.apprStatCnd
        }
      }, function(data) {
        for (var i = 0; i < data.list.length; i++) {
          data.list[i].checked = $scope.check.checkallm;
        }
        Array.prototype.push.apply($scope.stfList, data.list);
        $scope.moredata = data.hasNextPage;
        $scope.pageNum = data.pageNum;

        $scope.$broadcast("scroll.infiniteScrollComplete");
      });
    };
}]);