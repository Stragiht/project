/**
 * 离职流程批量审批列表
 */
app.controller('dimiApplApprListCtrl', function($scope, $sessionStorage,
    $ionicPopup, $state, $timeout, comApi) {

  var navMenu = comApi.showFooterMenu("");
  $scope.$emit('navMenu.type', navMenu);

  $scope.pageNum = 0; // 第几页
  $scope.pageSize = 15; // 每页显示件数
  $scope.moredata = true; // 上拉加载是否可用
  $scope.dimiInfo = {};
  $scope.dimiInfo.dimiApplList = []; // 结果集
  $scope.checkStatus = true;

  // 下拉刷新
  $scope.doRefresh = function() {
    $scope.pageNum = 0;
    comApi.post('dimiAppl/selectDimiApplApprListM', {
      pageSize : $scope.pageSize,
      pageNum : $scope.pageNum + 1
    }, function(data) {
      for (var i = 0; i < data.list.length; i++) {
        data.list[i].isCheck = true;
      }
      $scope.checkStatus = true;
      $scope.dimiInfo.dimiApplList = data.list;
      $scope.moredata = data.hasNextPage;
      $scope.pageNum = data.pageNum;

      $scope.$broadcast("scroll.refreshComplete");
    });
  };
  // 上拉加载
  $scope.loadMore = function() {
    comApi.post('dimiAppl/selectDimiApplApprListM', {
      pageSize : $scope.pageSize,
      pageNum : $scope.pageNum + 1
    }, function(data) {
      for (var i = 0; i < data.list.length; i++) {
        data.list[i].isCheck = true;
      }
      Array.prototype.push.apply($scope.dimiInfo.dimiApplList, data.list);
      $scope.moredata = data.hasNextPage;
      $scope.pageNum = data.pageNum;

      $scope.$broadcast("scroll.infiniteScrollComplete");
    });
  };

  // 全选
  $scope.checkAll = function() {
    for (var i = 0; i < $scope.dimiInfo.dimiApplList.length; i++) {
      $scope.dimiInfo.dimiApplList[i].isCheck = $scope.checkStatus;
    }
  };

  //点击选择按钮
  $scope.checkItem = function() {
    var j = 0
    for (var i = 0; i < $scope.dimiInfo.dimiApplList.length; i++) {
      if ($scope.dimiInfo.dimiApplList[i].isCheck) {
        j++;
      }
    }
    if (j == $scope.dimiInfo.dimiApplList.length) {
      $scope.checkStatus = true;
    } else {
      $scope.checkStatus = false;
    }
  };

  // 提交操作
  $scope.apprDimiAppl = function(apprRst) {
    var isCheck = false;
    for (var i = 0; i < $scope.dimiInfo.dimiApplList.length; i++) {
      if ($scope.dimiInfo.dimiApplList[i].isCheck) {
        isCheck = true;
        break;
      }
    }
    if (!isCheck) {
      // 弹出消息
      comApi.showMessage([ "error", "审批" ], "msg.common.10005", 3000);
    } else {
      $scope.dimiInfo.apprRst = apprRst;
      comApi.post("dimiAppl/apprDimiApplListM", $scope.dimiInfo,
          function(data) {
            // 弹出提示消息
            comApi.showMessage("success", "msg.common.10001", 3000);
            // 3秒后跳转
            $timeout(function() {
              // 跳转到离职流程页面
              $state.go("dimiAppl");
            }, 3000);
          });
    }
  };
});