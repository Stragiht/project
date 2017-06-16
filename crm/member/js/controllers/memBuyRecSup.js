
app.controller('memBuyRecSupCon', ['$scope','NgTableParams', 'comApi','$filter','$stateParams','$state','$modal',
        function($scope, NgTableParams, comApi, $filter, $stateParams, $state, $modal) {

    //$scope.membBuyDtlRectList=[{c:'比度克拔毒膏',d:'99.89',e:'8',f:'189.89',stfNums:'',storeNums:''}]
    //向画面注入的会员购买记录
    $scope.membBuyDtlRectList=[];
    //向后台传入的补录会员购买记录
    //$scope.membBuyDtlRect=[];
    //购买会员
    $scope.membInfo={membNum:'',membNm:'', membInfo:''};

    $scope.del=function(idx){
        $scope.membBuyDtlRectList.splice(idx,1);
    }

    //选择会员模态窗口
    $scope.openMemRadioSelect = function(size){
        comApi.openMemRadioSelect(size, 2, function(selectedItem) {
            //获取选择的会员
            if(selectedItem && selectedItem.length > 0) {
                $scope.membInfo.membNum = selectedItem[0].membNum;
                $scope.membInfo.membNm = selectedItem[0].membNum;
                $scope.membInfo.membInfo = selectedItem[0].membNum+"."+selectedItem[0].membNm;
            }else{
            	 $scope.membInfo.membNum = null;
                 $scope.membInfo.membNm = null;
                 $scope.membInfo.membInfo = null;
            }
        });
    }

    //选择商品模态窗口
    $scope.openGdsMultiSelec= function(size){
        comApi.openGdsMultiSelect(size, 1, function(selectedItem) {
            //获取选择的商品
            if(selectedItem && selectedItem.length > 0) {
                for(var i = 0; i < selectedItem.length; i++){
                    var buDtlRect = {};
                    //商品规格详细编号
                    buDtlRect.buyGdsSpecDtlNum = selectedItem[i].gdsSpecDtlNum;
                    //商品规格详细名称
                    buDtlRect.buyGdsSpecDtlNm = selectedItem[i].gdsSpecDtlNm;
                    //商品市场售价
                    buDtlRect.buyGdsCurPc = selectedItem[i].curPc;
                    //商品数量
                    buDtlRect.gdsQty = "";
                    //实收金额
                    buDtlRect.gdsAmt = "";
                    //服务人员编号
                    buDtlRect.stfNum = "";
                    //服务人员姓名
                    buDtlRect.stfNm = "";
                    //界面中显示的服务人员信息 如:s000001.吕晓亮
                    buDtlRect.stfInfo = "";
                    //购买门店编号
                    buDtlRect.buyStrNum = "";
                    //购买门店名称
                    buDtlRect.buyStrNm = "";
                    //画面中显示的门店信息 如str001.GZ天河店
                    buDtlRect.buyStrInfo = "";
                    //购买时间
                    buDtlRect.buyTm = "";


                    $scope.membBuyDtlRectList.push(buDtlRect);
                }

            }
        });
    }

    //选择门店模态窗口
    $scope.openStore = function(index, size) {
        var modalInstance = $modal.open({
            templateUrl : 'radiostore.html',
            controller :'radioStoreController',
            size : size,
            resolve : {
                //传递你的flag(1:不需要权限查询全部数据,2：需要权限查询部分数据)
                flag : function() {
                    return 1;
                },
                //配置需要注入JS
                deps: ['$ocLazyLoad', function ($ocLazyLoad) { return $ocLazyLoad.load(['common/js/controllers/radiostore.js']);}]
            }

        });
        //父子传递参数
        modalInstance.result.then(function(selectedItem) {
            if(selectedItem && selectedItem.length > 0 && selectedItem[0] != null) {
                //购买门店编号
                $scope.membBuyDtlRectList[index].buyStrNum = selectedItem[0].strNum;
                //购买门店名称
                $scope.membBuyDtlRectList[index].buyStrNm = selectedItem[0].strNm;
                //画面中显示的门店信息 如str001.GZ天河店
                $scope.membBuyDtlRectList[index].buyStrInfo = selectedItem[0].strNum + "." + selectedItem[0].strNm;
            }else{
            	 $scope.membBuyDtlRectList[index].buyStrNum = null;
                 //购买门店名称
                 $scope.membBuyDtlRectList[index].buyStrNm = "";
                 //画面中显示的门店信息 如str001.GZ天河店
                 $scope.membBuyDtlRectList[index].buyStrInfo = "";
            }
        });
    };


    //选择人员模态窗口
    $scope.openRadioStaff = function(index, size) {
        comApi.openRadioStaff(size, 2, function(selectedItem) {
            if(selectedItem && selectedItem.length > 0 && selectedItem[0] != null) {
                //服务人员编号
                $scope.membBuyDtlRectList[index].stfNum = selectedItem[0].stfNum;
                //服务人员姓名
                $scope.membBuyDtlRectList[index].stfNm = selectedItem[0].stfNm;
                //界面中显示的服务人员信息 如:s000001.吕晓亮
                $scope.membBuyDtlRectList[index].stfInfo = selectedItem[0].stfNum + "." + selectedItem[0].stfNm;
            }else{
            	//服务人员编号
                $scope.membBuyDtlRectList[index].stfNum = null;
                //服务人员姓名
                $scope.membBuyDtlRectList[index].stfNm = "";
                //界面中显示的服务人员信息 如:s000001.吕晓亮
                $scope.membBuyDtlRectList[index].stfInfo = "";
            }
        });
    };

    //转换画面数据到json对象
    $scope.getMembBuyDtlRect = function(rectList){

        var membBuyDtlRectList = [];

        if(!rectList || rectList.length <= 0){
           return null;
        }

        for(var i = 0; i < rectList.length; i++){
            var membBuyDtlRect = {
                buyGdsSpecDtlNum:'',
                buyStrNum:'',
                buyTm:'',
                gdsAmt:'',
                gdsQty:'',
                membNum:'',
                stfNum:''
            };
            membBuyDtlRect.buyGdsSpecDtlNum = rectList[i].buyGdsSpecDtlNum;
            membBuyDtlRect.buyStrNum = rectList[i].buyStrNum;
            membBuyDtlRect.buyTm = comApi.timeToTimestamp(comApi.angularDateFor(rectList[i].buyTm));
            membBuyDtlRect.gdsAmt = rectList[i].gdsAmt;
            membBuyDtlRect.gdsQty = rectList[i].gdsQty;
            membBuyDtlRect.membNum =$scope.membInfo.membNum;
            membBuyDtlRect.stfNum = rectList[i].stfNum;
            membBuyDtlRectList.push(membBuyDtlRect);
        }
        return membBuyDtlRectList;
    }

    //提交补录的会员购买记录
     $scope.saveMembBuyDtlRect = function(){
         //转换画面数据到json对象
         var membBuyDtlRectList = $scope.getMembBuyDtlRect($scope.membBuyDtlRectList);
         if(membBuyDtlRectList && membBuyDtlRectList != null) {
             comApi.post("membBuyDtlRec/insertMembBuyDtlRecByMakesUp", membBuyDtlRectList, function (data) {
                 $state.go("app.member.memBuyRecSupSucc");
             });
         }else{
             comApi.errorMessage("msg.member.10002");
         }

     }
     

}]);