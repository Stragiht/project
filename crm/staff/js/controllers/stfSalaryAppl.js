/*
 *审批工资报表頁面 批量审批，查看记录，编辑工资，审批个人工资
 */
app.controller('stfSalaryApplCtrl',['$scope','$http','NgTableParams','$element','comApi','toaster','$state','$filter','$modal',function($scope, $http, NgTableParams, $element,comApi,toaster,$state,$filter,$modal) {
  $scope.oneAtATime = true;
  $scope.status = {open : true};
  $scope.salary = {};
  $scope.selectedApprStat = "0000";
  // 取得审批状态选项
  $scope.apprStatList = comApi.getSelectBoxDic("C018", "2");
  // 编辑个人工资
  $scope.updateSalaryAppl = function(oId, applNum) {
    $state.go("app.staff.stfSalaryApplUpdate", {
      oIdupdate : oId,
      applNumupdate : applNum
    });
  };
  // 查看个人工资
  $scope.infoSalaryAppl = function(oId,applNum) {
    $state.go("app.staff.stfSalaryApplSelect", {
      oId : oId,
      applNum:applNum
    });
  };
  // 审批个人工资
  $scope.apprSalaryAppl = function(oId, applNum) {
    $state.go("app.staff.stfSalaryApplAppr", {
      oIdappl : oId,
      applNumappl : applNum
    });
  };
  // 批量审批
  $scope.applAll = function() {
        var oId = "";
        var applNum = "";
        var updtTm = "";
        var selectFlag = false;
        var stateFlag = true;
        angular.forEach($scope.list,function(item) {
            if ($scope.checkboxes.items[item.oId] == true) {
              
              if (item.apprStat =='30') {
                oId += item.oId + ",";
                applNum +=  item.applNum+ ",";
                updtTm += item.updtTm + ",";
                selectFlag = true;
              } else {
                stateFlag = false;
              }
            }
        });
        if (!selectFlag) {
          comApi.HintMessage([ "error", "审批" ], "", "msg.common.00020", 0, "");
          return;
        }
        if (!stateFlag) {
          comApi.HintMessage([ "error", "" ], "", "msg.common.00047", 0, "");
          return;
        }
        var modalInstance = $modal
        .open({
            templateUrl : 'salaryApplWindow.html',
            controller : 'salaryApplWindow',
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
                                    .load([ 'common/js/controllers/salaryApplWindow.js' ]);
                        } ]
            }
    
        });
        // 父子传递参数
        modalInstance.result.then(function(selectedItem) {
          $scope.salary.apprRst = selectedItem;
          var outtime = $filter("date")(new Date(),'yyyyMMdd');
          $scope.salary.oId = oId.substring(0,oId.length - 1);
          $scope.salary.applNum = applNum.substring(0,applNum.length - 1);
          $scope.salary.updtTm = updtTm.substring(0,updtTm.length - 1);
          comApi.post("staff/stfSalaryApplApprAll",$scope.salary,function(data) {
            $scope.getArray = data;
            comApi.HintMessage([ "success", "工资信息" ], "", "msg.common.00022", 3000, "");
            $scope.selectSalaryApplList($scope.selectedApprStat);
          });
        });
    }; 
    $scope.selectSalaryApplList = function(apprStat) {
      selectSalaryAppl(apprStat);
    }
  // 查询方法
  function selectSalaryAppl(apprStat) {
    $scope.selectedApprStat = apprStat;
    comApi.get("staff/stfSalaryApplInit/" + apprStat,
        function(data) {
          $scope.checkboxes.checked =false;
          angular.element(".select-all").prop("indeterminate",false);
          angular.forEach($scope.list,function(item) {$scope.checkboxes.items[item.oId] = false;});
          // 总件数
          $scope.recordCount = data.length;
          $scope.list = data;
          // ng-table的实现绑定
          $scope.tableParams = new NgTableParams({
            page : 1,
            count : 20
          }, {
            dataset : data,
            counts : [ 20, 50, 100, 200 ]
          });
        });
  }
  $scope.checkboxes = {
      checked : false,
      items : {}
  };
  // 画面初始化直接查询
  selectSalaryAppl($scope.apprStatList[0].key);
  //全选
  $scope.checkAll = function() {
        // angular 循环的方法
        angular.forEach($scope.list,function(item) {
          $scope.checkboxes.items[item.oId] = $scope.checkboxes.checked;
        });
    };
  // 单选
  $scope.checkItem = function() {
      var checked = 0, unchecked = 0, total = $scope.recordCount;
      angular.forEach($scope.list,function(item) {
        checked += ($scope.checkboxes.items[item.oId]) || 0;
        unchecked += (!$scope.checkboxes.items[item.oId]) || 0;
      });
      if ((unchecked == 0) || (checked == 0)) {
        $scope.checkboxes.checked = (checked == total);
      }
      angular.element(".select-all").prop("indeterminate",(checked != 0 && unchecked != 0));
  };
} ]);