/**
 * Created by lenovo on 2016/5/25.
 */
app.controller('membSkincareProdPrefViewCtrl',function($scope,$stateParams,$sessionStorage,comApi){

    //控制底部菜单栏的显示
    var navMenu = comApi.showFooterMenu("");
    $scope.$emit('navMenu.type', navMenu);

    //会员编号
    $scope.curMembNum = $stateParams.membNum;

    if (comApi.isNotEmptyObject($sessionStorage.membDetailPerSto.membSkinCareNeed.C027)){
        $scope.membSkinProdPreList = $sessionStorage.membDetailPerSto.membSkinCareNeed.C027;
        comApi.myConsoleLog("===", $scope.membSkinProdPreList, "===");
    }

});