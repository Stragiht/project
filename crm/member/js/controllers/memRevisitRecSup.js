app.controller('memRevisitRecSupCtrl', ['$scope','NgTableParams', 'comApi','$filter','$stateParams','$state', '$modal',
    function($scope, NgTableParams, comApi, $filter, $stateParams, $state, $modal) {

        //定义补录会员回访记录的参数
        $scope.memRevisitRecSupList = [
            {
                membNum:'',
                revisitCont:'',
                revisitTm:'',
                stfNum:''
            }
        ]

        //人员弹窗
        $scope.openMemRev = function(index,size) {
            var modalInstance = $modal.open({
                templateUrl : 'radiostaff.html',
                controller : 'radioStaffController',
                size : size,
                resolve : {
                    //传递你的flag(1:不需要权限查询全部数据,2：需要权限查询部分数据)
                    flag : function() {
                        return 2;
                    },
                    //配置需要注入JS
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) { return $ocLazyLoad.load(['common/js/controllers/radiostaff.js']);}]
                }

            });

            //父子传递参数
            modalInstance.result.then(function(selectedItem) {
            	if(selectedItem && selectedItem != null && selectedItem.length > 0 && selectedItem[0] != null){
            		$scope.memRevisitRecSupList[index].stfNumNm = selectedItem[0].stfNum+"."+selectedItem[0].stfNm;
            		$scope.memRevisitRecSupList[index].stfNum = selectedItem[0].stfNum;
            	}else{
            		$scope.memRevisitRecSupList[index].stfNumNm = "";
            		$scope.memRevisitRecSupList[index].stfNum = null;
            	}
            });
        };

        //会员弹窗
        $scope.openSelMemb = function(size) {
            var modalInstance = $modal.open({
                templateUrl : 'memRadioSelect.html',
                controller : 'memRadioSelectController',
                size : size,
                resolve : {
                    //传递你的flag(1:不需要权限查询全部数据,2：需要权限查询部分数据)
                    flag : function() {
                        return 2;
                    },
                    //配置需要注入JS
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) { return $ocLazyLoad.load(['common/js/controllers/memRadioSelect.js']);}]
                }

            });

            //父子传递参数
            modalInstance.result.then(function(selectedItem) {
            	if(selectedItem && selectedItem != null && selectedItem.length > 0 && selectedItem[0] != null){
	                $scope.memNumNm = selectedItem[0].membNum+"."+selectedItem[0].membNm;
	                $scope.memNum = selectedItem[0].membNum;
            	}else{
            		$scope.memNumNm = "";
	                $scope.memNum = null;
            	}
            });
        };

        // 获取某个时间格式的时间戳
        function timeToStamp(dataStr) {
            //var timestamp = Date.parse(new Date(dataStr));
          //  timestamp = timestamp;
            //console.log(timestamp)
            return  Date.parse(new Date(dataStr));
        }



        //添加
        $scope.addMemRevRecSup=function(){
            var obj={membNum:'',revisitCont:'',revisitTm:'',stfNum:''};
            $scope.memRevisitRecSupList.push(obj);

        }

        //删除
        $scope.del=function(idx){
            $scope.memRevisitRecSupList.splice(idx,1);
        }

        $scope.memRevRecSupSub = function() {

            //备份提交的数据
            $scope.memRevSub = angular.copy($scope.memRevisitRecSupList);
            for (var i=0; i<$scope.memRevSub.length; i++) {
                $scope.memRevSub[i].membNum = $scope.memNum;
                delete $scope.memRevSub[i]["stfNumNm"];
                $scope.memRevSub[i].revisitTm = timeToStamp($scope.memRevSub[i].revisitTm);
            }
            comApi.post('membRevisitRec/insertMembRevisitRecByWebMakesUp', $scope.memRevSub, function(data){
            	comApi.successMessage('msg.member.10012');
                setTimeout(function() {
                    $state.go('app.member.memRevisitRecSupSucc');
                },1000);
            })
        }
}]);