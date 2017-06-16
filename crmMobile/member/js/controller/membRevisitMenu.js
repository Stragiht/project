/**
 * Created by lenovo on 2016/7/5.
 */
app.controller("membRevisitMenuCtrl", function($scope, comApi, $rootScope, $state){

    //控制底部菜单栏的显示
    var navMenu = comApi.showFooterMenu("membShow", "3");
    $scope.$emit("navMenu.type", navMenu);

    $scope.changeMembRtHomeFlg = function() {
        $rootScope.REVTSK_FLG = false;
        $state.go("membRevisitTsk");
    };

   /* $scope.changHui = function() {
        var oTest = document.getElementById("baTest");
        oTest.style.background = 'yellow';
    };
*/
    $scope.changeMembRecHomeFlg = function() {
        $rootScope.REVREC_FLG = false;
        $state.go("membRevisitRec");
    };

  /*  $scope.release  = function() {
        var oTest = document.getElementById("baTest");
        oTest.style.background = '#fff';
    }*/
});