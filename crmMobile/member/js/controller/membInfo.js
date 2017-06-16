/**
 * 会员信息画面
 */
//app.controller('membInfoCtrl', ['$rootScope','$scope', '$ionicPopover', 'comApi', '$sessionStorage', '$filter',  function ($rootScope,$scope, $ionicPopover, comApi, $sessionStorage, $ionicScrollDelegate, $filter) {
app.controller('membInfoCtrl', function ($rootScope, $scope, comApi, $sessionStorage, $ionicScrollDelegate, $filter, ionicDatePicker, $state) {

    //控制底部菜单栏的显示
    var navMenu = comApi.showFooterMenu("membShow", "1");
    $scope.$emit("navMenu.type", navMenu);

    $scope.on_select = function (idx) {
        $scope.log = [idx, " selected!"].join("");
    };

    //控制会员信息和会员搜索页的显示和隐藏
    $scope.membInfoSearchShow = {
        info:true,
        search: false
    };

    //会员信息列表请求参数
    $scope.memBas = {
        "pageNum": $rootScope.PAGE_NUM,
        "pageSize": $rootScope.PAGE_SIZE,
        "params": {"phone": "", "crtdStfNum": "", "startTime": "", "endTime": "", "startCrtdTm":"", "endCrtdTm":""}
    };

    //会员信息列表 comApi  /membBas/selectMembBas4App  flg = 3 筛选
    $scope.selectMembBas = function (flg) {
        $scope.dataShow = false;
        comApi.post("membBas/selectMembBas4App",$scope.memBas,function(data){
            comApi.myConsoleLog('搜索会员列表==',data, "====");

            //判断是否有数据,若没有数据，显示小熊$scope.dataShow = true;
            if (comApi.isNotNullAndUndefined(data.data)) {

                if (data.currnetPage < data.totalPage) {
                    $scope.hasNextPage = true;
                } else {
                    $scope.hasNextPage = false;
                }

                if (flg ==1 ) {
                    $scope.membList = angular.copy(data.data);
                } else if (flg == 2) {

                    $scope.membList = $scope.membList.concat(data.data);
                    //表示上拉结束(隐藏转圈的效果)
                    $scope.$broadcast("scroll.infiniteScrollComplete");
                }

            } else {
                $scope.hasNextPage = false;
                if ($scope.memBas.pageNum == 1 ) {
                    $scope.dataShow = true;
                }

            }

        });
    };


    //数据初始化
    $scope.initMembInfo = function() {
        //定义上拉加载的标识，true可以上拉，false不能上拉，数据已经加载完成
        $scope.hasNextPage = true;
        $scope.memBas.pageNum = 1;
        $scope.membList = [];

        $scope.dataShow = false;

        $scope.createPersonnel = angular.copy(comApi.getMySubStfList());
        comApi.myConsoleLog("==创建人员=", $scope.createPersonnel, "===");

        $scope.createLen = $scope.createPersonnel.length;

        $scope.selectMembBas(2);
    };

    $scope.initMembInfo();


    //===================数据刷新============================
    //下拉刷新(初始化数据)  flg = 1表示下拉更新
    $scope.doRefresh=function(){
        $scope.hasNextPage = true;
        $scope.memBas.pageNum = 1;
        //$scope.membList = [];
        $scope.selectMembBas(1);
        $scope.$broadcast("scroll.refreshComplete");
    };

    // 上拉加载  flg = 2 标识上拉加载
    $scope.loadMore = function() {
        if ($scope.hasNextPage) {
            $scope.memBas.pageNum = $scope.memBas.pageNum + 1;
            $scope.selectMembBas(2);
            //表示上拉结束(隐藏转圈的效果)
           // $scope.$broadcast("scroll.infiniteScrollComplete");
        } else {
            console.log("已经是最后一页咯");
        }

    };

    //创建人员(自己)
    $scope.entryStfNum = $sessionStorage.userId;

    //获取本周的时间
    var today =  new Date();
    var currentDay=today.getDay();
    if(currentDay==0){currentDay=7}
    var mondayTime=today.getTime()-(currentDay-1)*24*60*60*1000;

    //获取本月的时间
    var year = today.getFullYear();
    var curMonth =  today.getMonth()+1;   //2016-03-15 07:25:23.0
    var month_first = year + "-" + curMonth + "-01" + " 00:00:00.0";
    var curMonthStamp = comApi.dateTimeTotamp(month_first);

    //选中的时间列表
    $scope.initValue = {
        all: " ",
        today : new Date().getTime(),
        week : mondayTime,
        month : curMonthStamp,
        inputStartDate:" ",
        inputEndDate:" ",
        selectedDate : " ",
        selectedStfNum : "0000"
    };


    // 设定初期值
    $scope.isToday = true;
    $scope.toggleStatus = {
        dateChecked : false,
        staffChecked : false
    };

    //========================

    // 初始化脚部显示的数据标志
    $scope.showFlg = true;

    function dataInit() {
        $scope.showFlg = true;
        $scope.membList = [];
        $scope.memBas.pageNum = 1;
        $scope.hasNextPage = false;
    }

    // 点击【筛选】里的人员姓名
    $scope.staffClick = function(stfNum) {
        $scope.memBas.params.crtdStfNum = stfNum;
        $scope.pageShow = {
            list : true,
            filter : false,
            date : false,
            staff : false
        };

        dataInit();

        // 回到顶部
        $ionicScrollDelegate.$getByHandle("contentScroll").scrollTop();

        $scope.selectMembBas(1);
        comApi.myConsoleLog("==查询创建时间数据====", $scope.memBas, "===");

    };


    // 点击【筛选】里的日期
    $scope.dateClick = function(start, end, flg) {
        $scope.memBas.params.startCrtdTm = start;
        $scope.memBas.params.endCrtdTm = end;
        if(flg == "CUSTOM" && $scope.toggleStatus.dateChecked) {
            $scope.initValue.selectedDate = null;
            return;
        }
        //如果选择自定义，并且自定义按钮是关闭的状态，则查询全部
        else if (flg == "CUSTOM" && !$scope.toggleStatus.dateChecked) {
            $scope.memBas.params.startCrtdTm = "";
            $scope.memBas.params.endCrtdTm = "";
            $scope.initValue.selectedDate = " ";
            $scope.selectMembBas(1);
            return;
        } else if (flg == "BTN") {
            $scope.initValue.selectedDate = null;
        } else {
            $scope.initValue.inputStartDate = "";
            $scope.initValue.inputEndDate = "";
            $scope.toggleStatus.dateChecked = false;
            $scope.initValue.selectedDate = start;
        }
        $scope.moredata = true;
        $scope.pageShow = {
            list : true,
            filter : false,
            date : false,
            staff : false
        };
        dataInit();
        // 回到顶部
        $ionicScrollDelegate.$getByHandle("contentScroll").scrollTop();
        $scope.selectMembBas(1);
        comApi.myConsoleLog("==查询创建时间数据====", $scope.memBas, "===");
        //$ionicScrollDelegate.$getByHandle('contentScroll').scrollTop();
    };


    // 显示【筛选】画面
    $scope.showFilter = function(isDateShow, flg) {
        $ionicScrollDelegate.$getByHandle('contentScrollFilter').scrollTop();
        $scope.pageShow = {
            list : false,
            filter : true,
            staff : isDateShow,
            date : !isDateShow
        };

        var height = document.body.clientHeight;
        var osxTitle = document.getElementById("sxTitle");

        // 设定【筛选】的高度
        if(flg == 'creator') {
            if (($scope.createLen+2)*55 > height) {
                height = ($scope.createLen+2)*55;
            }

        }

        osxTitle.style.height = height + "px";

        $scope.showFlg = false;
    };

    // 取消【筛选】
    $scope.cancelFilter = function() {

        $scope.pageShow = {
            list : true,
            filter : false,
            date : false,
            staff : false
        };

        $scope.showFlg = true;
    };

    $scope.openDatePicker = function(flg) {
        ionicDatePicker.openDatePicker({
            //val为一个时间戳
            callback : function(val) {
                if (flg == 1) {
                    $scope.memBas.params.startCrtdTm = val;
                    $scope.initValue.inputStartDate = $filter("date")(val, "yyyy-MM-dd");
                } else if(flg == 2) {
                    $scope.memBas.params.endCrtdTm = val;
                    $scope.initValue.inputEndDate = $filter("date")(val, "yyyy-MM-dd");
                }
            }
        });
    };

    //拨打电话
    $scope.callPhone = function(phone){
        var data = '{"phone" : " + phone + "}';
        window.bdk.callNumber(data);
    };

    //调用微信
    $scope.callWx = function() {
        window.bdk.openWeChat();
    };


    //=========================================================


    //光标初始化
    function cursorInit() {
        var oSearchBox = document.getElementById("searchbox");
        oSearchBox.focus();
    }

  //  cursorInit();

    $scope.searchMembByPhone = function(flg, ref) {

        $scope.dataShowSearch = false;

        if (comApi.isNotNullAndUndefined($scope.MembBas4App.params.phone)) {
            $scope.clickState = true;
        } else {
            $scope.clickState = false;
        }

        if (flg == 1) {
            //初始化查询数据
            $scope.membNameAndPhoneList = [];
            $scope.hasNextPageSearch = true;
            $scope.MembBas4App.pageNum = 1;
            if (!ref) {
                // 回到顶部
                $ionicScrollDelegate.$getByHandle('contentScrollSearch').scrollTop();
            }

        }

        //搜索会员信息列表
        comApi.post('/membBas/selectMembBas4App', $scope.MembBas4App, function(data){

            if (comApi.isNotNullAndUndefined(data.data)) {
                if (data.currnetPage < data.totalPage) {
                    $scope.hasNextPageSearch = true;
                } else {
                    $scope.hasNextPageSearch = false;
                }

                if (flg == 1) {
                    $scope.membNameAndPhoneList = angular.copy(data.data);
                } else if (flg == 2) {
                    $scope.membNameAndPhoneList = $scope.membNameAndPhoneList.concat(data.data);
                    //表示上拉结束(隐藏转圈的效果)
                    $scope.$broadcast("scroll.infiniteScrollComplete");
                }
            } else {
                $scope.hasNextPageSearch = false;
                if ($scope.MembBas4App.pageNum == 1) {
                    $scope.dataShowSearch = true;
                }

            }

            //会员列表数据
            comApi.myConsoleLog("搜索会员返回的数据====",data,"===");
        });
    };

    //点击进入会员搜索
    $scope.enterMembSearch = function() {
        //控制底部菜单栏的显示
        var navMenu = comApi.showFooterMenu("");
        $scope.$emit("navMenu.type", navMenu);

        //var oSearchBox = document.getElementById("searchbox");

        //oSearchBox.focus();


        $scope.membInfoSearchShow = {
            info:false,
            search: true
        };

        $scope.clickState = false;

       // angular.element('#searchbox').focus();

       // cursorInit();

        $scope.hasNextPageSearch = true;

        $scope.dataShowSearch = false;

        //初始化数据
        $scope.MembBas4App = {
            "pageNum":$rootScope.PAGE_NUM,
            "pageSize":$rootScope.PAGE_SIZE,
            "params":{
                "phone":"",
                "crtdStfNum":"",
                "startTime":"",
                "endTime":""
            }};

        $scope.searchMembByPhone(1, true);
    };

    //下拉刷新(初始化数据)  flg = 1表示下拉更新
    $scope.doRefreshSearch = function(){

        $scope.searchMembByPhone(1, true);
        $scope.$broadcast("scroll.refreshComplete");
    };

    // 上拉加载  flg = 2 标识上拉加载
    $scope.loadMoreSearch = function() {
        if ($scope.hasNextPageSearch) {
            $scope.MembBas4App.pageNum = $scope.MembBas4App.pageNum + 1;
            $scope.searchMembByPhone(2, false);
        } else {
            console.log("已经是最后一页咯");
        }

    };

    //清空输入
    $scope.clearInput = function() {

        //清空输入框
        $scope.MembBas4App.params.phone = null;

        $scope.searchMembByPhone(1, false);

        // 回到顶部
        //$ionicScrollDelegate.$getByHandle('contentScrollSearch').scrollTop();
    };


    $scope.hideKeyboard = function() {
        var oSearchBox = document.getElementById("searchbox");
        oSearchBox.blur();
    };

    //会员详情
    $scope.checkMembDetailInfo = function(membNum) {
        //会员详情tab
        $sessionStorage.tabCondSto = "";

        $state.go("membDetailInfo", {
            membNum : membNum
        });
    };

    //回到会员信息画面
    $scope.backMembInfo = function() {
        var navMenu = comApi.showFooterMenu("membShow", "1");
        $scope.$emit('navMenu.type', navMenu);
        $scope.membInfoSearchShow = {
            info:true,
            search: false
        };
    };

});