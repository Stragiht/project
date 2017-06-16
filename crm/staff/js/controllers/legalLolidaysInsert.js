app.controller("legalLolidaysInsertController", function ($scope,toaster,$filter,comApi,$state,NgTableParams,$modal) {
  $scope.dateList=[{dateVal:""}];
  $scope.year=[];
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
   * 判断是否已存在年份
   */
  $scope.panchong=function (){
    var year = $scope.year.nianfen;
    if(year.length == 4){
      comApi.get("staff/selectLegalLolidays/"+year,function(data){
        if(data > 0){
          toaster.pop('error', "错误",
              '该年份已存在，请编辑此年份！',0,
              'trustedHtml',
              function() {
              });
        }
      });
    }
  }
  /**
   * 保存法定假日补助标准
   */
  $scope.preservation = function(){
    var list = $scope.dateList;
    var date1="";
    var date2="";
    var year = $scope.year.nianfen;
    if($filter("date")(list[0].dateVal,'yyyy-MM-dd').substring(0,4) != year){
      toaster.pop('error', "错误",
          "日期" + $filter("date")(list[0].dateVal,'yyyy-MM-dd') + "不在当前年份内！",0,
          'trustedHtml',
          function() {
      });
      return;
    }
    for(var i=0;i<list.length-1;i++){
      
      list[i].dateVal = $filter("date")(list[i].dateVal,'yyyy-MM-dd');
      
      for(var k=i+1;k<list.length;k++){
        
        date2=$filter("date")(list[k].dateVal,'yyyy-MM-dd');
        
        if($filter("date")(list[k].dateVal,'yyyy-MM-dd').substring(0,4) != year){
          toaster.pop('error', "错误",
              "日期"+date2 + "不在当前年份内！",0,
              'trustedHtml',
              function() {
          });
          return;
        }
        if(list[i].dateVal == list[k].dateVal){
          toaster.pop('error', "错误",
              "日期"+date2 + "重复了",0,
              'trustedHtml',
              function() {
              });
          return;
        }
      }
    }
    
    if(list.length > 1){
      list[list.length-1].dateVal = date2;
    }
    comApi.post("staff/updateLegalLolidays",list,function(data){
      if(data < 0){
        toaster.pop('error',"错误",
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
        toaster.pop('success', '',
            '保存成功', 3000,
            'trustedHtml',
            function() {
            });
        $state.go("app.staff.legalLolidays");
      }
    });
  }
});