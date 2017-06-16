/*
 *工资信息頁面 工资做成，查看最近一次记录，开启，查看个人记录，编辑个人记录 
 */
app.controller('SalaryCtrl',['$scope','$http','NgTableParams','$element','comApi','$filter','$timeout','$state',function($scope, $http, NgTableParams, $element,comApi,$filter,$timeout,$state) {
 
    $scope.salary={};
    $scope.salary.saleStartTime = "";
    $scope.salary.saleEndTime = "";
    $scope.havedataflag = "";
    $scope.salary.initFlag = "";
    $scope.oneAtATime = true;
    $scope.status = {tipsopen: true,creatopen: true,selectopen: true};
    // 档期初始化数据
    $scope.phaGrpOidList = comApi.getSelectBoxPhaGrp("0");
    $scope.salary.phaGrpOid = $scope.phaGrpOidList[0].key;
    $scope.phaIdList = comApi.getSelectBoxPhase($scope.salary.phaGrpOid,"0");
    $scope.salary.phaId = $scope.phaIdList[0].key;
    // 职位等级初始化数据
    $scope.jobList = comApi.getSelectBoxJob("2");
    $scope.salary.posNum = $scope.jobList[0].key;
    $scope.posList = comApi.getSelectBoxPosLvl($scope.salary.posNum,"2");
    $scope.salary.posGrdNum = $scope.posList[0].key;
    // 档期组变更重新取得档期列表
    $scope.changePhaGrpOid = function(phaGrpOid) {
      $scope.phaIdList = comApi.getSelectBoxPhase(phaGrpOid, "0");
      $scope.salary.phaId = $scope.phaIdList[0].key;
    };
    // 职位变更重新取得职位等级列表
    $scope.changePosition = function(position) {
      $scope.posList = comApi.getSelectBoxPosLvl(position, "2");
      $scope.salary.posGrdNum = $scope.posList[0].key;
    };
    comApi.post("staff/stfSalaryInit",{},function(data) {
        // 按钮控制
        $scope.discreate = true;
        $scope.disselect = true;
        $scope.disopen = true;
        $scope.disserch = true;
        $scope.saleStartTm = '';
        $scope.saleEndTm = '';
        $scope.phaGrpNm = '';
        $scope.listcount = '0';
        $scope.salary.initFlag = data;
        if (data == '0') {
          $scope.discreate = false;
        } else if  (data == '2') {
            $scope.discreate = false;
            $scope.disselect = false;
            $scope.disopen = false;
            $scope.disserch = false;
        }
									
	});
	$scope.checkboxes = {
        checked : false,
        items : {}
    };
	// 生成工资报表
	$scope.insertStfSalary = function() {
	  if ($scope.salary.saleStartTime == "") {
	    comApi.HintMessage([ "error", "销售业绩开始时间" ], "", "msg.common.00014", 0, "");
        return;
	  }
	  if ($scope.salary.saleEndTime == "") {
	    comApi.HintMessage([ "error", "销售业绩结束时间" ], "", "msg.common.00014", 0, "");
        return;
      }
	  if($filter("date")($scope.salary.saleEndTime,'yyyy-MM-dd')<$filter("date")($scope.salary.saleStartTime,'yyyy-MM-dd')){
	    comApi.HintMessage([ "error", "销售业绩" ], "", "msg.common.00012", 0, "");
        return;
	  }
	  $scope.discreate = true;
      $scope.disselect = true;
      $scope.disopen = true;
      $scope.disserch = true;
	  comApi.post("staff/insertStfsalary",$scope.salary,function(data) {
	    if (data == '1' || data == '2' || data == '3') {
	       if ($scope.salary.initFlag == '0') {
	          $scope.discreate = false;
	        } else if  ($scope.salary.initFlag == '2') {
	            $scope.discreate = false;
	            $scope.disselect = false;
	            $scope.disopen = false;
	            $scope.disserch = false;
	        }
	    } else if (data == '0') {
	      $scope.discreate = false;
          $scope.disselect = false;
          $scope.disserch = false;
          $scope.disopen = false;
	    }
	    if (data == '0') {
	      comApi.HintMessage([ "success", "工资报表" ], "", "msg.common.00040", 3000, "");
	    } else if (data == '1') {
	      comApi.HintMessage([ "error", "" ], "", "msg.common.00037", 0, "");
	    } else  if (data == '2') {
	      comApi.HintMessage([ "error", "生成工资报表" ], "", "msg.common.00039", 0, "");
	    } else if (data == '3') {
	      comApi.HintMessage([ "error", "" ], "", "msg.common.00042", 0, "");
	    }
	  });
	};
	// 开启报表审核
	$scope.salaryopen = function() {
	  $scope.discreate = true;
      $scope.disselect = true;
      $scope.disopen = true;
      $scope.disserch = true;
      $scope.listcount = 0;
      $scope.havedataflag="";
      $scope.tableParams = new NgTableParams({page : 1,count : 20 }, {dataset : null,counts : [ 20,50,100,200 ] });
      comApi.post("staff/updateStfSalaryApplOpen",$scope.salary,function(data) {
          if (data == '1' || data == '2') {
             if ($scope.salary.initFlag == '0') {
                $scope.discreate = false;
              } else if  ($scope.salary.initFlag == '2') {
                  $scope.discreate = false;
                  $scope.disselect = false;
                  $scope.disopen = false;
                  $scope.disserch = false;
              }
          } else if (data == '0') {
            $scope.discreate = false;
            $scope.disselect = false;
            $scope.disserch = false;
            $scope.disopen = false;
          }
      
        if (data == '1') {
          comApi.HintMessage([ "error", "最近生成工资数据已经开启工资报表审核" ], "", "msg.common.00038", 0, "");
        } else if (data == '2') {
         comApi.HintMessage([ "error", "开启工资报表审核" ], "", "msg.common.00039", 0, "");
        } else if (data == '0') {
         comApi.HintMessage([ "success", "工资报表审核" ], "", "msg.common.00025", 3000, "");
       }
      });
    };
    // 查看
    $scope.stfSalarySelectByKey = function(oId) {
        $state.go("app.staff.salarySelect", {
            oId : oId
        });
    };
    // 编辑
    $scope.stfSalaryUpdateByKey = function(oId) {
        $state.go("app.staff.salaryUpdate", {
          oId : oId
        });
    };
	// 搜索
	$scope.stfsalaryselect = function() {
	  $scope.salary.selectFlag = '';
	  comApi.post("staff/stfsalaryselect",
	      $scope.salary,
	      function(data) {
	        $scope.checkboxes.checked =false;
	        angular.element(".select-all").prop("indeterminate",false);
	        angular.forEach($scope.list,function(item) {$scope.checkboxes.items[item.oId] = false;});
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
          });
    }
	// 点击 查看最后一次生成记录
    $scope.stfsalaryselectlast = function() {
      $scope.salary.selectFlag = 'All';
      comApi.post("staff/stfsalaryselect",
          $scope.salary,
          function(data) {
            $scope.checkboxes.checked =false;
            angular.element(".select-all").prop("indeterminate",false);
            angular.forEach($scope.list,function(item) {$scope.checkboxes.items[item.oId] = false;});
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
            }  else {
              $scope.havedataflag="";
              $scope.saleStartTm = '';
              $scope.phaGrpNm = '';
            }
            $scope.tableParams = new NgTableParams({page : 1,count : 20 }, {dataset : data,counts : [ 20,50,100,200 ] });
          });
    };


    //导出数据格式化方法
    $scope.formDCMeth = function(obj) {
        $scope.forD.a = obj.stfNum;
        $scope.forD.b = obj.stfNm;
        $scope.forD.c = $filter("stfBasSubDep")(obj.subDep);
        $scope.forD.d = $filter("stfBasPosNum")(obj.position);
        $scope.forD.e = $filter('stfBasPosGrdNum')(obj.position, obj.posGrd);
        $scope.forD.f = obj.stfEntDt;
        $scope.forD.g = obj.dimiDt;
        $scope.forD.h = "￥"+ $filter("fromMoney")(obj.probStarStd);
        $scope.forD.i = "￥"+ $filter("fromMoney")(obj.regularStarStd);
        $scope.forD.j = "￥"+ $filter("fromMoney")(obj.attendAmt);
        $scope.forD.k = "￥"+ $filter("fromMoney")(obj.summation);
        $scope.forD.l = "￥"+ $filter("fromMoney")(obj.totDedu);
        $scope.forD.m = "￥"+ $filter("fromMoney")(obj.netSal);
        $scope.forD.n = "￥"+ $filter("fromMoney")(obj.sclSecurity);
        $scope.forD.o = "￥"+ $filter("fromMoney")(obj.accumFunds);
        $scope.forD.p = "￥"+ $filter("fromMoney")(obj.supTaxAmt);
        $scope.forD.q = "￥"+ $filter("fromMoney")(obj.persIncomeTax);
        $scope.forD.r = "￥"+ $filter("fromMoney")(obj.otherDedu);
        return $scope.forD;
    };

    // 导出方法
    $scope.outPut = function () {
        var isEmptySelect = true;
        $scope.outSalary = [{
            "a": "人员编号",
            "b": "姓名",
            "c": "部门",
            "d": "职位",
            "e": "等级",
            "f": "入职日期",
            "g": "最后工作日",
            "h": "试用星级标准",
            "i": "转正星级标准",
            "j": "考勤工资",
            "k": "应加合计",
            "l": "应扣合计",
            "m": "实发工资",
            "n": "社保",
            "o": "公积金",
            "p": "应计税金额",
            "q": "个税",
            "r": "其它应扣"
        }];

        var oidNum = "";

        angular.forEach($scope.list, function (item) {
            if ($scope.checkboxes.items[item.oId] == true) {
                isEmptySelect = false;
                $scope.forD = {
                    "a": "",
                    "b": "",
                    "c": "",
                    "d": "",
                    "e": "",
                    "f": "",
                    "g": "",
                    "h": "",
                    "i": "",
                    "j": "",
                    "k": "",
                    "l": "",
                    "m": "",
                    "n": "",
                    "o": "",
                    "p": "",
                    "q": "",
                    "r": ""
                };
                $scope.outSalary.push($scope.formDCMeth(item));
                oidNum += '"'
                    + item.oId
                    + '"' + ",";
            }
        });

        if(isEmptySelect){
            comApi.HintMessage([ "error", "导出" ], "", "msg.common.00020", 0, "");
            return;
        }
        var outtime = $filter("date")(new Date(),'yyyyMMdd');
        $scope.filename = "员工工资信息_" + outtime + ".csv";

        $scope.getArray = $scope.outSalary;
        $timeout(
            function () {
                angular
                    .element(
                    document
                        .querySelector('#outs'))
                    .triggerHandler(
                    'click');
            }, 1000);
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