/**
 * Created by Administrator on 2017\7\3 0003.
 */
app.controller('roleCtrl', ['$scope', '$rootScope', '$http', '$resource', '$state', '$timeout', 'selectService', 'backPathService', 'mediaService', 'commonService','dataAccess','checkBtnService',
    function ($scope, $rootScope, $http, $resource, $state, $timeout, selectService, backPathService, mediaService, commonService,dataAccess,checkBtnService) {
        var mediaSelectedArr = []
        $scope.mediaSelectedArr = mediaSelectedArr
        $scope.datas = []

        //角色搜索
        $scope.query = function (hasCount,roleName) {

            var $com = $resource($scope.app.host + "/api/mps-user/role?hasCount=:hasCount&roleName=:roleName", {
                hasCount: '@hasCount',
                roleName: '@roleName'
            });

            $com.get({hasCount: hasCount,roleName:roleName},
                function (data) {
                    dataAccess.set("permissionDateRes", data)
                    $scope.datas = data.results
                })
        }
        $scope.query();
        $scope.queryRoleName = function(e,bol,name){
            if(e){
                var keycode = window.event?e.keyCode:e.which;
                if(keycode == 13){
                    $scope.query(bol,name);
                }

            }else {
                $scope.query(bol,name);
            }
        }
        //删除
        $scope.delete = function (data) {
            //检测删除权限
            checkBtnService.check("/api/mps-user/role/:roleId",'delete').then(function(){
                //获取删除项对象集合
                if(typeof data=='string'){
                    var sendObj = data
                }else{
                    var sendObj = data.join(',')

                }
                if(sendObj.length == 0){
                    commonService.ctrlError('操作','请先选择角色')
                }else {
                    commonService.ctrlModal("delRole").result.then(function () {

                        var $com = $resource($scope.app.host + "/api/mps-user/role/:roleId",{
                            roleId: '@sendObj'
                        });

                        $com.delete({roleId:sendObj}, function (res) {
                            if(res.success){
                                $scope.query()
                                $scope.keyword = ''
                                commonService.ctrlSuccess('删除')
                                $scope.mediaSelectedArr = []
                            }else{
                                commonService.ctrlError('删除' , res.message)
                            }

                        })

                    })
                }
            })

        }

        //select相关操作的方法绑定
        $scope.updateSelection = selectService.updateSelection
        $scope.isSelected = selectService.isSelected
        $scope.isSelectedAll = selectService.isSelectedAll

        //滚动条
        $scope.scrollHeight = function(){
                //console.log($(window).height())
            $('#scroll').css('height',$(window).height()-230)
        }
        $scope.scrollHeight();
        $(window).resize(function() {
            $('#scroll').css('height',$(window).height()-230)
        });
        //滚动条设置
        setTimeout(function(){
            var scroll = new Optiscroll(document.getElementById('scroll'));
            //滚动底部的时候触发
            $('#scroll').on('scrollreachbottom', function (ev) {

            });
        },100)

    }])

//添加和编辑权限操作
app.controller('permissionCtrl',
    ['$scope', '$resource', '$stateParams', '$state' , '$modal' , 'commonService' , 'dataAccess','$timeout',
        function ($scope, $resource, $stateParams, $state , $modal , commonService , dataAccess,$timeout) {

        var perSelectedArr = [[],[]]
        var userSelectedArr = []
        var name = ''//权限的名字用鱼取消该名字的时候使用


        $scope.roleId = '';
        $('.groupNameFocus').focus(function(){
            $scope.errorMsg = false
        })
        //查询权限类
        var queryPermission = function(id){
            var $com = $resource($scope.app.host + "/api/mps-user/role/:id/permission",{id:'@id'});
            $com.get({id:id},function(data){

                $scope.permissionDatas = data.results
                // console.log(data.results)

                angular.forEach( $scope.permissionDatas , function(data,index){
                    //console.log(index);
                    perSelectedArr[index + 1] = []
                    angular.forEach(data.methods , function(mData){
                        if(mData.checked === true){
                            perSelectedArr[0].push(mData.id)
                            perSelectedArr[index + 1].push(mData.id)
                        }
                    })
                })
                //console.log(perSelectedArr)
                $scope.perSelectedArr = perSelectedArr
            })
        }

        //查询组成员
        var queryUser = function(id){
            var $com = $resource($scope.app.host + "/api/mps-user/role/:id/member",{id:'@id'});
            $com.get({id:id},function(data){

                $scope.groupUsers = data.results

                angular.forEach( $scope.groupUsers , function(data){
                    if(data.check_flag === 'Y'){
                        userSelectedArr.push(data.user_id)
                    }
                })
                $scope.userSelectedArr = userSelectedArr
            })
        }


        //edit_mode为true，即为编辑模式
        var edit_mode = !!$stateParams.id;
        $scope.editProName = edit_mode

        //取消改名字操作
        $scope.clearName = function(){
            $scope.roleName = name;
            $scope.editProName = !$scope.editProName;
        }
        $scope.editName = function(){
            $scope.editProName = !$scope.editProName;
            var focusEle = angular.element('.proName')
            $timeout(function () {
                focusEle.focus().select()
            })
        }

        //编辑权限信息需要先拉取对应信息并显示
        if(edit_mode){
            var permissionDateRes = dataAccess.get("permissionDateRes")

            angular.forEach(permissionDateRes.results , function(data) {
                if(data.roleId == $stateParams.id){
                    $scope.data = data
                    $scope.roleId = data.roleId
                    name = data.roleName;
                }
            })
            queryPermission($scope.roleId)
            //queryUser($scope.roleId)
        }

        else {
            $scope.data = {}
            queryPermission('null')
        }

        //提交按钮的编辑和新增状态控制
        //添加组名
        $scope.addGroupName = function () {
            $('.btnSubmit').attr('disabled',true)
            if(edit_mode){
                var $comUpdate = $resource($scope.app.host + "/api/mps-user/role/:id",{id:'@id'},{
                    'update': { method:'PUT' }
                });

                $comUpdate.update({id:$scope.roleId},this.data,function(res){
                    if(res.success){
                        commonService.ctrlSuccess('添加');
                        $('.btnSubmit').attr('disabled',false)
                        name = $scope.data.roleName;
                        $scope.editProName = !$scope.editProName;
                    }else {
                        $('.btnSubmit').attr('disabled',false)
                        //$scope.errorMsg = res.message
                        commonService.ctrlError('操作' , res.message)
                    }
                });
            }
            else {
                var $com = $resource($scope.app.host + "/api/mps-user/role");

                $com.save(this.data,function(res){
                    if(res.success){
                        $scope.roleId = res.message
                        //queryPermission($scope.roleId)
                        //queryUser($scope.roleId)
                        $('.btnSubmit').attr('disabled',false)
                        edit_mode = true;
                        commonService.ctrlSuccess('操作')
                        name = $scope.data.roleName;
                        $scope.editProName = !$scope.editProName;
                    }else {
                        $('.btnSubmit').attr('disabled',false)
                        $scope.errorMsg = res.message
                    }
                })
            }
        }
            $scope.getIcon = function(index){
                switch(index){
                    case 0:return 'iconfont icon-wenjianjia'
                    case 1:return 'iconfont icon-fasong'
                    case 2:return 'iconfont icon-shebei'
                    case 3:return 'iconfont icon-earth'
                    case 4:return 'iconfont icon-wenjianjia'

                }
            }
        //添加权限类
        app.controller('permissionClass',
            ['$scope' , '$resource' , '$modal' , 'perService' , 'commonService' , 'selectService',
                function ($scope , $resource , $modal , perService , commonService , selectService) {

                    $scope.perSelectedArr = perSelectedArr
                    //console.log(perSelectedArr)
                    $scope.addPermissionList = function(id){
                        if($scope.roleId == ''){
                            commonService.ctrlError('操作', '请填写并保存权限名')
                            return;
                        }
                        //提交信息到保存权限api
                        var $com = $resource($scope.app.host + "/api/mps-user/role/:id/permission",{id:'@id'});
                        $com.save({id:id} , perSelectedArr[0] , function(data){
                            if(data.success){
                                commonService.ctrlSuccess('添加');
                                $state.go('app.role.roleList');

                                //$state.go('app.members.membersList')
                            }else{
                                commonService.ctrlError('操作' , res.message)
                            }
                        })
                    }

                    //select相关操作的方法绑定
                    $scope.updateSelection = selectService.updateSelection
                    $scope.selectAll = selectService.selectAll
                    $scope.isSelected = selectService.isSelected
                    $scope.isSelectedAll = selectService.isSelectedAll
                    $scope.selectChildAll = selectService.selectChildAll
                    $scope.isChildSelectedAll = selectService.isChildSelectedAll

                    $scope.isSelectedAllRole = selectService.isSelectedAllRole


                }])

            //尝试jq解决全选问题
            $('#allCheck').on('click',function(){
               if($(this).is(':checked')){
                   var checkList = $('.parent2Check')
                   for(var i = 0; i < checkList.length; i++){
                       if(!checkList.eq(i).is(':checked')){
                           checkList.eq(i).click();
                           //$scope.$apply();
                       }
                   }
               }else{
                   var checkList = $('.parent2Check')
                   for(var i = 0; i < checkList.length; i++){
                       if(checkList.eq(i).is(':checked')){
                           checkList.eq(i).click();
                       }
                   }
               }
            })
    }])


//权限添加成员列表
app.controller('addMemberManagerCtrl', ['$scope', '$rootScope', '$http', '$resource', 'commonService','$stateParams',
    function ($scope, $rootScope, $http, $resource, commonService,$stateParams) {

        $scope.selected = [];//初始化复选框
        $rootScope.roleMemberFlash = false;

        //edit_mode为true，即为编辑模式
        var edit_mode = !!$stateParams.id;
        //console.log($stateParams)


        /**
         * 列出成员列表接口
         */
        $scope.query = function (roleId,userName) {
            //console.log('搜索关键字为：' + queryValue);
            var $com = $resource($scope.app.host + "/api/mps-user/role/:roleId/member?userName=:userName", {
                //var $com = $resource($scope.app.host + "/api/mps-filemanager/file?pageNo=:pageNo&pageSize=:pageSize&path=:path&keyword=:keyword", {

                roleId: '@roleId',userName:'@userName'
            });

            $com.get({ roleId: roleId,userName:userName},
                function (data) {
                    //console.log(data)
                    var dataList = [];
                    for(var i = 0; i < data.results.length; i++){
                        if(data.results[i].check_flag == 'Y'){
                            dataList.push(data.results[i]);
                        }
                    }
                    $scope.memberList = dataList;
                    $scope.selected = []
                })
        }

        $scope.query($stateParams.id,'')

        //删除成员操作
        $scope.deleteMember = function (data) {
            var roleId = $stateParams.id;
            if(typeof data=='string'){
                var sendObj = data
            }else{
                var sendObj = data.join(',')

            }
            if (sendObj.length == 0) {
                commonService.ctrlError('删除', '未选择成员');
                return;
            }
            commonService.ctrlModal('memberName').result.then(function () {
                var $com = $resource($scope.app.host + "/api/mps-user/role/:roleId/member?memberIds=:memberIds",{roleId:'@roleId',memberIds:'@sendObj'});
                $com.delete({roleId:roleId,memberIds:sendObj},{},function(data){
                    if (data.success) {
                        commonService.ctrlSuccess('删除');
                        $scope.selected = [];
                        $scope.query($stateParams.id);
                        //$state.go('app.member.membersList');
                    }
                });
            })
        }

        //判断是否为选中状态
        $scope.isChecked = function (id) {
            return $scope.selected.indexOf(id) >= 0;
        }

        //删除选中的成员
        $scope.deleteSelected = function () {
            //console.log('delete' + $scope.selected);
        }

        //搜索成员列表
        $scope.searchMember = function (keyword, e) {
            //console.log(e)
            if (e) {
                var keycode = window.event ? e.keyCode : e.which;
                if (keycode == 13) {
                    //console.log('search ' + keyword);//开始进行查询操作
                    $scope.query($stateParams.id,keyword)

                }
            }else{
                $scope.query($stateParams.id,keyword)
            }

        }

        //用户复选框操作，给出checkbox结果
        $scope.updateSelection = function ($event, id) {
            var checkbox = $event.target;
            var checked = checkbox.checked;
            if (checked) {
                $scope.selected.push(id);
            } else {
                var idx = $scope.selected.indexOf(id);
                $scope.selected.splice(idx, 1);
            }
           // console.log($scope.selected);
        }


        //添加成员
        $scope.addMember = function () {
            //console.log('添加成员');
            commonService.addRoleMemberModal($stateParams.id,$stateParams.name);
        }

        //滚动条
        $scope.scrollHeight = function () {
            //console.log($(window).height())
            $('#scroll').css('height', $(window).height() - 230)
        }
        $scope.scrollHeight();
        $(window).resize(function () {
            $('#scroll').css('height', $(window).height() - 230)
        });
        //滚动条设置
        setTimeout(function () {
            var scroll = new Optiscroll(document.getElementById('scroll'));
            //滚动底部的时候触发
            $('#scroll').on('scrollreachbottom', function (ev) {

            });
        }, 100)

        var watch = $scope.$watch('roleMemberFlash', function (newValue, oldValue, scope) {
            if (newValue) {
                $scope.query($stateParams.id);
                $rootScope.roleMemberFlash = false;
            }
        });


    }])

