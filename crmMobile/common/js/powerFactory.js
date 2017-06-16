'use strict';
app.factory('userPowerFactory', [ '$rootScope', '$sessionStorage',
    function($rootScope, $sessionStorage) {
      var userPermissionList = $sessionStorage.userPower;
      var menuPermissionList = $sessionStorage.mobileMenu;
      return {
        //setPermissions: function(permissions) {
        //    userPermissionList = permissions;
        //    $rootScope.$broadcast('permissionsChanged')
        //},
        userPower : function(permission) {
          try {
            for (var i = 0, j = userPermissionList.length; i < j; i++) {
              if (userPermissionList[i].fpd == permission.trim()) {
                return true;
              }
            }
            return false;
          } catch (e) {
            return false;
          }
        },
        userPowerFm : function(permission) {
          try {
            for (var i = 0, j = userPermissionList.length; i < j; i++) {
              if (userPermissionList[i].fm == permission.trim()) {
                return true;
              }
            }
            return false;
          } catch (e) {
            return false;
          }
        },
        userPowerFp : function(permission) {
          try {
            for (var i = 0, j = userPermissionList.length; i < j; i++) {
              if (userPermissionList[i].fp == permission.trim()) {
                return true;
              }
            }
            return false;
          } catch (e) {
            return false;
          }
        },
        menuPower: function(permission) {
            try {
            	if(menuPermissionList) {
            		if(menuPermissionList[permission]) {
            			return menuPermissionList[permission].show ? true : false;
            		}
            	}
                return false;
              } catch (e) {
                return false;
              }
          },
          userPowerRefresh: function() {
              userPermissionList = $sessionStorage.userPower;
          },
          menuPowerRefresh: function() {
              menuPermissionList = $sessionStorage.mobileMenu;
          }
      };
    } ])