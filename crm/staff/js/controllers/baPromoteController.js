/**
 * BA晋升督导流程列表
 */
app.controller('baPromoteController', function($scope, $state, NgTableParams,
    comApi, toaster,$modal) {
  $scope.oneAtATime = true;
  $scope.status = {
    open : true
  };
  $scope.selectedApprStat = "0000";
  // 取得审批状态选项
  $scope.apprStatList = comApi.getSelectBoxDic("C018", "2");
  // 取得生效状态选项
  $scope.prmnStatList = comApi.getSelectBoxDic("C047", "2");
  // 画面初始化直接查询
  selectBaPromote($scope.apprStatList[0].key);
  // 查询处理
  $scope.selectBaPromoteList = function(apprStat) {
      selectBaPromote(apprStat);
  };
  // 查询方法
  function selectBaPromote(apprStat) {
    $scope.selectedApprStat = apprStat;
    comApi.get("BaPromote/selectBaPromoteList/" + apprStat, function(data) {
      // 总件数
      $scope.recordCount = data.length;
      // ng-table的实现绑定
      $scope.tableParams = new NgTableParams({
        // 显示的第几页
        page : 1,
        // 一页显示多少条
        count : 20
      }, {
        // 把data数据集绑定前台
        dataset : data,
        // 可以点击的显示自己想要一页显示多少条
        counts : [ 20, 50, 100, 200 ]
      });
    });
  }
  
   //查看
  $scope.infoBaPormoteAppl = function(applNum) {
    $state.go("app.staff.baPormoteinfo", {
        applNum : applNum
    });
  };
  //审批
  $scope.apprPormoteAppl = function(applNum,updtTm){
      $state.go("app.staff.baPormoteAppr",{
          applNum : applNum,
          updtTm : updtTm
      });
      
  };
  //编辑
  $scope.updateBaPormoteAppl = function(applNum,updtTm){
      $state.go("app.staff.baPromoteUpdate",{
          applNum : applNum,
          updtTm : updtTm
      });
  };
  
  //删除处理
  $scope.deleteBaPormoteAppl = function(applNum, updtTm) {
    comApi.openDelWindow(function() {
      comApi.post("BaPromote/deleteBaPormoteAppl", {
          applNum : applNum,
          updtTm : updtTm
      }, function() {
        selectBaPromote($scope.selectedApprStat);
      });
    });
  };
  
  // 取消处理
  $scope.cancelBaPormoteAppl = function(applNum, updtTm) {
    if (window.confirm("确定取消BA晋升督导流程信息？")) {
      comApi.post("BaPromote/cancelBaPormoteAppl", {
          applNum : applNum,
          updtTm : updtTm
      }, function() {
        selectBaPromote($scope.selectedApprStat);
      });
    }
  };
  

  
  //弹窗生效处理
  $scope.effectBaPormoteAppl = function(applNum, updtTm) {
      //生效窗口
      var modalInstance = $modal.open({
                  templateUrl : 'effectOut.html',
                  controller : 'effectOutController',
                  resolve : {
                      // 传递你的flag(1:不需要权限查询全部数据,2：需要权限查询部分数据)
                      flag : function() {
                          return 1;
                      },
                      // 配置需要注入JS
                      deps : [
                              '$ocLazyLoad',
                              function($ocLazyLoad) {
                                  return $ocLazyLoad
                                          .load([ 'staff/js/controllers/effectOut.js' ]);
                              } ]
                  }
              });
      
          // 父子传递参数
          modalInstance.result.then(function(Babas){
            comApi.post("BaPromote/effectBaPormoteAppl", {
            applNum : applNum,
            updtTm : updtTm,
            babas:Babas
        }, function() {
          selectBaPromote($scope.selectedApprStat);
        });
          });
  };

});