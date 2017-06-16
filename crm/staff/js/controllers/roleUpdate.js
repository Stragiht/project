
app.controller("roleUpdateController", function ($scope, comApi, $modal, $stateParams, $sessionStorage, $state) {

    //编辑角色的参数
    $scope.roleUpdate = {
        "roleId": "",
        "roleName": "",
        "seq": "",
        "roleDesc": "",
        "funcModuleList": [
            /* {
             "funcModuleNum": "",
             "funcPointList": [
             {
             "funcPointNum": "",
             "funcPointDetailList": [
             {
             "funcPointDetailNum": ""
             },
             {
             "funcPointDetailNum": ""
             }
             ]
             }
             ]
             }*/
        ],
        "updtTime": ""
    };

    var self = this;
    self.checkboxes = {
        checked : false,
        items : {}
    };

    self.checkboxesApp = {
        checked : false,
        items : {}
    };

    $scope.roleUpdateWebData = {};
    $scope.roleUpdateAppData = {};

    //停止标识符
    var leftStop = false;
    var rightStop = false;

    var leftStopApp = false;
    var rightStopApp = false;

    //鼠标移入←
    $scope.onmousedownLeft = function () {
        leftStop = false;
        setTimeLeft();
    };
    //鼠标移出左
    $scope.onmousedownLeftStop = function () {
        leftStop = true;
    };
    //鼠标移入右
    $scope.onmousedownRight = function () {
        rightStop = false;
        setTimeRight();
    };
    //鼠标移出右
    $scope.onmousedownRightStop = function () {
        rightStop = true;
    };

    //鼠标移入←
    $scope.onmousedownLeftApp = function () {
        leftStopApp = false;
        setTimeLeftApp();
    };
    //鼠标移出左
    $scope.onmousedownLeftStopApp = function () {
        leftStopApp = true;
    };
    //鼠标移入右
    $scope.onmousedownRightApp = function () {
        rightStopApp = false;
        setTimeRightApp();
    };
    //鼠标移出右
    $scope.onmousedownRightStopApp = function () {
        rightStopApp = true;
    };

    //向左方法
    function setTimeLeft() {
        if (leftStop) return;
        var nu = $(".tab-content-box .nav.nav-tabs").position().left;
        nu = nu - 10;
        var nuTb = $(".tab-content-box .myTab").position().left;
        nuTb = nuTb + 10;
        $(".tab-content-box .myTab").css({"left": nuTb + "px"});
        $(".tab-content-box .nav.nav-tabs").css({"left": nu + "px"});
    }

    //向右方法
    function setTimeRight() {
        if (rightStop) return;
        var nu = $(".tab-content-box .nav.nav-tabs").position().left;
        if (nu == 0) return;
        nu = nu + 10;
        var nuTb = $(".tab-content-box .myTab").position().left;
        nuTb = nuTb - 10;
        $(".tab-content-box .myTab").css({"left": nuTb + "px"});
        $(".tab-content-box .nav.nav-tabs").css({"left": nu + "px"});
    }

    //向左方法
    function setTimeLeftApp() {
        if (leftStopApp) return;
        var nu = $(".tab-content-box2 .nav.nav-tabs").position().left;
        nu = nu - 10;
        var nuTb = $(".tab-content-box2 .myTab").position().left;
        nuTb = nuTb + 10;
        $(".tab-content-box2 .myTab").css({"left": nuTb + "px"});
        $(".tab-content-box2 .nav.nav-tabs").css({"left": nu + "px"});
    }

    //向右方法
    function setTimeRightApp() {
        if (rightStopApp) return;
        var nu = $(".tab-content-box2 .nav.nav-tabs").position().left;
        if (nu == 0) return;
        nu = nu + 10;
        var nuTb = $(".tab-content-box2 .myTab").position().left;
        nuTb = nuTb - 10;
        $(".tab-content-box2 .myTab").css({"left": nuTb + "px"});
        $(".tab-content-box2 .nav.nav-tabs").css({"left": nu + "px"});
    }

    //查询权限
    $scope.selectFuncInfo = function(roleId) {
        comApi.get("roleConfig/selectFuncInfo", function(data){
            $scope.initFirst(data);
            comApi.get("roleConfig/selectRoleConfig/" + roleId, function(data2){
                $scope.initSelected(data2);
            });
        });
    };


    $scope.initFirst = function (data){
        $scope.roleUpdate.updtTime = data[0].updtTime;

        $scope.funcInWeb = [];
        $scope.funcInApp = [];

        //web端App端功能区分
        for (var i=0; i<data.length; i++) {
            for(var j=0; j<data[i].funcPointList.length; j++) {
                data[i].funcPointList.checkFlg = false;
                data[i].funcModuShowFlg = false;
            }
            if (data[i].deviceType == "W") {
                $scope.funcInWeb.push(data[i]);
            } else if(data[i].deviceType == "M") {
                $scope.funcInApp.push(data[i]);
            }
        }

        $scope.funcInWeb[0].active = true;
        $scope.funcInApp[0].active = true;
        $scope.funcInApp[0].funcModuShowFlg = true;
        $scope.funcInWeb[0].funcModuShowFlg = true;

        $scope.listWeb = $scope.funcInWeb[0].funcPointList;
        $scope.listApp = $scope.funcInApp[0].funcPointList;

        $sessionStorage.webRoleSto = $scope.funcInWeb;
        $sessionStorage.appRoleSto = $scope.funcInApp;
    };

    $scope.isCode = function(code) {
        if (comApi.isNotNullAndUndefined(code)) {
            return true;
        } else {
            return false;
        }
    };

    $scope.getCheckAll = function(funcModuleNum, flg) {
        if (flg == 'W') {
            for (var i=0; i<$scope.funcInWeb.length; i++) {
                if (funcModuleNum == $scope.funcInWeb[i].funcModuleNum) {
                    $scope.funcInWeb[i].funcPointList.checkFlg = true;
                }
            }

            if (funcModuleNum == $scope.funcInWeb[0].funcModuleNum) {
                self.checkboxes.checked = true;
            }
        } else if (flg == 'M') {
            for (var j=0; j<$scope.funcInApp.length; j++) {
                if (funcModuleNum == $scope.funcInApp[j].funcModuleNum) {
                    $scope.funcInApp[j].funcPointList.checkFlg = true;
                }
            }

            if (funcModuleNum == $scope.funcInApp[0].funcModuleNum) {
                self.checkboxesApp.checked = true;
            }
        }

    };

    $scope.webConfigData = [];
    $scope.appConfigData = [];


    $scope.initSelected = function(data){
        $scope.roleUpdate = data;  //

        for (var r = 0; r<data.funcModuleList.length; r++) {
            if (data.funcModuleList[r].deviceType == "M") {
                $scope.appConfigData.push(data.funcModuleList[r]);
            } else if (data.funcModuleList[r].deviceType == "W") {
                $scope.webConfigData.push(data.funcModuleList[r]);
            }
        }

        //$("#showMack").show();

        //选中
        for (var i=0; i<$scope.webConfigData.length; i++) {

            var checked = 0, unchecked = 0, total = $scope.webConfigData[i].funcPointList.length;
            var checked1 = 0, unchecked1 = 0, total1 = 0;
            var checked2 = 0, unchecked2 = 0, total2 = 0;

            var webFuncPtDetList = 0;

            angular
                .forEach(
                $scope.webConfigData[i].funcPointList,
                function (itemPar, index) {

                    checked2 = 0;

                    webFuncPtDetList = comApi.getRolePowerLen($scope.webConfigData[i].funcModuleNum, itemPar.funcPointNum, 'W');

                    angular
                        .forEach(
                        itemPar.funcPointDetailList,
                        function (item, thisIndex) {
                            self.checkboxes.items[item.funcPointDetailNum] = true;

                            //checked2 += $scope.isCode(item.funcPointDetailNum) || 0;
                            checked2 += self.checkboxes.items[item.funcPointDetailNum] || 0;

                            unchecked2 += (!self.checkboxes.items[item.funcPointDetailNum]) || 0;
                            if (checked2 >= webFuncPtDetList) {
                                checked2 = 0;
                                funcPtDetList = 0;
                                //self.checkboxes.items[$scope.funcInWeb[i].funcPointList[index].funcPointDetailList[thisIndex].funcPointNum] = true;
                                self.checkboxes.items[itemPar.funcPointNum] = true;
                                checked1 += self.checkboxes.items[itemPar.funcPointNum] || 0;
                            }
                        });

                    if (checked1 >= $scope.webConfigData[i].funcPointList.length) {
                        $scope.getCheckAll($scope.webConfigData[i].funcModuleNum, 'W');
                    }
                });

        }


        for (var j=0; j<$scope.appConfigData.length; j++) {
            var checkedApp = 0, uncheckedApp = 0;
            var checkedApp1 = 0, uncheckedApp1 = 0, totalApp1 = 0;
            var checkedApp2 = 0, uncheckedApp2 = 0, totalApp2 = 0;
            var appFuncPtDetList = 0;
            angular
                .forEach(
                $scope.appConfigData[j].funcPointList,
                function (itemPar) {
                    appFuncPtDetList = comApi.getRolePowerLen($scope.appConfigData[j].funcModuleNum, itemPar.funcPointNum, 'M');
                    angular
                        .forEach(
                        itemPar.funcPointDetailList,
                        function (item) {
                            self.checkboxesApp.items[item.funcPointDetailNum] = true;

                            checkedApp2 += $scope.isCode(item.funcPointDetailNum) || 0;

                            uncheckedApp2 += (!self.checkboxesApp.items[item.funcPointDetailNum]) || 0;

                            if (checkedApp2 >= appFuncPtDetList) {
                                checkedApp2 = 0;
                                appFuncPtDetList = 0;
                                self.checkboxesApp.items[itemPar.funcPointNum] = true;
                                checkedApp1 += self.checkboxesApp.items[itemPar.funcPointNum] || 0;
                            }

                        });

                    if (checkedApp1 >= $scope.appConfigData[j].funcPointList.length) {
                        $scope.getCheckAll($scope.appConfigData[j].funcModuleNum, 'M');
                    }
                });

        }
    };


    $scope.init = function() {
        $scope.selectFuncInfo($stateParams.roleId);
    };

    $scope.init();


    //改变listWeb的值
    $scope.webChangFuncValue = function(funcPoiList) {
        funcPoiList.funcModuShowFlg = true;
        $scope.listWeb =funcPoiList.funcPointList;
        self.checkboxes.checked = $scope.listWeb.checkFlg;

    };
    $scope.appChangFuncValue = function(funcPoiList) {
        funcPoiList.funcModuShowFlg = true;
        $scope.listApp =funcPoiList.funcPointList;
        self.checkboxesApp.checked = $scope.listApp.checkFlg;
    };

    // 点击全选的事件
    $scope.checkAll = function() {
        // angular 循环的方法
        angular
            .forEach(
            $scope.listWeb,
            function(item) {
                self.checkboxes.items[item.funcPointNum] = self.checkboxes.checked;
                angular
                    .forEach(
                    item.funcPointDetailList,
                    function(item) {
                        self.checkboxes.items[item.funcPointDetailNum] = self.checkboxes.checked;
                        //self.checkboxes.items[item.funcPointDetailNum] = self.checkboxes.checked;
                    });

                $scope.listWeb.checkFlg = self.checkboxes.checked;
            });
    };

    // 单选事件
    $scope.checkItem = function(funcPoint) {
        var checked = 0, unchecked = 0, total = $scope.listWeb.length;
        angular
            .forEach(
            $scope.listWeb,
            function(item) {
                checked += (self.checkboxes.items[item.funcPointNum]) || 0;
                unchecked += (!self.checkboxes.items[item.funcPointNum]) || 0;

                angular
                    .forEach(
                    funcPoint.funcPointDetailList,
                    function(item) {
                        self.checkboxes.items[item.funcPointDetailNum] = self.checkboxes.items[item.funcPointNum];
                    });
            });

        if ((unchecked == 0) || (checked == 0)) {
            self.checkboxes.checked = (checked == total);
            $scope.listWeb.checkFlg = (checked == total);
        } else {
            self.checkboxes.checked = false;
            $scope.listWeb.checkFlg = false;
        }
    };

    //功能点单选
    $scope.checkItemFuncPoint = function(funcPoint, funcPList) {
        var checked = 0, unchecked = 0, total = funcPoint.funcPointDetailList.length;
        var checked1 = 0, unchecked1 = 0, total1 = funcPList.funcPointList.length;
        angular
            .forEach(
            funcPoint.funcPointDetailList,
            function(item) {
                checked += (self.checkboxes.items[item.funcPointDetailNum]) || 0;
                unchecked += (!self.checkboxes.items[item.funcPointDetailNum]) || 0;
            });

        if ((unchecked == 0) || (checked == 0)) {
            self.checkboxes.items[funcPoint.funcPointNum] = (checked == total);

            angular
                .forEach(
                funcPList.funcPointList,
                function(item) {
                    checked1 += (self.checkboxes.items[item.funcPointNum]) || 0;
                    unchecked1 += (!self.checkboxes.items[item.funcPointNum]) || 0;
                });

            if ((unchecked1 == 0) || (checked1 == 0)) {
                self.checkboxes.checked = (checked1 == total1);
                $scope.listWeb.checkFlg = (checked1 == total1);
            } else {
                self.checkboxes.checked = false;
                $scope.listWeb.checkFlg = false;
            }
        } else {
            self.checkboxes.items[funcPoint.funcPointNum] = false;
            self.checkboxes.checked = false;
            $scope.listWeb.checkFlg = false;
        }

    };

    //app端
    // 点击全选的事件
    $scope.checkAllApp = function() {
        // angular 循环的方法
        angular
            .forEach(
            $scope.listApp,
            function(item) {
                self.checkboxesApp.items[item.funcPointNum] = self.checkboxesApp.checked;
                angular
                    .forEach(
                    item.funcPointDetailList,
                    function(item) {
                        self.checkboxesApp.items[item.funcPointDetailNum] = self.checkboxesApp.checked;
                    });

                $scope.listApp.checkFlg = self.checkboxesApp.checked;
            });
    };

    // 单选事件
    $scope.checkItemApp = function(funcPoint) {
        var checked = 0, unchecked = 0, total = $scope.listApp.length;
        angular
            .forEach(
            $scope.listApp,
            function(item) {
                checked += (self.checkboxesApp.items[item.funcPointNum]) || 0;
                unchecked += (!self.checkboxesApp.items[item.funcPointNum]) || 0;

                angular
                    .forEach(
                    funcPoint.funcPointDetailList,
                    function(item) {
                        self.checkboxesApp.items[item.funcPointDetailNum] = self.checkboxesApp.items[item.funcPointNum];
                    });
            });

        if ((unchecked == 0) || (checked == 0)) {
            self.checkboxesApp.checked = (checked == total);
            $scope.listApp.checkFlg = (checked == total);
        } else {
            self.checkboxesApp.checked = false;
            $scope.listApp.checkFlg = false;
        }
    };

    //功能点单选
    $scope.checkItemFuncPointApp = function(funcPoint, funcPList) {
        var checked = 0, unchecked = 0, total = funcPoint.funcPointDetailList.length;
        var checked1 = 0, unchecked1 = 0, total1 = funcPList.funcPointList.length;
        angular
            .forEach(
            funcPoint.funcPointDetailList,
            function(item) {
                checked += (self.checkboxesApp.items[item.funcPointDetailNum]) || 0;
                unchecked += (!self.checkboxesApp.items[item.funcPointDetailNum]) || 0;
            });

        if ((unchecked == 0) || (checked == 0)) {
            self.checkboxesApp.items[funcPoint.funcPointNum] = (checked == total);

            angular
                .forEach(
                funcPList.funcPointList,
                function(item) {
                    checked1 += (self.checkboxesApp.items[item.funcPointNum]) || 0;
                    unchecked1 += (!self.checkboxesApp.items[item.funcPointNum]) || 0;
                });

            if ((unchecked1 == 0) || (checked1 == 0)) {
                self.checkboxesApp.checked = (checked1 == total1);
                $scope.listApp.checkFlg = (checked1 == total1);
            } else {
                self.checkboxesApp.checked = false;
                $scope.listApp.checkFlg = false;
            }
        } else {
            self.checkboxesApp.items[funcPoint.funcPointNum] = false;
            self.checkboxesApp.checked = false;
            $scope.listApp.checkFlg = false;
        }
    };

    $scope.updateRoleConfig = function() {

        //web端
        $scope.funcModuleListWeb = [];
        for (var i=0; i<$scope.funcInWeb.length; i++) {
            flg = false;
            angular.forEach(
                $scope.funcInWeb[i].funcPointList,
                function(item, index) {
                    $scope.funcMWeb = {"funcModuleNum":item.funcModuleNum, "funcPointList":[]};
                    if (self.checkboxes.items[item.funcPointNum] == true) {
                        flg = true;
                        $scope.funcMWeb.funcPointList.push({"funcPointNum": item.funcPointNum,
                            "funcPointDetailList": item.funcPointDetailList});
                        $scope.funcModuleListWeb.push($scope.funcMWeb);
                    } else {
                        $scope.funcMWeb.funcPointList.push({"funcPointNum": item.funcPointNum,
                            "funcPointDetailList": []});
                        angular
                            .forEach(
                            item.funcPointDetailList,
                            function(item, index) {
                                if ( self.checkboxes.items[item.funcPointDetailNum] == true) {
                                    $scope.funcMWeb.funcPointList[0].funcPointDetailList.push({"funcPointDetailNum":item.funcPointDetailNum});
                                    //$scope.funcModuleListWeb.push($scope.funcMWeb);
                                }

                            });
                        $scope.funcModuleListWeb.push($scope.funcMWeb);
                    }

                });
        }

        //app端
        $scope.funcModuleListApp = [];
        for (var j=0; j<$scope.funcInApp.length; j++) {
            angular.forEach(
                $scope.funcInApp[j].funcPointList,
                function(item, index) {
                    $scope.funcMApp = {"funcModuleNum":item.funcModuleNum, "funcPointList":[]};
                    if (self.checkboxesApp.items[item.funcPointNum] == true) {
                        $scope.funcMApp.funcPointList.push({"funcPointNum": item.funcPointNum,
                            "funcPointDetailList": item.funcPointDetailList});
                        $scope.funcModuleListApp.push($scope.funcMApp);
                    } else {
                        $scope.funcMApp.funcPointList.push({"funcPointNum": item.funcPointNum,
                            "funcPointDetailList": []});
                        angular
                            .forEach(
                            item.funcPointDetailList,
                            function(item, index) {
                                if ( self.checkboxesApp.items[item.funcPointDetailNum] == true) {

                                    $scope.funcMApp.funcPointList[0].funcPointDetailList.push({"funcPointDetailNum":item.funcPointDetailNum});
                                    //$scope.funcModuleListApp.push($scope.funcMApp);

                                }

                            });
                        $scope.funcModuleListApp.push($scope.funcMApp);
                    }

                });
        }

        $scope.roleUpdate.funcModuleList = angular.copy(($scope.funcModuleListWeb).concat($scope.funcModuleListApp));

        comApi.post("roleConfig/updateRoleConfig", $scope.roleUpdate, function(){
            comApi.successMessage("msg.common.20010");
            setTimeout(function() {
                $state.go('app.staff.configRolePermiss')
            },1000);
        })
    }

});