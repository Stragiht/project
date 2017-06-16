/**
 * Created by 单颖 on 2016-4-20.
 */
app.controller('appfbkInfoSelectController',function ($scope,$http,comApi,$state,$sce,$filter) {
    
    //APP意见反馈一览初始化
    comApi.get('FbkInfoApp/fbkInfoSelect',function(data){
    	angular.forEach(data, function(key, idx){
    		//解决音频文件安全性问题。
    		//$sce.trustAsResourceUrl 不使用该方法，直接将url赋到source标签上，会出现Error: $sce:insecurl错误
    		//参考网站1:https://docs.angularjs.org/error/$interpolate/interr?p0=%7B%7BfbkInfo.audio%7Cimgpath%7D%7D&p1=Error:%20%5B$sce:insecurl%5D%20http:%2F%2Ferrors.angularjs.org%2F1.3.2%2F$sce%2Finsecurl%3Fp0%3Dhttp%253A%252F%252F114.55.32.224%253A8080%252FuploadFiles%252Fothers%252Faudios%252F20160726%252Ff4d5a22c-7840-49ac-be60-f4606a81ff31.mp3
    		//参考网站2:https://docs.angularjs.org/error/$sce/insecurl?p0=http:%2F%2F114.55.32.224:8080%2FuploadFiles%2Fothers%2Faudios%2F20160726%2Ff4d5a22c-7840-49ac-be60-f4606a81ff31.mp3
    		//参考网站3（解决方案）:http://twofuckingdevelopers.com/2014/04/angularjs-video-source-directive/?utm_source=tuicool&utm_medium=referral
    		data[idx].audio = $sce.trustAsResourceUrl($filter("imgpath")(data[idx].audio));
//    		$sce.trustAsResourceUrl(data[idx].audio);
    	});
        $scope.data = data;
    });
    //点击处理跳转页面
    $scope.fbkInfoUpdate = function(oid){
        $state.go("app.interactive.appfbkInfoUpdate",{oid:oid});
    }

});