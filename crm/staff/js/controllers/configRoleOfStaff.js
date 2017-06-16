/**
 * Created by 张玉良 on 2016-4-11.
 */
app.controller("configRoleOfStaffController", function ($scope, comApi, $modal) {

    //停止标识符
    var leftStop = false;
    var rightStop = false;
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
    //向左方法
    function setTimeLeft() {
        if (leftStop) return;
        var nu = $(".nav.nav-tabs").position().left;
        if ($scope.app.settings.asideFolded == false) {
        	nu = nu - 225;
        	  var nuTb = $(".myTab").position().left;
        	  nuTb = nuTb + 10;
          
        } else {
        	nu = nu - 80;
        	  var nuTb = $(".myTab").position().left;
              nuTb = nuTb + 10;
        }
      
        $(".myTab").css({"left": nuTb + "px"});
        $(".nav.nav-tabs").css({"left": nu + "px"});
//        setTimeout(setTimeLeft, 100);
    }

    //向右方法
    function setTimeRight() {
        if (rightStop) return;
        var nu = $(".nav.nav-tabs").position().left;
        if ($scope.app.settings.asideFolded == false) {
        	if (nu > 145) return;
        	nu =nu - 205;
        	  var nuTb = $(".myTab").position().left;
        	  nuTb = nuTb - 10;
        } else {
        	if (nu == 0) return;
        	 nu = nu - 60;
        	  var nuTb = $(".myTab").position().left;
              nuTb = nuTb - 10;
        }
     
        $(".myTab").css({"left": nuTb + "px"});
        $(".nav.nav-tabs").css({"left": nu + "px"});
//        setTimeout(setTimeRight, 100);
    }

    //获取tab页面数据
    comApi.get("configRoleOfStaff/selectRoleInfoAll", function (data) {
        $scope.tabs = data;
        $scope.tabs[0].active = true;
    });

    //tab切换触发
    $scope.tabSelect = function (roleID) {
        //判断是否修改数据
        if (roleData().get().length > 0) {
            var ModalInstanceCtrl = function ($scope, $modalInstance) {
                $scope.ok = function () {
                    $modalInstance.close(1);
                };

                $scope.cancel = function () {
                    $modalInstance.close(2);
                };
            };
            var modalInstance = $modal.open({
                template: '<div class="modal-body" style="text-align: center;"><br/><p >是否要保存当前操作的数据？</p><br/><div><button class="btn btn-info" type="button" ng-click="ok()" style="width: 85px;margin-right: 40px;">保存</button><button class="btn btn-danger" type="button" ng-click="cancel()" style="width: 85px;">取消</button></div><br/></div>',
                controller: ModalInstanceCtrl
            });
            modalInstance.opened.then(function () {
                //模态窗口打开之后执行的函数
            });
            //父子传递参数
            modalInstance.result.then(function (v) {
                if (v == '1') {
                    $scope.submitRoleData();
                    comApi.get("configRoleOfStaff/selectUserByRoleId/" + roleID, function (data) {
                        if (data != null) {
                            tabIndexRoleId = roleID;
                            roleData().remove();
                            $scope.roleDataCon = roleData().get().length;
                            $scope.haveRoleItems.length = 0;
                            $scope.noRoleItems.length = 0;
                            $scope.haveRoleData = data.haveRole;
                            $scope.noRoleData = data.noRole;
                        }
                    });
                } else {
                    comApi.get("configRoleOfStaff/selectUserByRoleId/" + roleID, function (data) {
                        if (data != null) {
                            tabIndexRoleId = roleID;
                            roleData().remove();
                            $scope.roleDataCon = roleData().get().length;
                            $scope.haveRoleItems.length = 0;
                            $scope.noRoleItems.length = 0;
                            $scope.haveRoleData = data.haveRole;
                            $scope.noRoleData = data.noRole;
                        }
                    });
                }
            });
        } else {
            comApi.get("configRoleOfStaff/selectUserByRoleId/" + roleID, function (data) {
                if (data != null) {
                    tabIndexRoleId = roleID;
                    roleData().remove();
                    $scope.roleDataCon = roleData().get().length;
                    $scope.haveRoleItems.length = 0;
                    $scope.noRoleItems.length = 0;
                    $scope.haveRoleData = data.haveRole;
                    $scope.noRoleData = data.noRole;
                }
            });
        }

    };

    /**
     * 操作区域开始
     */
    //用户最终操作
    var roleData = TAFFY();

    //有权限用户数据
    $scope.haveRoleData = [];
    //没有权限用户数据
    $scope.noRoleData = [];

    //有权限用户选中的
    $scope.haveRoleItems = [];
    //没权限用户选中的
    $scope.noRoleItems = [];
    //有权限的用户
    $scope.haveRole = {
        data: 'haveRoleData',
        enableRowSelection: true,
        //showFooter:true,
        enableSorting: false,//排序功能
        showFilter: true,//搜索功能
        noKeyboardNavigation: true,//禁用键盘导航
        selectedItems: $scope.haveRoleItems,//选中的赋值
        beforeSelectionChange: function (rowItem, event) {
            return rowItem;
        },
        columnDefs: [{
            field: "userText",
            pinned: false,
            cellClass: "callText",
            headerClass: 'headText',
            displayName: "当前角色已有人员"
        }]
    };

    //没有权限的用户
    $scope.noRole = {
        data: 'noRoleData',
        enableRowSelection: true,
        //showFooter:true,
        enableSorting: false,//排序功能
        showFilter: true,//搜索功能
        noKeyboardNavigation: true,//禁用键盘导航
        selectedItems: $scope.noRoleItems,//选中的赋值
        beforeSelectionChange: function (rowItem, event) {
            return rowItem;
        },
        columnDefs: [{
            field: "userText",
            pinned: false,
            cellClass: "callText",
            headerClass: 'headText',
            displayName: "未分配当前角色的人员"
        }]
    };

    //有权限移动到没有权限
    $scope.LeftFoRight = function () {
        if (!$scope.haveRoleItems.length > 0) return;
        $scope.noRoleData = $scope.haveRoleItems.concat($scope.noRoleData);

        for (var i = 0, j = $scope.haveRoleItems.length; i < j; i++) {
            var obj = $scope.haveRoleItems[i];
            obj.type = "delete";
            obj.roleId = tabIndexRoleId;

            if (roleData({"stfNum": obj.stfNum}).remove() == 0) {
                roleData.insert(obj);
            }
            $scope.roleDataCon = roleData().get().length;
            for (var k = 0; k < $scope.haveRoleData.length; k++) {
                if ($scope.haveRoleData[k].stfNum == $scope.haveRoleItems[i].stfNum) {
                    $scope.haveRoleData.splice(k, 1);
                }
            }
        }
        $scope.haveRoleItems.length = 0;
    };

    //没有权限移动到有权限
    $scope.RightFoLeft = function () {
        if (!$scope.noRoleItems.length > 0) return;
        $scope.haveRoleData = $scope.noRoleItems.concat($scope.haveRoleData);
        for (var i = 0, j = $scope.noRoleItems.length; i < j; i++) {
            var obj = $scope.noRoleItems[i];
            obj.type = "insert";
            obj.roleId = tabIndexRoleId;

            if (roleData({"stfNum": obj.stfNum}).remove() == 0) {
                roleData.insert(obj);
            }
            $scope.roleDataCon = roleData().get().length;
            for (var k = 0; k < $scope.noRoleData.length; k++) {
                if ($scope.noRoleData[k].stfNum == $scope.noRoleItems[i].stfNum) {
                    $scope.noRoleData.splice(k, 1);
                }
            }
        }
        $scope.noRoleItems.length = 0;
    };

    $scope.roleDataCon = 0;

    $scope.submitRoleData = function () {
        comApi.post("configRoleOfStaff/saveUserRole", {list: roleData().get()}, function (data) {
            comApi.HintMessage(["success", "配置人员所属角色"], "", "msg.common.00023", 3000, "");
            roleData().remove();
            $scope.roleDataCon = roleData().get().length;
        });
    }


});