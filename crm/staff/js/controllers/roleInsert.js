
app.controller("roleInsertController", function ($scope, comApi, $modal, $state) {

    //新增角色的参数
    $scope.roleInsert = {
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

    $scope.roleInsertWebData = {};
    $scope.roleInsertAppData = {};

    //停止标识符
    var leftStop = false;
    var rightStop = false;

    var leftStopApp = false;
    var rightStopApp = false;

    var tabIndexRoleId;

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
    $scope.selectFuncInfo = function() {
        comApi.get("roleConfig/selectFuncInfo", function(data){
            $scope.initFirst(data);
        });
    };

    $scope.initFirst = function(data) {
        $scope.roleInsert.updtTime = data[0].updtTime;
        /* $scope.tabs = data;
         $scope.tabs[0].active = true;*/
        $scope.funcInWeb = [];
        $scope.funcInApp = [];

        //web端App端功能区分
        for (var i=0; i<data.length; i++) {
            for(var j=0; j<data[i].funcPointList.length; j++) {
                data[i].funcPointList.checkFlg = false;
            }
            //data[i].checkFlg = false;
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
    };

    $scope.selectFuncInfo();

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

    var self = this;
    self.checkboxes = {
        checked : false,
        //checkedNext: false,
        items : {},
        itemsNext: {}
    };

    self.checkboxesApp = {
        checked : false,
        //checkedNext: false,
        items : {},
        itemsNext: {}
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
             //self.checkboxes.checked = (checked == total);
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
                        //self.checkboxes.items[item.funcPointDetailNum] = self.checkboxes.checked;
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
            //self.checkboxes.checked = (checked == total);
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

    ///roleConfig/insertRoleConfig
    $scope.insertRoleConfig = function() {
        //web端
        $scope.funcModuleListWeb = [];
        for (var i=0; i<$scope.funcInWeb.length; i++) {
            angular.forEach(
                $scope.funcInWeb[i].funcPointList,
                function(item, index) {
                    $scope.funcMWeb = {"funcModuleNum":item.funcModuleNum, "funcPointList":[]};

                    if (self.checkboxes.items[item.funcPointNum] == true) {

                        $scope.funcMWeb.funcPointList.push({"funcPointNum": item.funcPointNum,
                            "funcPointDetailList": item.funcPointDetailList});
                        $scope.funcModuleListWeb.push($scope.funcMWeb);
                    } else {
                        $scope.funcMWeb.funcPointList.push({"funcPointNum": item.funcPointNum,
                            "funcPointDetailList": []});
                        //$scope.funcMoo.funcPointList[index].funcPointDetailList = [];
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
                                   // $scope.funcModuleListApp.push($scope.funcMApp);

                                }
                            });
                        $scope.funcModuleListApp.push($scope.funcMApp);
                    }



                });
        }


        $scope.roleInsert.funcModuleList = angular.copy(($scope.funcModuleListWeb).concat($scope.funcModuleListApp));

        comApi.post("roleConfig/insertRoleConfig", $scope.roleInsert, function(){
            comApi.successMessage("msg.common.20010");
            setTimeout(function() {
                $state.go('app.staff.configRolePermiss')
            },1000);
        })
    }


});