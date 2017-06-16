/**
 * Created by Fupenglu on 2016-3-15. 人员信息画面
 */

app
    .controller(
        'stfListCtrl',
        function($scope, $http, $location, $sessionStorage, $ionicPopup,
            $window, $ionicScrollDelegate,comApi,$timeout) {
        	
        	  $scope.pageNum = 0; // 第几页
        	  $scope.pageSize = 15; // 每页显示件数
        	  $scope.moredata = true; // 上拉加载是否可用
        	  $scope.stfList = [];
        	  $scope.localCity = "";
        	  
        		var navMenu = comApi.showFooterMenu("stfShow","1");
        		$scope.$emit('navMenu.type', navMenu); 
        	  
          	// 定位完成
        	$window.locationComplete = function(data) {
        	     var dataJson = JSON.parse(data);
        	     if (dataJson.success) {
        	    	 $scope.localCity = dataJson.result.city;

                     var localCity = $scope.localCity;
                     var localCityNum = "";
                     
                     comApi.get('staff/mobileStfCity',function(data) {
                     	var tempCitys = data;
                         var lastCitys = [];
                         var letters = [ 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H',
                             'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R',
                             'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z' ];

                         if(localCity != null && localCity != "" && localCity != undefined){
                             for(var m = 0;m< tempCitys.length;m++){
                             	if(tempCitys[m].rgnNm == localCity){
                             		localCityNum = tempCitys[m].rgnNum;
                             	}
                             }
                             lastCitys.push({
                                 "firstPinyin" : "00",
                                 "rgnNum" : localCityNum,
                                 "rgnNm" : localCity
                               });
                         }
                                         
                         lastCitys.push({
                           "firstPinyin" : "0",
                           "rgnNum" : "999999",
                           "rgnNm" : "全部"
                         });
                         lastCitys.push({
                           "firstPinyin" : "0",
                           "rgnNum" : "000000",
                           "rgnNm" : "全部"
                         });
                         var tempLetter = "";
                         var j = 0;
                         for (var i = 0; i < tempCitys.length; i++) {

                           if (tempLetter != tempCitys[i].firstPinyin) {

                             tempLetter = tempCitys[i].firstPinyin;

                             if (tempLetter != '0' && j < 26) {
                               if (tempLetter == letters[j]) {
                                 j++;
                               } else {
                                 while (tempLetter != letters[j]) {
                                   lastCitys.push({
                                     "firstPinyin" : letters[j],
                                     "rgnNum" : "999999",
                                     "rgnNm" : letters[j]
                                   });
                                   j++;
                                 }
                                 j++;
                               }
                             }

                             lastCitys.push({
                               "firstPinyin" : tempCitys[i].firstPinyin,
                               "rgnNum" : "999999",
                               "rgnNm" : tempCitys[i].firstPinyin
                             });

                           }
                           if((localCityNum != "" && tempCitys[i].rgnNum != localCityNum ) || localCityNum == ""){
                               lastCitys.push(tempCitys[i]);
                           }
                           
                         }

                         $scope.citys = lastCitys;
                         
                     });
        	     } else {
                 	var errMsg = comApi.appCallBackFaultHandle(dataJson, 3);
        	     }
        	  };
        	  
        	  // 关闭筛选
        	  $scope.closeSelect = function(){
                  $scope.selectStore = false;
                  $scope.selectArea = false;
                  $scope.selectJob = false;
                  
        		var navMenu = comApi.showFooterMenu("stfShow","1");
        		$scope.$emit('navMenu.type', navMenu); 
        	  }
        	  
              // 点击指定地区
              $scope.cityChange = function(rgnNum, rgnNm) {
                  // 回到顶部
                  $ionicScrollDelegate.$getByHandle('contentScroll').scrollTop();
            	  
            	  $scope.selectStore = false;
                  $scope.selectJob = false;
//                  $scope.moredata = true;
                  if ($scope.selectArea) {
                    $scope.selectArea = false;
                  } else {
                    $scope.selectArea = true;
                  }
                var stfNum = $sessionStorage.userId;
                $scope.pageNum = 0; // 还原第几页
                // 设定查询条件
                var searchParam = {
                        pageSize : $scope.pageSize,
                        pageNum : $scope.pageNum + 1, // 下一页
                        params : {
                            stfNum : stfNum,
                            strNum:$scope.search.strNum,
                            posNum: $scope.search.posNum,
                            rgnNum : rgnNum
                        }
                }
                // 初始化条件查询列表
                comApi.post('staff/mobileStfList', searchParam, function(data) {
                    $scope.stfList = data.list;
                    $scope.moredata = data.hasNextPage;
                    $scope.pageNum = data.pageNum;
                    
                    if (rgnNum == '000000') {
                        $scope.titleArea = "地区";
                      } else {
                        $scope.titleArea = rgnNm;
                      }
                    
                    // 取得地区
                    comApi.get('staff/mobileStfStore/' + rgnNum,function(data) {
                    	 $scope.stores = [ {
                             "strNum" : "000000",
                             "strNm" : "全部"
                           } ];
                           var tempStores = data;
                           var lastStores = $scope.stores
                               .concat(tempStores);
                           $scope.stores = lastStores;
                           //地区改变时，门店初始化
                           $scope.search.strNum = '000000';
                           $scope.titleStore = "门店";
                    });

                    $scope.$broadcast("scroll.refreshComplete");
                  });
              }

          // 初始化方法
          $scope.init = function() {
            // 快捷字母
            var cheight = document.body.clientHeight;
            $scope.liheight = ((cheight - 92 -51) / 27).toFixed(2);

            // 初始化变量
            var stfNum = $sessionStorage.userId;
            // 地区选择标题
            $scope.titleArea = "地区";
            // 门店选择标题
            $scope.titleStore = "门店";
            // 职位选择标题
            $scope.titleJob = "职位";
            // 是否显示地区列表
            $scope.selectArea = false;
            // 是否显示门点列表
            $scope.selectStore = false;
            // 是否显示职位列表
            $scope.selectJob = false;
            // 城市列表
            $scope.citys = [];
            // 门点列表
            $scope.stores = [ {
              "strNum" : "000000",
              "strNm" : "全部"
            } ];
            // 职位列表
            $scope.jobs = [ {
              "posNum" : "000000",
              "posNm" : "全部"
            } ];
            // 字母快捷键
            $scope.letters = [ 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I',
                'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U',
                'V', 'W', 'X', 'Y', 'Z' ];
            // 画面查询用对象
            $scope.search = {
              rgnNum : '000000',
              strNum : '000000',
              posNum : '000000'
            };
            
            var localCity = $scope.localCity;
            var localCityNum = "";
            
            comApi.get('staff/mobileStfCity',function(data) {
            	var tempCitys = data;
                var lastCitys = [];
                var letters = [ 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H',
                    'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R',
                    'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z' ];
                

                if(localCity != null && localCity != "" && localCity != undefined){
                    for(var m = 0;m< tempCitys.length;m++){
                    	if(tempCitys[m].rgnNm == localCity){
                    		localCityNum = tempCitys[m].rgnNum;
                    	}
                    }
                    lastCitys.push({
                        "firstPinyin" : "00",
                        "rgnNum" : localCityNum,
                        "rgnNm" : localCity
                      });
                    $scope.search.rgnNum = localCityNum;
                }
                                
                lastCitys.push({
                  "firstPinyin" : "0",
                  "rgnNum" : "999999",
                  "rgnNm" : "全部"
                });
                lastCitys.push({
                  "firstPinyin" : "0",
                  "rgnNum" : "000000",
                  "rgnNm" : "全部"
                });
                var tempLetter = "";
                var j = 0;
                for (var i = 0; i < tempCitys.length; i++) {

                  if (tempLetter != tempCitys[i].firstPinyin) {

                    tempLetter = tempCitys[i].firstPinyin;

                    if (tempLetter != '0' && j < 26) {
                      if (tempLetter == letters[j]) {
                        j++;
                      } else {
                        while (tempLetter != letters[j]) {
                          lastCitys.push({
                            "firstPinyin" : letters[j],
                            "rgnNum" : "999999",
                            "rgnNm" : letters[j]
                          });
                          j++;
                        }
                        j++;
                      }
                    }

                    lastCitys.push({
                      "firstPinyin" : tempCitys[i].firstPinyin,
                      "rgnNum" : "999999",
                      "rgnNm" : tempCitys[i].firstPinyin
                    });

                  }
                  if((localCityNum != "" && tempCitys[i].rgnNum != localCityNum ) || localCityNum == ""){
                      lastCitys.push(tempCitys[i]);
                  }
                }

                $scope.citys = lastCitys;
            });
            
            // 取得职位
            comApi.get('staff/mobileStfJob',function(data) {
                $scope.jobs = [ {
                    "posNum" : "000000",
                    "posNm" : "全部"
                  } ];
                  var tempJobs = data;
                  var lastJobs = $scope.jobs.concat(tempJobs);
                  $scope.jobs = lastJobs;
            });
            
            //if(localCityNum != ""){
            	// $scope.cityChange(localCityNum,localCity);
            //}
          }

          // 调用页面初始化
          $scope.init();
//          $timeout(function(){          $scope.moredata = true;},1000);
          // 下拉刷新
          $scope.doRefresh = function() {
        	 var stfNum = $sessionStorage.userId;
            $scope.pageNum = 0; // 还原第几页
            $scope.moredata = true;
            // 初始化查询条件
            var initSearch = {
                    pageSize : $scope.pageSize,
                    pageNum : $scope.pageNum + 1, // 下一页
                    params : {
                        stfNum : stfNum,
                        strNum:$scope.search.strNum,
                        posNum: $scope.search.posNum,
                        rgnNum : $scope.search.rgnNum
                    }
            }
            // 初始化条件查询列表
            comApi.post('staff/mobileStfList', initSearch, function(data) {
                $scope.stfList = data.list;
                $scope.moredata = data.hasNextPage;
                $scope.pageNum = data.pageNum;

                $scope.$broadcast("scroll.refreshComplete");
              });
          };
          
          // 点击地区选择按钮
          $scope.citySelect = function() {
            $scope.selectStore = false;
            $scope.selectJob = false;
            if ($scope.selectArea) {
              $scope.selectArea = false;
            } else {
              $scope.selectArea = true;
            }
            
            if($scope.selectArea) {
            	// TODO 原生调用
                window.bdk.getCurrentCity();
            }
            
        	var navMenu = comApi.showFooterMenu("stfShow","1");
        	$scope.$emit('navMenu.type', navMenu); 
          };

          // 点击门点选择按钮
          $scope.storeSelect = function() {
            $scope.selectJob = false;
            $scope.selectArea = false;
            if ($scope.selectStore) {
              $scope.selectStore = false;
            } else {
              $scope.selectStore = true;
            }
            
        	var navMenu = comApi.showFooterMenu("stfShow","1");
        	$scope.$emit('navMenu.type', navMenu); 
          };

          // 点击职位选择按钮
          $scope.jobSelect = function() {
            $scope.selectStore = false;
            $scope.selectArea = false;
            if ($scope.selectJob) {
              $scope.selectJob = false;
            } else {
              $scope.selectJob = true;
            }
            
        	var navMenu = comApi.showFooterMenu("stfShow","1");
        	$scope.$emit('navMenu.type', navMenu); 
          };

          // 点击跳转到指定地区标签
          $scope.goToLetter = function(letter) {
            var scroll = document.getElementById(letter).offsetTop;
            $ionicScrollDelegate.resize();
            $ionicScrollDelegate.scrollTo(0, scroll, true);
          };

          // 点击跳转到顶部
          $scope.goToTop = function() {
            $ionicScrollDelegate.scrollTop(true);
          };

          //点击指定门点
          $scope.storeChange = function(strNum, strNm) {
              // 回到顶部
              $ionicScrollDelegate.$getByHandle('contentScroll').scrollTop();
              
              $scope.storeSelect();

//              $scope.moredata = true;
              
            var stfNum = $sessionStorage.userId;
            $scope.pageNum = 0; // 还原第几页
            
            //设定查询条件
            var searchParam = {              
              pageSize : $scope.pageSize,
              pageNum : $scope.pageNum + 1, // 下一页
              params : {
            	  stfNum : stfNum,
                  strNum:strNum,
                  posNum: $scope.search.posNum,
                  rgnNum : $scope.search.rgnNum
              }
            }
            
            // 初始化条件查询列表
            comApi.post('staff/mobileStfList', searchParam, function(data) {
                $scope.stfList = data.list;
                $scope.moredata = data.hasNextPage;
                $scope.pageNum = data.pageNum;
               
                if (strNum == '000000') {
                  $scope.titleStore = "门店";
                } else {
                  $scope.titleStore = strNm;
                }
                $scope.$broadcast("scroll.refreshComplete");
                $ionicScrollDelegate.scrollTop(true);
              });
          };

          //点击指定职位
          $scope.jobChange = function(posNum, PosNm) {
              // 回到顶部
              $ionicScrollDelegate.$getByHandle('contentScroll').scrollTop();
            
        	  $scope.jobSelect();

//              $scope.moredata = true;
            var stfNum = $sessionStorage.userId;
            $scope.pageNum = 0; // 还原第几页
            
            //设定查询条件
            var searchParam = {              
              pageSize : $scope.pageSize,
              pageNum : $scope.pageNum + 1, // 下一页
              params : {
            	  stfNum : stfNum,
            	  strNum : $scope.search.strNum,
                  posNum: posNum,
                  rgnNum : $scope.search.rgnNum
              }
            }
            
            // 初始化条件查询列表
            comApi.post('staff/mobileStfList', searchParam, function(data) {
                $scope.stfList = data.list;
                $scope.moredata = data.hasNextPage;
                $scope.pageNum = data.pageNum;
                if (posNum == '000000') {
                  $scope.titleJob = "职位";
                } else {
                  $scope.titleJob = PosNm;
                }

                $scope.$broadcast("scroll.refreshComplete");
                $ionicScrollDelegate.scrollTop(true);
              });
          };
          
          // 上拉加载
          $scope.loadMore = function() {
        	  var stfNum = $sessionStorage.userId;
//              $scope.moredata = true;
            comApi.post('staff/mobileStfList', {
              pageSize : $scope.pageSize,
              pageNum : $scope.pageNum + 1, // 下一页
              params : {
                  stfNum : stfNum,
            	  strNum : $scope.search.strNum,
                  posNum: $scope.search.posNum,
                  rgnNum : $scope.search.rgnNum
              }
            }, function(data) {
              Array.prototype.push.apply($scope.stfList, data.list); // 拼接结果集
              $scope.moredata = data.hasNextPage;
              $scope.pageNum = data.pageNum;

              $scope.$broadcast("scroll.infiniteScrollComplete");
            });
          };
          //调用打电话
          $scope.callPhone = function(phone) {
            var data = '{"phone": ' + phone + '}';
            var resultJson = JSON.parse(window.bdk.callNumber(data));
          }
          //调用微信
          $scope.callWeixin = function() {
            var resultJson = JSON.parse(window.bdk.openWeChat());
          }
        });