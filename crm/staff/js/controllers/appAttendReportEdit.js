/**
 * Created by 小张 on 2016-4-25.
 */
app.controller("appAttendReportEditController", function ($scope, comApi, $state, NgTableParams, $stateParams,$filter) {
    $scope.deit = {};
    $scope.oneAtATime = true;
    $scope.status = {
        open1: true,
        open2: true,
        open3: true,
        open4: true
    };

    $scope.selecttabs = function () {
        comApi.get("LeaveManagementController/selectLeaveApproval/" + $scope.myDatas.applNum, function (data) {
            // ng-table的实现绑定
            $scope.apptableParams = new NgTableParams({}, {
                // 把data数据集绑定前台
                dataset: data,
                // 可以点击的显示自己想要一页显示多少条
                counts: []
            });
        });
    };

    // 查询方法
    function selectEntryAppl(oid) {
        comApi.get("GenAttendReport/selectStfAttendDtlbyStfNum/" + oid, function (data) {
            $scope.myDatas = data;
            if (!data.kqmx) {
                data.kqmx = "[]"
            }
            if (!data.StoresList) {
                data.StoresList = "[]"
            }
            var tmps= JSON.parse(data.kqmx);
            if(tmps[0].oid == "" || tmps[0].oid == undefined){
              data.kqmx = "[]"
            }
            $scope.deit.editAttendList = tmps;
            $scope.deit.actualAttnDays = $scope.myDatas.actualAttnDays;
            $scope.deit.supPayDays = $scope.myDatas.supPayDays;
            $scope.deit.persLeaveDays = $scope.myDatas.persLeaveDays;
            $scope.deit.absentDays = $scope.myDatas.absentDays;
            $scope.deit.secDays = $scope.myDatas.secDays;
            $scope.deit.fullAttnDays = $scope.myDatas.fullAttnDays;
            // ng-table的实现绑定
            $scope.tableParams = new NgTableParams({count: 999999999999999}, {
                // 把data数据集绑定前台
                dataset: JSON.parse(data.kqmx),
                // 可以点击的显示自己想要一页显示多少条
                counts: []
            });

            $scope.tableParamsStoresList = new NgTableParams({count: 999999999999999}, {
                // 把data数据集绑定前台
                dataset: JSON.parse(data.StoresList),
                // 可以点击的显示自己想要一页显示多少条
                counts: []
            })


        });
    }

    $scope.BoxDic = comApi.getSelectBoxDic("C040");
    // 画面初始化直接查询
    var oid = $stateParams.oid;
    var updtTm = $stateParams.updtTm;
    $scope.deit.oid = oid;
    $scope.deit.updtTm = updtTm;
    $scope.deit.editAttendList = [];
    selectEntryAppl(oid);
    
    $scope.selectBoxDic = function (oid, e) {       
       for (var k = 0; k < $scope.deit.editAttendList.length; k++) {
            if ($scope.deit.editAttendList[k].oid == oid) {
                $scope.deit.editAttendList[k].attendSituA = e;
            }
        }
        //出勤天数
        var cqcount = 0;
        //请假天数
        var qjcount = 0;
        //旷工天数
        var kgcount = 0;
        //借调天数
        var jdcount = 0;
        for(var i=0;i<$scope.deit.editAttendList.length;i++){
          if($scope.deit.editAttendList[i].attendSituA == "0"){
            cqcount = cqcount+1;
          }
          if($scope.deit.editAttendList[i].attendSituA == "1"){
            qjcount = qjcount+1;
          }
          if($scope.deit.editAttendList[i].attendSituA == "2"){
            kgcount = kgcount+1;
          }
          if($scope.deit.editAttendList[i].attendSituA == "3"){
            jdcount = jdcount+1;
          }
        }
        //计算应发工资天数
        var yfgzcount = 0;
        /**
         * 借调天数>=请假天数
         * 应出勤天数-旷工天数
         * 借调天数<请假天数
         * 计算明细表的出勤天数。
         */
        if(jdcount - qjcount >= 0){
          yfgzcount = $scope.myDatas.supAttdDays - kgcount;
        }else{
          yfgzcount = cqcount;
        }
        if (yfgzcount < 0) {
          yfgzcount = 0;
        }
        //判断是否全勤
        var phastarttmp = $scope.myDatas.phaStartTm;
        phastarttmp = phastarttmp.replace(".","-");
        phastarttmp = phastarttmp.replace(".","-");
        if(kgcount == 0 && $filter("date")(phastarttmp,'yyyy-MM-dd') >= $filter("date")($scope.myDatas.stfEntDt,'yyyy-MM-dd') && cqcount+jdcount >= $scope.myDatas.supAttdDays){
          $scope.myDatas.fullAttnDaysNm = "1";
          $scope.myDatas.fullAttnDays = "1";
          $scope.deit.fullAttnDays = 1;
        }else{
          $scope.myDatas.fullAttnDaysNm = "0";
          $scope.myDatas.fullAttnDays = "0";
          $scope.deit.fullAttnDays = 0;
        }
        
        $scope.myDatas.actualAttnDays = cqcount + jdcount;
        $scope.myDatas.supPayDays = yfgzcount;
        $scope.myDatas.persLeaveDays = qjcount;
        $scope.myDatas.absentDays = kgcount;
        $scope.myDatas.secDays = jdcount;
        $scope.deit.actualAttnDays = cqcount + jdcount;
        $scope.deit.supPayDays = yfgzcount;
        $scope.deit.persLeaveDays = qjcount;
        $scope.deit.absentDays = kgcount;
        $scope.deit.secDays = jdcount;
    };
    
    $scope.subEdit = function () {
        comApi.post("GenAttendReport/updateEditAttendReport", $scope.deit, function (data) {
            comApi.HintMessage([ "success", "考勤信息" ], "", "msg.common.00023", 3000, "");
            setTimeout(function(){$state.go("app.staff.appAttendReport");},500);
        });
    };


    $scope.subSub = function () {
        comApi.post("GenAttendReport/updateAppAttendReport", $scope.deit, function (data) {
          comApi.HintMessage([ "success", "考勤信息" ], "", "msg.common.00024", 3000, "");
            setTimeout(function(){$state.go("app.staff.appAttendReport");},500);
        });
    };
});
app.directive('selectedSelected', function () {
    return {
        restrict: 'A', // used A because of attribute
        link: function (scope, element, attrs) {
            if (attrs.value == attrs.selectedSelected) {
                element[0].selected = true
            }
        }
    };
    
});