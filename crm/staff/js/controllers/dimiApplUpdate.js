/**
 * 编辑离职流程
 */
app.controller('dimiApplUpdateController', function($scope, $stateParams,
    $state, $modal, NgTableParams, comApi) {

  $scope.oneAtATime = true;
  $scope.status = {
    dimiBaseInfoOpen : true,
    apprHisDisplay : false
  };
  $scope.dimiInfo = {};
  $scope.stfList = [];
  $scope.applTypeList = [];

  // 初始化
  $scope.initDimiApplInsert = function() {
    comApi.post("dimiAppl/getDimiApplInfoForUpdatePage", {
      dimiApplNum : $stateParams.dimiApplNum,
      updtTm : $stateParams.updtTm
    }, function(data) {
      // 离职申请信息
      $scope.dimiInfo = data.dimiApplInfo;
      $scope.dimiInfo.dimiDt = data.dimiApplInfo.dimiDtDis;
      // 离职人列表
      $scope.stfList = data.stfList;
      // 审批历史
      if (data.approvalList.length > 0) {
        $scope.status.apprHisDisplay = true;
      }
      $scope.tableParams = new NgTableParams({
        // 显示的第几页
        page : 1,
        // 一页显示多少条
        count : 20
      }, {
        // 把data数据集绑定前台
        dataset : data.approvalList,
        // 可以点击的显示自己想要一页显示多少条
        counts : [ 20, 50, 100, 200 ]
      });
    });
    // 提交方式下拉列表
    var applTypeDataList = comApi.getSelectBoxDic("C005", "0");
    if (applTypeDataList.length > 0) {
      $scope.applTypeList[0] = applTypeDataList[0];
    }
    // 离职原因下拉列表
    var dimiReasonCateDataList = comApi.getSelectBoxDic("C006", "0");
    $scope.dimiReasonCateList = dimiReasonCateDataList;
  }
  // 执行初始化
  $scope.initDimiApplInsert();

  // 离职人浏览
  $scope.openStf = function(size) {
    var modalInstance = $modal.open({
      templateUrl : 'multiselectstaff.html',
      controller : 'multiSelectStaffController',
      size : size,
      resolve : {
        // 传递你的flag(1:不需要权限查询全部数据,2：需要权限查询部分数据)
        flag : function() {
          return 2;
        },
        // 配置需要注入JS
        deps : [
            '$ocLazyLoad',
            function($ocLazyLoad) {
              return $ocLazyLoad
                  .load([ 'common/js/controllers/multiselectstaff.js' ]);
            } ]
      }
    });
    // 父子传递参数
    modalInstance.result.then(function(selectedItem) {
      for (var i = 0; i < selectedItem.length; i++) {
        var stfNum = selectedItem[i].stfNum;
        var exist = false;
        for (var j = 0; j < $scope.stfList.length; j++) {
          if (stfNum == $scope.stfList[j].stfNum) {
            exist = true;
            break;
          }
        }
        if (!exist) {
          $scope.stfList.push(selectedItem[i]);
        }
      }
      var stfNumStr = "";
      var stfNmStr = "";
      for (var i = 0; i < $scope.stfList.length; i++) {
        if (i == 0) {
          stfNumStr = $scope.stfList[i].stfNum;
          stfNmStr = $scope.stfList[i].stfNm;
        } else {
          stfNumStr = stfNumStr + "," + $scope.stfList[i].stfNum;
          stfNmStr = stfNmStr + "," + $scope.stfList[i].stfNm;
        }
      }
      $scope.dimiInfo.jobLeaver = stfNumStr;
      $scope.dimiInfo.jobLeaverNm = stfNmStr;
    });
  };
  // 离职人删除
  $scope.delStf = function(index) {
    $scope.stfList.splice(index, 1);
    var stfNumStr = "";
    var stfNmStr = "";
    for (var i = 0; i < $scope.stfList.length; i++) {
      if (i == 0) {
        stfNumStr = $scope.stfList[i].stfNum;
        stfNmStr = $scope.stfList[i].stfNm;
      } else {
        stfNumStr = stfNumStr + "," + $scope.stfList[i].stfNum;
        stfNmStr = stfNmStr + "," + $scope.stfList[i].stfNm;
      }
    }
    $scope.dimiInfo.jobLeaver = stfNumStr;
    $scope.dimiInfo.jobLeaverNm = stfNmStr;
  };

  // 保存操作
  $scope.saveDimiAppl = function() {
    comApi.post("dimiAppl/saveDimiApplForUpdatePage", $scope.dimiInfo,
        function(data) {
          comApi.HintMessage([ "success", "离职流程信息" ], "", "msg.common.00023",
              3000, "");
          // 跳转到离职流程页面
          $state.go("app.staff.dimiAppl");
        });
  };

  // 提交操作
  $scope.submitDimiAppl = function() {
    comApi.post("dimiAppl/submitDimiApplForUpdatePage", $scope.dimiInfo,
        function(data) {
          comApi.HintMessage([ "success", "离职流程信息" ], "", "msg.common.00024",
              3000, "");
          // 跳转到离职流程页面
          $state.go("app.staff.dimiAppl");
        });
  };
});