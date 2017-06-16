/**
 *
 * Created by lenovo on 2016/5/26.
 */
app.controller('membOperateMenuCtrl', function($scope,comApi){
    $scope.membRevTsk = {
        "pageNum": 1,
        "pageSize": 50,
        "params": {
            "endTime": '',
            "rtnStat": "",
            "startTime": '',
            "stfNum": ""
        }
    };
    $scope.searchMembRevisitTsk = function(){
        comApi.post('membRevisitTsk/selectMembRevisitTskList4App', $scope.membRevTsk, function(data){
            $scope.membRevTskList = data;
            comApi.myConsoleLog('BA回访任务返回的数据====', data, "====");
        });
    }
});
