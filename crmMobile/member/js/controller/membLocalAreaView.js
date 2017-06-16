/**
 * Created by lenovo on 2016/5/25.
 */
app.controller("membLocalAreaViewCtrl", function($scope, $sessionStorage,$stateParams, comApi){

    //控制底部菜单栏的显示
    var navMenu = comApi.showFooterMenu("");
    $scope.$emit("navMenu.type", navMenu);

    //会员的数据编号
    $scope.curMembNum = $stateParams.membNum;
    $scope.addressDet = $sessionStorage.memInfoDetail;
});