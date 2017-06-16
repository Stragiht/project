/*
 *這是 人員基本信息批量修改一个个编辑的方法 
 *--江風成  2016-3-25 
 *引入的  $scope  $http  NgTableParams  $element
 */
app
    .controller(
    'stfBasOneOneEditUpdate',
    [
        '$scope',
        '$http',
        'NgTableParams',
        '$element',
        'comApi',
        '$filter',
        'toaster',
        '$timeout',
        '$state',
        '$modal',
        '$stateParams',
        'toaster',
        function ($scope, $http, NgTableParams, $element,
                  comApi, $filter, toaster, $timeout, $state,
                  $modal, $stateParams) {
            // 定义变量
            $scope.stfbas = {};
            $scope.stfbastable = {};
            // 定义变量
            $scope.date = {};
            // 初始化ng-table的checkboxes
            $scope.oneAtATime = true;
            var self = this;
            self.checkboxes = {
                checked: false,
                items: {}
            };
            $scope.status = {
                open: true
            };
            var stnum = "";
            var stnumtwo = "";
            var result = $stateParams.stfNum.split(",");
            for (var i = 0; i < result.length; i++) {
                stnum += '"' + result[i] + '"' + ",";
                stnumtwo += result[i] + ",";
            }
            $scope.stfbas.stfBasNumber = stnum.substring(0,
                stnum.length - 1);
            $scope.stfbas.stfBasNumbertwo = stnumtwo.substring(
                0, stnumtwo.length - 1);

            $scope.posGrdNumSet = {
                items: {}
            };

            comApi.post("/staff/selectEdit", $scope.stfbas,
                function (data) {
                    $scope.listss = data;
                    angular.forEach(
                        $scope.listss,
                        function (item) {
                            $scope.posGrdNumSet.items[item.posNum] = comApi.getSelectBoxPosLvl(item.posNum, "0");
                            if ($scope.posGrdNumSet.items[item.posNum].length == "0") {
                                item.posGrdNum = "0000";
                            }
                        });

                    $scope.tableParams = new NgTableParams(
                        {}, {
                            dataset: $scope.listss
                        });
                    // 綁定變量返回的 map數據的長度
                    var content = "";
                    $scope.repeatlist = data;
                    for (var i = 0; i < data.length; i++) {
                        content += data[i].stfNum + "."
                            + data[i].stfNm + ",";
                    }
                    $scope.contents = content;
                });

            $scope.zhuangtai = comApi.getSelectBoxDic("C001", 0);
            $scope.jobs = comApi.getSelectBoxJob(0);

            //直属主管弹窗
            $scope.openStaff = function (size, id) {
                var modalInstance = $modal.open({
                    templateUrl: 'radiostaff.html',
                    controller: 'radioStaffController',
                    size: size,
                    resolve: {
                        //传递你的flag(1:不需要权限查询全部数据,2：需要权限查询部分数据)
                        flag: function () {
                            return 1;
                        },
                        //配置需要注入JS
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load(['common/js/controllers/radiostaff.js']);
                        }]
                    }
                });
                //父子传递参数
                modalInstance.result.then(function (selectedItem) {
                    //给text窗口赋显示格式的值
                    if (selectedItem.length > 0) {
                        $scope.listss[id].supvrStfNum = selectedItem[0].stfNum;
                        $scope.listss[id].supvrStfNm = selectedItem[0].stfNm;
                    } else {
                        $scope.listss[id].supvrStfNum = "";
                        $scope.listss[id].supvrStfNm = "";
                    }
                });
            };
            //职位改变状态
            $scope.selectc = function () {
                angular.forEach(
                    $scope.listss,
                    function (item) {//row.posGrdNum
                        $scope.posGrdNumSet.items[item.posNum] = comApi.getSelectBoxPosLvl(item.posNum, "0");
                        if ($scope.posGrdNumSet.items[item.posNum].length == "0") {
                            item.posGrdNum = "0000";
                        } else {
                            //初始化默认值为第一个
                            item.posGrdNum = $scope.posGrdNumSet.items[item.posNum][0].key;
                        }
                    });
            };
            /*
             * 插入人员信息
             */
            $scope.inserter = function () {
                var errorRep;
                for (var i = 0; i < $scope.repeatlist.length; i++) {
                    $scope.repeat = {};
                    $scope.repeat.stfIdNum = $scope.repeatlist[i].stfIdNum;
                    $scope.repeat.posNum = $scope.repeatlist[i].posNum;
                    $scope.repeat.posGrdNum = $scope.repeatlist[i].posGrdNum;
                    $scope.repeat.stfNum = $scope.repeatlist[i].stfNum;
                    $scope.repeat.supvrStfNum = $scope.repeatlist[i].supvrStfNum;

                    if ($scope.repeat.stfNum == $scope.repeat.supvrStfNum) {
                        comApi.HintMessage("error", "", "msg.common.00046", 0, "");
                        return;
                    }
                    if ($scope.repeatlist[i].stfNm == "") {
                        $scope.repeatlist[i].xxxs = true;
                        errorRep = "员工" + $scope.repeatlist[i].stfNum + "的姓名";
                        comApi.HintMessage(["error", errorRep], "", "msg.common.00014", 0, "");
                        return false;
                    }
                }

                comApi
                    .post(
                    "/staff/stfbasOneOneUpdate",
                    $scope.listss,
                    function (data) {

                        comApi.searchUnReadMessage($scope);

                        comApi.HintMessage(["success", "一个个编辑"], "", "msg.common.00023", 3000, "");

                        setTimeout(
                            function () {
                                $state
                                    .go("app.staff.stfBasAllUpdate");
                            }, "1000");
                    });
            }

        }]);
