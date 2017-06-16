app.controller('gdsPropInsertCtrl', ['$scope', 'comApi', '$state', function($scope,comApi,$state) {
    $scope.gdsProGrp = {
        "gdsPropGrpNm":"",
        "gdsPropList":[
            {
                "gdsPropNm":'',
               // "listSelect":'1',  //自定义标识
                "gdsPropValList":[
                    {
                        "gdsPropValNm":''
                    }
                ],
                "mustFlg":'1',
                "valFlg":'1'
            }
        ]
    };

    $scope.listSelect = '1'; //定义一个标识

    $scope.add=function(){
        var gpsPropObj={"gdsPropNm":'',"mustFlg":'1', "valFlg":'1',"gdsPropValList":[{"gdsPropValNm":''}]};
        $scope.gdsProGrp.gdsPropList.push(gpsPropObj);
    }

    $scope.del=function(idx) {
        //if ($scope.gdsProGrp.gdsPropList.length == 1) {
        //    comApi.errorMessage('msg.goods.10010');
        //}else{
            $scope.gdsProGrp.gdsPropList.splice(idx,1);
        //}
    }

    $scope.add2=function(gdsPropValList){
        var obj={gdsPropValNm:''};
        gdsPropValList.push(obj);
    }

    $scope.dell2=function(gdsPropValList, idx){
        //if(gdsPropValList.length == 1){
        //    comApi.errorMessage('msg.goods.10010');
        //}else{
            gdsPropValList.splice(idx,1);
        //}
    }

    $scope.insertGdsProp = function() {
        for(var i=0; i<$scope.gdsProGrp.gdsPropList.length; i++) {
            if ($scope.gdsProGrp.gdsPropList[i].valFlg == '0') {
                $scope.gdsProGrp.gdsPropList[i].gdsPropValList = [];
            }
        }
        comApi.post("gdsProp/insertGdsPropGrp", $scope.gdsProGrp, function(data){
            //消息提示
        	comApi.successMessage('msg.goods.10009');
            setTimeout(function() {
                $state.go('app.goods.gdsProp');
            },1000);
        })
    }

}]);