/**
 * 
 * 考勤规则信息主页
 * 
 */
app.controller("attendRuleController", function($scope, $modal, NgTableParams,
    $location, $stateParams, $state, $log, comApi, toaster) {

  // 初始化规则列表数据
  loadAttendRule();

  // 绑定删除考勤规则方法
  $scope.delect=function(id){
    comApi.openDelWindow(function(){
      comApi.post("AttendRule/attendRuleDelete", {
      oId : id
      }, function(data) {
        loadAttendRule();
       });
    })
    
   }
  
  //绑定编辑考勤规则方法
  $scope.goUpdate = function(oid) {
    $state.go("app.staff.attendRuleUpdate", {oId : oid});
};
  
  /**
   * 
   * 初始化考勤列表数据
   * 
   */
  function loadAttendRule() {

    // 获取考勤规则数据
    comApi.get("AttendRule/attendRuleSelect", function(data) {
      // 总件数
      $scope.recordCount = data.length;
      // 加载ngtable数据
      $scope.tableParams = new NgTableParams({
        dataset : data,
        // 显示的第几页
        page : 1,
        // 一页显示多少条
        count : 20      
     }, {
          // 把data数据集绑定前台
          dataset : data,
          // 可以点击的显示自己想要一页显示多少条
          counts : [ 20, 50, 100, 200 ]
      });
    });

  }

});
