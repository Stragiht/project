/**
 * 新增离职流程
 */
app.controller('dimiApplInsertCtrl', function($scope, $sessionStorage,
    $ionicPopup, $timeout, $state, $filter, comApi, ionicDatePicker) {

	var navMenu = comApi.showFooterMenu("");
	$scope.$emit('navMenu.type', navMenu); 
	
  $scope.dimiInfo = {}; // 离职流程信息
  $scope.selectedDate = new Date();

  $scope.infoShow = false; // 提示信息是否显示
  $scope.dimiFormShow = true; // 离职流程表单是否显示
  $scope.jobLeaverSelectShow = false; // 直属主管选择页面是否显示
  $scope.dimiReasonSelectShow = false; // 性别选择页面是否显示
  var undStflist=[];
  var apprStat;
  // 初始化
  $scope.init = function() {
    // 取得下属人员列表(过滤掉已经申请的人员 10:未申请 60:已取消 20:未通过)
    comApi.getSelectBoxUndStf($sessionStorage.userId, 0, 2).then(function(data) {
      for(var i=0;i<data.length;i++){
          undStflist.push({key:data[i].key, text:data[i].text,myself:data[i].myself});
      }
      $scope.undStfList = undStflist;
    });
    // 取得离职原因列表
    comApi.getSelectBoxDic("C006", 0).then(function(data) {
      $scope.dicList = data;
    });
  };

  // 执行初始化方法
  $scope.init();

  /**
   * 离职人员选择
   */
  // 显示离职人员选择页面
  $scope.jobLeaverSelect = function() {
    $scope.dimiFormShow = false;
    $scope.dimiReasonSelectShow = false;
    $scope.jobLeaverSelectShow = true;

    $scope.infoShow = true;

    $timeout(function() {
      $scope.infoShow = false;
    }, 3000);
  };
  // 选定离职人员
  $scope.clickJobLeaver = function() {
    var leaver = [];
    var leaverNm = [];
    for (var i = 0; i < $scope.undStfList.length; i++) {
      if ($scope.undStfList[i].isCheck) {
        leaver.push($scope.undStfList[i].key);
        leaverNm.push($scope.undStfList[i].text);
      }
    }
    $scope.dimiInfo.jobLeaver = leaver.join(",");
    $scope.dimiInfo.jobLeaverNm = leaverNm.join(",");
  };

  /**
   * 离职原因选择
   */
  // 显示离职原因页面
  $scope.dimiReasonSelect = function() {
    $scope.dimiFormShow = false;
    $scope.dimiReasonSelectShow = true;
    $scope.jobLeaverSelectShow = false;
  };
  // 选定离职原因
  $scope.clickDimiReason = function(dic) {
    $scope.dimiInfo.dimiReasonDis = dic.text;
    $scope.goBack();
  };
  // 返回
  $scope.goBack = function() {
    $scope.dimiFormShow = true;
    $scope.dimiReasonSelectShow = false;
    $scope.jobLeaverSelectShow = false;
  };

  //选择日期
  $scope.openDatePicker = function() {
    ionicDatePicker.openDatePicker({
      callback : function(val) {
        $scope.selectedDate = new Date(val);
        var date = $filter("date")(val, 'yyyy-MM-dd');
        $scope.dimiInfo.dimiDt = date;
      },
      inputDate : $scope.selectedDate
    });
  };

  // 返回前页面
  $scope.goFrontPage = function() {
    var confirmPopup = $ionicPopup.confirm({
      title : '提示',
      template : '确定要放弃此次编辑？',
      okText : '确定',
      cancelText : '取消'

    });
    confirmPopup.then(function(res) {
      if (res) {
        $state.go("dimiAppl");
      }
    });
  };

  // 保存操作
  $scope.saveDimiAppl = function() {
    // 表单验证
    if (!$scope.checkForm()) {
      return;
    }
    comApi.post("dimiAppl/saveDimiApplForInsertPage", $scope.dimiInfo,
        function(data) {
          // 弹出提示消息
          comApi.showMessage("success", "msg.common.10001", 3000);
          // 3秒后跳转
          $timeout(function() {
            // 跳转到离职流程页面
            $state.go("dimiAppl");
          }, 3000);
        },true);
  };

  // 提交操作
  $scope.submitDimiAppl = function() {
    // 表单验证
    if (!$scope.checkForm()) {
      return;
    }
    comApi.post("dimiAppl/submitDimiApplForInsertPage", $scope.dimiInfo,
        function(data) {
          // 弹出提示消息
          comApi.showMessage("success", "msg.common.10001", 3000);
          // 3秒后跳转
          $timeout(function() {
            // 跳转到离职流程页面
            $state.go("dimiAppl");
          }, 3000);
        },true);
  };

  // 表单验证
  $scope.checkForm = function() {
    // 离职人
    if ($scope.isEmpty($scope.dimiInfo.jobLeaver)) {
      comApi.showMessage([ "error", "离职人员" ], "msg.common.10002", 3000);
      return false;
    }
    // 离职时间
    if ($scope.isEmpty($scope.dimiInfo.dimiDt)) {
      comApi.showMessage([ "error", "离职时间" ], "msg.common.10002", 3000);
      return false;
    }
    // 离职原因
    if ($scope.isEmpty($scope.dimiInfo.dimiReasonCate)) {
      comApi.showMessage([ "error", "离职原因" ], "msg.common.10002", 3000);
      return false;
    }
    return true;
  }
  // 判断是否为空
  $scope.isEmpty = function(str) {
    if (str == "" || str == null || str == undefined) {
      return true;
    } else {
      return false;
    }
  };
});