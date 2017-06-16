/*
 *工资历史信息頁面 查看历史记录，导出，查看个人记录
 */
app.controller('SalaryHistoryCtrl',['$scope','$http','NgTableParams','$element','comApi','$filter','$timeout','toaster',function($scope, $http, NgTableParams, $element,comApi,$filter,$timeout,toaster) {
 
    $scope.salaryHistory={};
    $scope.oneAtATime = true;
    $scope.status = {selectopen: true};
    $scope.salaryHistory.hasDirSupFlg = true;
    // 档期初始化数据
    $scope.phaGrpOidList = comApi.getSelectBoxPhaGrp("0");
    $scope.salaryHistory.phaGrpOid = $scope.phaGrpOidList[0].key;
    $scope.phaIdList = comApi.getSelectBoxPhase($scope.salaryHistory.phaGrpOid,"0");
    $scope.salaryHistory.phaId = $scope.phaIdList[0].key;
    // 职位等级初始化数据
    $scope.jobList = comApi.getSelectBoxJob("2");
    $scope.salaryHistory.posNum = $scope.jobList[0].key;
    $scope.posList = comApi.getSelectBoxPosLvl($scope.salaryHistory.posNum,"2");
    $scope.salaryHistory.posGrdNum = $scope.posList[0].key;
    // 档期组变更重新取得档期列表
    $scope.changePhaGrpOid = function(phaGrpOid) {
      $scope.phaIdList = comApi.getSelectBoxPhase(phaGrpOid, "0");
      $scope.salaryHistory.phaId = $scope.phaIdList[0].key;
    };
    // 职位变更重新取得职位等级列表
    $scope.changePosition = function(position) {
      $scope.posList = comApi.getSelectBoxPosLvl(position, "2");
      $scope.salaryHistory.posGrdNum = $scope.posList[0].key;
    };
    // 明细头部显示控制
    $scope.saleStartTm = "";
    $scope.phaGrpNm = "";
    $scope.havedataflag="";
    $scope.listcount = '0';
									
	// 点击 搜索  stfsalaryhistoryselect()
	$scope.stfsalaryhistoryselect = function() {
	  comApi.post("staff/stfSalaryHistorySelect",
	      $scope.salaryHistory,
	      function(data) {
    	    
	        // 綁定變量返回的 map數據的長度
	        $scope.listcount = data.length;
            // 綁定一個數據集方便下面全選的 調用
            $scope.list = data;
            if (data.length > 0) {
              $scope.havedataflag="1";
              // 销售业绩时间
              $scope.saleStartTm = data[0].saleAmtStartDt;
              $scope.saleEndTm = data[0].saleAmtEndDt;
              // 基本工资档期
              $scope.phaGrpNm = data[0].phaGrpNm;
              $scope.phaNm = data[0].phaNm;
            } else {
              $scope.havedataflag="";
              $scope.saleStartTm = '';
              $scope.phaGrpNm = '';
            }
            $scope.tableParams = new NgTableParams({page : 1,count : 20 }, {dataset : data,counts : [ 20,50,100,200 ] });
            $scope.checkboxes.checked =false;
            angular.forEach($scope.list,function(item) {$scope.checkboxes.items[item.oId] = false;});
            angular.element(".select-all").prop("indeterminate",false);
          });
    };
    // 初始化ng-table的checkboxes
    $scope.checkboxes = {
        checked : false,
        items : {}
    };
    // 导出报表
    $scope.outPut = function() {
          var oId = "";
          var selectFlag = false;
          angular.forEach($scope.list,function(item) {
              if ($scope.checkboxes.items[item.oId] == true) {
                oId += '"' + item.oId + '"' + ",";
                selectFlag = true;
              }
          });
          if (!selectFlag) {
        	  comApi.HintMessage("error", "", "msg.common.00008",0, "");
            return;
          }
          var outtime = $filter("date")(new Date(),'yyyyMMdd');
          $scope.salaryHistory.allSelectOut = $scope.checkboxes.checked;
          $scope.salaryHistory.oId = oId.substring(0,oId.length - 1);
          $scope.filename = "员工工资历史信息_" + outtime + ".csv";
          comApi.post("staff/stfSalaryHistoryOut",$scope.salaryHistory,function(data) {
            $scope.getArray = data;
            $timeout(function() {
                    angular.element(document.querySelector('#outs')).triggerHandler('click');
            }, 0);
          });
      };                  
     // 全选
     $scope.checkAll = function() {
          // angular 循环的方法
          angular.forEach($scope.list,function(item) {
            $scope.checkboxes.items[item.oId] = $scope.checkboxes.checked;
          });
      };
      // 单选
      $scope.checkItem = function() {
          var checked = 0, unchecked = 0, total = $scope.listcount;
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