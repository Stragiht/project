/**
 * Created by lenovo on 2016/5/26.
 */
app.controller("membChnlInsertCtrl", function($scope, $sessionStorage, $stateParams, comApi, $state){

    //控制底部菜单栏的显示
    var navMenu = comApi.showFooterMenu("");
    $scope.$emit("navMenu.type", navMenu);

    //来源渠道
    $scope.allChannel = comApi.getAllChnList(0);

    //会员的数据编号
    $scope.curMemIndex = $stateParams.memIndex;

    if (comApi.isNotNullAndUndefined($sessionStorage.sourceMembChnlInsert)) {
        $scope.membInsertProvChnl = $sessionStorage.sourceMembChnlInsert;
    } /*else {
     $scope.membEditProvChnl = $sessionStorage.memInfoDetailEdit.provChnl;
     }*/

    $scope.chnlSelectSelect = function(chnlCode){
        // $sessionStorage.memInfoDetailEdit.sex = sexIndex;
        //保存性别
        $sessionStorage.sourceMembChnlInsert = chnlCode;
        $state.go("membBasInsert");
    }
});