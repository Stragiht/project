/**
 * 
 * 人员升降级报表
 * 
 * Created by helt on 2016-4-21.
 */

app.controller("prmnDemnMngSelect", function($scope, $http, NgTableParams,
    $location, comApi, $stateParams, $localStorage, $filter, $timeout) {

  // 是否显示没查询出的错误信息
  $scope.msgShowInfo = true;
  // 对数据大小初始化
  $scope.myDataSize = 0;
  // 查询 手风琴 默认打开
  $scope.status = {
    open : true
  };
  $scope.updateData = [];
  $scope.updateDataInfo = {};
  $scope.mytest = {};
  // 创建查询结果对象
  $scope.xsmdxx = new Array();
  // 初始化下拉选择默认为全选值为 0000
  $scope.xsmdxx.ssxsqd = '0000';
  // 初始化 所属销售渠道 下拉选择框
  // PGSTFW0250003
  $scope.chnlList = comApi.getChnlList("PGREPW0130001", 2);

  var self = this;
  self.checkboxes = {
    checked : false,
    items : {}
  };

  init()

  // 设置了一个用于存放个人创建变量用的对象
  $scope.myPara = {
    // 存放page相关参数
    page : {
      // 存放url上参数信息
      url : {
        // 所属销售渠道
        strType : $stateParams.strType,
        // 页码数
        pageNum : $stateParams.pageNum,
        // 每页最大行数
        pageSize : $stateParams.pageSize,
        // 主键
        strNum : $stateParams.strNum
      }
    },
    // 存放table相关参数
    table : {
      // 所属销售渠道
      strType : "",
      // 初始化页码数
      strInitPageNum : 1,
      // 初始化每页最大显示条数
      pageSizeInit : 20,
      // 页码数
      pageNum : "",
      // 每页最大行数
      pageSize : "",
      // 总页数
      pageCount : "",
      // 总行数
      dataCount : "",
      // 获取当前页数
      pageNow : ""
    },
    select : {
      // 选择销售业绩时间段:起始时间
      phaStartTm1 :$filter("date")($scope.mytest.phaStartTm1,'yyyy-MM-dd'),
      // 选择销售业绩时间段:结束时间
      phaEndTm1 : $filter("date")($scope.mytest.phaEndTm1,'yyyy-MM-dd')
    }
  };

  // 生成ng-table
  $scope.tableParamsGet = function() {
	$scope.myPara.select.phaStartTm1=$filter("date")($scope.mytest.phaStartTm1,'yyyy-MM-dd');
	$scope.myPara.select.phaEndTm1=$filter("date")($scope.mytest.phaEndTm1,'yyyy-MM-dd');
	if($filter("date")($scope.mytest.phaStartTm1,'yyyy-MM-dd')==null || $filter("date")($scope.mytest.phaStartTm1,'yyyy-MM-dd')==undefined || $filter("date")($scope.mytest.phaStartTm1,'yyyy-MM-dd')==''){
		comApi.HintMessage( ["error","销售业绩时间段"], "错误", "msg.common.00014",0, "");
        return;
	}
	if($filter("date")($scope.mytest.phaEndTm1,'yyyy-MM-dd')==null || $filter("date")($scope.mytest.phaEndTm1,'yyyy-MM-dd')==undefined || $filter("date")($scope.mytest.phaEndTm1,'yyyy-MM-dd')==''){
		comApi.HintMessage( ["error","销售业绩时间段"], "错误", "msg.common.00014",0, "");
        return;
	}
    comApi.post("staff/prmnDemnMng/prmnDemnMngSelect", $scope.myPara.select,
        function(data) {
          if(data.length>0){
            comApi.HintMessage([ "success", "人员升降级报表" ], "", "msg.common.00040", 3000, "");
          }
        })
  };

  // 查看最后一次生成结果
  $scope.tableParamsGetLast = function() {
    comApi.post("staff/prmnDemnMng/prmnDemnMngLastSelect", '', function(data) {

      // table的总数据数
      $scope.myDataSize = data.length;
      // 綁定一個數據集方便下面全選的 調用
      $scope.list = data;
      for(var i =0;i<data.length;i++){
    	  var stfEntDt = $filter("date")(data[i].stfEntDt, 'yyyy.MM.dd');
    	  data[i].stfEntDt = stfEntDt;
      }
      // 如果查询出的数据为0，那么返回错误信息
      if ($scope.myDataSize == 0 || $scope.myDataSize == null
          || $scope.myDataSize == undefined) {
        $scope.msgShowInfo = true;
      } else {
        $scope.msgShowInfo = false;
      }

      self.tableParams = new NgTableParams({
        // 显示第几页
        page : 1,
        // 每页显示条数
        count : 20
      }, {
        dataset : data,
        // 可选的每页显示条数
        counts : [ 20, 50, 100, 200 ]
      })
    })
  };

  // 点击全选 的事件
  $scope.checkAll = function() {
    // angular 循环的方法
    angular.forEach($scope.list, function(item) {
      // stfNum是
      // $scope.list的一个key值注意這個value值是唯一的
      self.checkboxes.items[item.stfNum] = self.checkboxes.checked;
    });
  };

  // 设定checkbox的选中状态
  $scope.checkItem = function() {
    var checked = 0, unchecked = 0, total = $scope.gydst;
    angular.forEach($scope.list, function(item) {
      checked += (self.checkboxes.items[item.stfNum]) || 0;
      unchecked += (!self.checkboxes.items[item.stfNum]) || 0;
    });
    if ((unchecked == 0) || (checked == 0)) {
      self.checkboxes.checked = (checked == total);
    }
    angular.element(".select-all").prop("indeterminate",
        (checked != 0 && unchecked != 0));
  };

  // 画面初期状态
  function init() {
    // 初始化选中OID列表
    $scope.stfNums = [];
    // 初始化ng-table的checkboxes
    self.checkboxes = {
      checked : false,
      items : {}
    };
    // 初始化全选checkBox的样式
    angular.element(".select-all").prop("indeterminate", false);
  }

  // 点击 批量导出的方法
  $scope.exportCsv = function() {
    var exportData = [ {
      stfNum : "人员编号",
      stfNm : "姓名",
      depNm : "部门",
      posNm : "职位",
      posGrdNm_now : "等级",
      stfEntDt : "入职日期",
      stfNm_zg : "直属主管",
      stfNm_zj : "大区总监",
      lstPhaSaleAmt : "上个档期销售业绩",
      befLstPhaSaleAmt : "前个档期销售业绩",
      twoPhaBefLstPhaSaleAmt : "第前三个档期销售业绩",
      avrAmtOf3Pha : "三个档期平均销售业绩",
      grdStat : "升降级状态",
      posGrdNm_to : "降级/升级为"
    } ];
    // angular 循环的方法
    angular.forEach($scope.list, function(item) {
      // 如果数据是选中状态的时候
      if (self.checkboxes.items[item.stfNum]) {
        var c={
            stfNum : item.stfNum,
            stfNm : item.stfNm,
            depNm : item.depNm,
            posNm : item.posNm,
            posGrdNm_now :item.posGrdNm_now,
            stfEntDt :item.stfEntDt,
            stfNm_zg : item.stfNm_zg,
            stfNm_zj : item.stfNm_zj,
            lstPhaSaleAmt : item.lstPhaSaleAmt,
            befLstPhaSaleAmt : item.befLstPhaSaleAmt,
            twoPhaBefLstPhaSaleAmt : item.twoPhaBefLstPhaSaleAmt,
            avrAmtOf3Pha : item.avrAmtOf3Pha,
            grdStat : item.grdStat,
            posGrdNm_to :item.posGrdNm_to
         
         
        }
      
        c.stfEntDt = $filter("date")(c.stfEntDt, 'yyyy-MM-dd');
        // 保存该条数据
        exportData.push(c);
      }
    });
    // 如果没有选择要导出的数据，提示错误信息，返回。
    if (exportData.length == 1) {
      comApi.HintMessage("error", "", "msg.common.00008",0, "");
      return;
    }
    // 要导出的数据
    $scope.getArray = exportData;
    // 设定导出文件名
    $scope.exportFileNm = "人员升降级报表_" + $filter("date")(new Date(), 'yyyyMMdd')
        + ".csv";
    $timeout(function() {
      angular.element(document.querySelector('#export'))
          .triggerHandler('click');
    }, 0);
  }

  // 更新人员信息
  $scope.updateStfInfo = function() {
    $scope.updateData = [];

    // angular 循环的方法
    angular.forEach($scope.list, function(item) {
      // 如果数据是选中状态的时候
      if (self.checkboxes.items[item.stfNum]) {
        $scope.updateData.push(item.stfNum);
      }
    });
    // 如果没有选择要导出的数据，提示错误信息，返回。
    if ($scope.updateData.length == 0) {
    	comApi.HintMessage( ["error",""], "错误", "msg.common.00045",0, "");
        return;
    }
    // 要更新的数据
    comApi.post("staff/prmnDemnMng/prmnDemnMngUpdateStf", $scope.updateData,
        function() {
            comApi.successMessage("msg.staff.10004");
        })
  };
});
