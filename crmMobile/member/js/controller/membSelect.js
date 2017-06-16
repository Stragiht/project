/**
 * Created by lenovo on 2016/5/25.
 */
app.controller('membSelectCtrl', function($scope, comApi, $sessionStorage, $rootScope, $state, $ionicScrollDelegate){

    //控制底部菜单栏的显示
    var navMenu = comApi.showFooterMenu("");
    $scope.$emit('navMenu.type', navMenu);

    $scope.clickState = false;

    //光标初始化
    function cursorInit() {

       var oSearch =  document.getElementById("searchbox");
        oSearch.focus();
    }

    cursorInit();

    $scope.searchMembByPhone = function(flg, ref) {

        $scope.dataShow = false;

        if (comApi.isNotNullAndUndefined($scope.MembBas4App.params.phone)) {
            $scope.clickState = true;
        } else {
            $scope.clickState = false;
        }

        if (flg == 1) {
            //初始化查询数据
            $scope.membNameAndPhoneList = [];
            $scope.hasNextPage = true;
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
                    $scope.hasNextPage = true;
                } else {
                    $scope.hasNextPage = false;
                }

                if (flg == 1) {
                    $scope.membNameAndPhoneList = angular.copy(data.data);
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


    $scope.initMembSelect = function() {

        //var crtdStfNum = $sessionStorage.userId;

        $scope.MembBas4App = {
            "pageNum":$rootScope.PAGE_NUM,
            "pageSize":$rootScope.PAGE_SIZE,
            "params":{
                "phone":"",
                "crtdStfNum":"",
                "startTime":"",
                "endTime":""
            }};

        $scope.searchMembByPhone(1, false);
    };

    $scope.initMembSelect();

    //初始化搜索数据

    //===================数据刷新============================
    //下拉刷新(初始化数据)  flg = 1表示下拉更新
    $scope.doRefresh=function(){

        $scope.searchMembByPhone(1, true);
        $scope.$broadcast('scroll.refreshComplete');
    };

    // 上拉加载  flg = 2 标识上拉加载
    $scope.loadMore = function() {
        if ($scope.hasNextPage) {
            $scope.MembBas4App.pageNum = $scope.MembBas4App.pageNum+1;
            $scope.searchMembByPhone(2, false);
        } else {
            console.log("已经是最后一页咯");
        }

    };

    //选择会员
    $scope.selectMemb = function(memb) {
        //缓存当前选中的会员
        $sessionStorage.selCurMembSto = angular.copy(memb);
        comApi.myConsoleLog("当前选中的会员===", memb , '===');
        $state.go('membRevisitRecInsert2');
    };

    //清空输入
    $scope.clearInput = function() {

        //清空输入框
        $scope.MembBas4App.params.phone = null;

        $scope.searchMembByPhone(1, false);

        // 回到顶部
        //$ionicScrollDelegate.$getByHandle('contentScrollSearch').scrollTop();
    };

    var oSearchBox = document.getElementById("searchbox");

    $scope.hideKeyboard = function() {
        oSearchBox.blur();
    };

});