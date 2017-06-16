app.controller('gdsPropUpdCtrl', ['$scope', '$stateParams', 'comApi', '$state',function($scope,$stateParams,comApi,$state) {
    var oId = $stateParams.oId;
    $scope.gdsPropUpd = {};
    comApi.get("gdsProp/selectGdsPropGrp/"+oId, function(data){
        $scope.gdsPropUpd = data;
        $scope.gdsPropList = data.gdsPropList;
        $scope.gdsPropValList = data.gdsPropList.gdsPropValList;

    })

    //$scope.listSelect = '0';"mustFlg":'1', "valFlg":'1',

    $scope.add=function(){
        var gpsPropObj={
            gdsPropGrpId:'',
            gdsPropNm:'',
            gdsPropValList:[{
                gdsPropId:'',
                gdsPropValNm:'',
                oId:''
            }],
            mustFlg:'1',
            valFlg:'1',
            oId:''
        };
        $scope.gdsPropList.push(gpsPropObj);
    }

    $scope.del=function(idx){
        //if($scope.gdsPropList.length == 1){
        //    comApi.errorMessage('msg.goods.10010');
        //}else{
            $scope.gdsPropList.splice(idx,1);
        //}
    }

    $scope.add2=function(gdsPropValList){
        var obj={
            gdsPropId:'',
            gdsPropValNm:'',
            oId:''
        };
        gdsPropValList.push(obj);
    }

    $scope.dell2=function(gdsPropValList, idx){
        //if(gdsPropValList.length == 1){
        //    comApi.errorMessage('msg.goods.10010');
        //}else{
            gdsPropValList.splice(idx,1);
        //}
    }

    $scope.updateGdsProp = function(){
        $scope.gdsPropUpdCopy = angular.copy($scope.gdsPropUpd);
        for(var i=0; i<$scope.gdsPropUpdCopy.gdsPropList.length; i++) {
            if ($scope.gdsPropUpdCopy.gdsPropList[i].valFlg == '0') {
                $scope.gdsPropUpdCopy.gdsPropList[i].gdsPropValList = [];
            }
        }
        comApi.post("gdsProp/updateGdsPropGrp", $scope.gdsPropUpdCopy, function(data){
            //消息提示
        	comApi.successMessage('msg.goods.10011');
            setTimeout(function() {
                $state.go('app.goods.gdsProp')
            },1000);
        })

    }

}]);