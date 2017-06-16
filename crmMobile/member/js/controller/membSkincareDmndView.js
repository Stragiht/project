/**
 * Created by lenovo on 2016/5/25.
 */
app.controller('membSkincareDmndViewCtrl',function($scope,$stateParams,$sessionStorage,comApi){

    //控制底部菜单栏的显示
    var navMenu = comApi.showFooterMenu("");
    $scope.$emit('navMenu.type', navMenu);

    //会员的数据编号
    $scope.curMembNum = $stateParams.membNum;
    if (comApi.isNotEmptyObject($sessionStorage.membDetailPerSto.membSkinCareNeed.C028)){
        $scope.membSkinDmndList = $sessionStorage.membDetailPerSto.membSkinCareNeed.C028;
        comApi.myConsoleLog("===", $scope.membSkinStatusList, "===");
    }
});