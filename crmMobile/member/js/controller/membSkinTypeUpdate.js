/**
 * Created by lenovo on 2016/5/25.
 */
app.controller('membSkinTypeUpdateCtrl', function($scope, $sessionStorage, $stateParams, comApi, $state){

    //控制底部菜单栏的显示
    var navMenu = comApi.showFooterMenu("");
    $scope.$emit('navMenu.type', navMenu);

    /*//会员的数据编号
    $scope.curMemIndex = $stateParams.memIndex;
    $scope.addressDet = $sessionStorage.memInfoDetail;

    $scope.choice1 = 'A';
    $scope.choice2 = 'B';
    $scope.choice3 = 'C';
    $scope.choice4 = 'D';
    $scope.choice5 = 'E';
    $scope.choice6 = 'F';*/

    $scope.curMembNum = $stateParams.membNum;

    //肌肤类型
    $scope.skinTypes = comApi.getSelectSkin("C025",0);

    comApi.myConsoleLog('肌肤类型的数据===', $scope.skinTypes, "====");

    //会员的数据编号
    //$scope.curMemIndex = $stateParams.memIndex;

    if (comApi.isNotNullAndUndefined($sessionStorage.skinTypeUpdate)) {
        $scope.membEditSkinType = $sessionStorage.skinTypeUpdate;
    } else {
        $scope.membEditSkinType = $sessionStorage.memInfoDetailEdit.membSkinCareNeed.C025;
    }

    $scope.skinTypeSelect = function(skinTypeKey){

        $sessionStorage.skinTypeUpdate = skinTypeKey;

        $state.go('membInfoUpdate', {membNum: $scope.curMembNum});
    }
});