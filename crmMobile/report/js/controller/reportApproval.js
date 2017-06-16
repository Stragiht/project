/**
 * Created by JiaZhaoYang on 2016-4-21.
 * 人员信息详情画面
 */
app.controller('reportApprovalCtrl', ['$scope','$ionicScrollDelegate','$state', '$http', '$location','$sessionStorage','$ionicPopup','$stateParams','comApi',function ($scope,$ionicScrollDelegate,$state, $http, $location,$sessionStorage,$ionicPopup,$stateParams,comApi) {
	
	var navMenu = comApi.showFooterMenu("reportShow","4");
	$scope.$emit('navMenu.type', navMenu); 
	
	$scope.flag = true;
  $scope.bottom = "bottom: 51px;"
  $scope.repApprStartDt = "";
  $scope.repApprEndDt = "";
  $scope.pageNum = 0; // 第几页
  $scope.pageSize = 15; // 每页显示件数
  $scope.moredata = true; // 上拉加载是否可用
  $scope.apprStatCnd = "0000";
  $scope.key = "0000";
  if($stateParams.flag != null){
    $scope.flag = $stateParams.flag;
  }
  if($stateParams.keys != null){
    $scope.keys = $stateParams.keys;
    if(!$scope.flag){
      $scope.apprStatCnd = "30";
      var navMenu = {
          mainShow : false,
          stfShow:false,
          reportShow:$scope.flag
      };
      $scope.$emit('navMenu.type', navMenu); 
    }else{
      $scope.apprStatCnd = $stateParams.keys;
      var navMenu = {
          mainShow : false,
          stfShow:false,
          reportShow:true
      };
      $scope.$emit('navMenu.type', navMenu); 
    }
  }
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
	  if(apprStat == "40" || apprStat == "60" || apprStat == "70"){
	    $scope.apprStatCnd = apprStat;
	    $scope.key = apprStat;
	    $scope.moredata = false;
	    $scope.pageNum = 0;
        $scope.bblist = [];
        $ionicScrollDelegate.$getByHandle('contentScroll').scrollTop();
	  }else{
	    $scope.apprStatCnd = apprStat;
	    $scope.key = apprStat;
	    $scope.pageNum = 0;
	    $scope.moredata = true;
	    $scope.bblist = [];
	    $ionicScrollDelegate.$getByHandle('contentScroll').scrollTop();
	  }
	}
	//审批
	$scope.update = function(status){
	  var stf = {};
	  var dataList = [];
      if(status == "50"){
          stf.apprRst = "1";
      }else{
          stf.apprRst = "0";
      }
      for(var k=0;k<$scope.bblist.length;k++){
        for(var i = 0;i<$scope.bblist[k].stfList.length;i++){
          if($scope.bblist[k].stfList[i].checked){
            dataList.push($scope.bblist[k].stfList[i]);
          }
        }
      }
      if(dataList.length>0){
        stf.dataList = dataList;
        comApi.post("RepApplReport/apprReportBatchManagement",stf,function(data) {
          comApi.showMessage("success", "msg.common.10010", 3000);
          $scope.flag = !$scope.flag;
          $scope.moredata = true;
          $scope.apprStatCnd = "0000";
          $scope.bblist = [];
        },true);
      }else{
        comApi.showMessage([ "error", "审批" ], "msg.common.10005", 3000);
        return;
      }
      
	}
	
	//批量审批修改flag
	$scope.batchApproval=function(key){
	  if($scope.flag){
	    $scope.bottom = "bottom: 63px;"
	    $scope.flag = false;
	    $scope.keys = key;
	    $scope.apprStatCnd = "30"
	    $scope.pageNum = 0;
        $scope.moredata = true;
        $scope.bblist = [];
        $ionicScrollDelegate.$getByHandle('contentScroll').scrollTop();
        
    	var navMenu = {
    			mainShow : false,
    			stfShow:false,
    			reportShow:false
    	};
    	$scope.$emit('navMenu.type', navMenu); 
	  }else{
	    $scope.bottom = "bottom: 51px;"
	    $scope.flag = true;
	    
		var navMenu = {
				mainShow : false,
				stfShow:false,
				reportShow:true
		};
		$scope.$emit('navMenu.type', navMenu); 
	    $scope.apprStatCnd = key;
	    $scope.key = key;
	    $scope.pageNum = 0;
        $scope.moredata = true;
        $scope.bblist = [];
        $ionicScrollDelegate.$getByHandle('contentScroll').scrollTop();
	  }
	}
	$scope.check = {};
	//点击全选按钮
    $scope.checkAll = function(){
        for(var k=0;k<$scope.bblist.length;k++){
          for(var i=0;i<$scope.bblist[k].stfList.length;i++){
            $scope.bblist[k].stfList[i].checked = $scope.check.checkallm;
          }
        }
    }
    
    //点击选择按钮
    $scope.checkItem = function(){
        var j = 0
        for(var k=0;k<$scope.bblist.length;k++){
          for(var i=0;i<$scope.bblist[k].stfList.length;i++){
              if($scope.bblist[k].stfList[i].checked){
                  j++;
              }
          }
        }
        var count = 0;
        for(var k=0;k<$scope.bblist.length;k++){
          for(var i=0;i<$scope.bblist[k].stfList.length;i++){
            count++;
          }
        }
        if(j == count){
            $scope.check.checkallm = true;
        }else{
            $scope.check.checkallm = false;
        }
    }
    
    // 下拉刷新
    $scope.doRefresh = function() {
      $scope.pageNum = 0; // 还原第几页
      comApi.post('repAppl/selectRepApplMobileLists', {
        pageSize : $scope.pageSize,
        pageNum : $scope.pageNum + 1, // 下一页
        params : {
          apprStat : $scope.apprStatCnd
        }
      }, function(data) {
        
        var stfList = [];
        $scope.bblist = [];
        var bbList = [];
        if(data.data.length > 0){
            var repApprStartDt = data.data[0].repApprStartDt;
            var repApprEndDt = data.data[0].repApprEndDt;
          //人员列表
          if(data.data.length == 0){
            bbList = [];
            return;
          }
          for(var i = 0;i<data.data.length;i++){
            str=data.data[i].strNum;
            if(str.length > 5){
              data.data[i].strNum = str.substring(0,3)+"...";
            }
            if(repApprStartDt == data.data[i].repApprStartDt && repApprEndDt == data.data[i].repApprEndDt){
              stfList.push(data.data[i]);
            }else{
              bbList.push({
                repApprStartDt : repApprStartDt,
                repApprEndDt : repApprEndDt,
                stfList : stfList
              })
              stfList = [];
              repApprStartDt = data.data[i].repApprStartDt;
              repApprEndDt = data.data[i].repApprEndDt;
              stfList.push(data.data[i]);
            }
          }
          bbList.push({
            repApprStartDt:repApprStartDt,
            repApprEndDt:repApprEndDt,
            stfList:stfList
          });
          for(var k=0;k<bbList.length;k++){
            for(var i=0;i<bbList[k].stfList.length;i++){
              bbList[k].stfList[i].checked =  $scope.check.checkallm;
            }
          }
        }else{
          bbList=[];
        }
        $scope.check.checkallm = true;
        $scope.bblist = bbList;
        $scope.moredata = data.currnetPage < data.totalPage;
        $scope.pageNum = data.pageNum;

        $scope.$broadcast("scroll.refreshComplete");
      });
    }

    // 上拉加载
    $scope.loadMore = function() {
      comApi.post('repAppl/selectRepApplMobileLists', {
        pageSize : $scope.pageSize,
        pageNum : $scope.pageNum + 1, // 下一页
        params : {
          apprStat : $scope.apprStatCnd
        }
      }, function(data) {
        var stfList = [];
        $scope.bblist = [];
        var bbList = [];
        if(data.data.length > 0){
            var repApprStartDt = data.data[0].repApprStartDt;
            var repApprEndDt = data.data[0].repApprEndDt;
          //人员列表
          if(data.data.length == 0){
            bbList = [];
            return;
          }
          if($scope.flag){
            for(var i = 0;i<data.data.length;i++){
              str=data.data[i].strNum;
              if(str.length > 5){
                data.data[i].strNum = str.substring(0,3)+"...";
              }
              if(repApprStartDt == data.data[i].repApprStartDt && repApprEndDt == data.data[i].repApprEndDt){
                stfList.push(data.data[i]);
              }else{
                bbList.push({
                  repApprStartDt : repApprStartDt,
                  repApprEndDt : repApprEndDt,
                  stfList : stfList
                })
                stfList = [];
                repApprStartDt = data.data[i].repApprStartDt;
                repApprEndDt = data.data[i].repApprEndDt;
                stfList.push(data.data[i]);
              }
            }
            bbList.push({
              repApprStartDt:repApprStartDt,
              repApprEndDt:repApprEndDt,
              stfList:stfList
            });
          }else{
            stfList = data.data;
            bbList.push({stfList:stfList});
            for(var k=0;k<bbList.length;k++){
              for(var i=0;i<bbList[k].stfList.length;i++){
                bbList[k].stfList[i].checked =  $scope.check.checkallm;
              }
            }
          }
        }else{
          bbList=[];
        }
        $scope.check.checkallm = true;
        Array.prototype.push.apply($scope.bblist, bbList); // 拼接结果集
        $scope.moredata = data.currnetPage < data.totalPage;
        $scope.pageNum = data.pageNum;

        $scope.$broadcast("scroll.infiniteScrollComplete");
      });
    }
}]);