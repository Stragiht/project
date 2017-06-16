/*
 *這是 人員基本信息頁面的方法 主要 是列表和查詢的方法 
 *--江風成  2016-3-25 
 *引入的  $scope  $http  NgTableParams  $element
 */
app
		.controller(
				'stfBasCtrl',
				[
						'$scope',
						'$http',
						'NgTableParams',
						'$element',
						'comApi',
						'$filter',
						'$timeout',
						'$state',
						'$modal','Upload',
						function($scope, $http, NgTableParams, $element,
								comApi, $filter, $timeout, $state, $modal,Upload) {

							$scope.stfbas = {};
							// 定义变量
							$scope.date = {};
							// 初始化ng-table的checkboxes
							$scope.oneAtATime = true;
							$scope.stfbas.allSelectOut =false;
							var self = this;
							self.checkboxes = {
								checked : false,
								items : {}
							};
							$scope.status = {
								open : true
							};
							// 是否包含其下成员
							$scope.stfbas.hasDirSupFlg = true;
							// 初始化总条数
							$scope.gydst = "0";
							// 格式化時間
							Date.prototype.Format = function(fmt) { // author:
																	// meizz
								var o = {
									"M+" : this.getMonth() + 1, // 月份
									"d+" : this.getDate(), // 日
									"h+" : this.getHours(), // 小时
									"m+" : this.getMinutes(), // 分
									"s+" : this.getSeconds(), // 秒
									"q+" : Math
											.floor((this.getMonth() + 3) / 3), // 季度
									"S" : this.getMilliseconds()
								// 毫秒
								};
								if (/(y+)/.test(fmt))
									fmt = fmt.replace(RegExp.$1, (this
											.getFullYear() + "")
											.substr(4 - RegExp.$1.length));
								for ( var k in o)
									if (new RegExp("(" + k + ")").test(fmt))
										fmt = fmt
												.replace(
														RegExp.$1,
														(RegExp.$1.length == 1) ? (o[k])
																: (("00" + o[k])
																		.substr(("" + o[k]).length)));
								return fmt;
							}

							// 查看方法
							// 查看
							$scope.stfBasSelect = function(stfNum) {
								$state.go("app.staff.stfBasSelect", {
									stfNum : stfNum
								});
							};
							// 编辑
							$scope.stfBasUpdate = function(stfNum) {
								$state.go("app.staff.stfBasUpdate", {
									stfNum : stfNum
								});
							};
							//var time1 = new Date().Format("yyyyMMdd");

							// 弹窗
							$scope.openOut = function() {
								var stnum = "";
								angular
										.forEach(
												$scope.list,
												function(item) {
													// stfNum是
													if (self.checkboxes.items[item.stfNum] == true) {
														stnum += item.stfNum + ",";
													}
												});
								$scope.stfbas.stfBasNumber = stnum.substring(0,
										stnum.length - 1);
						        if(stnum.length<1){
                                  comApi.HintMessage("error", "", "msg.common.00008",0, "");
                                  return;
						        }
								var modalInstance = $modal
										.open({
											templateUrl : 'stafOut.html',
											controller : 'stafOutffController',
											resolve : {
												// 传递你的flag(1:不需要权限查询全部数据,2：需要权限查询部分数据)
												flag : function() {
													return 1;
												},
												// 配置需要注入JS
												deps : [
														'$ocLazyLoad',
														function($ocLazyLoad) {
															return $ocLazyLoad
																	.load([ 'common/js/controllers/stafOut.js' ]);
														} ]
											}

										});

								// 父子传递参数
								modalInstance.result
										.then(function(selectedItem) {
											var type="";
											if (selectedItem.idcard) {
													type+="1,";
											}
											if (selectedItem.bnk) {
													type+="2,";
											}
											if (selectedItem.health) {
													type+="3,";
											}
											type = type.substring(0,type.length-1);
											Upload.upload({
												url : '/CrmWeb/api/staff/getStfOutPutImg',
												data : {
													type:type,
													stfNum : $scope.stfbas.stfBasNumber
												}
											}).then(function(resp) {
												var downloadUrl = resp.data.data;
												if(!downloadUrl || downloadUrl == "") {
					              	                comApi.HintMessage( ["error", "人员可能不存在证件附件。"], "错误", "msg.common.00057", 0, function() {});
													return;
												}
												comApi.downloadFile(comApi.getFileServerPath() + downloadUrl);
											}, function(resp) {
												//$scope.figured = "文件上传失败！";
											});

										});
							};


							// 导出方法
							/*$scope.outPut = function() {
								var stnum = "";
								angular
										.forEach(
												$scope.list,
												function(item) {
													console.log(item)
													console.log(angular.toJson(item))
													// stfNum是
													if (self.checkboxes.items[item.stfNum] == true) {
														stnum += '"'
																+ item.stfNum
																+ '"' + ",";
													}
												});
								$scope.stfbas.allSelectOut = self.checkboxes.checked;
								$scope.stfbas.stfBasNumber = stnum.substring(0,
										stnum.length - 1);
								if(stnum.length<1){
								  comApi.HintMessage("error", "", "msg.common.00008",0, "");
								  return;
								}
								// stfBasNumber
								$scope.filename = "人员信息_" + time1 + ".csv";
								console.log(angular.toJson($scope.stfbas))
								comApi
										.post(
												"/staff/stfbasout",
												$scope.stfbas,
												function(data) {
													console.log(angular.toJson(data));
													// 綁定變量返回的 map數據的長度
													$scope.getArray = data;

													$timeout(
															function() {
																angular
																		.element(
																				document
																						.querySelector('#outs'))
																		.triggerHandler(
																				'click');
															}, 0);

												});
								$scope.stfbas.allSelectOut=false;

							};*/

							//导出 /*lg*/
							//导出数据格式化方法
							$scope.formDCMeth = function(obj) {
								$scope.forD.a = obj.stfNum;
								$scope.forD.b = obj.currStfNum;
								$scope.forD.c = obj.stfNm;
								$scope.forD.d = $filter("dicNameFilter")(obj.sex, "C003");
								$scope.forD.e = $filter('dicNameFilter')(obj.maritalStatus, "C049");
								if ($filter('stfBasPCV')(obj.homeAddrProv) != '0000' && comApi.isNotNullAndUndefined($filter('stfBasPCV')(obj.homeAddrProv))) {
									if ($filter('stfBasPCV')(obj.homeAddrCity) != '0000' && comApi.isNotNullAndUndefined($filter('stfBasPCV')(obj.homeAddrCity))) {
										$scope.forD.f = $filter('stfBasPCV')(obj.homeAddrProv) + ">" + $filter('stfBasPCV')(obj.homeAddrCity);
									} else {
										$scope.forD.f = $filter('stfBasPCV')(obj.homeAddrProv);
									}
								} else {
									$scope.forD.f = "";
								}
								$scope.forD.g = obj.phone;
								$scope.forD.h = '\t'+obj.stfIdNum;
								if ($filter('stfBasPCV')(obj.locProv) != '0000' && comApi.isNotNullAndUndefined($filter('stfBasPCV')(obj.locProv))) {
									if($filter('stfBasPCV')(obj.locCity) != '0000' && comApi.isNotNullAndUndefined($filter('stfBasPCV')(obj.locCity))){
										$scope.forD.i = $filter('stfBasPCV')(obj.locProv) + ">" + $filter('stfBasPCV')(obj.locCity);
									}else{
										$scope.forD.i = $filter('stfBasPCV')(obj.locProv);
									}
								}else{
									$scope.forD.i = "";
								}
								$scope.forD.j = $filter("dicNameFilter")(obj.workStat, "C001");//
								$scope.forD.k = $filter("dicNameFilter")(obj.materialCompleteFlag, "C002");//getAge(obj.birtyday);
								$scope.forD.l = $filter("date")(obj.stfEntDt, "yyyy-MM-dd");
								$scope.forD.m = $filter("stfBasSubDep")(obj.subDep);
								$scope.forD.n = $filter('stfBasPosNum')(obj.posNum);
								$scope.forD.o = obj.posGrdNum;
								$scope.forD.p = obj.supvrStfNm;
								$scope.forD.q = obj.subStrNm;
								$scope.forD.r = $filter("dicNameFilter")(obj.calcSalFlg, "C002");
								$scope.forD.s = $filter("dicNameFilter")(obj.crtAcctFlg, "C002");
								$scope.forD.t = $filter("dicNameFilter")(obj.crtAcctAppFlg, "C002");
								return $scope.forD;
							};

							//当前日期
							var currentDate = new Date().Format("yyyyMMdd");

							//批量导出
							$scope.outPut = function() {
								var isEmptySelect = true;
								$scope.outStaff = [{
									"a": "人员编号",
									"b": "现员工编号",
									"c": "姓名",
									"d": "性别",
									"e": "婚否",
									"f": "籍贯",
									"g": "联系电话",
									"h": "身份证号码",
									"i": "所在城市",
									"j": "在岗状态",
									"k": "纸质材料是否齐全",
									"l": "入职日期",
									"m": "所属部门",
									"n": "职位名称",
									"o": "职位等级",
									"p": "直属主管",
									"q": "所属门店",
									"r": "是否计算工资",
									"s": "是否开通WEB端权限",
									"t": "是否开通APP端权限"
								}];

								var stnum = "";

								angular.forEach($scope.list, function (item) {
									if (self.checkboxes.items[item.stfNum] == true) {
										isEmptySelect = false;
										$scope.forD = {
											"a": "",
											"b": "",
											"c": "",
											"d": "",
											"e": "",
											"f": "",
											"g": "",
											"h": "",
											"i": "",
											"j": "",
											"k": "",
											"l": "",
											"m": "",
											"n": "",
											"o": "",
											"p": "",
											"q": "",
											"r": "",
											"s": "",
											"t": ""
										};
										$scope.outStaff.push($scope.formDCMeth(item));
										stnum += '"'
											+ item.stfNum
											+ '"' + ",";
									}
								});

								if(isEmptySelect){
									comApi.HintMessage("error", "错误", "msg.common.00008", 0, "");
									return;
								}
								$scope.filename = "人员信息_" + currentDate + ".csv";

								$scope.getArray = $scope.outStaff;
								$timeout(
									function () {
										angular
											.element(
											document
												.querySelector('#outs'))
											.triggerHandler(
											'click');
									}, 1000);
							};

							angular.element(".select-all").prop("indeterminate",true);
							$scope.zhuangtai = comApi
									.getSelectBoxDic("C001", 2);
							$scope.stfbas.workStat= $scope.zhuangtai[0].key;
							$scope.job = comApi.getSelectBoxJob(2);
							$scope.stfbas.posNum= $scope.job[0].key;
							//职位等级
							$scope.posLvls = comApi.getSelectAllPos(2);
							$scope.stfbas.posGrdNum= $scope.posLvls[0].key;
							$scope.department = comApi.getSelectBoxDepartment(2);
							 $scope.stfbas.subDep= $scope.department[0].key;
							// 籍贯——省
							$scope.nativeProv = comApi.getSelectBoxPCV("1", "2");
							$scope.stfbas.homeAddrProv = $scope.nativeProv[0].key;
							// 籍贯——市
							$scope.nativeCity = comApi.getSelectBoxPCV(
								$scope.stfbas.homeAddrProv, "2");
							$scope.stfbas.homeAddrCity = $scope.nativeCity[0].key;
							//选择省份的时候查询对应的城市
							$scope.selectNativeCity = function() {
								$scope.nativeCity = comApi.getSelectBoxPCV(
									$scope.stfbas.homeAddrProv, "2");
								$scope.stfbas.homeAddrCity = $scope.nativeCity[0].key;
								//$scope.homeAddrPref = [];
							};


							// 职位/*lg*/
							$scope.positions = comApi.getSelectBoxJob(2);
							//职位等级，默认为全部
							$scope.curPoslvl = comApi.getSelectBoxPosLvl($scope.stfbas.posGrdNum, 2);
							$scope.stfbas.posGrdNum = $scope.curPoslvl[0].key;
							//根据职位获取职位等级/*lg*/
							$scope.getPosLvls = function(posNum) {
								$scope.curPoslvl = comApi.getSelectBoxPosLvl(posNum, 2);
								//职位等级默认选中第一个
								if (comApi.isNotEmptyObject($scope.curPoslvl)) {
									$scope.stfbas.posGrdNum = $scope.curPoslvl[0].key;
								}
							};
							//纸质材料是否齐全
							$scope.materialCompleteFlags = comApi.getSelectBoxDic("C002", 2);
							//纸质材料默认选中全部
							$scope.stfbas.materialCompleteFlag = "0000";

							/* 初始化 不加载任何数据点击搜索的时候检索数据 */
							// 点击 搜索的方法 initialselect()
							$scope.initialselect = function() {


								if( typeof ($scope.stfbas.stfEntDtStart+0) != "number"){
									$scope.stfbas.stfEntDtStart = $scope.stfbas.stfEntDtStart.getTime();
								}

								if( typeof ($scope.stfbas.stfEntDtEnd+0) != "number"){
									$scope.stfbas.stfEntDtEnd = $scope.stfbas.stfEntDtEnd.getTime();
								}

								/*if (comApi.isNotNullAndUndefined($scope.stfbas.stfEntDtStart)){

									$scope.stfbas.stfEntDtStart = $scope.stfbas.stfEntDtStart.getTime();
								}

								if (comApi.isNotNullAndUndefined($scope.stfbas.stfEntDtEnd)) {
									$scope.stfbas.stfEntDtEnd = $scope.stfbas.stfEntDtEnd.getTime();
								}*/

								// 請求后台獲取數據的方法
								comApi
										.post(
												"/staff/stfbasselect",
												$scope.stfbas,
												function(data) {
													self.checkboxes.checked =false;
													angular.element(".select-all").prop("indeterminate",false);
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
