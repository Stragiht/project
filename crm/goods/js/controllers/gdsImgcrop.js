
//商品分类图片上传
app.controller('ImgGdsClsCtrl', [
	'$scope',
	'Upload','comApi','toaster',
	function($scope, Upload,comApi,toaster) {
		//定义图片上传的标识
		$scope.imgFlg = false;
		$scope.gdsClsImg = '';
		//商品分类图片上传的路径
		/*$scope.$on("myImagegbRod", function (event, msg) {
			$scope.gdsClsImg = msg;

		})*/
		$scope.myCroppedImageo = '';
		$scope.cropTypeo = "square";
		$scope.insert = {};
		var handleFileSelect = function(evt) {
			//$scope.bnkCardPics = "";
			//$scope.bnkCardPicd = "";
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
					$scope.imgFlg = true;
					$scope.gdsClsImg = evt.target.result;
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

		$scope.delClsInsImg = function() {
			$scope.gdsClsImg = ' ';
			$scope.fileInput1 = null;
			angular.element(document.querySelector('#fileInput1')).val(null);
			$scope.$emit("gdsClsImgurl", null);
		};

		// upload on file select or drop

		$scope.upload = function(file) {
			Upload.upload({
				url : '/CrmWeb/api/upload/files',
				data : {
					file : file,
					type : "gdsClsImgurl"
				}
			}).then(function(resp) {
				$scope.imgFlg = false;
				//console.log("成功===00=");
				//$scope.insert.bnkCardPic = resp.data;
				//$scope.bnkCardPics= "商品分类图片上传成功！";
				$scope.$emit("gdsClsImgurl", resp.data);
				comApi.successMessage('msg.common.21002');

			}, function(resp) {
				comApi.errorMessage('msg.common.21003');
				//$scope.bnkCardPicd = "商品分类图片上传失败！";
			});
		};

		angular.element(document.querySelector('#fileInput1')).on('change',
			handleFileSelect);
	} ]);


//编辑商品分类图片上传
app.controller('ImgGdsClsUpdCtrl', [
	'$scope',
	'Upload','comApi','toaster',
	function($scope, Upload,comApi,toaster) {
		$scope.gdsClsUpdImg = '';
		//控制图片上传的标志
		$scope.imgFlg = false;
		//商品分类图片上传的路径
		$scope.$on("gdsClsImgRod", function (event, msg) {
		 	$scope.gdsClsUpdImg = msg;
		})
		$scope.myCroppedImageo = '';
		$scope.cropTypeo = "square";
		$scope.insert = {};
		var handleFileSelect = function(evt) {
			$scope.bnkCardPics = "";
			$scope.bnkCardPicd = "";
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
					$scope.gdsClsUpdImg = evt.target.result;
				});
			};
			$scope.fileInput1 = file;
			reader.readAsDataURL(file);
		};
		$scope.submit1 = function() {
			if ($scope.imgFlg == true) {
				if ($scope.fileInput1 && $scope.fileInput1 != null) {
					$scope.upload($scope.fileInput1);
				}
			} else{
				comApi.imgPop();
			}
		};

		//删除图片(本地删)
		$scope.delClsUpdImg = function() {
			$scope.gdsClsUpdImg = ' ';
			$scope.fileInput1 = null;
			angular.element(document.querySelector('#fileInput1')).val(null);
			$scope.$emit("gdsClsUpdImgurl", null);
		};

		// upload on file select or drop

		$scope.upload = function(file) {
			Upload.upload({
				url : '/CrmWeb/api/upload/files',
				data : {
					file : file,
					type : "gdsClsUpdImgurl"
				}
			}).then(function(resp) {
				$scope.imgFlg = false;
				$scope.insert.bnkCardPic = resp.data;
				$scope.bnkCardPics= "商品分类编辑图片上传成功！";
				$scope.$emit("gdsClsUpdImgurl", resp.data);
				comApi.successMessage('msg.common.21002');

			}, function(resp) {
				comApi.errorMessage("msg.common.10003");
				$scope.bnkCardPicd = "商品分类编辑图片上传失败！";
			});
		};

		angular.element(document.querySelector('#fileInput1')).on('change',
			handleFileSelect);
	} ]);




//上传附件
app.controller('fileCtrl', [
                      		'$scope',
                      		'Upload',
                      		function($scope, Upload) {
                       
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
                      					$scope.$emit("resumeFileNm", resp.data);

                      				}, function(resp) {
                      					$scope.resumeFileNmd = "上传附件失败！";
                      				});
                      			};

                      			angular.element(document.querySelector('#filefuj')).on('change',
                      					handleFileSelect);
                      		} ]);