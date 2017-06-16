app.controller('memSelectCtrl', ['$scope', '$http', '$sce', 'NgTableParams', 'comApi', '$stateParams', '$sessionStorage',function ($scope, $http, $sce, NgTableParams,comApi, $stateParams,$sessionStorage) {
    //控制伸展框的打开与闭合
    $scope.oneAtATime = true;
    $scope.status = {
        oneopen: true,
        twoopen: true,
        threeopen: true,
        timeopen: true,
        timesopen: true

    };

    $scope.sce = $sce.trustAsResourceUrl;

    var counts = comApi.getPageCounts();
    var pageNum = 1;
    var pageSize = counts[0];
    var membNum = $stateParams.membNum;

    //定义查看购买明细的参数
    $scope.membBuyDtlRectList =  {
        pageNum:'1',
        pageSize: '',
        params: {
            membNum: membNum
        }
    }

    comApi.get('membBas/selectMembBuyDtlRecCount/'+membNum, function(data){
        $scope.membBuyRec = data;

    })
    comApi.get('membBas/selectByMembNum/'+membNum, function(data){
        $scope.detailsMemb = data; //$sessionStorage.upload
        if ($scope.detailsMemb.membFigure && $scope.detailsMemb.membFigure != null && $scope.detailsMemb.membFigure != "") {
            $scope.detailsMemb.membFigure = $sessionStorage.upload + $scope.detailsMemb.membFigure;
        }
        //计算年龄
        $scope.detailsMemb.actAge = getAge($scope.detailsMemb.birtyday);
        //肌肤类型


        //会员肌肤问题
        $scope.skinProb = valueJud($scope.detailsMemb.membSkinCareNeed.C026);  //肌肤类型
        $scope.skinDem = valueJud($scope.detailsMemb.membSkinCareNeed.C027);   //护肤品需求
        $scope.skinDaily = valueJud($scope.detailsMemb.membSkinCareNeed.C028); //日常护肤需求



    })

    //数据判断
    function valueJud(value) {
        if (value == undefined || value == '' || value == null) {
            value = [];
        }
        /*else if (value.indexOf(',') != -1) {
            value = value.split(',');
        } else {
            value = [];
        }*/
        else {
            value = value.split(',');
        }

        return value;
    }

    //回访记录
    comApi.post('membBas/selectMembRevisitRecListWithReplyList', $scope.membBuyDtlRectList, function(data){
        $scope.membRevisitRecList = data.data;
        //添加回访记录的收缩标识
        for (var i=0; i<$scope.membRevisitRecList.length; i++) {
            if (i == 0) {
                $scope.membRevisitRecList[i].timeopen = true;
            } else {
                $scope.membRevisitRecList[i].timeopen = false;
            }
            $scope.membRevisitRecList[i].shrinkFlg = false;//消息查看收缩标识
            $scope.membRevisitRecList[i].revisitVoice = comApi.str2Arr($scope.membRevisitRecList[i].revisitVoice, true);
            $scope.membRevisitRecList[i].revisitImg = comApi.str2Arr($scope.membRevisitRecList[i].revisitImg, true);
            for (var j=0; j<$scope.membRevisitRecList[i].replyList.length; j++) {

                if (comApi.isNotNullAndUndefined($scope.membRevisitRecList[i].replyList[j].fbkVoice)) {
                    $scope.membRevisitRecList[i].replyList[j].fbkVoice = comApi.getFileServerPath() + $scope.membRevisitRecList[i].replyList[j].fbkVoice;
                }

            }
        }
        comApi.myConsoleLog(angular.toJson($scope.membRevisitRecList)+"====aaaa");
    });


    //查看购买明细列表
    comApi.post('membBas/selectMembBuyDtlRecList', $scope.membBuyDtlRectList, function(data){
    	data = data.data;
    	pageNum = 1;
    	pageSize = $sessionStorage.memSelectPageSizeCopy > 0 ? angular.copy($sessionStorage.memSelectPageSizeCopy) : pageSize;
    	$scope.tableParams = getTableParams(pageNum, pageSize, data, counts);
    });
    
    
    function getTableParams(pageNum, pageSize, data, counts){
    	var arr = comApi.buildTableParams(pageNum, pageSize, data, counts, function(pageIndex, pageCount){
        	pageNum = pageIndex;
	        pageSize = pageCount;
	        $sessionStorage.memSelectPageNumCopy = angular.copy(pageIndex);
	        $sessionStorage.memSelectPageSizeCopy = angular.copy(pageCount);
        });
    	var tableParams = new NgTableParams(arr[0], arr[1]);
    	return tableParams;
    }
    
    

    //控制回复框打开、收缩
    $scope.openRep = function(flg,index) {
        $scope.membRevisitRecList[index].shrinkFlg = !flg;
    };


    //根据时间戳计算年龄
    function getAge(timeStamp) {
    	if(!timeStamp || timeStamp == 0){
    		return;
    	}
        var now = new Date().getTime();
        var hours = (now - timeStamp)/1000/60/60;
        return  Math.floor(hours / (24 * 30 * 12));
    }
}]);