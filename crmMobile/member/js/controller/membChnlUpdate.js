/**
 * Created by lenovo on 2016/5/25.
 */
app.controller("membChnlUpdateCtrl", function($scope, $sessionStorage,$stateParams,comApi,$state){

        //控制底部菜单栏的显示
        var navMenu = comApi.showFooterMenu("");
        $scope.$emit("navMenu.type", navMenu);

        //来源渠道
        $scope.allChannel = comApi.getAllChnList(0);

        //会员的数据编号
        $scope.curMembNum = $stateParams.membNum;

        if (comApi.isNotNullAndUndefined($sessionStorage.sourceMembChnlUpdate)) {
                $scope.membEditProvChnl = $sessionStorage.sourceMembChnlUpdate;
        } else {
                $scope.membEditProvChnl = $sessionStorage.memInfoDetailEdit.provChnl;
        }

        $scope.chnlSelectSelect = function(chnlCode){
                // $sessionStorage.memInfoDetailEdit.sex = sexIndex;
                //保存性别
                $sessionStorage.sourceMembChnlUpdate = chnlCode;
                $state.go("membInfoUpdate", {membNum: $scope.curMembNum});
        }
});