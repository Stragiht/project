app.controller('genAttendReportHistory', ['$scope', '$http', 'NgTableParams', 'comApi', '$state', '$timeout', function ($scope, $http, NgTableParams, comApi, $state, $timeout) {

    $scope.status = {
        open: true
    };
    var ifDay="0";
    var ifDepartment="";
    $scope.attendreport = {};
    $scope.attendreport.stfNm = "";
    $scope.attendreport.stfNum = "";
    $scope.attendreport.flag = true;
    $scope.gydst = "0";
    $scope.ifDayList=[{key:'0',text:"全部"},{key:'1',text:"是"},{key:'2',text:"否"}]
    $scope.phaGrpNmList = comApi.getSelectBoxPhaGrp("0");
    $scope.Department = comApi.getSelectBoxDepartment();
    $scope.Department.push({key:"000",text:"全部"});
    $scope.DepartmentFun = function (v) {
    	ifDepartment=v;
    	$scope.departments = v;
    };
    $scope.secDaysFun = function(v){
    	ifDay=v
    	$scope.selectedDay = v;
    };

    $scope.attendreport.phaGrpNm = $scope.phaGrpNmList[0].key;
    $scope.phaNmList = comApi.getSelectBoxPhase($scope.phaGrpNmList[0].key, "0");
    $scope.attendreport.phaNm = $scope.phaNmList[0].key;
    //查看最近一次生成结果
    $scope.searchGenAttendReport = function () {
      serchDetail();
    };
    function serchDetail() {
    	if(ifDepartment!="000"&&ifDay!="0"){
    		$scope.departments=ifDepartment;
    		$scope.selectedDay=ifDay;
    		$scope.attendreport.departments = $scope.departments;
    		$scope.attendreport.ccsyt = $scope.selectedDay;
    	}
    	if(ifDepartment!="000"&&ifDay=="0"){
    		$scope.departments=ifDepartment;
    		$scope.selectedDay="0";
    		$scope.attendreport.departments = $scope.departments;
    		$scope.attendreport.ccsyt = $scope.selectedDay;
    	}
    	if(ifDepartment=="000"&&ifDay!="0"){
    		$scope.departments="000";
    		$scope.selectedDay=ifDay;
    		$scope.attendreport.departments = "";
    		$scope.attendreport.ccsyt = $scope.selectedDay;
    	}
    	if(ifDepartment=="000"&&ifDay=="0"){
    		$scope.departments="000";
    		$scope.selectedDay="0";
    		$scope.attendreport.departments = "";
    		$scope.attendreport.ccsyt = $scope.selectedDay;
    	}
      comApi.post("GenAttendReport/searchGenAttendReportHistory", $scope.attendreport, function (data) {
        // 取得件数
        $scope.gydst = data.length;
        // 取得列表数据
        $scope.list = data;
        // ng-table的实现绑定
        $scope.tableParams = new NgTableParams({
            // 显示的第几页
            page: 1,
            // 一页显示多少条
            count: 20
        }, {
            // 把data数据集绑定前台
            dataset: data,
            // 可以点击的显示自己想要一页显示多少条
            counts: [20, 50, 100, 200]
        });

        $scope.checkboxes = {
            checked: false,
            items: {}
        };
        angular.element(".select-all").prop("indeterminate",false);
    });
    }
    // 初始化ng-table的checkboxes
    $scope.checkboxes = {
        checked: false,
        items: {}
    };
    // 全选事件
    $scope.checkAll = function () {
        // angular 循环的方法
        angular
            .forEach(
                $scope.list,
                function (item) {
                    // stfNum是
                    // $scope.list的一个key值注意這個value值是唯一的
                    $scope.checkboxes.items[item.stfNum] = $scope.checkboxes.checked;
                });
    };
    // 单选事件
    $scope.checkItem = function () {
        var checked = 0, unchecked = 0, total = $scope.gydst;
        angular
            .forEach(
                $scope.list,
                function (item) {
                    checked += ($scope.checkboxes.items[item.stfNum]) || 0;
                    unchecked += (!$scope.checkboxes.items[item.stfNum]) || 0;
                });
        if ((unchecked == 0) || (checked == 0)) {
            $scope.checkboxes.checked = (checked == total);
        }
        angular.element(".select-all").prop(
            "indeterminate",
            (checked != 0 && unchecked != 0));
    };

    // 档期组变更重新取得档期列表
    $scope.changePhaGrp = function (phaGrp) {
        $scope.phaNmList = comApi.getSelectBoxPhase(phaGrp, "0");
        $scope.attendreport.phaNm = $scope.phaNmList[0].key;
    };

    $scope.selectAttendReport = function (oid) {
        $state.go("app.staff.genAttendReportSelect", {
            oid: oid,
            type:2
        });
    };


    $scope.stfbas = {};
    // 导出方法
   /* $scope.outPut = function () {
        var stnum = [];
        angular.forEach($scope.list, function (item) {   // stfNum是
            if ($scope.checkboxes.items[item.stfNum] == true) {
                stnum.push(item.stfNum);
            }
        });
        // 如果没有选择要导出的数据，提示错误信息，返回。
        if (stnum.length == 0) {
          comApi.HintMessage("error", "", "msg.common.00008",0, "");
          return;
        }
        var time1 = new Date().Format("yyyyMMdd");
        $scope.filename = "考勤管理_" + time1 + ".csv";
        comApi.post("GenAttendReport/exportAttendanceManagement", {"stfNum": stnum.join(),"phaNum": $scope.attendreport.phaNm,"buttonFlag": "1"}, function (data) {
            // 綁定變量返回的 map數據的長度
            $scope.getArray = data;

            $timeout(function () {
                angular.element(document.querySelector('#outs')).triggerHandler('click');
            }, 0);
        });
    }*/


    //导出 /*lg*/
    //导出数据格式化方法
    $scope.formDCMeth = function(obj) {
        $scope.forD.a = obj.stfNum;
        $scope.forD.b = obj.stfNm;
        $scope.forD.c = obj.depNm;
        $scope.forD.d = obj.posNm;
        $scope.forD.e = obj.phaGrpNm;
        $scope.forD.f = obj.fullAttnDaysNm;
        $scope.forD.g = obj.supAttdDays;
        $scope.forD.h = obj.actualAttnDays;
        $scope.forD.i = obj.supPayDays;
        $scope.forD.j = obj.persLeaveDays;
        $scope.forD.k = obj.secDays;
        $scope.forD.l = obj.absentDays;
        return $scope.forD;
    };

    //当前日期
    var currentDate = new Date().Format("yyyyMMdd");

    //批量导出
    $scope.outPut = function() {
        var isEmptySelect = true;
        $scope.outAttendance = [{
            "a": "人员编号",
            "b": "姓名",
            "c": "部门",
            "d": "职位",
            "e": "考勤档期",
            "f": "是否全勤",
            "g": "应出勤天数",
            "h": "实际出勤天数",
            "i": "应发工资天数",
            "j": "请假天数",
            "k": "借调天数",
            "l": "旷工天数"
        }];

        var stnum = "";

        angular.forEach($scope.list, function (item) {

            if ($scope.checkboxes.items[item.stfNum] == true) {
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
                    "l": ""
                };
                $scope.outAttendance.push($scope.formDCMeth(item));
                stnum += '"'
                    + item.stfNum
                    + '"' + ",";
            }
        });

        if(isEmptySelect){
            comApi.HintMessage("error", "错误", "msg.common.00008", 0, "");
            return;
        }
        $scope.filename = "考勤管理_" + currentDate + ".csv";

        $scope.getArray = $scope.outAttendance;
        $timeout(
            function () {
                angular
                    .element(
                    document
                        .querySelector('#outAttendances'))
                    .triggerHandler(
                    'click');
            }, 1000);
    };

}]);