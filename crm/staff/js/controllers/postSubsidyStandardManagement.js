app.controller('ZwbzbzglCtrl', ['toaster','$stateParams','$scope','NgTableParams','comApi','$state', function(toaster,$stateParams,$scope,NgTableParams,comApi,$state) {
    //一览
    comApi.get("pssm/pssmSelect",function(data){
        $scope.pssmdata = data;
        $scope.countfalg=data.length;
    });
    //删除
    $scope.del = function(rulenm,index) {
      comApi.openDelWindow(function(){
          comApi.post("pssm/deletePssm",{ruleNm:rulenm},function(data){
              $scope.pssmdata.splice(index,1);
              $scope.countfalg=$scope.pssmdata.length;
          });
      })
    };
}]);
