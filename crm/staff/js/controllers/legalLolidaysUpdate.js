app.controller("legalLolidaysUpdateController", function ($scope,toaster,$filter,$stateParams,comApi, $state, NgTableParams, $modal) {
  $scope.dateList=[];
  $scope.year=[];
  $scope.year.nianfen = $stateParams.year;
  /**
   * 添加日期
   */
  $scope.addDate = function(){
    $scope.dateList.push({dateVal:""});
  }
  /**
   * 删除日期
   */
  $scope.delectDate = function(index){
    if($scope.dateList.length==1){
      toaster.pop('error', "错误",
          '至少有一个日期！', 0,
          'trustedHtml',
          function() {
          });
      return;
    }else{
      $scope.dateList.splice(index,1);
    }
  }
  /**
   * 根据年份查询当前年份的法定假日
   */
  comApi.get("staff/legalLolidays/"+$stateParams.year,function(data){
    if(data.length > 0){
      for(var i = 0;i<data.length;i++){
        var obj = {};
        obj.dateVal = data[i].dateVal;
        obj.updtTm = data[i].updtTm;
        $scope.dateList.push(obj);
      }
    }else{
      toaster.pop('error', "错误",
          '查询失败！', 0,
          'trustedHtml',
          function() {
          });
    }
  })
  /**
   * 保存法定假日补助标准
   */
  $scope.preservation = function(){
    var list = $scope.dateList;
    var date1="";
    var date2="";
    var year = $scope.year.nianfen;
    if($filter("date")(list[0].dateVal,'yyyy-MM-dd').substring(0,4)!= year){
      toaster.pop('error', "错误",
          "日期"+$filter("date")(list[0].dateVal,'yyyy-MM-dd') + "不在当前年份内！",0,
          'trustedHtml',
          function() {
      });
      return;
    }
    for(var i=0;i<list.length-1;i++){
      
      list[i].dateVal = $filter("date")(list[i].dateVal,'yyyy-MM-dd');
      
      for(var k=i+1;k<list.length;k++){
        
        y=$filter("date")(list[k].dateVal,'yyyy-MM-dd').substring(0,4);
        
        if(y != year){
          toaster.pop('error', "错误",
              "日期"+$filter("date")(list[k].dateVal,'yyyy-MM-dd') + "不在当前年份内！",0,
              'trustedHtml',
              function() {
          });
          return;
        }
        if($filter("date")(list[i].dateVal,'yyyy-MM-dd') == $filter("date")(list[k].dateVal,'yyyy-MM-dd')){
          toaster.pop('error', "错误",
              "日期"+$filter("date")(list[k].dateVal,'yyyy-MM-dd') + "重复了",0,
              'trustedHtml',
              function() {
              });
          return;
        }
      }
    }
    if(list.length>1){
      list[list.length-1].dateVal = $filter("date")(list[list.length-1].dateVal,'yyyy-MM-dd');
    }
    
    comApi.post("staff/updateLegalLolidayss",list,function(data){
      if(data < 0){
        toaster.pop('error', "错误",
            "该年份的法定假日已存在，请编辑该年份！",0,
            'trustedHtml',
            function() {
            });
        return;
      }else if(data == 0){
        toaster.pop('error', "错误",
            "保存失败",0,
            'trustedHtml',
            function() {
            });
        return;
      }else if(data > 0){
        toaster.pop('success', '成功',
            '保存成功', 3000,
            'trustedHtml',
            function() {
            });
        $state.go("app.staff.legalLolidays");
      }
    });
  }
});