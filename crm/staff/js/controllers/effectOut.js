app.controller("effectOutController", function($scope, $modal, NgTableParams,
		$location, $stateParams, $state, $log, comApi, toaster, $modalInstance,$filter) {


	
	//初始化是被选中
    $scope.poiSetFlg=1;
	 var AttDays;//档期间隔天数
	 var workend=0;//不要出勤出勤天数,日期多选时赋值
	 var retunlist=[];
	// 初始化档期组
	 Date.prototype.Format = function (fmt) { //author: meizz 
         var o = {
                 "M+": this.getMonth() + 1, //月份 
                 "d+": this.getDate(), //日 
                 "h+": this.getHours(), //小时 
                 "m+": this.getMinutes(), //分 
                 "s+": this.getSeconds(), //秒 
                 "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
                 "S": this.getMilliseconds() //毫秒 
         };
         if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
         for (var k in o)
             if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
         return fmt;
     }
	var time = new Date().Format("yyyy-MM-dd");
    $scope.phaGrpOidList = comApi.getSelectBoxPhaGrp("0");
    for(var j=0;j<$scope.phaGrpOidList.length;j++){
    	$scope.phaGrpOid=$scope.phaGrpOidList[j].key;
    	$scope.phaIdList = comApi.getSelectBoxPhase($scope.phaGrpOid, "0");
    	for(var i=0;i<$scope.phaIdList.length;i++){
    		if(new Date(time)<=new Date($scope.phaIdList[i].phaStartTm)){
    			if($scope.phaIdList.length>0){
    				var map = new Map();
                    map.put("key", $scope.phaGrpOidList[j].key);
                    map.put("text", $scope.phaGrpOidList[j].text);
                    retunlist.push(map.entrySet);
                    break;
    			}
                
            }
    	}
    }
    $scope.phaGrpOid=$scope.phaGrpOidList[0].key;
    initPhase($scope.phaGrpOid);
    function initPhase(phaGrpOid){ 
        //清空刷新档期组
        $scope.phaGrpOid="";
        $scope.phaGrpOid=phaGrpOid;
        //清空刷新档期集合
        $scope.phaIdList=[];
        $scope.phaIdList = comApi.getSelectBoxPhase(phaGrpOid, "0");
        var retumlist=[];
        for(var i=0;i<$scope.phaIdList.length;i++){
            if(new Date(time)<=new Date($scope.phaIdList[i].phaStartTm)){
                var map = new Map();
                map.put("key", $scope.phaIdList[i].key);
                map.put("text", $scope.phaIdList[i].text);
                retumlist.push(map.entrySet);
            }
        }
        $scope.phaIdList=retumlist;
        $scope.phaGrpOidList=retunlist;
        if($scope.phaIdList.length==0){
            $scope.phaId="";
        }else{
            //清空刷新档期
            $scope.phaId="";
            $scope.phaId=retumlist[0].key;
        }
    }

    // 档期组变更重新取得档期列表
    $scope.changePhaGrpOid = function(phaGrpOid) {
        initPhase(phaGrpOid);
    };
    $scope.changephaId=function(phaId){
        //清空刷新档期
        $scope.phaId="";
        $scope.phaId=phaId;
    }
	//隐藏或显示等级
    $scope.showorhide=function(flag){
    if(flag==1){
        angular.element("#phaGrp").show();
        // 初始化档期组
        $scope.phaGrpOidList = comApi.getSelectBoxPhaGrp("0");
        $scope.phaGrpOid=$scope.phaGrpOidList[0].key;
        initPhase($scope.phaGrpOid);
        $scope.poiSetFlg=1;
    //如果编辑时选择不生效,然后提交保存
    }else if(flag==0){
        angular.element("#phaGrp").hide();
        //清空档期组
        $scope.phaGrpOid="";
        //清空刷新档期
        $scope.phaId="";
        $scope.poiSetFlg=0;
      }
    }
    
    
    /**
     * 确定按钮
     */
    $scope.ok = function() {

        /**
         * 向父页面传递参数
         */
          $scope.Babas = {};
          $scope.Babas.phaGrpOid=$scope.phaGrpOid;
          $scope.Babas.phaId=$scope.phaId;
          if($scope.poiSetFlg == "1"){
            if(""==$scope.Babas.phaId||undefined==$scope.Babas.phaId||"null"==$scope.Babas.phaId){
              comApi.HintMessage( ["error","档期"], "错误", "msg.common.00034",0, "");    
              return;
            }
          }
          $scope.Babas.poiSetFlg=$scope.poiSetFlg;
          $modalInstance.close($scope.Babas);
        
    };
	/**
	 * 
	 * 关闭当前子画面
	 * 
	 * 
	 */
	$scope.cancel = function() {
		$modalInstance.dismiss();
	};
});
