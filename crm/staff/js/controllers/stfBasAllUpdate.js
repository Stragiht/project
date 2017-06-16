/*
 *這是 人員基本信息批量修改的方法 主要 是列表和查詢的方法 
 *--江風成  2016-3-25 
 *引入的  $scope  $http  NgTableParams  $element
 */
app
		.controller(
				'stfBasAllUpdateCtrl',
				[
						'$scope',
						'$http',
						'NgTableParams',
						'$element',
						'comApi',
						'$filter',
						'$timeout',
						'$state',
						'$modal',
						function($scope, $http, NgTableParams, $element,
								comApi, $filter, $timeout, $state, $modal) {
							// 定义变量
							$scope.stfbas = {};
							// 定义变量
							$scope.date = {};
							// 初始化ng-table的checkboxes
							$scope.oneAtATime = true;
							var self = this;
							self.checkboxes = {
								checked : false,
								items : {}
							};
							$scope.status = {
								open : true
							};
							// 是否包含其下成员
							$scope.stfbas.allSelectOut = true;
							// 初始化总条数
							$scope.gydst = "0";
				 
							// 一个个编辑
							$scope.oneOneUpdate = function() {
								
								var stnum = "";
								angular.forEach(
												$scope.list,
												function(item) {
													// stfNum是
													if (self.checkboxes.items[item.stfNum] == true) {
														
														stnum += item.stfNum + ",";
													}
												});
								if(stnum.length<1){
								  comApi.HintMessage( ["error","一个个编辑"], "", "msg.common.00020",0, "");
									return false;
								}
							$state.go("app.staff.stfBasOneOneEditUpdate", {
								stfNum : stnum,
								type:"1"
							});
							}
 
							// 弹窗
							$scope.allUpdate = function() {
								var stnum = "";
								var respos=0;
								var oldpos="";
								var keepGoing = false;
								angular.forEach(
								    $scope.list,function(item) {
    									// stfNum是
    									if (self.checkboxes.items[item.stfNum] == true) {
    										respos++;
    										if(respos==1){
    											oldpos=	item.posNum;
    										}
    										if(oldpos!=item.posNum){
    											keepGoing=true;
    										}
    										stnum += item.stfNum + ",";
    									}
								    }
								);
								
								if(keepGoing){
									comApi.HintMessage( "error", "", "msg.common.00028",0, "");
									return false;
								}
								$scope.stfbas.stfBasNumber = stnum.substring(0,
										stnum.length - 1);
								
								if($scope.stfbas.stfBasNumber.length<1){
								  comApi.HintMessage( ["error","统一编辑"], "", "msg.common.00020",0, "");
									return false;
								}
								
								var modalInstance = $modal.open({
									templateUrl : 'stafAllUpdateWindow.html',
									controller : 'stafAllUpdateWindow',
									resolve : {
										// 传递你的flag(1:不需要权限查询全部数据,2：需要权限查询部分数据)
										flag : function() {
											return 1;
										},
										// 配置需要注入JS
										deps : ['$ocLazyLoad',function($ocLazyLoad) {
											return $ocLazyLoad.load([ 'common/js/controllers/stafAllUpdateWindow.js' ]);
										}]
									}
								});
								// 父子传递参数
								modalInstance.result.then(function(selectedItem) {
									var type="";
									//职位
									if (selectedItem.job) {
										type+="1,";
									}
									//直属主管
									if (selectedItem.posGrdNum) {
										type+="3,";
									}
									//在岗状态
									if (selectedItem.workStat) {
										type+="4,";
									}
									type = type.substring(0,type.length-1);
									$state.go("app.staff.stfBasAllEditUpdate", {
									   stfNum : $scope.stfbas.stfBasNumber,
									   type:type
									});
								});
							};

							$scope.zhuangtai = comApi.getSelectBoxDic("C001", 2);
                            $scope.stfbas.workStat= $scope.zhuangtai[0].key;

							// 下拉框职位
							$scope.jobs = comApi.getSelectBoxJob(2);
							$scope.stfbas.posNum = $scope.jobs[0].key;
							$scope.curPoslvl = comApi.getSelectBoxPosLvl($scope.jobs[0].key, 2);
							if (comApi.isNotEmptyObject($scope.curPoslvl)) {
								$scope.stfbas.posGrdNum = $scope.curPoslvl[0].key;
							} else {
								$scope.stfbas.posGrdNum = '0000';
							}

							//根据职位获取职位等级/*lg*/
							$scope.getPosLvls = function(posNum) {
								$scope.curPoslvl = comApi.getSelectBoxPosLvl(posNum, 2);
								//职位等级默认选中第一个
								if (comApi.isNotEmptyObject($scope.curPoslvl)) {
									$scope.stfbas.posGrdNum = $scope.curPoslvl[0].key;
								} else {
									$scope.stfbas.posGrdNum = '0000';
								}
							};
			 
							/* 初始化 不加载任何数据点击搜索的时候检索数据 */
							// 点击 搜索的方法 initialselect()
							$scope.initialselect = function() {

								if( typeof ($scope.stfbas.stfEntDtStart+0) != "number"){
									$scope.stfbas.stfEntDtStart = $scope.stfbas.stfEntDtStart.getTime();
								}

								if( typeof ($scope.stfbas.stfEntDtEnd+0) != "number"){
									$scope.stfbas.stfEntDtEnd = $scope.stfbas.stfEntDtEnd.getTime();
								}

								// console.log($scope.stfbas)
								// 請求后台獲取數據的方法
								comApi
										.post(
												"/staff/stfbasselect",
												$scope.stfbas,
												function(data) {
													self.checkboxes.checked =false;
													angular
															.element(
																	".select-all")
															.prop(
																	"indeterminate",
																	false);
													angular
															.forEach(
																	$scope.list,
																	function(
																			item) {
																		// $scope.list的一个key值注意這個value值是唯一的
																		self.checkboxes.items[item.stfNum] = false;
																	});

													// 綁定變量返回的 map數據的長度
													$scope.gydst = data.length;
													// 綁定一個數據集方便下面全選的 調用
													$scope.list = data;
													// ng-table的实现绑定
													self.tableParams = new NgTableParams(
															{
																// 显示的第几页
																page : 1,
																// 一页显示多少条
																count : 20
															}, {
																// 把data数据集绑定前台
																dataset : data,
																// 可以点击的显示自己想要一页显示多少条
																counts : [ 20,
																		50,
																		100,
																		200 ]
															});

													//$("#mydiv").getNiceScroll(0).doScrollLeft(500,300);

												});

							}
							// 点击全选 的事件
							$scope.checkAll = function() {
								// angular 循环的方法
								angular
										.forEach(
												$scope.list,
												function(item) {
													// stfNum是
													// $scope.list的一个key值注意這個value值是唯一的
													self.checkboxes.items[item.stfNum] = self.checkboxes.checked;
												});
							};
							// 單選 的事件
							$scope.checkItem = function() {
								var checked = 0, unchecked = 0, total = $scope.gydst;
								angular
										.forEach(
												$scope.list,
												function(item) {
													checked += (self.checkboxes.items[item.stfNum]) || 0;
													unchecked += (!self.checkboxes.items[item.stfNum]) || 0;
												});
								if ((unchecked == 0) || (checked == 0)) {
									self.checkboxes.checked = (checked == total);
								}
								angular.element(".select-all").prop(
										"indeterminate",
										(checked != 0 && unchecked != 0));
							};

						} ]);
