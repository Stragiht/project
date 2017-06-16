/**
 * Created by lenovo on 2016/5/24.
 */
/*
 * 购买明细
 * */
app.controller("membBuyDetailCtrl", ["$scope", "$ionicPopover", "comApi", "$sessionStorage", "$stateParams", function ($scope, $ionicPopover, comApi, $sessionStorage, $stateParams) {

    //控制底部菜单栏的显示
    var navMenu = comApi.showFooterMenu("");
    $scope.$emit("navMenu.type", navMenu);

    //当前会员购买详情索引
    var curMemBuyIndex = $stateParams.memBuyIndex;
    //会员信息索引
    $scope.curMembNum = $stateParams.membNum;
    $scope.membBuyDetl = $sessionStorage.membBuyDetlLists[curMemBuyIndex];
    comApi.myConsoleLog('购买明细的具体数据==',$scope.membBuyDetl, "====");

    //控制显示
    $scope.membBuyDetShow = {
        detailShow:true,
        fieldShow:false
    };
    //显示的标题
    $scope.filedTitle = "";
    //显示的内容
    $scope.filedDetail = "";

    //预览超过12个字符的文字
    $scope.viewStrField = function(str,tit) {
        $scope.membBuyDetShow = {
            detailShow:false,
            fieldShow:true
        };

        $scope.filedTitle = tit;

        $scope.filedDetail = str;
    };

    $scope.backBuyDet = function() {
        $scope.membBuyDetShow = {
            detailShow:true,
            fieldShow:false
        };
    }

}]);