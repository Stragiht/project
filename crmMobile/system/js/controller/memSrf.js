/**
 * Created by lenovo on 2016/5/25.
 */
app.controller('memSrfCtrl', function($scope,comApi){

    $scope.MembBas4App = {
        "pageNum":1,
        "pageSize":3,
        "params":{
            "phone":"",
            "crtdStfNum":"",
            "startTime":'',
            "endTime":''}};


    //搜索会员信息列表
    comApi.post('/membBas/selectMembBas4App', $scope.MembBas4App, function(data){
        //会员列表数据
    });

});