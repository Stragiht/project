app.controller('memGrpCtrl', ['$scope', 'comApi', 'NgTableParams', '$sessionStorage', function($scope, comApi, NgTableParams,$sessionStorage) {

	var counts = comApi.getPageCounts();
    var pageNum = 1;
    var pageSize = counts[0];
	
    $scope.searchAllMemGrp = function() {
    	pageNum = 1;
    	pageSize = $sessionStorage.searchAllMemGrpPageSizeCopy > 0 ? angular.copy($sessionStorage.searchAllMemGrpPageSizeCopy) : pageSize;
        comApi.get("membGrp/selectAllMembGrp", function(data){
            $scope.membGrpList = data;
            $scope.membGrpCount = data.length;
            for (var i=0; i<data.length; i++) {
               //定义要给标识，区分编辑和保存
                $scope.membGrpList[i].seFlg = 0;
                //编辑框中的内容
                $scope.membGrpList[i].updateGrpNm = $scope.membGrpList[i].grpNm;
                $scope.membGrpList[i].updateGrpDesc = $scope.membGrpList[i].grpDesc;
            }
            $scope.tableParams = getTableParams(pageNum, pageSize, data, counts);
        });
    };
    
    
    function getTableParams(pageNum, pageSize, data, counts){
    	var arr = comApi.buildTableParams(pageNum, pageSize, data, counts, function(pageIndex, pageCount){
        	pageNum = pageIndex;
	        pageSize = pageCount;
	        $sessionStorage.searchAllMemGrpPageNumCopy = angular.copy(pageIndex);
	        $sessionStorage.searchAllMemGrpPageSizeCopy = angular.copy(pageCount);
        });
    	var tableParams = new NgTableParams(arr[0], arr[1]);
    	return tableParams;
    }
    

    $scope.membGrpInit = function(){
        $scope.membGrpCount = 0;//会员组别数量
        //查询组别会员组别
        $scope.searchAllMemGrp();
    };

    $scope.membGrpInit();

    //编辑
    $scope.updateMemGrp=function(membGrp){

        membGrp.seFlg = 1;
        membGrp.updateGrpNm = membGrp.grpNm;
        membGrp.updateGrpDesc = membGrp.grpDesc;

    };

    //取消编辑
    $scope.cancelUpdateMemGrp=function(membGrp){
        membGrp.seFlg = 0;
        membGrp.updateGrpNm = membGrp.grpNm;
        membGrp.updateGrpDesc = membGrp.grpDesc;
    };


    //保存
    $scope.saveMemGrp=function(memGrp){
        //数据备份
        memGrp.grpNm = memGrp.updateGrpNm;
        memGrp.grpDesc = memGrp.updateGrpDesc;
        $scope.memGrpCopy = angular.copy(memGrp);
        delete $scope.memGrpCopy["seFlg"];
        delete $scope.memGrpCopy["updateGrpNm"];
        delete $scope.memGrpCopy["updateGrpDesc"];

        comApi.post("membGrp/updateMembGrp", $scope.memGrpCopy, function(data){
        	comApi.successMessage('msg.member.10006');
            memGrp.seFlg = 0;
            $scope.searchAllMemGrp();
        })

    };

    //新增
    $scope.insertMemGrp=function(){
        comApi.post("membGrp/insertMembGrp",$scope.insertObj, function(data){
            $scope.insertObj.grpNm = '';
            comApi.successMessage('msg.member.10007');
            $scope.searchAllMemGrp();
        })
    };

    //取消新增
    $scope.cancleInsertMemGrp = function() {
        $scope.insertObj.grpNm = '';
    };

    // 删除会员组别
    $scope.delMemGrp = function(oId){
        comApi.openDelWindow(function(){
            comApi.get("membGrp/deleteMembGrp/"+oId, function(data){
            	comApi.successMessage('msg.member.10008');
                $scope.searchAllMemGrp();
            })
        });
    };
}]);