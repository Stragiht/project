/**
 * Created by Fupenglu on 2016-3-15.
 * 人员信息详情画面
 */
app.controller('stfInfoCtrl', function ($scope, $http, $location,$sessionStorage,$ionicPopup,$stateParams,comApi) {
	
	var navMenu = comApi.showFooterMenu("");
	$scope.$emit('navMenu.type', navMenu); 
	
    //初始化方法
	$scope.init = function(){
		
		//初始化变量
		var stfNum = $stateParams.stfNum;
		//人员信息详情
		$scope.stfInfo = {};
		//上级集合
		$scope.superItems = [];
		//职位集合
		$scope.strItems = [];

		comApi.get( 'staff/mobileStfInfo/'+stfNum,function(data){
            if(data.length > 0){
                $scope.stfInfo = data[0];

                //上级领导做成
                var tempSupers = $scope.stfInfo.superStfNm.split(",");
                if(tempSupers.length > 1){
                    for(var i = 1 ; i<tempSupers.length;i++ ){
                        var tempArray = tempSupers[i].split(":");
                        if(tempArray.length > 1){
                            $scope.superItems.push({posNm:tempArray[0],stfNm:tempArray[1]});
                        }
                    }
                }
                //门店集合做成
                if($scope.stfInfo.strNm != "" && $scope.stfInfo.strNm != null && $scope.stfInfo.strNm != undefined){
                    var tempStrs = $scope.stfInfo.strNm.split(",");
                    if(tempStrs.length > 0){
                        for(var i = 0 ; i<tempStrs.length;i++ ){
                            $scope.strItems.push({strNm:tempStrs[i]});
                        }
                    }
                }
            }
        });

		//取得地区

	}

	//调用页面初始化
	$scope.init();

});