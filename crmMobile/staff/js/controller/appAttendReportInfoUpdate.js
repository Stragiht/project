/**
 * 请假管理详情
 */
app.controller('appAttendReportInfoUpdateController', function ($scope,$timeout, $sessionStorage, $ionicPopup, $state, comApi, $stateParams) {
   
	var navMenu = comApi.showFooterMenu("");
	$scope.$emit('navMenu.type', navMenu); 
	
	$scope.editAttendList = [];
    $scope.kqmxDatas = [];
    //初始化
    function init() {
        $scope.editStatus = 0;
        comApi.get("GenAttendReport/selectStfAttendDtlbyStfNumMobile/" + $stateParams.oid, function (data) {
            $scope.AttendDatas = data;
            $scope.AttendDatas.secDay = data.secDays;
            if(data.kqmx != undefined){
              $scope.kqmxDatas = JSON.parse(data.kqmx);
            }
            if(data.StoresList != undefined){
              $scope.storesList = JSON.parse(data.StoresList);
            }
            
        });

        comApi.getSelectBoxDic("C040", 0).then(function (data) {
            $scope.appattendSitus = data;
        });

    }

    init();
    //编辑完后 点返回 将数据存到交换数组里 用于提交后台
    $scope.goUpToSetBox = function () {
        $scope.editStatus = 0;

        for (var i = 0, j = $scope.editAttendList.length; i < j; i++) {
            if ($scope.editAttendList[i].oid == $scope.kqmxDatas[$scope.EditDtlNum].oid) {
                $scope.editAttendList[i].statu = $scope.kqmxDatas[$scope.EditDtlNum].attendSitu;
                return;
            }
        }
        var obj = new Object();
        obj.oid = $scope.kqmxDatas[$scope.EditDtlNum].oid;
        obj.statu = $scope.kqmxDatas[$scope.EditDtlNum].attendSitu;
        obj.attendStr = $scope.kqmxDatas[$scope.EditDtlNum].attendStr;
        $scope.editAttendList.push(obj);
    };


    //跳转页面以及记录选择第几条数据
    $scope.goEditStatus = function(v,n,k){
        $scope.editStatus = v;
        $scope.entryInfo = {};
        $scope.entryInfo.sex = k;
        if(n>=0){
            $scope.EditDtlNum = n;
        }
    };

    //修改状态
    $scope.upCQQK = function(k,v){
        $scope.kqmxDatas[$scope.EditDtlNum].attendSitu = k;
        $scope.kqmxDatas[$scope.EditDtlNum].attendSituNm = v;
        $scope.goEditStatus(0,-1);
        //出勤天数
        var cqcount = 0;
        //请假天数
        var qjcount = 0;
        //旷工天数
        var kgcount = 0;
        //借调天数
        var jdcount = 0;
        for(var i=0;i<$scope.kqmxDatas.length;i++){
          if($scope.kqmxDatas[i].attendSitu == "0"){
            cqcount = cqcount+1;
          }
          if($scope.kqmxDatas[i].attendSitu == "1"){
            qjcount = qjcount+1;
          }
          if($scope.kqmxDatas[i].attendSitu == "2"){
            kgcount = kgcount+1;
          }
          if($scope.kqmxDatas[i].attendSitu == "3"){
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
          yfgzcount = $scope.AttendDatas.supAttdDays - kgcount;
        }else{
          yfgzcount = cqcount + jdcount;
        }
        //判断是否全勤
        if(kgcount == 0 && $scope.AttendDatas.phaStartTm >= $scope.AttendDatas.stfEntDt && yfgzcount >= $scope.AttendDatas.supAttdDays){
          $scope.AttendDatas.fullAttnDaysNm = "是";
        }else{
          $scope.AttendDatas.fullAttnDaysNm = "否";
        }
        
        $scope.AttendDatas.supPayDays = yfgzcount;
        $scope.AttendDatas.persLeaveDays = qjcount;
        $scope.AttendDatas.absentDays = kgcount;
        $scope.AttendDatas.secDay = jdcount;
    };

    //回到上一页
    $scope.goToUpPage = function () {
        $state.go("appAttendReportInfo", {oid: $stateParams.oid, updtTm: $stateParams.updtTm,flag : true})
    };

    //保存
    $scope.subEdit = function () {
        comApi.post("GenAttendReport/updateEditAttendReportMobile", {
            oid: $stateParams.oid,
            updtTm: $stateParams.updtTm,
            editAttendList:$scope.kqmxDatas,
            AttendDatas:$scope.AttendDatas
        }, function (data) {
            comApi.showMessage("success", "msg.common.10001", 3000);
            $timeout(function () {
                $state.go("appAttendReport");
            }, 3000);
        },true);
    };

    //提交
    $scope.subSub = function () {
        comApi.post("GenAttendReport/updateAppAttendReport", {
            oid: $stateParams.oid,
            updtTm: $stateParams.updtTm,
            editAttendList:$scope.editAttendList,
            AttendDatas:$scope.AttendDatas
        }, function (data) {
            comApi.showMessage("success", "msg.common.10001", 3000);
            $timeout(function () {
                $state.go("appAttendReport");
            }, 3000);
        },true);
    };

});