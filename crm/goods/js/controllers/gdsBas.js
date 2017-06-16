
    app.controller('GdsBasCtrl',['$scope', '$http', 'NgTableParams', 'comApi', '$sessionStorage', 'gdsInfoService', '$stateParams', function($scope,$http,NgTableParams,comApi,$sessionStorage,gdsInfoService,$stateParams){

        $scope.oneAtATime = true;
        $scope.status = {
            open: true
        };
        
        var counts = comApi.getPageCounts();
        var pageNum = 1;
        var pageSize = counts[0];
        var isBack = $stateParams.isBack && ($stateParams.isBack == "true" || $stateParams.isBack == true);

        //定义查询商品规格列表传递的参数
        $scope.selectGdsList = {
            "pageNum": "1",
            "pageSize": "",
            "params": {
                "ftyGdsNum": "",
                "gdsNm": "",
                "gdsSpecDtlNum": "",
                "gdsSpecDtlNm": "",
                "brdId": "",
                "gdsClsId": "",
                "sellFlg": "",
                "chnlNum": "",
                "ifGdsThum": ""
            }
        }

        //获取属性组
        comApi.selectGdsPropGrps();

        //规格渠道
        $scope.chnlList = comApi.getChnlList('IFCOMW0210001',2);
        $scope.selectGdsList.params.chnlNum = $scope.chnlList[0].key;
        //商品品牌
        gdsInfoService.selectGdsBrd(function(){
        	if(!isBack){
        		$scope.gdsBrds = gdsInfoService.getGdsBrd(2);
        		$scope.selectGdsList.params.brdId = $scope.gdsBrds[0].key;
        	}
        });
        //comApi.get("gdsBrd/selectAllGdsBrd", function(data){
        //    $sessionStorage.gdsBrd = data;
        //    $scope.gdsBrds = comApi.getGdsBrd(2);
        //    $scope.selectGdsList.params.brdId = $scope.gdsBrds[0].key;
        //    //$sessionStorage.gdsPropFmt = gdsInfoService.formatGdsPropData();
        //});
        //是否上架
        $scope.sellFlgs = comApi.getSelectBoxDic('C002',2);
        $scope.selectGdsList.params.sellFlg = $scope.sellFlgs[0].key;

        //======================================
        //所属分类
      //  $scope.gdsClsLs = comApi.GetGdsClsList('','', 4);

        //查询对象
        $scope.gdsSearchFilter = {
            "gdsClsId":""	//商品分类ID
        };


        //当前选中的商品分类级数
        $scope.selectedGdsClsLevel = 1;
        //当前选中的商品分类
        $scope.selectedGdsCls = [];
        $scope.gdsClsList = [];

        comApi.selectAllGdsCls();

        $scope.gdsClsList[0] = comApi.GetGdsClsList("", "", "2");
        $scope.selectedGdsCls[0] = $scope.gdsClsList[0][0].key;

        $scope.changeSuperGdsCls = function(index){
            if($scope.selectedGdsCls[index] == "0000"){//全部
                $scope.selectedGdsClsLevel = index+1;
                //$scope.gdsClsInsert.cateLevel = $scope.selectedGdsClsLevel;
                if(index == 0) {//一级分类为全部，则商品分类ID为空
                    $scope.gdsSearchFilter.gdsClsId = "";
                }else{//其它级别，获取上级商品分类ID
                    $scope.gdsSearchFilter.gdsClsId = $scope.selectedGdsCls[index-1];
                }
            }else{//选中其它选项
                $scope.gdsSearchFilter.gdsClsId =  $scope.selectedGdsCls[index];
                //加载下级分类
                if(index < 4) {//限制分类级别最多为五级，1-4级分类时可加载下一级（2-5）分类列表
                    var list = comApi.GetGdsClsList($scope.gdsSearchFilter.gdsClsId, "", "0");
                    if(list && list.length > 0) {
                        $scope.gdsClsList[index + 1] = comApi.GetGdsClsList($scope.gdsSearchFilter.gdsClsId, "", "2");
                        $scope.selectedGdsCls[index + 1] = $scope.gdsClsList[index+1][0].key;
                        $scope.selectedGdsClsLevel = index + 2;
                        //$scope.gdsClsInsert.cateLevel = $scope.selectedGdsClsLevel;
                    }else{//当选择的分类没有下级时，修改选择的级别
                        $scope.selectedGdsClsLevel = index + 1;
                    }
                }
            }
        };

        //分类默认值
       // $scope.selectGdsList.params.gdsClsId = $scope.gdsClsLs[0].key;

        //=============================================

        //设置$scope.gydst的默认值为0
        $scope.gydst = 0;
        $scope.searchGdsInfo = function() {  //$scope.gdsSearchFilter.gdsClsId
        	pageSize = $sessionStorage.selectGdsBasListPageSizeCopy > 0 ? angular.copy($sessionStorage.selectGdsBasListPageSizeCopy) : pageSize;
            if(isBack == true){
            	$scope.selectGdsList = angular.copy($sessionStorage.selectGdsBasListCopy);
            	$scope.gydst = angular.copy($sessionStorage.selectGdsBasListDataLengthCopy);
            	$scope.list= angular.copy($sessionStorage.selectGdsBasListDataCopy);
            	$scope.gdsSearchFilter.gdsClsId = angular.copy($scope.selectGdsList.params.gdsClsId);
            	$scope.gdsBrds = angular.copy($sessionStorage.selectGdsBasListGdsBrdsCopy);
            	$scope.gdsClsList = angular.copy($sessionStorage.selectGdsBasListGdsClsListCopy);
            	$scope.selectedGdsClsLevel = angular.copy($sessionStorage.selectGdsBasListSelectedGdsClsLevelCopy);
            	$scope.selectedGdsCls = angular.copy($sessionStorage.selectGdsBasListSelectedGdsClsCopy);
            	pageNum = $sessionStorage.selectGdsBasListPageNumCopy > 0 ? angular.copy($sessionStorage.selectGdsBasListPageNumCopy) : pageNum;
            	$scope.tableParams = getTableParams(pageNum, pageSize, $scope.list, counts);
            	isBack = false;
            }else{
            	pageNum = 1;
            	$scope.selectGdsList.params.gdsClsId = angular.copy($scope.gdsSearchFilter.gdsClsId);
            	$sessionStorage.selectGdsBasListCopy = angular.copy($scope.selectGdsList);
            	comApi.post('gdsInfo/selectGdsInfo', $scope.selectGdsList, function(data){
            		data = data.data;
            		$scope.gydst=data.length;
            		$scope.list=data;
            		$scope.tableParams = getTableParams(pageNum, pageSize, data, counts);
	                $sessionStorage.selectGdsBasListDataLengthCopy = angular.copy($scope.gydst);
	                $sessionStorage.selectGdsBasListDataCopy = angular.copy($scope.list);
	                $sessionStorage.selectGdsBasListGdsBrdsCopy = angular.copy($scope.gdsBrds);
	                $sessionStorage.selectGdsBasListGdsClsListCopy = angular.copy($scope.gdsClsList);
	                $sessionStorage.selectGdsBasListSelectedGdsClsLevelCopy = angular.copy($scope.selectedGdsClsLevel);
	                $sessionStorage.selectGdsBasListSelectedGdsClsCopy = angular.copy($scope.selectedGdsCls);
            	});
            }
        }

        
        function getTableParams(pageNum, pageSize, data, counts){
        	var arr = comApi.buildTableParams(pageNum, pageSize, data, counts, function(pageIndex, pageCount){
            	pageNum = pageIndex;
    	        pageSize = pageCount;
    	        $sessionStorage.selectGdsBasListPageNumCopy = angular.copy(pageIndex);
    	        $sessionStorage.selectGdsBasListPageSizeCopy = angular.copy(pageCount);
            });
        	var tableParams = new NgTableParams(arr[0], arr[1]);
        	return tableParams;
        }
        
        
        if(isBack == true){
        	$scope.searchGdsInfo();
        }
        
        // 删除商品
        $scope.delGdsBas = function(oId){
            comApi.openDelWindow(function(){
                comApi.get("gdsInfo/deleteGdsSpecDtl/"+oId, function(data){
                    $scope.searchGdsInfo();})
            });
        }

    }]);
