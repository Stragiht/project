app.controller("selectHolidayController", function($scope, $state, comApi,
    $modalInstance, fromDate, toDate) {

  $scope.fromDate = fromDate;
  $scope.toDate = toDate;

  // 初始化数据
  $scope.date = [];
  // 增加不需要出勤日期
  $scope.add = function() {
    var chooseDate = document.getElementById("chooseDate").value;
    if (chooseDate == "" || chooseDate == null) {
      // comApi.HintMessage(["error","设定的日期"],"","msg.common.00014",0,"");
      return;
    }
    if ($scope.date.length > 0) {
      // 判断是否存在相同的假期
      var flag = isRepeat($scope.date, chooseDate);
      if (flag) {
        // comApi.HintMessage(["error","设定的日期"],"","msg.common.00017",0,"");
        return;
      }
      $scope.date.push({
        date : chooseDate
      });
    } else {
      $scope.date.push({
        date : chooseDate
      });
    }
  }

  // 删除
  $scope.del = function(index) {
    $scope.date.splice(index, 1);
  }

  // 确定按钮
  $scope.ok = function() {
    var datas = [];
    if (typeof ($scope.date) != "undefined") {
      datas = $scope.date;
    }
    // 向父页面传递参数
    $modalInstance.close(datas);
  };

  // 关闭当前子画面
  $scope.cancel = function() {
    $modalInstance.dismiss();
  };

  // 验证数组内元素重不重复,true重复,false不重复
  function isRepeat(arr, date) {
    for (var i = 0; i < arr.length; i++) {
      if (arr[i].date == date) {
        return true;
      }
    }
    return false;
  }
});
