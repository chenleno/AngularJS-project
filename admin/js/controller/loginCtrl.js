/**
 * Created by chenqi1 on 2017/7/4.
 */
/**
 * Created by chenqi1 on 2016/12/26.
 */

//登录验证模块

app.controller('LoginController',
    ['$scope','$http','$state' ,'$timeout' , 'commonService' ,'dataAccess','$modal','$cookieStore','cookieService',
        function($scope,$http,$state ,$timeout , commonService ,dataAccess,$modal,$cookieStore,cookieService){


    //['$scope','$http','$state' ,'$timeout' , 'commonService' ,'dataAccess','$modal','cookieService',
    //    function($scope,$http,$state ,$timeout , commonService ,dataAccess,$modal,cookieService){
            //初始化记住密码状态
            $scope.rememberPassword = false;

            $scope.login = function(){
                $http.post($scope.app.host + '/api/login',$scope.data)
                    .success(function(data){
                        if(data.success){
                            dataAccess.sessionSave('adminName' , data.message.userName)
                            dataAccess.sessionSave('adminId' , data.message.userId)
                            $state.go('app.PT.PTlist')
                        }
                        else {
                            $scope.noRepeat = false
                            $scope.data.password = ''
                            $scope.errorMsg = data.message
                            $scope.errorShake = true
                            $timeout(function(){
                                $scope.errorMsg = null
                                $scope.errorShake = false
                            },3000)
                        }
                    })
                    .error(function(data){
                        $scope.noRepeat = false
                        commonService.ctrlModal('reqErrorType')
                    })
            }

            //检查是否为记住密码登录
            $scope.checkLogin = function(){
                var remPwd = $scope.rememberPassword
                if(remPwd){
                    //如果是记住密码，调用writeCookie方法更新cookie
                    cookieService.writeCookie($scope.data)
                }else{
                    $cookieStore.remove('name')
                    $cookieStore.remove('password')
                }
                //点击登录后禁用登录按钮
                $scope.noRepeat = true
                $scope.login();
            }

            //找回密码弹窗
            $scope.findPassword = function(){
                commonService.ctrlModal('findPwdType')
            }
        }]);

//忘记密码控制器
//app.controller('findPasswordCtrl' ,
//    ['$scope' , '$modalInstance', '$resource','$stateParams','$modal','$state','commonService','app',
//        function($scope , $modalInstance, $resource,$stateParams,$modal,$state,commonService,app){
//
//            $scope.app = app
//            //取消操作关闭模态框
//            $scope.cancel = function () {
//                $modalInstance.dismiss('cancel');
//            };
//            //查询信息列表
//            $scope.query = function(userId){
//                var $com = $resource($scope.app.host + "/api/iot-user/user");
//                $com.get({userId:userId},function(data){
//                    $scope.datas = data;
//                    console.log(data)
//                })
//            }
//        }])

//登出操作控制器
app.controller('adminCtrl',['$rootScope','$scope','$http','$state','commonService','dataAccess',
    function($rootScope,$scope,$http,$state,commonService,dataAccess){

//用户信息
        $rootScope.adminName = dataAccess.sessionGet('adminName')
        $scope.adminId = dataAccess.sessionGet('adminId')

        $scope.logout = function(){
            commonService.ctrlModal("logOutType").result.then(function(){
                $http.get($scope.app.host + '/api/exit')
                    .success(function(data){
                        if(data.success){
                            dataAccess.sessionClear()
                            $state.go('auth.login')
                        }
                        else {
                            commonService.ctrlModal('reqErrorType')
                        }
                    })
            })
        }
}])