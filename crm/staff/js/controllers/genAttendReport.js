app.controller('GenAttendReport', ['$scope', '$http', 'NgTableParams', 'comApi', '$state','$timeout','$filter', function ($scope, $http, NgTableParams, comApi, $state,$timeout,$filter) {
    $scope.attendreport = {};
    comApi.get("/GenAttendReport/searchDisableFlg", function (data) {
        // 按钮控制
        $scope.discreate = true;
        $scope.disselect = true;
        $scope.disopen = true;
        $scope.attendreport.initFlag = data;
        if (data == '0') {
          $scope.discreate = false;
        } else if  (data == '2') {
            $scope.discreate = false;
            $scope.disselect = false;
            $scope.disopen = false;
        }
    });
    $scope.status = {
        open: true
    };
    $scope.gydst = 0;
    $scope.phaGrpNmList = comApi.getSelectBoxPhaGrp("0");
    $scope.attendreport.phaGrpNm = $scope.phaGrpNmList[0].key;
    $scope.phaNmList = comApi.getSelectBoxPhase($scope.phaGrpNmList[0].key, "0");
    $scope.attendreport.phaNm = $scope.phaNmList[0].key;
    //查看最近一次生成结果
    $scope.searchGenAttendReport = function () {
        comApi.get("GenAttendReport/searchGenAttendReport", function (data) {
            // 取得件数
            $scope.gydst = data.length;
            // 没有查询到数据时提示
            if (data.length == 0) {
                //comApi.HintMessage("error", "", "NoDatas", 3000, "");
            }
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
    };
    //生成报表
    $scope.genAttendReport = function () {
        $scope.discreate = true;
        $scope.disselect = true;
        $scope.disopen = true;
        comApi.post("/GenAttendReport/genAttendReport/" + $scope.attendreport.phaNm+"/"+ $scope.attendreport.initFlag,{}, function (data) {
            if (data == '1' || data == '2' || data == '3') {
               if ($scope.attendreport.initFlag == '0') {
                  $scope.discreate = false;
                } else if  ($scope.attendreport.initFlag == '2') {
                    $scope.discreate = false;
                    $scope.disselect = false;
                    $scope.disopen = false;
                }
            } else if (data == '0') {
              $scope.discreate = false;
              $scope.disselect = false;
              $scope.disopen = false;
            }
            if (data == '0') {
              comApi.HintMessage([ "success", "考勤报表" ], "", "msg.common.00040", 3000, "");
            } else if (data == '1') {
              comApi.HintMessage([ "error", "" ], "", "msg.common.00037", 0, "");
            } else  if (data == '2') {
              comApi.HintMessage([ "error", "生成考勤报表" ], "", "msg.common.00039", 0, "");
            } else if (data == '3') {
              comApi.HintMessage([ "error", "" ], "", "msg.common.00042", 0, "");
            }
        });
    };
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
            type:1
        });
    };


    $scope.stfbas = {};
    // 导出方法
    $scope.outPut = function () {
        var stnum = [];
        var selectFlag = false;
        angular.forEach($scope.list, function (item) {   // stfNum是
            if ($scope.checkboxes.items[item.stfNum] == true) {
                stnum.push(item.stfNum);
                selectFlag = true;
            }
        });
        if (!selectFlag) {
          comApi.HintMessage([ "error", "导出" ], "", "msg.common.00020", 0, "");
          return;
        }
        var time1 = new Date();
        
        $scope.filename = "考勤管理_" + $filter("date")(time1,'yyyyMMdd') + ".csv";
        comApi.post("GenAttendReport/exportAttendanceManagement", {"stfNum":stnum.join(),"phaNum":$scope.attendreport.phaNm,"buttonFlag": "0"}, function (data) {
            // 綁定變量返回的 map數據的長度
            $scope.getArray = data;
            $timeout(function () {
                angular.element(document.querySelector('#outs')).triggerHandler('click');
            }, 0);
        });
    }
    // 开启审核
    $scope.insertAttendanceProcess = function(){
        $scope.discreate = true;
        $scope.disselect = true;
        $scope.disopen = true;
        comApi.post("/GenAttendReport/insertAttendanceProcess/"+ $scope.attendreport.phaNm+"/"+ $scope.attendreport.initFlag,{},function (data) {   
            if (data == '1' || data == '2') {
               if ($scope.attendreport.initFlag == '0') {
                  $scope.discreate = false;
                } else if  ($scope.attendreport.initFlag == '2') {
                    $scope.discreate = false;
                    $scope.disselect = false;
                    $scope.disopen = false;
                }
            } else if (data == '0') {
              $scope.discreate = false;
              $scope.disselect = false;
              $scope.disopen = false;
            }
            if (data == '0') {
              comApi.HintMessage([ "success", "考勤报表审核" ], "", "msg.common.00025", 3000, "");
            } else if (data == '1') {
              comApi.HintMessage([ "error", "最近生成考勤数据已经开启考勤报表审核" ], "", "msg.common.00038", 0, "");
            } else  if (data == '2') {
              comApi.HintMessage([ "error", "开启考勤报表审核" ], "", "msg.common.00039", 0, "");
            }
        });
    }


}]);