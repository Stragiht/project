/**
 * Created by lenovo on 2016-3-15.
 * 会员信息详情画面
 */
app.controller("membDetailInfoCtrl", function ($scope, $sessionStorage, $state, $ionicPopup, $stateParams, comApi, $ionicTabsDelegate, $timeout, $filter) {

    //控制底部菜单栏的显示
    var navMenu = comApi.showFooterMenu("");
    $scope.$emit("navMenu.type", navMenu);

    var membNum = $stateParams.membNum;

    $scope.goFrontPage = function() {

        $sessionStorage.tabCondSto = "";
        $state.go("membInfo");

    };

    /*
     * 根据会员编号获取会员详细信息
     * */
    $scope.selectInfoAccMembNum = function() {
         comApi.get("membBas/selectByMembNum/"+membNum, function(data) {
             $scope.memInfo = data;
             //字符串的时间格式转成时间戳
             var crtdTm = comApi.timeToTimestamp($scope.memInfo.crtdTm);
             $scope.formatCrtdDate = $filter("dateFormat")(crtdTm);
             $scope.formatCrtdTm = $filter("date")(crtdTm, "HH:mm:ss");
         });
    };

    $scope.buyDetlDataShow = false;

    //购买明细  {"pageNum":1,"pageSize":3,"params":{"membNum":"V000007"}}  /membBas/selectMembBuyDtlRecList
    $scope.membBuyDetlData = {
        "pageNum":"",
        "pageSize":"",
        "params":{
            "membNum":membNum
        }
    };

    $scope.selectMembBuyDetl = function() {
        comApi.post("membBas/selectMembBuyDtlRecList", $scope.membBuyDetlData, function(data) {
            $scope.membBuyDetlList = data.data;
            if (!comApi.isNotEmptyObject($scope.membBuyDetlList)) {
                $scope.buyDetlDataShow = true;
            } else {
                $sessionStorage.membBuyDetlLists = angular.copy(data.data);
            }
            comApi.myConsoleLog("购买明细的数据===", data, "=====");
        })
    };

    $scope.membRevisitRecDataShow = false;

    //回访记录 /membBas/selectMembRevisitRecListWithReplyList  {"pageNum":1,"pageSize":2,"params":{"membNum":"V000007"}}
    $scope.membRevisitRecData = {
        "pageNum":"",
        "pageSize":"",
        "params":{
            "membNum":membNum
        }
    };

    $scope.triangleStyle = [];


    $scope.selectMembRevRecList = function() {
        comApi.post("membBas/selectMembRevisitRecListWithReplyList", $scope.membRevisitRecData, function(data) {
            $scope.membRevisitRecList = data.data;

            if (!comApi.isNotEmptyObject($scope.membRevisitRecList)) {
                $scope.membRevisitRecDataShow = true;
            } else {
                //回访记录列表
                $sessionStorage.membRevisitLists = angular.copy(data.data);
            }
            comApi.myConsoleLog("回访记录的数据===", data, "=====");

            //回访记录小三角形区域border-color的默认颜色
            for (var i=0; i<$scope.membRevisitRecList.length; i++) {
                $scope.triangleStyle[i] = "triangle_border_color";
            }
        })
    };

    //会员详细信息初始化
    $scope.membInfoDetailInit = function() {
        //初始化切换栏的状态
        $scope.tabCond = {
            membInfo: true,
            membBuyDet: false,
            membRevRec: false
        };

        if (comApi.isNotNullAndUndefined($sessionStorage.tabCondSto)) {
            $scope.tabCond = $sessionStorage.tabCondSto;
        }

        $scope.selectInfoAccMembNum();

        //初始化购买明细
        $scope.selectMembBuyDetl();

        //初始化会员回访记录
        $scope.selectMembRevRecList();

    };

    $scope.membInfoDetailInit();



 /* $scope.selectTabWithIndex = function(index) {
      //alert(index);
      //alert(index)
        $ionicTabsDelegate.select(index);
        $ionicTabsDelegate.$getByHandle('my-handle').select(index);

    };*/

    //初始化tab栏
    //$scope.initIonTab = 0; //默认选中第一个tab栏
    /*if (comApi.isNotNullAndUndefined($sessionStorage.ionTabSto)) {
        $scope.initIonTab = $sessionStorage.ionTabSto;
    }*/


    //控制tab栏切换
    $scope.tabSwitch = function(membInfo, membBuyDet, membRevRec) {
        $scope.tabCond = {
            membInfo: membInfo,
            membBuyDet: membBuyDet,
            membRevRec: membRevRec
        };

        $sessionStorage.tabCondSto = $scope.tabCond;
    };

   /* $scope.selectTabWithIndex = function(index) {
        $ionicTabsDelegate.select(index);
        $sessionStorage.ionTabSto = index;
    };*/

    /*$scope.$on('ionTabFinished', function () {

        $ionicTabsDelegate.select($scope.initIonTab);

    });*/

    $scope.touchChangeStyle = function(index) {
        $scope.triangleStyle[index] = "triangle_border_color_touch";
        console.log($scope.triangleStyle[index]+"==")

    };

    $scope.releaseChangeStyle = function(index) {
        $timeout(function(){
            $scope.triangleStyle[index] = "triangle_border_color";
        },100);
    };

    $scope.checkMembRevRecView = function(index) {
        $state.go("membRevisitRecView", {
            membNum : $scope.memInfo.membNum,  //memInfo({memIndex:curMemIndex})
            memRevisIndex : index  //memInfo({memIndex:curMemIndex})
        });
    };

    $scope.checkMembRevBuyDet = function(index) {
        $state.go("membBuyDetail", {
            membNum : $scope.memInfo.membNum,
            memBuyIndex : index
        });
    }


});