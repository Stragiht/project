/**
 * Created by 张玉良 on 2016-4-6.
 */
app.factory('userPowerFactory', ['$rootScope','$sessionStorage',function ($rootScope,$sessionStorage) {
    return {
        //setPermissions: function(permissions) {
        //    userPermissionList = permissions;
        //    $rootScope.$broadcast('permissionsChanged')
        //},
        userPowerMo: function (permission) {
            var userPermissionList = $sessionStorage.userPower;
            try {
                for(var i= 0,j = userPermissionList.length;i<j;i++){
                    if(userPermissionList[i].fm == permission.trim()){
                        return true;
                    }
                }
                return false;
            } catch (e) {
                return false;
            }
        },
        userPower: function (permission) {
            var userPermissionList = $sessionStorage.userPower;
            try {
                for(var i= 0,j = userPermissionList.length;i<j;i++){
                    if(userPermissionList[i].fpd == permission.trim()){
                        return true;
                    }
                }
                return false;
            } catch (e) {
                return false;
            }
        }
    };
}])