/**
 * Created by lenovo on 2016/5/25.
 */
app.controller('membSelect2Ctrl', function($scope, comApi, $sessionStorage, $rootScope, $state, $ionicScrollDelegate){

    //控制底部菜单栏的显示
    var navMenu = comApi.showFooterMenu("");
    $scope.$emit('navMenu.type', navMenu);

    //光标初始化
    function cursorInit() {

        var oSearch =  document.getElementById("searchbox2");
        oSearch.focus();
    }

    cursorInit();

    var crtdStfNum = $sessionStorage.userId;

    $scope.MembBas4App = {
        "pageNum":$rootScope.PAGE_NUM,
        "pageSize":$rootScope.PAGE_SIZE,
        "params":{
            "phone":"",
            "crtdStfNum":crtdStfNum,
            "startTime":"",
            "endTime":""
        }};


    //定义上拉加载的标识，true可以上拉，false不能上拉，数据已经加载完成
    $scope.hasNextPage = false;
    //没有输入条件是不显示数据及样式
    $scope.dataShow = false;
    $scope.membNameAndPhoneList = [];

    $scope.searchMembByPhone = function(flg) {

        $scope.clickState = false;
        $scope.dataShow = false;

        /*if (!comApi.isNotNullAndUndefined($scope.MembBas4App.params.phone)) {
            $scope.membNameAndPhoneList = [];
            $scope.hasNextPage = false;
            $scope.clickState = true;
            return;
        } else if (flg == 1) {
            //初始化查询数据
            $scope.membNameAndPhoneList = [];
            $scope.hasNextPage = true;
            $scope.MembBas4App.pageNum = 1;
            // 回到顶部
            $ionicScrollDelegate.$getByHandle('contentScrollSearch').scrollTop();
        }*/

        if (!comApi.isNotNullAndUndefined($scope.MembBas4App.params.phone)) {
            $scope.clickState = true;
        }

        if (flg == 1) {
            //初始化查询数据
            $scope.membNameAndPhoneList = [];
            $scope.hasNextPage = true;
            $scope.MembBas4App.pageNum = 1;
            // 回到顶部
            $ionicScrollDelegate.$getByHandle('contentScrollSearch').scrollTop();
        }

        //搜索会员信息列表
        comApi.post('/membBas/selectMembBas4App', $scope.MembBas4App, function(data){

            if (comApi.isNotNullAndUndefined(data.data)) {

                if (data.currnetPage < data.totalPage) {
                    $scope.hasNextPage = true;
                } else {
                    $scope.hasNextPage = false;
                }

                if (flg == 1) {
                    $scope.membNameAndPhoneList = angular.copy(data.data);
                    $scope.$broadcast('scroll.refreshComplete');
                } else if (flg == 2) {
                    $scope.membNameAndPhoneList = $scope.membNameAndPhoneList.concat(data.data);
                    //表示上拉结束(隐藏转圈的效果)
                    $scope.$broadcast("scroll.infiniteScrollComplete");
                }

            } else {
                $scope.hasNextPage = false;
                $scope.dataShow = true;

            }

            //会员列表数据
            comApi.myConsoleLog("搜索会员返回的数据====",data,"===");
        });
    };

    //初始化搜索数据
    $scope.searchMembByPhone(1);


    //===================数据刷新============================
    //下拉刷新(初始化数据)  flg = 1表示下拉更新
    $scope.doRefresh=function(){
        /*if (!comApi.isNotNullAndUndefined($scope.MembBas4App.params.phone)) {
            $scope.membNameAndPhoneList = [];
            $scope.hasNextPage = false;
            $scope.dataShow = false;
        } else {
            comApi.consoleLog("下拉刷新----有输入");
            $scope.hasNextPage = true;
            $scope.MembBas4App.pageNum = 1;
            $scope.searchMembByPhone(1);
        }*/
        $scope.searchMembByPhone(1);

    };

    // 上拉加载  flg = 2 标识上拉加载
    $scope.loadMore = function() {
        if ($scope.hasNextPage) {
            $scope.MembBas4App.pageNum = $scope.MembBas4App.pageNum+1;
            $scope.searchMembByPhone(2);
        }
    };

    //选择会员
    $scope.selectMemb = function(memb) {
        //缓存当前选中的会员
        $sessionStorage.selCurMembSto = angular.copy(memb);
        comApi.myConsoleLog("当前选中的会员===", memb , '===');
        $state.go('membRevisitRecInsert2');
    };

    $scope.clickState = false;
    //清空输入
    $scope.clearInput = function() {

        $scope.membNameAndPhoneList = [];

        $scope.dataShow = false;

        $scope.MembBas4App.params.phone = null;

        $scope.clickState = true;

        $scope.searchMembByPhone(1);

        // 回到顶部
        $ionicScrollDelegate.$getByHandle('contentScrollSearch').scrollTop();
    };

    var oSearchBox2 = document.getElementById("searchbox2");

    $scope.hideKeyboard = function() {
        oSearchBox2.blur();
    };

});