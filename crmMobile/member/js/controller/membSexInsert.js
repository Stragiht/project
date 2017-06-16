/**
 * Created by lenovo on 2016/5/26.
 */
app.controller('membSexInsertCtrl', function($scope, $sessionStorage, $stateParams, comApi, $state){

    //控制底部菜单栏的显示
    var navMenu = comApi.showFooterMenu("");
    $scope.$emit('navMenu.type', navMenu);

    if (comApi.isNotNullAndUndefined($sessionStorage.baSexInsert)) {
        $scope.membEditSex = $sessionStorage.baSexInsert;
    } else {
        $scope.membEditSex = '2';
    }
    $scope.sexList = [
        { text: "女", value: "2" },
        { text: "男", value: "1" }
    ];

    $scope.sexSelect = function(sexIndex){
        // $sessionStorage.memInfoDetailEdit.sex = sexIndex;
        //保存性别
        $sessionStorage.baSexInsert = sexIndex;
        $state.go('membBasInsert');
    }

});