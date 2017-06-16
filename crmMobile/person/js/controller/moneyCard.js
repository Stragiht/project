/**
 * Created By zhaoq
 */
app.controller('moneyCardCtrl', function ($scope,$http,$sessionStorage,$ionicPopup,$state,comApi,$timeout) {
	
	var navMenu = comApi.showFooterMenu("");
	$scope.$emit('navMenu.type', navMenu); 
	
	//编辑页面对象初始化
	$scope.moneyCard={};
    //初始化时工资卡编辑页面展开,银行卡名称列表不展开
    $scope.moneyCardFormShow=true;
    $scope.moneyCardSelect=false;
    // 初始化
    $scope.init = function() {
      // 取得银行卡名称列表
      comApi.getSelectBoxDic("C010", 0).then(function(data) {
        $scope.dicList = data;
      });
  	  //取得登录用户员工编号
      var userId = $sessionStorage.userId;
      comApi.post("MoneyCard/moneyCardInit",{userId:userId},function(data){
    	  //初始化赋值
    	  $scope.moneyCard.cardNameDis=data.cardNameDis;
    	  if(data.cardNo != null && data.cardNo != '') {
    	    $scope.moneyCard.cardNo=parseInt(data.cardNo);
    	  }
    	  //做排他
    	  $scope.moneyCard.updtTm=data.updtTm;
    	  //给银行卡名选择列表赋值
    	  $scope.moneyCard.cardName=data.dtlNum;
      });
    }
    //执行初始化方法
    $scope.init();
    //从银行卡名称选择列表页面返回工资卡编辑页面
    $scope.goBack=function(){
        $scope.moneyCardFormShow=true;
        $scope.moneyCardSelect=false;
    }
    //点击银行卡名称
    $scope.moneyCardChoose=function(){
        $scope.moneyCardFormShow=false;
        $scope.moneyCardSelect=true;
    }
    //选定银行卡名称
    $scope.clickmoneyCard = function(dic) {
      $scope.moneyCard.cardNameDis = dic.text;
      $scope.goBack();
    };
    // 从工资卡编辑页面返回到个人中心页面
    $scope.goFrontPage = function() {
      var confirmPopup = $ionicPopup.confirm({
        title : '提示',
        template : '确定要放弃此次编辑？',
        okText : '确定',
        cancelText : '取消'
      });
      confirmPopup.then(function(res) {
        if (res) {
          $state.go("personalCenter");
        }
      });
    };
//    // 判断是否为空
//    $scope.isEmpty = function(str) {
//      if (str == "" || str == null || str == undefined) {
//        return true;
//      } else {
//        return false;
//      }
//    };
//    //验证表单
//    $scope.checkForm=function(){
//    if ($scope.isEmpty($scope.moneyCard.cardNo)) {
//        comApi
//            .showMessage([ "error", "银行卡号码" ], "msg.common.10002", 3000);
//        return false;
//      }else{
//    	   return true;
//      }
//    }
    //保存
    $scope.save=function(){
    	//取得登录用户员工编号
        var userId = $sessionStorage.userId;
        //往对象里添加数据
        $scope.moneyCard.userId=userId;
//        if($scope.checkForm()){
        comApi.post("MoneyCard/updatemoneyCard", $scope.moneyCard,
                 function(data) {
        	if(data==1){
        		// 弹出提示消息
        		comApi.showMessage("success", "msg.common.10001", 3000);
        		// 3秒后跳转
        		$timeout(function() {
        			// 跳转到个人中心页面
        			$state.go("personalCenter");
        		}, 3000);
        	}
       });
       }
//    }
});