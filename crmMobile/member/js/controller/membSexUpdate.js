/**
 * Created by lenovo on 2016/5/25.
 */
app.controller('membSexUpdateCtrl', function($scope, $sessionStorage, $stateParams, comApi, $state){

    //控制底部菜单栏的显示
    var navMenu = comApi.showFooterMenu("");
    $scope.$emit('navMenu.type', navMenu);

    //会员的数据编号
    $scope.curMembNum = $stateParams.membNum;
    /*if ($sessionStorage.baSexUpdate == '' || $sessionStorage.baSexUpdate == null || $sessionStorage.baSexUpdate == undefined) {
        $scope.membEditSex = $sessionStorage.memInfoDetailEdit.sex;
    } else {
        $scope.membEditSex = $sessionStorage.baSexUpdate;
    }*/

    if (comApi.isNotNullAndUndefined($sessionStorage.baSexUpdate)){
        $scope.membEditSex = $sessionStorage.baSexUpdate;
    } else {
        $scope.membEditSex = $sessionStorage.memInfoDetailEdit.sex;
    }

    $scope.sexList = [
        { text: "女", value: "2" },
        { text: "男", value: "1" }
    ];

    $scope.sexSelect = function(sexIndex){
        // $sessionStorage.memInfoDetailEdit.sex = sexIndex;
        //保存性别
        $sessionStorage.baSexUpdate = sexIndex;
        $state.go('membInfoUpdate', {membNum: $scope.curMembNum});
    }

});