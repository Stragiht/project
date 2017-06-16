/**
 * Created by shanying on 2016-05-18.
 */
app.controller("baShiftMngController", function ($scope, comApi, $state, NgTableParams, $modal,$sessionStorage) {
    $scope.oneAtATime = true;
    $scope.status = {
        open: true
    };
    $scope.baShiftInfo = {};
    $scope.selectedApprStat = "0000";
    $scope.selectedDay = "0";
    var model="0000";
    var modelDay="0";
    // 取得审批状态选项
    $scope.apprStatList = comApi.getSelectBoxDic("C018", "2");
    
    $scope.dayList=[{key:'0',text:"全部"},{key:'1',text:"15天"},{key:'2',text:"26天"},{key:'3',text:"其他"}]
   
    // 查询方法
    function selectShiftMng(apprRslt,day) {
    	if(model!="0000"){
    		$scope.selectedApprStat = model;
            $scope.selectedDay = day;
    	}
    	if(modelDay!="0"){
    		$scope.selectedApprStat = apprRslt;
            $scope.selectedDay = modelDay;
    	}
    	if(modelDay!="0"&&model!="0000"){
    		$scope.selectedApprStat = model;
            $scope.selectedDay = modelDay;
    	}
    	if(modelDay=="0"&&model=="0000"){
    		$scope.selectedApprStat = "0000";
            $scope.selectedDay = "0";
    	}
    	$scope.baShiftInfo.apprRslt=$scope.selectedApprStat;
    	$scope.baShiftInfo.day=$scope.selectedDay;
        comApi.post("staff/selectShiftMngList" , $scope.baShiftInfo, function (data) {
          $scope.checkboxes.checked =false;
          angular.element(".select-all").prop("indeterminate",false);
          angular.forEach($scope.list,function(item) {$scope.checkboxes.items[item.schNum] = false;});
            // 总件数
            $scope.recordCount = data.length;

            // 取得列表数据
            $scope.list = data;
            // 没有查询到数据时提示
            if (data.length == 0) {
               // comApi.HintMessage("error", "", "NoDatas", 3000, "");
            }
            // ng-table的实现绑定
            $scope.tableParams = new NgTableParams({
                // 显示的第几页
                page: 1,
                // 一页显示多少条
                count: 20
            }, {
                // 把data数据集绑定前台
                dataset: data,
                // 可以点击的显示自己想要一页显示多少条
                counts: [20, 50, 100, 200]
            });
        });
    }

    // 画面初始化直接查询
    selectShiftMng($scope.apprStatList[0].key,$scope.dayList[0].key);
    /**
     * 切换审批状态按钮
     */
    $scope.selectShiftMngList = function (apprRslt) {
    	model=apprRslt
        selectShiftMng(apprRslt,'0');
    };
    $scope.selectDayList = function (day) {
    	modelDay=day;
        selectShiftMng('0000',day);
    };
    
    //查看
    $scope.infoShiftMngAppl = function(schNum) {
      $state.go("app.staff.baShiftMngInfo", {
          schNum : schNum
      });
    };
    
    //审批
    $scope.apprShiftMngAppl = function(schNum,updtTm) {
      $state.go("app.staff.baShiftMngAppr", {
          schNum : schNum,
          updtTm : updtTm
      });
    };
    
    // 初始化ng-table的checkboxes
    $scope.checkboxes = {
        checked: false,
        items: {}
    };
    // 全选事件
    $scope.checkAll = function () {
        // angular 循环的方法
        angular
            .forEach(
                $scope.list,
                function (item) {
                    // stfNum是
                    // $scope.list的一个key值注意這個value值是唯一的
                    $scope.checkboxes.items[item.schNum] = $scope.checkboxes.checked;
                });
    };
    // 单选事件
    $scope.checkItem = function () {
        var checked = 0, unchecked = 0, total = $scope.gydst;
        angular
            .forEach(
                $scope.list,
                function (item) {
                    checked += ($scope.checkboxes.items[item.schNum]) || 0;
                    unchecked += (!$scope.checkboxes.items[item.schNum]) || 0;
                });
        if ((unchecked == 0) || (checked == 0)) {
            $scope.checkboxes.checked = (checked == total);
        }
        angular.element(".select-all").prop(
            "indeterminate",
            (checked != 0 && unchecked != 0));
    };

    
  //调用共通画面
    $scope.openAppl = function(size) {
        var obj=$scope.checkboxes.items;
        //把选中的记录放进数组里
        var dataList=[];
        //取出所有的key,也就是申请编号
        var flag=false;
        for(var prop in obj){
            if (obj.hasOwnProperty(prop)){
            if(obj[prop]==true){
               flag=true;
               var map = new Map();
               for(var i=0;i<$scope.list.length;i++){
                   if(prop==$scope.list[i].schNum){
                     if($scope.list[i].operatorId!=$sessionStorage.userName){
                       comApi.HintMessage("error", "错误", "msg.common.00047", 0, function () {});    
                       return;
                     }else{
                       if ($scope.list[i].apprRslt != "30"&&$scope.list[i].apprRslt != "40") {
                         comApi.HintMessage("error", "错误", "msg.common.00047", 0, function () {});    
                         return;
                       }
                     }
                     
                     map.put("updtTm",$scope.list[i].updtTm);
                     map.put("schNum",$scope.list[i].schNum);
                     dataList.push(map.entrySet);
                   }
               }
            }
            }
        }
        if(flag==false){
              comApi.HintMessage(["error","批量审批"],"错误","msg.common.00020",0,function () {});    
              return;
        }
        var modalInstance = $modal.open({
            templateUrl : 'batchapproval.html',
            controller : 'batchapprovalController',
            size : size,
            resolve : {
                //配置需要注入JS
                deps: ['$ocLazyLoad', function ($ocLazyLoad) { return $ocLazyLoad.load(['common/js/controllers/batchapprova.js']);}]
            }
        
        });
        
        //父子传递参数
        modalInstance.result.then(function(selectedItem) {
            //组装json数数据
            var json = {dataList:dataList,apprRst:selectedItem};
            comApi.post("staff/apprBaShiftMngpi",json,function(data){
              comApi.HintMessage(["success","审批排班申请流程"], "提示","msg.common.00022",3000,function () {});  
              selectShiftMng($scope.selectedApprStat);
            });
        }); 

    };



});