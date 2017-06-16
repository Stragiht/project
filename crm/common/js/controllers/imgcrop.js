 
app.controller('ImgCropCtrl', [
		'$scope',
		'Upload','comApi','$filter',
		function($scope, Upload,comApi,$filter) {
			$scope.myImage = '';
			$scope.myCroppedImage = '';
			$scope.cropType = "circle";
			$scope.insert = {};
			//头像
			$scope.$on("figurePath", function(event, path) {
			  
			  if(path!=null){
			  $scope.myCroppedImage = $filter("imgpath")(path);
			  }else{
			 
			  $scope.myCroppedImage ='../crm/staff/img/default.jpg';
			  }
			});
			var handleFileSelect = function(evt) {
				$scope.figures = "";
				$scope.figured = "";
				var file = evt.currentTarget.files[0];
				if(parseInt(file.size) > 2097152){
				comApi.HintMessage( "error", "", "msg.common.10004",3000, "");
				return;
				}else if(!/\.(jpg|png|JPG|PNG)$/.test(file.name)){
				comApi.HintMessage( "error", "", "msg.common.10003",3000, "");
				return;
				}
				
				var reader = new FileReader();
				reader.onload = function(evt) {
					$scope.$apply(function($scope) {
						$scope.myImage = evt.target.result;
					});
				};

				$scope.fileInput = file;
				reader.readAsDataURL(file);
			};
			$scope.submit = function() {
				if ($scope.fileInput) {
					$scope.upload($scope.fileInput);
				}
			};
			// upload on file select or drop
			$scope.upload = function(file) {
		        var files = [];
	             files.push($scope.myCroppedImage);
	                var requestData = {"type":"userfhotourl", base64Images:files};
	                comApi.post("upload/base64Images", requestData, function(data){
	                  for (var j = 0; j < data.length; j++) {
	                    if (!data[j] || data[j] == "") {//上传失败
	                      $scope.figured = "上传头像失败！";
	                    } else {
	                      $scope.$emit("figure",data[0]);
	                      $scope.insert.figure =data[0];
	                      $scope.figures = "上传头像成功！";
	                    }
	                  }
	                });
 
			};

			angular.element(document.querySelector('#fileInput')).on('change',
					handleFileSelect);
		} ]);
app.controller('ImgoneCtrl', [
		'$scope',
		'Upload','comApi','$filter',
		function($scope, Upload,comApi,$filter) {
			$scope.myImageo = '';
			$scope.myCroppedImageo = '';
			$scope.cropTypeo = "square";
			$scope.insert = {};
			$scope.$on("bnkCardPicPath", function(event, path) {
			        if(path!=null){
		              $scope.myImageo = $filter("imgpath")(path);
		              }else{
		              $scope.myImageo = '../crm/staff/img/default.jpg';
		              }
				});
			var handleFileSelect = function(evt) {
				$scope.bnkCardPics = "";
				$scope.bnkCardPicd = "";
				var file = evt.currentTarget.files[0];
				if(parseInt(file.size) > 2097152){
					comApi.HintMessage( "error", "", "msg.common.10004",3000, "");
					return;
					}else if(!/\.(jpg|png|JPG|PNG)$/.test(file.name)){
					comApi.HintMessage( "error", "", "msg.common.10003",3000, "");
					return;
					}
				var reader = new FileReader();
				reader.onload = function(evt) {
					$scope.$apply(function($scope) {
						$scope.myImageo = evt.target.result;
					});
				};
				$scope.fileInput1 = file;
				reader.readAsDataURL(file);
			};
			$scope.submit1 = function() {
				if ($scope.fileInput1) {
					$scope.upload($scope.fileInput1);
				}
			};

			// upload on file select or drop

			$scope.upload = function(file) {
				Upload.upload({
					url : '/CrmWeb/api/upload/files',
					data : {
						file : file,
						type : "bankfhotourl"
					}
				}).then(function(resp) {
					$scope.insert.bnkCardPic = resp.data.data[0];
					$scope.bnkCardPics= "上传银行正面图片成功！";
					$scope.$emit("bnkCardPic", resp.data.data[0]);

				}, function(resp) {
					$scope.bnkCardPicd = "上传银行正面图片失败！";
				});
			};

			angular.element(document.querySelector('#fileInput1')).on('change',
					handleFileSelect);
		} ]);
app.controller('ImgtwoCtrl', [
		'$scope',
		'Upload','comApi','$filter',
		function($scope, Upload,comApi,$filter) {
			$scope.myImaget = '';
			$scope.myCroppedImaget = '';
			$scope.cropTypet = "circle";
			$scope.insert = {};
			// 身份证正面
			$scope.$on("idCardPosPicPath", function(event, path) {
			
		       if(path!=null){
		         $scope.insert.idCardPosPic = path;
                 $scope.myImaget = $filter("imgpath")(path);
           
                 }else{
                 $scope.myImaget = '../crm/staff/img/default.jpg';
                 }
			});
			var handleFileSelect = function(evt) {
				$scope.idCardPosPics = "";
				$scope.idCardPosPicd = "";
				var file = evt.currentTarget.files[0];
				if(parseInt(file.size) > 2097152){
					comApi.HintMessage( "error", "", "msg.common.10004",3000, "");
					return;
					}else if(!/\.(jpg|png|JPG|PNG)$/.test(file.name)){
					comApi.HintMessage( "error", "", "msg.common.10003",3000, "");
					return;
					}
				var reader = new FileReader();
				reader.onload = function(evt) {
					$scope.$apply(function($scope) {
						$scope.myImaget = evt.target.result;
					});
				};
				$scope.fileInput2 = file;
				reader.readAsDataURL(file);
			};
			$scope.submit2 = function() {
				if ($scope.fileInput2) {
					$scope.upload($scope.fileInput2);
				}
			};

			// upload on file select or drop

			$scope.upload = function(file) {
				Upload.upload({
					url : '/CrmWeb/api/upload/files',
					data : {
						file : file,
						type : "idcardpospic"
					}
				}).then(function(resp) {
					$scope.insert.idCardPosPic = resp.data.data[0];
					$scope.idCardPosPics = "上传身份证正面图片成功！";
					$scope.$emit("idCardPosPic",resp.data.data[0]);

				}, function(resp) {
					$scope.idCardPosPicd = "上传身份证正面图片失败！";
				});
			};

			angular.element(document.querySelector('#fileInput2')).on('change',
					handleFileSelect);
		} ]);
app.controller('ImgthreeCtrl', [
		'$scope',
		'Upload','comApi','$filter',
		function($scope, Upload,comApi,$filter) {
			$scope.myImager = '';
			$scope.myCroppedImager = '';
			$scope.cropTyper = "circle";
			$scope.insert = {};
			// 身份证反面
			$scope.$on("idCardOppPicPath", function(event, path) {
			      if(path!=null){
			        $scope.insert.idCardOppPic = path;
	                 $scope.myImager = $filter("imgpath")(path);
	                 }else{
	                 $scope.myImager = '../crm/staff/img/default.jpg';
	                 }
			});
			var handleFileSelect = function(evt) {
				var file = evt.currentTarget.files[0];
				if(parseInt(file.size) > 2097152){
					comApi.HintMessage( "error", "", "msg.common.10004",3000, "");
					return;
					}else if(!/\.(jpg|png|JPG|PNG)$/.test(file.name)){
					comApi.HintMessage( "error", "", "msg.common.10003",3000, "");
					return;
					}
				var reader = new FileReader();
				reader.onload = function(evt) {
					$scope.$apply(function($scope) {
						$scope.myImager = evt.target.result;
					});
				};
				$scope.fileInput3 = file;
				reader.readAsDataURL(file);
			};
			$scope.submit3 = function() {
				if ($scope.fileInput3) {
					$scope.upload($scope.fileInput3);
				}
			};

			// upload on file select or drop

			$scope.upload = function(file) {
				Upload.upload({
					url : '/CrmWeb/api/upload/files',
					data : {
						file : file,
						type : "idcardpospic"
					}
				}).then(function(resp) {

					$scope.insert.idCardOppPic = resp.data.data[0];
					$scope.idCardOppPics = "上传身份证反面图片成功！";
					$scope.$emit("idCardOppPic",resp.data.data[0]);

				}, function(resp) {
					$scope.idCardOppPicd = "上传身份证反面图片失败！";

				});
			};
			angular.element(document.querySelector('#fileInput3')).on('change',
					handleFileSelect);
		} ]);
app.controller('ImgfourCtrl', [
		'$scope',
		'Upload','comApi','$filter',
		function($scope, Upload,comApi,$filter) {
			$scope.myImagef = '';
			$scope.myCroppedImagef = '';
			$scope.cropTypef = "circle";
			$scope.insert = {};
			$scope.$on("healthCertPicPath", function(event, path) {
			      if(path!=null){
                    $scope.myImagef = $filter("imgpath")(path);
                    }else{
                    $scope.myImagef = '../crm/staff/img/default.jpg';
                    }
				});
			var handleFileSelect = function(evt) {
				var file = evt.currentTarget.files[0];
				if(parseInt(file.size)> 2097152){
					comApi.HintMessage( "error", "", "msg.common.10004",3000, "");
					return;
					}else if(!/\.(jpg|png|JPG|PNG)$/.test(file.name)){
					comApi.HintMessage( "error", "", "msg.common.10003",3000, "");
					return;
					}
				var reader = new FileReader();
				reader.onload = function(evt) {
					$scope.$apply(function($scope) {
						$scope.myImagef = evt.target.result;
					});
				};
				$scope.fileInput4 = file;
				reader.readAsDataURL(file);
			};
			$scope.submit4 = function() {
				if ($scope.fileInput4) {
					$scope.upload($scope.fileInput4);
				}
			};
 
			// upload on file select or drop

			$scope.upload = function(file) {
				Upload.upload({
					url : '/CrmWeb/api/upload/files',
					data : {
						file : file,
						type : "idcardpospic"
					}
				}).then(
						function(resp) {
							$scope.insert.healthCertPic = resp.data.data[0];	
							$scope.healthCertPics = "上传健康证图片成功！";
							$scope.$emit("healthCertPic", resp.data.data[0]);
						},
						function(resp) {
							$scope.healthCertPicd = "上传健康证图片失败！";
						} );
			};

			angular.element(document.querySelector('#fileInput4')).on('change',
					handleFileSelect);
		} ]);

//编辑商品品牌图片上传
app.controller('ImgGdsBrdUpdCtrl', [//ImgGdsBrdCtrl
	'$scope',
	'Upload','comApi','toaster',
	function($scope, Upload,comApi,toaster) {
		//定义图片上传的标志
		$scope.imgFlg = false;
		$scope.myImageo = '';
		//商品品牌图片上传的路径
		$scope.$on("myImagegbRod", function (event, msg) {
			$scope.myImageo = msg;

		})
		$scope.myCroppedImageo = '';
		$scope.cropTypeo = "square";
		$scope.insert = {};
		var handleFileSelect = function(evt) {
			comApi.myConsoleLog(evt.target.result+"======");
			comApi.myConsoleLog(evt+"=333==");
			comApi.myConsoleLog(angular.toJson(evt)+"===");
			//$scope.bnkCardPics = "";
			//$scope.bnkCardPicd = "";
			var file = evt.currentTarget.files[0];
			comApi.myConsoleLog(angular.toJson(file)+"====fil22e")
			if(parseInt(file.size) > 2097152){
				comApi.errorMessage("msg.common.10004");
				return;
			}else if(!/\.(jpg|png|JPG|PNG)$/.test(file.name)){
				comApi.errorMessage("msg.common.10003");
				return;
			}
			var reader = new FileReader();
			reader.onload = function(evt) {
				$scope.$apply(function($scope) {
					$scope.imgFlg = true;
					$scope.myImageo = evt.target.result;
				});
			};
			$scope.fileInput1 = file;
			reader.readAsDataURL(file);
		};
		$scope.submit1 = function() {
			if ($scope.imgFlg) {

				if ($scope.fileInput1 && $scope.fileInput1 != null) {
					$scope.upload($scope.fileInput1);
				}
			} else {
				comApi.imgPop();
			}
		};

		$scope.delBrdUpdImg = function() {
			$scope.myImageo = ' ';
			$scope.fileInputgb = null;
			angular.element(document.querySelector('#fileInput1')).val(null);
			$scope.$emit("gdsBrdImgUrl", null);
		};

		// upload on file select or drop

		$scope.upload = function(file) {
			Upload.upload({
				url : '/CrmWeb/api/upload/files',
				data : {
					file : file,
					type : "gdsBrdImgUrl"
				}
			}).then(function(resp) {
				$scope.imgFlg = false;
				//comApi.myConsoleLog("成功===00=");
				//$scope.insert.bnkCardPic = resp.data;
				$scope.$emit("gdsBrdImgUrl", resp.data);
				comApi.successMessage('msg.common.21002');

			}, function(resp) {
				comApi.errorMessage('msg.common.21003');
			});
		};

		angular.element(document.querySelector('#fileInput1')).on('change',
			handleFileSelect);
	} ]);

//商品品牌图片上传
app.controller('ImgGdsBrdCtrl', [  //ImgGdsBrdUpdCtrl
	'$scope',
	'Upload','toaster','comApi',
	function($scope, Upload,toaster,comApi) {

		//定义图片上传的标识
		$scope.imgFlg = false;

		$scope.myImagegb = '';
		//编辑
		$scope.myCroppedImagegb = '';
		$scope.cropTypegb = "square";
		$scope.insert = {};
		var handleFileSelect = function(evt) {
			//$scope.bnkCardPics = "";
			//$scope.bnkCardPicd = "";
			var file = evt.currentTarget.files[0];
			var reader = new FileReader();
			reader.onload = function(evt) {
				$scope.$apply(function($scope) {
					$scope.imgFlg = true;
					$scope.myImagegb = evt.target.result;
				});
			};
			$scope.fileInputgb = file;
			reader.readAsDataURL(file);
		};
		$scope.submitgb = function() {
			if ($scope.imgFlg) {
				if ($scope.fileInputgb && $scope.fileInputgb != null) {
					$scope.upload($scope.fileInputgb);
				}
			} else {
				comApi.imgPop();
			}
		};

		$scope.delBrdInsImg = function() {
			$scope.myImagegb = ' ';
			$scope.fileInputgb = null;
			angular.element(document.querySelector('#fileInputgb')).val(null);
			$scope.$emit("gdsBrdImgUrl", null);
		};

		// upload on file select or drop

		$scope.upload = function(file) {
			Upload.upload({
				url : '/CrmWeb/api/upload/files',
				data : {
					file : file,
					type : "gdsBrdImgUrl"
				}
			}).then(function(resp) {
				//$scope.insert.bnkCardPic = resp.data;
				//comApi.myConsoleLog(resp.data+"===");
				//$scope.bnkCardPics= "图片上传成功！";
				$scope.$emit("gdsBrdImgUrl", resp.data);
				comApi.successMessage('msg.common.21002');

			}, function(resp) {
				comApi.errorMessage('msg.common.21003');
				comApi.myConsoleLog("图片上传失败");
				$scope.bnkCardPicd = "图片上传成功失败！";
			});
		};

		angular.element(document.querySelector('#fileInputgb')).on('change',
			handleFileSelect);
	} ]);
//新增编辑会员 上传图片
app.controller('ImgMemCtrl', ['$scope', 'comApi', 'fileUploadApi', function($scope, comApi, fileUploadApi) {
	$scope.myImage = '';
	$scope.myCroppedImage = '';
	$scope.cropType = "circle";
	//$scope.insert = {};
	$scope.$on("myCroppedImage", function(event, myCroppedImageURL) {
		$scope.myCroppedImage = myCroppedImageURL;
	})
	//上传文件标志
	$scope.uploadFlag = fileUploadApi.uploadFlag;
	//选择图片
	$scope.selectImg = function(evt, imgData){
		fileUploadApi.selectFile(evt, imgData, fileUploadApi.checkImgFileFormat, fileUploadApi, $scope, comApi);
	};
	//删除图片
	$scope.delImgItem = function(imgData, imgItem){
		fileUploadApi.delFileItem(imgData, imgItem, $scope);
	};
	//上传图片
	$scope.uploadImg = function(imgData){
		imgData.fileArray[0].file = $scope.myCroppedImage;
		fileUploadApi.uploadBase64Images(imgData, fileUploadApi);
	};
	$scope.$on("selectFile", function(event, fileData) {
		$scope.myImage = angular.copy(fileData.fileArray[0].fileUrl);
	})
	$scope.$on("delFile", function(event, fileData) {
		$scope.myImage = angular.copy(fileData.fileArray[0].fileUrl);
		$scope.myCroppedImage = angular.copy(fileData.fileArray[0].fileUrl);
	})
} ]);

//新增会员上传图片
app.controller('ImgMemInsertCtrl', [
	'$scope',
	'Upload','comApi',
	function($scope, Upload,comApi) {
		$scope.myImage = '';
		$scope.myCroppedImage = '';
		$scope.cropType = "circle";
		$scope.insert = {};
		var handleFileSelect = function(evt) {
			$scope.figuresMemb = "";
			$scope.figuredMemb = "";
			var file = evt.currentTarget.files[0];
			if(parseInt(file.size) > 2097152){
				comApi.HintMessage( "error", "", "msg.common.10004",3000, "");
				return;
			}else if(!/\.(jpg|png|JPG|PNG)$/.test(file.name)){
				comApi.HintMessage( "error", "", "msg.common.10003",3000, "");
				return;
			}

			var reader = new FileReader();
			reader.onload = function(evt) {
				$scope.$apply(function($scope) {
					$scope.myImage = evt.target.result;
				});
			};

			$scope.fileInput = file;
			reader.readAsDataURL(file);
		};
		$scope.submit = function() {
			if ($scope.fileInput) {
				$scope.upload($scope.fileInput);
			}
		};

		// upload on file select or drop

		$scope.upload = function(file) {
			Upload.upload({
				url : '/CrmWeb/api/upload/files',
				data : {
					file : file
					//type : "userfhotourl"
				}
			}).then(function(resp) {
				$scope.$emit("figureMemb", resp.data.data[0]);
				$scope.insert.figureMemb = resp.data.data[0];
				$scope.figuresMemb = "上传头像成功！";
			}, function(resp) {
				$scope.figuredMemb = "上传头像失败！";

			});
		};

		angular.element(document.querySelector('#fileInput')).on('change',
			handleFileSelect);
	} ]);


//编辑会员头像
app.controller('ImgMemUpdateCtrl', [
	'$scope',
	'Upload','comApi',
	function($scope, Upload,comApi) {
		//定义图片上传的标识
		$scope.imgFlg = false;
		$scope.myImage = '';
		$scope.myCroppedImage = '';
		//原会员头像路径
		$scope.$on("myCroppedImage", function (event, msg) {
			$scope.myCroppedImage = msg;
		});
		$scope.cropType = "circle";
		$scope.insert = {};
		var handleFileSelect = function(evt) {
			$scope.figuresMembUpd = "";
			$scope.figuredMembUpd = "";
			var file = evt.currentTarget.files[0];
			if(parseInt(file.size) > 2097152){
				comApi.errorMessage("msg.common.10004");
				return;
			}else if(!/\.(jpg|png|JPG|PNG)$/.test(file.name)){
				comApi.errorMessage("msg.common.10003");
				return;
			}

			var reader = new FileReader();
			reader.onload = function(evt) {
				$scope.$apply(function($scope) {
					$scope.imgFlg = true;
					$scope.myImage = evt.target.result;
				});
			};

			$scope.fileInput = file;
			reader.readAsDataURL(file);
		};
		//删除图片
		$scope.delMemUpdImg = function() {
			$scope.myCroppedImage = ' ';
			$scope.myImage = ' ';
		};
		$scope.submit = function() {
			if ($scope.imgFlg) {

				if ($scope.fileInput) {
					$scope.upload($scope.fileInput);
				}
			} else {
				comApi.imgPop();
			}
		};

		// upload on file select or drop

		$scope.upload = function(file) {
			Upload.upload({
				url : '/CrmWeb/api/upload/files',
				data : {
					file : file,
					//type : "memb"
				}
			}).then(function(resp) {
				$scope.imgFlg = false;
				$scope.$emit("figureMembUpd", resp.data.data[0]);
				$scope.insert.figureMemb = resp.data.data[0];
				$scope.figuresMembUpd = "上传头像成功！";
			}, function(resp) {
				$scope.figuredMembUpd = "上传头像失败！";

			});
		};

		angular.element(document.querySelector('#fileInput')).on('change',
			handleFileSelect);
	} ]);


//批量编辑商品图像
app.controller('ImgGdsUpdateCtrl', [
	'$scope',
	'Upload','comApi',
	function($scope, Upload,comApi) {
		$scope.changeIndex = function(index,gdsbuobo) {
			$scope.curIndex = index;
			$scope.curGdsBuobo = gdsbuobo;

		}
		$scope.myImage = '';
		$scope.myCroppedImage = '';
		//原会员头像路径
		/*$scope.$on("myCroppedImage", function (event, msg) {
			$scope.myCroppedImage = msg;
		})*/
		$scope.cropType = "circle";
		$scope.insert = {};
		var handleFileSelect = function(evt) {
			$scope.figuresMembUpd = "";
			$scope.figuredMembUpd = "";
			var file = evt.currentTarget.files[0];
			if(parseInt(file.size) > 2097152){
				comApi.errorMessage("msg.common.10004");
				return;
			}else if(!/\.(jpg|png|JPG|PNG)$/.test(file.name)){
				comApi.errorMessage("msg.common.10003");
				return;
			}

			var reader = new FileReader();
			reader.onload = function(evt) {
				$scope.$apply(function($scope) {
					//$scope.myImage = evt.target.result;
					$scope.curGdsBuobo.gdsThum = evt.target.result;
				});
			};

			$scope.fileInput = file;
			reader.readAsDataURL(file);
		};
		$scope.submit = function() {
			if ($scope.fileInput) {
				$scope.upload($scope.fileInput);
			}
		};

		// upload on file select or drop

		$scope.upload = function(file) {
			Upload.upload({
				url : '/CrmWeb/api/upload/files',
				data : {
					file : file,
					//type : "memb"
				}
			}).then(function(resp) {
				$scope.$emit("figureMembUpd", resp.data.data[0]);
				$scope.insert.figureMemb = resp.data.data[0];
				$scope.figuresMembUpd = "上传头像成功！";
			}, function(resp) {
				$scope.figuredMembUpd = "上传头像失败！";

			});
		};

		angular.element(document.querySelector('#fileInput')).on('change',
			handleFileSelect);
	} ]);

//编辑商品信息规格缩略图图片上传
app.controller('ImgGdsUpdCtrl', [//ImgGdsBrdCtrl
	'$scope',
	'Upload','comApi','toaster',
	function($scope, Upload,comApi,toaster) {
		$scope.myImageo = '';
		//商品品牌图片上传的路径
		$scope.$on("myImagegbRod", function (event, msg) {
			$scope.myImageo = msg;

		})
		$scope.myCroppedImageo = '';
		$scope.cropTypeo = "square";
		$scope.insert = {};
		var handleFileSelect = function(evt) {
			var file = evt.currentTarget.files[0];
			if(parseInt(file.size) > 2097152){
				comApi.errorMessage("msg.common.10004");
				return;
			}else if(!/\.(jpg|png|JPG|PNG)$/.test(file.name)){
				comApi.errorMessage("msg.common.10003");
				return;
			}
			var reader = new FileReader();
			reader.onload = function(evt) {
				$scope.$apply(function($scope) {
					$scope.myImageo = evt.target.result;
				});
			};
			$scope.fileInput1 = file;
			reader.readAsDataURL(file);
		};
		$scope.submit1 = function() {
			if ($scope.fileInput1) {
				$scope.upload($scope.fileInput1);
			}
		};

		$scope.upload = function(file) {
			Upload.upload({
				url : '/CrmWeb/api/upload/files',
				data : {
					file : file
					/*type : "bankfhotourl"*/
				}
			}).then(function(resp) {
				comApi.myConsoleLog("成功===00=");
				//$scope.insert.bnkCardPic = resp.data;
				$scope.$emit("bankfhotourl", resp.data);
				comApi.successMessage('msg.common.21002');

			}, function(resp) {
				comApi.errorMessage('msg.common.21003');
			});
		};

		angular.element(document.querySelector('#fileInput1')).on('change',
			handleFileSelect);
	} ]);






//上传附件
app.controller('fileCtrl', [
                      		'$scope',
                      		'Upload','$filter',
                      		function($scope, Upload,$filter) {
                       
                      			$scope.insert = {};
                      			var handleFileSelect = function(evt) {
                      				$scope.resumeFileNms = "";
                      				$scope.resumeFileNmd = "";
                      				var file = evt.currentTarget.files[0];
                      				$scope.filefuj = file;
                      			};
                      			$scope.fileup = function() {
                      				if ($scope.filefuj) {
                      					$scope.upload($scope.filefuj);
                      				}
                      			};

                      			// upload on file select or drop

                      			$scope.upload = function(file) {
                      				Upload.upload({
                      					url : '/CrmWeb/api/upload/files',
                      					data : {
                      						file : file,
                      						type : "attachment"
                      					}
                      				}).then(function(resp) {
                      					$scope.resumeFileNms= "上传附件成功！";
                      					$scope.$emit("resumeFileNm",resp.data.data[0]);

                      				}, function(resp) {
                      					$scope.resumeFileNmd = "上传附件失败！";
                      				});
                      			};

                      			angular.element(document.querySelector('#filefuj')).on('change',
                      					handleFileSelect);
                      		} ]);