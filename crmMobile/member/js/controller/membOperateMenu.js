/**
 *
 * Created by lenovo on 2016/5/26.
 */
app.controller('membOperateMenuCtrl', function($scope, comApi, $rootScope){

    //控制底部菜单栏的显示
    var navMenu = comApi.showFooterMenu("membShow", "2");
    $scope.$emit("navMenu.type", navMenu);

    $scope.membRevTsk = {
        "pageNum": 1,
        "pageSize": "",
        "params": {
            "endTime": "",
            "rtnStat": "",
            "startTime": "",
            "stfNum": ""
        }
    };

    $scope.changeMembFlg = function() {
        $rootScope.ADDMEMB_FLG = false;
    };

    $scope.searchMembRevisitTsk = function(){
        comApi.post("membRevisitTsk/selectMembRevisitTskList4App", $scope.membRevTsk, function(data){
            $scope.membRevTskList = data;
            comApi.myConsoleLog("BA回访任务返回的数据====", data, "====");
        });
    }
});
