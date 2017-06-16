/**
 * created by zhaoq
 * 查看门店排班详情
 */
app.controller('baShiftMngDetailsController', function($scope,$sessionStorage,$ionicPopup,$http,
    $state,$ionicScrollDelegate,comApi,$stateParams){
  
	var navMenu = comApi.showFooterMenu("");
	$scope.$emit('navMenu.type', navMenu); 
	$scope.phaNum = $stateParams.phaNum;
	$scope.pageNum = 0; // 第几页
  $scope.pageSize = 15; // 每页显示件数
  $scope.moredata = true; // 上拉加载是否可用
//排班明细
$scope.bAShiftMngPersonDetile=[];
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
	   // 上拉加载
	   $scope.loadMore = function() {
	     $scope.pageNum=$scope.pageNum+1;
	     comApi.get('staff/selectShiftMngByschPum/'+$stateParams.phaNum+'/'+$stateParams.strNum+'/'+$scope.pageNum+'/'+$scope.pageSize,function(data){
	      
	       if(data.list.length>0){
	        //组装数据
	        //排班时间
	        $scope.time=data.list[0].phaStartTm+"~"+data.list[0].phaEndTm;
	        //门店
	        $scope.strNm=data.list[0].strNm;
	        //城市
	        $scope.rgnNm=data.list[0].rgnNm;
	        //排班人员
	        $scope.bAShiftMngPerson=[];
	        for(var i=0;i<data.list[0].name.split(",").length;i++){
	            $scope.bAShiftMngPerson.push({sequnce:"人员0"+(i+1),person:data.list[0].name.split(",")[i]});
	        }
	        //今日上班
	        $scope.bAShiftMngPersonToday=[];
	        if(data.list[0].worktoday) {
		        for(var i=0;i<data.list[0].worktoday.split(",").length;i++){
		            $scope.bAShiftMngPersonToday.push({schSitu:data.list[0].worktoday.split(",")[i].substr(0,2),detileperson:data.list[0].worktoday.split(",")[i].substr(2)});
		        }
	        }
	       
	        for(var i=0;i<data.list.length;i++){
	            $scope.bAShiftMngPersonDetile.push({riqi:data.list[i].contSchDt,detileperson:data.list[i].stfNm,schSitu:data.list[i].schSitu});
	        }
	        }
	       $scope.moredata = data.hasNextPage;
	       $scope.$broadcast("scroll.infiniteScrollComplete");
	    });
	               
	     
	       

	  };
	
	
});