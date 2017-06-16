/**
 * 此方法是人员基本信息插入的方法
 * by 江风成 2016-4-14
 */
app.controller('stfBasInsert',['$scope','NgTableParams','Upload','comApi','$filter','toaster','$stateParams','$state','$modal','fileUploadApi','$element',
	function($scope, NgTableParams, Upload, comApi, $filter,toaster, $stateParams, $state,$modal,fileUploadApi, element) {
			$scope.oneAtATime = true;
			var hasDirSupFlg = true;
			
			//初始化手風琴展開效果
			$scope.status = {
				jbxxopen : true,
				gwzzxxopen : true,
				gzkxxopen : true,
				zjdzsmxxopen : true,
				grjlxxopen : true,
				ldhtxxopen : true,
				ssmdopen : true,
				sbxxopen : true,
				gjjxxopen : true,
				zhxxopen : true
			};
			//初始化变量
			$scope.submit={};
			$scope.submit.flag = true;
			$scope.insert = {
			    figure : fileUploadApi.newSingleFileUpload(fileUploadApi.fileType.MEM_THUM),
			    bnkCardPic : fileUploadApi.newSingleFileUpload(fileUploadApi.fileType.BNK_THUM),
			    idCardPosPic : fileUploadApi.newSingleFileUpload(fileUploadApi.fileType.IDC_THUM),
			    idCardOppPic :fileUploadApi.newSingleFileUpload(fileUploadApi.fileType.IDC_THUM),
			    healthCertPic : fileUploadApi.newSingleFileUpload(fileUploadApi.fileType.IDC_THUM),
				resumeFileNm : fileUploadApi.newSingleFileUpload(fileUploadApi.fileType.ATT_THUM),
			    ages : 0,
				/*lg*/
				materialCompleteFlag: "0",
				currStfNum: "",
				maritalStatus: "",
				school:""
			};
			// 上传文件标志
			$scope.uploadFlag = fileUploadApi.uploadFlag;
			//定义变量判断是否显示所属门店
			$scope.marknum="1";
//			$scope.isSubmit=false;
			//初始化默认等级显示
			$scope.posGrdNums=true;
			//初始化第一步显示页面
			$scope.nextOne=true;
			//初始化第二步不显示
			$scope.nextTwo=false;
			//初始化是是直属主管
			$scope.insert.hasDirSupFlg="true";

			//工作经验校验提示消息
			$scope.workExpMsg = comApi.getMessageStr("msg.staff.10002");

			var createFlg = false;
			
			$scope.resumeInfoInsertEditor = null;
			
			//下一步
			$scope.next=function(evet){

				if (!createFlg) {
					//创建富文本框编辑器
					$scope.resumeInfoInsertEditor = MyEditor.createEditor("resumeInfoInsert", {"height":"340px"});
					createFlg = true;
				}

				hasDirSupFlg = $scope.insert.hasDirSupFlg;
			  if($scope.insert.hasDirSupFlg == 'false'){
			    $scope.insert.supvrStfNums = "";
			    $scope.insert.supvrStfNum = "";
			  }else if($scope.insert.supvrStfNum == ""){
			    $scope.xxxs = true;
			    return;
			  }
			  if($scope.insert.hasDirSupFlg == 'true' && $scope.insert.supvrStfNums==null){
			    $scope.xxxs=true;
			    return;
			  }
              //时间处理
              //出生日期
              $scope.insert.dtOfBirth=$filter("date")($scope.insert.dtOfBirth,'yyyy-MM-dd');
              //入职时间
              $scope.insert.stfEntDt=$filter("date")($scope.insert.stfEntDt,'yyyy-MM-dd');
              //转正时间
              $scope.insert.regularStfDt=$filter("date")($scope.insert.regularStfDt,'yyyy-MM-dd');
              //离职时间
              $scope.insert.dimiDt=$filter("date")($scope.insert.dimiDt,'yyyy-MM-dd');
              //签订劳动合同起始时间
              $scope.insert.laborConrtactStartTm=$filter("date")($scope.insert.laborConrtactStartTm,'yyyy-MM-dd');
              //劳动合同终止时间
              $scope.insert.laborContractEndTm=$filter("date")($scope.insert.laborContractEndTm,'yyyy-MM-dd');
              //购买日期
              $scope.insert.ssPruDt=$filter("date")($scope.insert.ssPruDt,'yyyy-MM-dd');
              //停止购买日期
              $scope.insert.stopSSDt=$filter("date")($scope.insert.stopSSDt,'yyyy-MM-dd');
              //购买日期
              $scope.insert.accumFundDt=$filter("date")($scope.insert.accumFundDt,'yyyy-MM-dd');
              //停止购买日期
              $scope.insert.stopBuyDt=$filter("date")($scope.insert.stopBuyDt,'yyyy-MM-dd');
				//判断是否是直属主管并且判断主管是否为空
				if($scope.insert.hasDirSupFlg=="true"&&$scope.insert.supvrStfNum==null){
					return;
			    }
				$scope.posGrdNum = comApi.getSelectBoxPosLvl($scope.insert.posNum,1);
				if($scope.posGrdNum.length=="1"){
				  $scope.posGrdNums=false;
				} else {
				  $scope.posGrdNums=true;
				  $scope.insert.posGrdNum = $scope.insert.posGrdNum ? $scope.insert.posGrdNum : $scope.posGrdNum[0].key;
				}
				//显示部门
				$scope.insert.subDeps =$scope.insert.subDep;
				//显示职位
				$scope.insert.posNums = $scope.insert.posNum;
				//获取是否是销售部
				comApi.get("/staff/stfbasmaknum/" + $scope.insert.posNum, function(data) {
					// 销售部场合
					if (data == true) {
					  $scope.marknum="0";
					  $scope.submit.flag = $scope.insert.stfStrRel ? false : true;
					} else {
					  $scope.marknum="1";
					  $scope.submit.flag = false;
					}
					//第一步页面隐藏
					$scope.nextOne=false;
					//第二步页面显示
					$scope.nextTwo=true;
				});
			}
			//上一步
			$scope.Back=function(){
				$scope.insert.hasDirSupFlg = hasDirSupFlg;
				//第二步页面隐藏
				$scope.nextOne=true;
				//第一步页面显示
				$scope.nextTwo=false;
			};
			//直属主管弹窗
		    $scope.openStaff = function(size) {
		          var modalInstance = $modal.open({
		              templateUrl : 'radiostaff.html',
		              controller : 'radioStaffController',
		              size : size,
		              resolve : {
		                //传递你的flag(1:不需要权限查询全部数据,2：需要权限查询部分数据)
		                flag : function() {
		                    return 1;
		                },
		                //配置需要注入JS
		                deps: ['$ocLazyLoad', function ($ocLazyLoad) { return $ocLazyLoad.load(['common/js/controllers/radiostaff.js']);}]
		              }
		          
		          });
		          
		          //父子传递参数
		          modalInstance.result.then(function(selectedItem) {
		            if(selectedItem.length>0){
		              //给text窗口赋显示格式的值
		              $scope.insert.supvrStfNums=selectedItem[0].stfNum+"."+selectedItem[0].stfNm;
		              //向变量中赋主管的编号
		              $scope.insert.supvrStfNum=selectedItem[0].stfNum;
		              $scope.xxxs=false;
		              //查询是否是主管的信息
		              comApi.get("/staff/getSupvrStfInfo/" + selectedItem[0].stfNum,
		                  function(data) {
		                if (data.supvrStfPosNum != "") {
		                  $scope.status.supvrStfInfoDisabled = true;
		                  $scope.supvrStfPosNum = data.supvrStfPosNum;
		                  $scope.supvrStfList = data.supvrStfList;
		                } else {
		                  $scope.status.supvrStfInfoDisabled = false;
		                  $scope.supvrStfPosNum = "";
		                  $scope.supvrStfList = {};
		                }
		              });
		            }else{
		              $scope.insert.supvrStfNums="";
		              $scope.insert.supvrStfNum="";
		              $scope.status.supvrStfInfoDisabled = false;
                      $scope.supvrStfPosNum = "";
                      $scope.supvrStfList = {};
		            }
		          });
		         };
		      // 所属门店浏览
		         $scope.openDep = function(size) {
		           var modalInstance = $modal.open({
		             templateUrl : 'multiselectstore.html',
		             controller : 'multiSelectStoreController',
		             size : size,
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
		                         .load([ 'common/js/controllers/multiselectstore.js' ]);
		                   } ]
		             }
		           });
		           // 父子传递参数
		           modalInstance.result.then(function(selectedItem) {
		        	   //接收传过来的门店参数放入变量中
		        	  // $scope.insert.stfStrRel=selectedItem;
		             if($scope.insert.stfStrRel!=null){
		               $scope.submit.flag = false;
		        	   $scope.insert.stfStrRel=$scope.unique($scope.insert.stfStrRel.concat(selectedItem));
		             }else{
		               $scope.insert.stfStrRel=$scope.unique(selectedItem);
                       $scope.submit.flag = false;
		             }
		             
		             $scope.tableParams = new NgTableParams(
								{
								}, {
									// 把data数据集绑定前台
									dataset : $scope.insert.stfStrRel,
									// 可以点击的显示自己想要一页显示多少条
									counts : [ 20,
											50,
											100,
											200 ]
								});
		           });
		         };
		         $scope.unique = function(data){
                   var a = data;
                   var b =data;
              for (var i=0; i<a.length; i++) {  
                  var num =0;
                  for(var j=0; j<b.length; j++)
                  if(a[i].strNum==b[j].strNum){
                      num++;
                      if(num==2){
                         data.splice(j,1);
                      }
                  }
                 }  
                        return data;  
                 }
		         //删除门店
		        $scope.delsrot=function(id){
		          var data = $scope.insert.stfStrRel;
		          data.splice(id, 1)
                 $scope.insert.stfStrRel=data;
                 $scope.tableParams = new NgTableParams(
                          {
                          }, {
                              // 把data数据集绑定前台
                              dataset : $scope.insert.stfStrRel,
                              // 可以点击的显示自己想要一页显示多少条
                              counts : [ 20,
                                      50,
                                      100,
                                      200 ]
                          });
                 if(data.length == 0){
                   $scope.submit.flag = true;
                 }
		         
		        };
		         
					// 下拉框职位
					$scope.jobs = comApi.getSelectBoxJob(0);
					$scope.curPoslvl = comApi.getSelectBoxPosLvl($scope.jobs[0].key, 0);
					if (comApi.isNotEmptyObject($scope.curPoslvl)) {
						$scope.insert.posGrdNum = $scope.curPoslvl[0].key;
					} else {
						$scope.insert.posGrdNum = '0000';
					}

					//根据职位获取职位等级/*lg*/
					$scope.getPosLvls = function(posNum) {
						$scope.curPoslvl = comApi.getSelectBoxPosLvl(posNum, 0);
						//职位等级默认选中第一个
						if (comApi.isNotEmptyObject($scope.curPoslvl)) {
							$scope.insert.posGrdNum = $scope.curPoslvl[0].key;
						} else {
							$scope.insert.posGrdNum = '0000';
						}
					};

					//下拉框部门
					$scope.departments = comApi.getSelectBoxDepartment(0);
					if ($scope.departments.length > 0) {
						//默认显示部门第一个
						$scope.insert.subDep= $scope.departments[0].key;
					}
					if ($scope.jobs.length > 0) {
						//默认显示职位第一个
						$scope.insert.posNum= $scope.jobs[0].key;
					}
					//初始化默认选中性别
					$scope.insert.sex = "2";
					//下拉框所属省
					$scope.locProv = comApi.getSelectBoxPCV("1", 0);
					//默认显示第一个省
					$scope.insert.locProv=$scope.locProv[0].key;
					//省改变事件
					$scope.selectc = function() {
						$scope.locCity = comApi.getSelectBoxPCV($scope.insert.locProv, "0");
						$scope.insert.locCity=$scope.locCity[0].key;
					}
					$scope.selectc();
					//学历下拉框
					$scope.degree = comApi.getSelectBoxDic("C009", "1"); 
					$scope.insert.degree = $scope.degree[0].key;
					//婚姻状况/*lg*/
					$scope.maritalStatuss = comApi.getSelectBoxDic("C049", 1);
					$scope.insert.maritalStatus = $scope.maritalStatuss[0].key;
					//在岗状态下拉框
					$scope.workStat = comApi.getSelectBoxDic("C001",0);
					//初始化默认显示在岗状态
					$scope.insert.workStat=$scope.workStat[0].key;
					//初始化是否计算工资
					$scope.insert.calcSalFlg="1";
					//初始化是否启用账号
					$scope.insert.crtAcctFlg="1";
					   //初始化是否启用账号
                    $scope.insert.crtAcctAppFlg="1";
					//显示部门
					$scope.insert.subDeps =$scope.insert.subDep;
					//显示职位
					$scope.insert.posNums = $scope.insert.posNum;
					//$scope.insert.posGrdNums = $scope.insert.posGrdNum;
					//银行卡下拉框
					$scope.bnkCardBnkNm = comApi.getSelectBoxDic("C010", "1");
					$scope.insert.bnkCardBnkNm = $scope.bnkCardBnkNm[0].key;
					//下拉框社保卡发放状态
					$scope.ssCardStat = comApi.getSelectBoxDic("C012", "1");
					$scope.insert.ssCardStat = $scope.ssCardStat[0].key;
					//下拉框公积金卡发放状态
					$scope.accumFundCardStat = comApi.getSelectBoxDic("C012","1");
					$scope.insert.accumFundCardStat = $scope.accumFundCardStat[0].key;
					//公积金省下拉框
					$scope.accumFundProv = comApi.getSelectBoxPCV("1", "1");
					$scope.insert.accumFundProv = $scope.accumFundProv[0].key;
					//公积金市下拉框
					$scope.selectgmd = function() {
						$scope.accumFundCity = comApi.getSelectBoxPCV(
								$scope.insert.accumFundProv, "1");
						$scope.insert.accumFundCity = $scope.accumFundCity[0].key;
					}
					//社保卡省下拉框
					$scope.ssPruProv = comApi.getSelectBoxPCV("1", "1");
					$scope.insert.ssPruProv = $scope.ssPruProv[0].key;
					//社保卡市下拉框
					$scope.selectgjj = function() {
						$scope.ssPruCity = comApi.getSelectBoxPCV(
								$scope.insert.ssPruProv, "1");
						$scope.insert.ssPruCity = $scope.ssPruCity[0].key;
					}
					//劳动合同类型类型下拉框
					$scope.laborContractType = comApi.getSelectBoxDic("C011","1");
					$scope.insert.laborContractType = $scope.laborContractType[0].key;

					// 籍贯——省/*lg*/
					$scope.homeAddrProv = comApi.getSelectBoxPCV("1", "1");
					$scope.insert.homeAddrProv = $scope.homeAddrProv[0].key;
					// 籍贯——市
					$scope.homeAddrCity = comApi.getSelectBoxPCV(
						$scope.insert.homeAddrProv, "1");

					//选择省份的时候查询对应的城市
					$scope.selectAddrCity = function() {
						$scope.homeAddrCity = comApi.getSelectBoxPCV(
							$scope.insert.homeAddrProv, "1");
						$scope.insert.homeAddrCity = $scope.homeAddrCity[0].key;
					};

					// 家庭住址省
					/*$scope.homeAddrProv = comApi.getSelectBoxPCV("1", "1");
					 $scope.insert.homeAddrProv = $scope.homeAddrProv[0].key;
					// 家庭住址市
					$scope.selectAddrCity = function() {
						$scope.homeAddrCity = comApi.getSelectBoxPCV(
								$scope.insert.homeAddrProv, "1");
						 $scope.insert.homeAddrCity = $scope.homeAddrCity[0].key;
						$scope.homeAddrPref = [];
					}*/
					// 家庭住址县
					/*$scope.selectAddrPref = function() {
						$scope.homeAddrPref = comApi.getSelectBoxPCV(
								$scope.insert.homeAddrCity, "1");
						 $scope.insert.homeAddrPref = $scope.homeAddrPref[0].key;

					}*/

					//附件上传回调路径
//					$scope.$on("resumeFileNm", function(event, msg) {
//						$scope.insert.resumeFileNm = msg;
//					})
		/*
		 * 插入人员信息
		 */
		$scope.inserter = function() {
			$scope.insert.hasDirSupFlg = hasDirSupFlg;
			if($scope.posGrdNums==true){
				if($scope.insert.posGrdNum=='0000'){
					comApi.HintMessage(["error","职位等级"], "", "msg.common.00014",0, "");
				    return;
				}
			}
			if($scope.insert.crtAcctFlg!="0"&&$scope.insert.crtAcctAppFlg!="0"){
			  if($scope.insert.sysPw == null || $scope.insert.sysPw == "" || $scope.insert.sysPw == undefined || $scope.insert.sysPw.length<1){
			    comApi.HintMessage(["error","系统账号密码"], "", "msg.common.00014",0, "");
			    return;
			  }
				
			}
			
			$scope.insertCopy =  angular.copy($scope.insert);
			$scope.insertCopy.figure = fileUploadApi.getUploadSuccFileUrl($scope.insertCopy.figure);
            $scope.insertCopy.bnkCardPic = fileUploadApi.getUploadSuccFileUrl($scope.insertCopy.bnkCardPic);
            $scope.insertCopy.idCardPosPic = fileUploadApi.getUploadSuccFileUrl($scope.insertCopy.idCardPosPic);
            $scope.insertCopy.idCardOppPic = fileUploadApi.getUploadSuccFileUrl($scope.insertCopy.idCardOppPic);
            if($scope.insertCopy.healthCertPic != ""){
              $scope.insertCopy.healthCertPic = fileUploadApi.getUploadSuccFileUrl($scope.insertCopy.healthCertPic);
            }
            $scope.insertCopy.resumeFileNm = fileUploadApi.getUploadSuccFileUrl($scope.insertCopy.resumeFileNm);

			// 导出方法
			/*comApi.post("/staff/stfbasrepeat",$scope.insertCopy, function(data) {
			if(data==0){*/

//              $scope.isSubmit=true;
                //劳动合时间验证
                if($scope.insert.laborContractEndTm!=null&&$scope.insert.laborContractEndTm!=''&&$filter("date")($scope.insert.laborContractEndTm,'yyyy-MM-dd')<$filter("date")($scope.insert.laborConrtactStartTm,'yyyy-MM-dd')){
                 comApi.HintMessage(["error","劳动合时间"], "", "msg.common.00012",0, "");
//                 $scope.isSubmit=false;
                return;
                 //社保时间验证
                }else if($scope.insert.stopSSDt!=null&&$scope.insert.stopSSDt!=''&&$filter("date")($scope.insert.stopSSDt,'yyyy-MM-dd')<$filter("date")($scope.insert.ssPruDt,'yyyy-MM-dd')){
                comApi.HintMessage( ["error","社保时间"], "", "msg.common.00012",0, "");            
//                $scope.isSubmit=false;
                return;
                //公积金时间验证
                }else if($scope.insert.stopBuyDt!=null&&$scope.insert.stopBuyDt!=''&&$filter("date")($scope.insert.stopBuyDt,'yyyy-MM-dd')<$filter("date")($scope.insert.accumFundDt,'yyyy-MM-dd')){
                comApi.HintMessage( ["error","公积金时间"], "", "msg.common.00012",0, "");           
//                $scope.isSubmit=false;
                return;
                }
                //判断是否是主管
                if($scope.insert.hasDirSupFlg=="true"){
                //等于true的时候是主管
                $scope.insert.hasDirSupFlg="1";
                }else{
                //不是主管
                $scope.insert.hasDirSupFlg="0"
                }
                if(($scope.marknum=="0"&&$scope.insert.stfStrRel==null)||($scope.marknum=="0"&&$scope.insert.stfStrRel.length==0)){
                  comApi.HintMessage(["error","所属门店"], "", "msg.common.00014",0, "");
//                  $scope.isSubmit=false;
                    return;
                }
                //$scope.insert.resumeInfo = $("#resumeInfo").html();
				$scope.insert.resumeInfo = MyEditor.getHtmlVal($scope.resumeInfoInsertEditor);
                $scope.insert.stfEntDt = $filter('date')(
                $scope.insert.stfEntDt, 'yyyy-MM-dd');

                $scope.insertCopy =  angular.copy($scope.insert);
                $scope.insertCopy.figure = fileUploadApi.getUploadSuccFileUrl($scope.insertCopy.figure);
                $scope.insertCopy.bnkCardPic = fileUploadApi.getUploadSuccFileUrl($scope.insertCopy.bnkCardPic);
                $scope.insertCopy.idCardPosPic = fileUploadApi.getUploadSuccFileUrl($scope.insertCopy.idCardPosPic);
                $scope.insertCopy.idCardOppPic = fileUploadApi.getUploadSuccFileUrl($scope.insertCopy.idCardOppPic);
                $scope.insertCopy.resumeFileNm = fileUploadApi.getUploadSuccFileUrl($scope.insertCopy.resumeFileNm);
                if($scope.insertCopy.healthCertPic != ""){
                  $scope.insertCopy.healthCertPic = fileUploadApi.getUploadSuccFileUrl($scope.insertCopy.healthCertPic);
                }

				if ($scope.marknum != 0) {
					delete $scope.insertCopy["stfStrRel"];
				}

				// 导出方法
                comApi.post("/staff/stfbasinsert",
                    $scope.insertCopy, function(data) {
                    comApi.HintMessage( ["success","人员信息"], "", "msg.common.00023",3000, "");
                    setTimeout(function() {
                            $state.go("app.staff.stfBas");}, "1000");
                                    });
                
            
              
			/*}else{
			  
				comApi.HintMessage( ["error",$scope.insert.stfIdNum,$filter("stfBasPosNum")($scope.insert.posNum)], "","msg.common.00043",0, "");
			}
			});*/
	}
	$scope.ngchange = function(dateOfBirth){
	  var dateBirth = $filter("date")(dateOfBirth,'yyyy-MM-dd');
	  var date = $filter("date")(new Date(),'yyyy-MM-dd');
	  if(dateBirth != null){
		  if(dateBirth > date){
			  comApi.HintMessage( ["error","出生日期","当前系统时间"], "", "msg.common.00052",0, "");
			  $scope.insert.dtOfBirth = "";
			  $scope.insert.ages = 0;
		  }else{
			  $scope.insert.ages = $filter("date")(new Date(),'yyyy') - $filter("date")(dateOfBirth,'yyyy');
		  }
	  }else{
		  $scope.insert.ages = 0;
	  }
	}				
	
	  // 选择图片
	  $scope.selectImg = function(evt, imgData) {
	    fileUploadApi.selectFile(evt, imgData, fileUploadApi.checkImgFileFormat,fileUploadApi, $scope, comApi);
	  };

	  // 删除图片
	  $scope.delImgItem = function(imgData, imgItem) {
	    fileUploadApi.delFileItem(imgData, imgItem, $scope);
	  };

	  // 上传图片
	  $scope.uploadImg = function(imgData) {
	    fileUploadApi.uploadFile(imgData, fileUploadApi);
	  };
	    //选择附件
      $scope.selectFile = function(evt, fileData){
    	  fileUploadApi.selectFile(evt, fileData, '',fileUploadApi, $scope, comApi);
      }
    //上传附件
      $scope.uploadFile = function(fileData){
    	  fileUploadApi.uploadFile(fileData, fileUploadApi);
      }
	  //上传附件
//	  $scope.handleFileSelect = function(evt) {
//		evt.target.value = "";
//		angular.element(evt.target).unbind('change');
//		angular.element(evt.target).one('change', function (evt) {
//			$scope.resumeFileNms = "";
//			$scope.resumeFileNmd = "";
//			var file = evt.currentTarget.files[0];
//			if (file) {
//				$scope.filefuj = file;
//				$scope.insert.filefuj=file.name;
//				$scope.$apply();
//			}
//		});
//      };
//      $scope.fileup = function() {
//          if ($scope.filefuj) {
//              $scope.upload($scope.filefuj);
//          }
//      };
  
      // upload on file select or drop
  
//      $scope.upload = function(file) {
//          Upload.upload({
//              url : '/CrmWeb/api/upload/files',
//              data : {
//                  file : file,
//                  type : "attachment"
//              }
//          }).then(function(resp) {
//              $scope.resumeFileNms= "上传附件成功！";
//              $scope.$emit("resumeFileNm",resp.data.data[0]);
//              $scope.insert.resumeFileNm = resp.data.data[0];
//          }, function(resp) {
//              $scope.resumeFileNmd = "上传附件失败！";
//          });
//      };
     // angular.element('#filefuj').on('change',handleFileSelect);
} ]);
