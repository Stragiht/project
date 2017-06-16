/**
 * Created by JiaZhaoYang on 2016-4-21.
 * 人员信息详情画面
 */
app.controller('viewingHistoricalCtrl', ['$ionicScrollDelegate','$scope', '$location','$sessionStorage','$ionicPopup','$stateParams','comApi',function ($ionicScrollDelegate,$scope, $location,$sessionStorage,$ionicPopup,$stateParams,comApi) {
  $scope.initValue = {};
  $scope.initValue.selectedStfNum = "0000";
  var selectedStfNum = "";
  $scope.toggleStatus = {};
	var navMenu = comApi.showFooterMenu("");
	$scope.$emit('navMenu.type', navMenu); 
	$scope.pageNum = 0; // 第几页
  $scope.pageSize = 15; // 每页显示件数
  $scope.moredata = true; // 上拉加载是否可用 
  //筛选条件
  $scope.stfNum = "0000";
  //"0":没有条件,"1":按照人员编号查询,"2":按照人员姓名查找
  $scope.screenFlag = "0";
  //初始化方法
	$scope.init = function(){
	  $scope.entryStfNum = $sessionStorage.userId;
	  $scope.stfList = [];
	}

	//调用页面初始化
	$scope.init();
	//筛选按钮
	$scope.screen = function(){
	  if($scope.flag){
	    $scope.flag = false;
	  }else{
	    $scope.flag = true;
	    $scope.filterPage = true;
        // 设定【筛选】的高度
        var height = document.body.clientHeight - 48;
        $scope.shaixuanBoxHeight = height + "px";
	  }
	}
	//筛选查询
	$scope.screenSelect = function(stfNum){
	  $scope.toggleStatus.staffChecked = false;
	  // 回到顶部
	  $ionicScrollDelegate.$getByHandle('contentScroll').scrollTop();
	  $scope.inputStfNm = "";
	  $scope.stfNum = stfNum;
	  $scope.screenFlag = "1";
	  $scope.flag = false;
	  $scope.pageNum = 0; // 第几页
	  $scope.moredata = true; // 上拉加载是否可用  
	  $scope.stfList = [];
	}
	$scope.checked = function(){
	  //点击指定人员的时候触发
		if($scope.toggleStatus.staffChecked){
			selectedStfNum = $scope.initValue.selectedStfNum;
			$scope.initValue.selectedStfNum = "1";
		}else{
			$scope.initValue.selectedStfNum = selectedStfNum;
		}
	}
	//指定人员
	$scope.btclick = function(inputStfNm){
	  // 回到顶部
	  $ionicScrollDelegate.$getByHandle('contentScroll').scrollTop();
      // 指定人员姓名为空的时候，提示错误销售
      if (inputStfNm == undefined || inputStfNm == null || inputStfNm == "") {
          // 弹出提示消息
          comApi.showMessage(["error", "指定人员姓名"], "msg.common.10002", 3000);
          return;
      }
      $scope.screenFlag = "2";
	  $scope.stfNum = inputStfNm;
      $scope.pageNum = 0; // 第几页
      $scope.moredata = true; // 上拉加载是否可用  
      $scope.stfList = [];
	}
	
	
	// 下拉刷新
    $scope.doRefresh = function() {
      if($scope.flag){
        $scope.$broadcast("scroll.refreshComplete");
        return;
      }
      $scope.pageNum = 0;
      comApi.post('staff/salaryMobileHistorylist', {
        pageSize : $scope.pageSize,
        pageNum : $scope.pageNum + 1,
        params : {
          stfNum : $scope.stfNum,
          flag : $scope.screenFlag
        }
      }, function(data) {

        if(data.list.length == 0){
          $scope.stfList = [];
          $scope.moredata = false; // 上拉加载是否可用  
          return;
        }
        var time = data.list[0].phaStartTm;
        var stfList = [];
        var List = [];
        //人员列表
        for(var i = 0;i<data.list.length;i++){
          if(time == data.list[i].phaStartTm){
            List.push(data.list[i]);
          }else{
            stfList.push({
                phaStartTm:data.list[i-1].phaStartTm,
                phaEndTm:data.list[i-1].phaEndTm,
                stfList:List
            });
            time = data.list[i].phaStartTm;
            List = [];
            List.push(data.list[i]);
          }
        }
        stfList.push({
            phaStartTm:data.list[i-1].phaStartTm,
            phaEndTm:data.list[i-1].phaEndTm,
            stfList:List
        });
        $scope.stfList = stfList;
        
        $scope.moredata = data.hasNextPage;
        $scope.pageNum = data.pageNum;
        $scope.$broadcast("scroll.refreshComplete");
      });
      $scope.flag = false;
    };

    // 上拉加载
    $scope.loadMore = function() {
      comApi.post('staff/salaryMobileHistorylist', {
        pageSize : $scope.pageSize,
        pageNum : $scope.pageNum + 1,
        params : {
          stfNum : $scope.stfNum,
          flag : $scope.screenFlag
        }
      }, function(data) {
        if(data.list.length == 0){
          $scope.stfList = [];
          $scope.flag = false;
          $scope.moredata = false; // 上拉加载是否可用  
          return;
        }
        var time = data.list[0].phaStartTm;
        var stfList = [];
        var List = [];
        //人员列表
        for(var i = 0;i<data.list.length;i++){
          if(time == data.list[i].phaStartTm){
            List.push(data.list[i]);
          }else{
            stfList.push({
                phaStartTm:data.list[i-1].phaStartTm,
                phaEndTm:data.list[i-1].phaEndTm,
                stfList:List
            });
            time = data.list[i].phaStartTm;
            List = [];
            List.push(data.list[i]);
          }
        }
        stfList.push({
            phaStartTm:data.list[i-1].phaStartTm,
            phaEndTm:data.list[i-1].phaEndTm,
            stfList:List
        });
        Array.prototype.push.apply($scope.stfList, stfList);
        $scope.moredata = data.hasNextPage;
        $scope.pageNum = data.pageNum;
        $scope.$broadcast("scroll.infiniteScrollComplete");
      });
      $scope.flag = false;
    };
}]);