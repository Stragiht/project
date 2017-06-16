/**
 * Created by 朱艳春 on 2016-4-20.
 */


 app.controller("prmnDemnRuleInsert", function ($scope, $http,$state,$stateParams,NgTableParams,$location,comApi,toaster) {
	 $scope.reason = {};
	 $scope.isFlag = "D001";
	 //加载判断依据
	 $scope.jgmBas= comApi.getSelectBoxDic("C016",0);
	 $scope.reason.jgmBas = $scope.jgmBas[0].key;
	 //加载职位等级
	 comApi.get('PrmnDemnRuleManage/levelSelect',function(data){
		 $scope.assPos = data;
		//默认第一项被选中
		$scope.posNum=$scope.assPos[0].posNum;
	 });
		//加载应用于职位等级表格
		 $scope.selectPos = function(){
				comApi.post('PrmnDemnRuleManage/levelTableSelect', {posNum:$scope.posNum},
					 function(data) {
						$scope.datas = data;
					});
			}	
	$scope.clear=function (){
	  $scope.datas=[];
	}
	// 单选框单击事件
	$scope.shows = function(typeCode) {
		if (typeCode == 2) {
			$scope.visible1 = false;
			$scope.visible2 = true;
			} else {
				$scope.visible1 = true;
				$scope.visible2 = false;
			}
		}
	//提交保存
	var count=0;
	var count1=0;
	$scope.saveRule = function(valid){
	//提交时进行信息验证
	  if($scope.datas==null || $scope.datas==undefined || $scope.datas==''){
        comApi.HintMessage( ["error","等级信息"], "错误", "msg.common.00014",0, "");
        return;
      }
	  if($scope.datas.length>0){
	    for(var i=0;i<$scope.datas.length;i++){
	    	if($scope.datas[i].lstPhaSaleAmt=="0"){
	    		count = count+1;
	    	}
	    	if($scope.datas[i].avgOfLst3PhaSaleAmt=="0"){
	    		count1 = count1+1;
	    	}
	    	if(count<=0){
    			comApi.HintMessage( ["error",""], "错误", "msg.common.10050",0, "");
	            return;
    		}
	    	if(count1<=0){
    			comApi.HintMessage( ["error",""], "错误", "msg.common.10050",0, "");
	            return;
    		}
	      if(typeof($scope.datas[i].lstPhaSaleAmt)=="undefined"){
            comApi.HintMessage( ["error","判断规则1"], "错误", "msg.common.00014",0, "");
            return;
          }
	      if(typeof($scope.datas[i].avgOfLst3PhaSaleAmt)=="undefined"){
	          comApi.HintMessage( ["error","判断规则2"], "错误", "msg.common.00014",0, "");
	          return;
	        }
	    }
	    
	  }
	  if($scope.isFlag==null || $scope.isFlag==undefined || $scope.isFlag==''){
        comApi.HintMessage( ["error","是否启用"], "错误", "msg.common.00034",0, "");
        return;
      }
		comApi.post('PrmnDemnRuleManage/insertPrmnDemnRule', {
			ruleObject:$scope.datas,assPos:$scope.posNum,jgmBas:$scope.reason.jgmBas,ruleNm:$scope.ruleNm,enableFlg:$scope.isFlag},
				 function(data) {
    			  comApi.HintMessage( ["success","人员升降级规则"], "提示", "msg.common.00023",3000, "");  
                  $state.go("app.staff.prmnDemnRuleManage");
		});
	}
    
 })
