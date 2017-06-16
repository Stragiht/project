app.controller('memRtnItemCtrl', ['$scope', 'comApi', '$state',function($scope,comApi,$state) {

    //定义回访事项
    $scope.memRtnItemlist=[
        /*{mil:''}*/
    ];

    $scope.add1=function(){
        var obj = {mil:''};
        $scope.memRtnItemlist.push(obj);
    };

    $scope.del1=function(idx){
        $scope.memRtnItemlist.splice(idx,1);
    };

    //数据初始化
    $scope.initMemRtnItem = function() {
        comApi.get('membRtnRule/selectAllMembRtnRuleRtnCont', function(data) {
            for (var i=0; i<data.length; i++) {
                $scope.memRtnItemlist.push({mil:data[i]});
            }
        })

    }

    $scope.initMemRtnItem();

    $scope.memRtnItemSub = function() {
        //提交的数据
        $scope.memRtnItemlistSub = [];
        //$scope.memRtnItemlist = ['是否使用咨询','培训使用祛痘产品','祛痘效果咨询','产品满意度咨询'];
        for (var i=0; i<$scope.memRtnItemlist.length; i++) {
            $scope.memRtnItemlistSub[i] = $scope.memRtnItemlist[i].mil;
        }
        comApi.post('/membRtnRule/saveMembRtnRuleRtnCont',$scope.memRtnItemlistSub,function(data) {
        	comApi.successMessage('msg.member.10013');
            setTimeout(function() {
                $state.go('app.member.memRtnRule');
            },1000);
        } )
    }

}]);