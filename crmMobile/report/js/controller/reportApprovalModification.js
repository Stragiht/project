app.controller('reportApprovalModificationCtrl', ['$timeout','comApi','$scope','$state', '$filter','$http', '$location','$sessionStorage','$ionicPopup','$stateParams','comApi',function ($timeout,comApi,$scope,$state,$filter, $http, $location,$sessionStorage,$ionicPopup,$stateParams,comApi) {
   
	var navMenu = comApi.showFooterMenu("");
	$scope.$emit('navMenu.type', navMenu); 
	
	$scope.a=[];
    $scope.datelist=[]; 
    $scope.achievements = [];
    //初始化方法
	$scope.init = function(){
	  $scope.flag = "1";
	//初始化条件查询列表
      comApi.get("repAppl/selectUpdateRepApplMobile/" + $stateParams.repApplNum, function(data) {
        $scope.stfList = data.details[0];
        for(var i=0;i<data.relevantPersonnel.length;i++){
          var list=[];
          for(var k=0;k<data.xiugaimingxi.length;k++){
            if(data.relevantPersonnel[i].apprStfNum == data.xiugaimingxi[k].apprStfNum && data.relevantPersonnel[i].repApplNum == data.xiugaimingxi[k].repApplId){
              var adjustAmt = 0;
              if (data.xiugaimingxi[k].adjustType == '1') {
                adjustAmt = data.xiugaimingxi[k].adjustAmt;
              } else {
                adjustAmt = data.xiugaimingxi[k].adjustAmt * -1;
              }
              list.push({
                adjustAmt : adjustAmt,
                adjustDate : data.xiugaimingxi[k].adjustDate,
                adjustType : data.xiugaimingxi[k].adjustType,
                dicNm :  data.xiugaimingxi[k].dicNm,
                apprStfNum : data.xiugaimingxi[k].apprStfNum,
                oId : data.xiugaimingxi[k].oId,
                repApplId : data.xiugaimingxi[k].repApplId
              })
            }
          }
          if(list.length=="0"){
            list.push({
              adjustAmt:"",
              adjustDate:"",
              adjustType:"",
              apprStfNum:"",
              oId:"",
              repApplId:""
            })
          }
          $scope.achievements.push({
            stfNm : data.relevantPersonnel[i].stfNm,
            phone : data.relevantPersonnel[i].phone,
            repApplNum : data.relevantPersonnel[i].repApplNum,
            apprStfNum : data.relevantPersonnel[i].apprStfNum,
            stfRepSaleAmt : data.relevantPersonnel[i].stfRepSaleAmt,
            updtTm : data.details[0].updtTm,
            yejis:list
          })
        }
      });
	}
	//调用页面初始化
	$scope.init();
	// 返回前页面
    $scope.goFrontPage = function() {
      var confirmPopup = $ionicPopup.confirm({
        title : '提示',
        template : '确定要放弃此次编辑？',
        okText : '确定',
        cancelText : '取消'

      });
      confirmPopup.then(function(res) {
        if (res) {
          $state.go("reportApprovalDetails", {
            applNum : $stateParams.repApplNum
          });
        }
      });
    };
    //增加/减少
    $scope.add = function(index){
      $scope.flag = "2";
      $scope.index = index;
      
      comApi.get("repAppl/selectType", function(data) {
        $scope.leixings = data;
      });
    }
    //增加/
    $scope.zengjia = function(index,str,dtlNum){
      $scope.flag = "4";
      if(str != ""){
        $scope.zengjiajianshao = str;
        $scope.zengjiajianshaoKey = dtlNum;
      }
    }
    //增加/减少业绩页面切换至到具体时间页面
    $scope.jutishijian = function(index,apprStfNum){
      $scope.flag = "3";
      $scope.time = index;
      //获取该人员上报销售业绩的时间
      comApi.get("repAppl/selectTime/" + apprStfNum + "/" + $scope.stfList.repApprStartDt + "/" + $scope.stfList.repApprEndDt + "/" + $scope.stfList.strNum, function(data) {
        for(var i=0;i<data.length;i++){
          data[i].billOfLandTm = $filter("date")(data[i].billOfLandTm,'yyyy-MM-dd')
        }
        $scope.datelist = data;
      });
      
    }
    //保存/提交
    $scope.preservation=function(flag){
      //如果是提交的时候，校验比对结果是否正确
      if (flag == 'Submit') {
        var fcSaleAmt = $scope.stfList.fcImpSaleAmt;
        var stfSaleAmt = $scope.stfList.stfRepSaleAmtSum;
        for (var i = 0; i < $scope.achievements.length; i++) {
          for (var j = 0; j < $scope.achievements[i].yejis.length; j++) {
            stfSaleAmt = stfSaleAmt + $scope.achievements[i].yejis[j].adjustAmt;
          }
        }
        //修改后的人员提交总销售数据大于财务导入销售数据的时候，提示错误消息
        if (stfSaleAmt > fcSaleAmt) {
          //显示错误消息
          comApi.showMessage("error", "msg.common.10018", 3000);
          return;
        }
      }
      var list = [];
      list.push({
        flag : flag,
        achievements : $scope.achievements
      })
      comApi.post("repAppl/insertRepApplMobile", list, function(data) {
        if(data == 1 || data == 2){
          comApi.showMessage("success", "msg.common.10001", 3000); 
          $timeout(function () {
            // 跳转回【提交报表列表】页面
            $state.go("reportApproval");
          }, 3000);
        }else{
          var alertPopup = $ionicPopup.alert({
            title: '<span class="popheader"><i class="fa fa-times-circle-o"></i>保存失败</span>',
            template: '系统错误。',
            okText:'我知道了'
         });
        }
      },true);
    }
    //到具体日期切换至增加/减少业绩页面
    $scope.riqi = function(index,time){
      $scope.flag = "4";
      if(time != ""){
        $scope.jutiriqi = time;
      }
    }
    //编辑页面切换至增加/减少业绩页面
    $scope.show = function(indexy,indexe,yeji,stfNum){
      if(indexy == "" && indexe == ""){
        $scope.flag = "1";
      }else{
        $scope.flag = "4";
        if(yeji.dicNm != ""){
          $scope.zengjiajianshao = yeji.dicNm;
          $scope.zengjiajianshaoKey = yeji.adjustType;//类型的key值
          if(yeji.adjustAmt >= 0){
            $scope.a.jutijine = yeji.adjustAmt;
          }else{
            $scope.a.jutijine = yeji.adjustAmt * -1;
          }
          $scope.jutiriqi = yeji.adjustDate;
        }
        $scope.apprStfNum = stfNum;
        $scope.key = indexy;
        $scope.keys = indexe;
      }
    }
    //确认按钮触发事件
    $scope.shows = function(indexy,indexe){
      //判断是否有输入项
      if(($scope.zengjiajianshao != "" && $scope.zengjiajianshao != undefined) || ($scope.a.jutijine != "" && $scope.a.jutijine != undefined) || ($scope.jutiriqi != "" && $scope.jutiriqi != undefined)){
        //判断是否选择修改类型
        if($scope.zengjiajianshao == ""){
          comApi.showMessage([ "error", "修改类型" ], "msg.common.10002", 3000);
          return;
        }
        //判断是否填写修改金额
        if($scope.a.jutijine == ""){
          comApi.showMessage([ "error", "修改金额" ], "msg.common.10002", 3000);
          return;
        }
        //判断是否选择具体日期
        if($scope.jutiriqi == ""){
          comApi.showMessage([ "error", "具体日期" ], "msg.common.10002", 3000);
          return;
        }
        //判断修改类型，给金额添加符号
        if($scope.zengjiajianshao == "增加"){
          $scope.achievements[indexy].yejis[indexe].adjustAmt = $scope.a.jutijine;
        }else if($scope.zengjiajianshao == "减少"){
          $scope.achievements[indexy].yejis[indexe].adjustAmt = $scope.a.jutijine * -1;
        }
        $scope.achievements[indexy].yejis[indexe].repApplNum = $scope.achievements[indexy].repApplNum;
        $scope.achievements[indexy].yejis[indexe].apprStfNum = $scope.achievements[indexy].apprStfNum;
        $scope.achievements[indexy].yejis[indexe].adjustDate = $scope.jutiriqi;
        $scope.achievements[indexy].yejis[indexe].dicNm = $scope.zengjiajianshao;
        $scope.achievements[indexy].yejis[indexe].adjustType = $scope.zengjiajianshaoKey;
        $scope.flag = "1";
      }else{
        $scope.flag = "1";
      }
    }
}]);