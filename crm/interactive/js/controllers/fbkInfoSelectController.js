/**
 * Created by 单颖 on 2016-3-13.
 */
app.controller('fbkInfoSelectController',function ($scope,$http,comApi,$state) {
    
    //网站意见反馈一览初始化
    comApi.get('FbkInfo/fbkInfoSelect',function(data){
        $scope.data = data;
    });
    //点击处理跳转页面
    $scope.fbkInfoUpdate = function(oid){
        $state.go("app.interactive.fbkInfoUpdate",{oid:oid});
    }
    
    
    
});