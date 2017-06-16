/**
 * Created by lenovo on 2016/5/25.
 */
app.controller('membSkinTypeInsertCtrl', function($scope, $sessionStorage, $stateParams, comApi, $state){

    //控制底部菜单栏的显示
    var navMenu = comApi.showFooterMenu("");
    $scope.$emit('navMenu.type', navMenu);

    //肌肤类型
    $scope.skinTypes = comApi.getSelectSkin("C025",0);

    comApi.myConsoleLog('肌肤类型的数据===', $scope.skinTypes, "====");


    if (comApi.isNotNullAndUndefined($sessionStorage.skinTypeInsert)) {
        $scope.membInsertSkinType = $sessionStorage.skinTypeInsert;
    }
    $scope.skinTypeSelect = function(skinTypeKey){
        // $sessionStorage.memInfoDetailEdit.sex = sexIndex;
        //保存性别
        $sessionStorage.skinTypeInsert = skinTypeKey;
        $state.go('membBasInsert');
    }
});