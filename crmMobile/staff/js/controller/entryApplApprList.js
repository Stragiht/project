/**
 * 入职流程批量审批列表
 */
app.controller('entryApplApprListCtrl', function($scope, $sessionStorage,
    $ionicPopup, $state, $timeout, comApi) {

	var navMenu = comApi.showFooterMenu("");
	$scope.$emit('navMenu.type', navMenu); 
	
  $scope.pageNum = 0; // 第几页
  $scope.pageSize = 15; // 每页显示件数
  $scope.moredata = true; // 上拉加载是否可用
  $scope.entryInfo = {};
  $scope.entryInfo.entryApplList = []; // 结果集
  $scope.checkStatus = true;

  // 下拉刷新
  $scope.doRefresh = function() {
    $scope.pageNum = 0;
    comApi.post('entryAppl/selectEntryApplApprListM', {
      pageSize : $scope.pageSize,
      pageNum : $scope.pageNum + 1
    }, function(data) {
      for (var i = 0; i < data.list.length; i++) {
        data.list[i].isCheck = true;
      }
      $scope.checkStatus = true;
      $scope.entryInfo.entryApplList = data.list;
      $scope.moredata = data.hasNextPage;
      $scope.pageNum = data.pageNum;

      $scope.$broadcast("scroll.refreshComplete");
    });
  };

  // 上拉加载
  $scope.loadMore = function() {
    comApi.post('entryAppl/selectEntryApplApprListM', {
      pageSize : $scope.pageSize,
      pageNum : $scope.pageNum + 1
    }, function(data) {
      for (var i = 0; i < data.list.length; i++) {
        data.list[i].isCheck = true;
      }
      Array.prototype.push.apply($scope.entryInfo.entryApplList, data.list);
      $scope.moredata = data.hasNextPage;
      $scope.pageNum = data.pageNum;

      $scope.$broadcast("scroll.infiniteScrollComplete");
    });
  };

  // 全选
  $scope.checkAll = function() {
    for (var i = 0; i < $scope.entryInfo.entryApplList.length; i++) {
      $scope.entryInfo.entryApplList[i].isCheck = $scope.checkStatus;
    }
  };

  //点击选择按钮
  $scope.checkItem = function() {
    var j = 0
    for (var i = 0; i < $scope.entryInfo.entryApplList.length; i++) {
      if ($scope.entryInfo.entryApplList[i].isCheck) {
        j++;
      }
    }
    if (j == $scope.entryInfo.entryApplList.length) {
      $scope.checkStatus = true;
    } else {
      $scope.checkStatus = false;
    }
  };
  
  // 提交操作
  $scope.apprEntryAppl = function(apprRst) {
    var isCheck = false;
    for (var i = 0; i < $scope.entryInfo.entryApplList.length; i++) {
      if ($scope.entryInfo.entryApplList[i].isCheck) {
        isCheck = true;
        break;
      }
    }
    if (!isCheck) {
      // 弹出消息
      comApi.showMessage([ "error", "审批" ], "msg.common.10005", 3000);
    } else {
      $scope.entryInfo.apprRst = apprRst;
      comApi.post("entryAppl/apprEntryApplListM", $scope.entryInfo, function(
          data) {
        // 弹出提示消息
        comApi.showMessage("success", "msg.common.10001", 3000);
        // 3秒后跳转
        $timeout(function() {
          // 跳转到入职流程页面
          $state.go("entryAppl");
        }, 3000);
      });
    }
  };
});