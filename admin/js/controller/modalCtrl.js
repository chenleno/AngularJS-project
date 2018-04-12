/**
 * Created by chenqi1 on 2017/6/19.
 */

//普通删除模态框

app.controller('delModalCtrl', ['$scope', '$modalInstance','$state', 'info', function ($scope, $modalInstance, $state ,  info) {

    $scope.modalType = info.typeInfo

    $scope.obj = info.obj

    $scope.ok = function () {
        $modalInstance.close();
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.goSheetList = function(){
        $state.go('app.order.orderList')
        $modalInstance.dismiss('cancel');
    }
}])

//提示类型模态框控制器，延时2秒后消失
app.controller('tipCtrl' ,['$scope' , '$modalInstance' ,'$timeout' ,'info',
    function($scope , $modalInstance ,$timeout ,info) {
    $scope.modalType = info.typeInfo;

    $timeout(function(){
        $modalInstance.close()
    },2000)

}])


//文件操作模态框
app.controller('fileManagerCtrl', ['$scope', '$rootScope', '$modalInstance', '$resource', '$state', 'commonService', 'getDatas', '$q', 'addDiyDom'
,function ($scope, $rootScope, $modalInstance, $resource, $state, commonService, getDatas, $q, addDiyDom) {

    $scope.mediaLists = getDatas.mediaLists;//获取勾选的媒体列表
    $scope.format = getDatas.format;   //获取文件格式
    $rootScope.titleName = '';//初始化上传到标题
    $scope.showLists = false;//初始化是否显示文件列表
    $scope.fileManagerName = $rootScope.fileManagerName;//标识媒体操作名称
    //console.log($scope.fileManagerName);
    if ($scope.fileManagerName == '上传' || $scope.fileManagerName == "选择") {
        //console.log($scope.fileManagerName);
        $scope.showImage = false;
    } else {
        //console.log($scope.fileManagerName);
        $scope.showImage = true;
    }
        var setting = {
        // 是否为异步加载文件
        // async: {
        //     enable: true,
        //     url:"/api/mps-filemanager/fileList",
        //     autoParam:["id", "name=n", "level=lv"],
        //     otherParam:{"otherParam":"zTreeAsyncTest"},
        //     dataFilter: filter
        // },
        view: {
			showLine: false,
			showIcon: false,
			selectedMulti: false,
			dblClickExpand: true,
			addDiyDom: addDiyDoms
		},
        callback: {
            onMouseUp: zTreeOnMouseUp,
            onDblClick: zTreeOnDblClick
        }
    };

    //自定义Dom样式
		function addDiyDoms(treeId, treeNode) {
            addDiyDom.diyDom(treeId, treeNode);
		}


    //异步加载数据树
    if($scope.fileManagerName == "选择") {
            //异步加载数据树
        setTimeout(function () {
            $scope.query('', '', true , $scope.format);
        }, 0);
    } else {
        setTimeout(function () {
            $scope.query('', true, true , $scope.format);
        }, 0);
    }

    //鼠标抬起时的回调函数 
    function zTreeOnMouseUp(event, treeId, treeNode) {
        if (treeNode) {
            $scope.titleName = treeNode.name;
        }
        // console.log(treeNode);
        // $(".ztree li a").css("background","none");
        // $("#"+ treeNode.tId+ "_a").css("background-color","#f9cc9d");

    };

    function zTreeOnDblClick (event, treeId, treeNode) {
        console.log(treeNode);
        if(!treeNode.isParent) {
            $scope.ok();
        }
    }

    //点击确定移动/复制时的操作
    $scope.ok = function () {

        var obj = $.fn.zTree.getZTreeObj("jqueryTree");//定义ztree对象
        var sNodes = obj.getSelectedNodes();//获取选择的对象
        var path = ''; //初始化全路径
        var mediaSendArr = [];//初始化发送信息数组
        if (sNodes.length > 0) {
            var node = sNodes[0].getPath();
        } else {
            commonService.ctrlError($scope.fileManagerName, '未选择文件(夹)');
            return;
        }

        if($scope.fileManagerName == "选择") {
            //console.log(sNodes[0]);
            if(sNodes[0].format) {
                $rootScope.$emit('selectFileObj',{selectFileObj:sNodes[0]});
                $modalInstance.dismiss('cancel');
            } else {
                commonService.ctrlError($scope.fileManagerName,'请选择媒体文件');
            }
            return;
        }

        //定义用户操作
        var operate = '';

        if ($scope.fileManagerName == '复制') {
            operate = 'copy';
        } else {
            operate = 'move';
        }
        if ($scope.fileManagerName == '上传') {
            $rootScope.filePath = $scope.mediaLists;
            // console.log($rootScope.uploadCtrl)
            $modalInstance.dismiss('cancel');
            $("#uploadBtn").click();
            return;
        }



        //获取当前节点的全路径
        for (var i = 0; i <= node.length - 1; i++) {
            path = path + "/" + node[i].name;
        }

        //拼接所需要移动/复制的数据对象        
        for (var i = 0; i <= getDatas.mediaLists.fileList.length - 1; i++) {
            var mediaSendObj = {};
            mediaSendObj.dest = sNodes[0].fullName;
            mediaSendObj.newName = getDatas.mediaLists.fileList[i].name;
            mediaSendObj.dir = getDatas.mediaLists.fileList[i].dir;
            mediaSendObj.path = getDatas.mediaLists.fileList[i].path;
            mediaSendObj.ondup = 'newcopy';
            mediaSendArr.push(mediaSendObj);
        }
        //console.log(mediaSendArr);
        var sendObj = {};
        sendObj.fileList = mediaSendArr;


        //发送数据请求
        var $com = $resource("/api/mps-filemanager/file?op=" + operate);
        //console.log(operate);
        $com.save(sendObj, function (res) {
            //成功回调函数
            if (res.success) {
                commonService.ctrlSuccess($scope.fileManagerName);
                //$state.go('app.media.mediaList');
                $rootScope.$broadcast('queryMedia',{queryMedia:true});
                $modalInstance.dismiss('cancel');
            } else {
                commonService.ctrlError($scope.fileManagerName, res.message);
                $modalInstance.dismiss('cancel');
            }
        })

    };

    $scope.upLoadFile = function () {
            $rootScope.filePath = $scope.mediaLists;
            // console.log($rootScope.uploadCtrl)
            $modalInstance.dismiss('cancel');
            //console.log(123123);
            $("#uploadBtn").click();
            return;
    }

    if ($scope.fileManagerName == '上传') {
        //console.log($scope.fileManagerName);
        $scope.showImage = false;
        //console.log(123123);
        $scope.upLoadFile();

    } else if($scope.fileManagerName == "选择") {
        $scope.showImage = false;
        } else {
        //console.log($scope.fileManagerName);
        $scope.showImage = true;
    }


    //取消时的操作
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    //默认查找根目录文件
    $scope.query = function (path, dir, all , format) {
        //测试接口,对接口进行测试
        var $com = $resource("/api/mps-filemanager/file/tree?path=:path&dir=:dir&all=:all&format=:format", {
            path: '@path',
            dir: '@dir',
            all: '@all'
        });

        $com.get({ path: path, dir: dir, all: all ,format:format},
            function (data) {
                //console.log(data);
                $.fn.zTree.init($("#jqueryTree"), setting, data.message);
            })
    }


}])

app.controller('addMemberCtrl', ['$scope', '$rootScope', '$modalInstance', '$resource', 'commonService', '$state', 'operate', 'id',
    function ($scope, $rootScope, $modalInstance, $resource, commonService, $state, operate, id) {

        //console.log(operate + id);
        $scope.editModel = false;

        $scope.showPass = true;

        $scope.showPassword = function () {
            $scope.showPass = !$scope.showPass;
            if ($scope.showPass) {
                $scope.repeatPassword = '';
                $scope.data.password = '';
            } else {
                $scope.data.password = $scope.cachePassword;
                $scope.repeatPassword = $scope.cachePassword;
            }
        }

        $scope.query = function () {
            //console.log(1111);
            var userId = id;
            var $com = $resource("/api/mps-user/user?userId=:userId", {
                //var $com = $resource($scope.app.host + "/api/mps-filemanager/file?pageNo=:pageNo&pageSize=:pageSize&path=:path&keyword=:keyword", {
                userId: '@userId'
            });

            $com.get({userId: userId},
                function (data) {
                    //console.log(data);
                    $scope.data = data.results[0];
                    $scope.cachePassword = $scope.data.password;
                    $scope.repeatPassword = $scope.cachePassword;
                })
        }

        //定义操作规则
        $scope.operate = operate;
        if (operate === 'edit') {
            $scope.editModel = true;
            $scope.id = id;
            $scope.showPass = false;

            $scope.query();//修改成员进行信息查询
        }


        //w5c表单验证配置
        var vm = $scope.vm = {
            htmlSource: "",
            showErrorType: "1",
            showDynamicElement: true,
            dynamicName: "dynamicName",
            entity: {}
        };

        vm.saveEntity = function ($event) {
            //do somethings for bz
            alert("Save Successfully!!!");
        };
        //每个表单的配置，如果不设置，默认和全局配置相同
        vm.validateOptions = {
            blurTrig: true
        };

        vm.customizer = function () {
            return vm.entity.customizer > vm.entity.number;
        };

        vm.changeShowType = function () {
            if (vm.showErrorType == 2) {
                vm.validateOptions.showError = false;
                vm.validateOptions.removeError = false;
            } else {
                vm.validateOptions.showError = true;
                vm.validateOptions.removeError = true;
            }
        };

        vm.types = [
            {
                value: 1,
                text: "选择框"
            },
            {
                value: 2,
                text: "输入框"
            }
        ];

        $scope.ok = function () {
            $modalInstance.close();
        };

        //查询权限
        $scope.queryRole = function () {
            var $com = $resource('/api/mps-user/role?hasCount=false')
            $com.get(function (data) {
                $scope.roles = data.results

            })
        }
        $scope.queryRole()

        //查询部门
        $scope.queryDepartment = function () {
            var $com = $resource('/api/common/department')
            $com.get(function (data) {
                $scope.departments = data.results
            })
        }
        $scope.queryDepartment()


        //提交成员数据
        $scope.submit = function () {
            //console.log('提交用户');
            //提交后禁用提交按钮防止重复提交
            $('.addMember').attr('disabled', true)

            if ($scope.editModel) {
                //console.log(id);
                var $comUpdate = $resource("/api/mps-user/user/:id", { id: '@id' }, {
                    'update': { method: 'PUT' }
                });
                $comUpdate.update({ id: $scope.id }, $scope.data, function (res) {
                    if (res.success) {
                        commonService.ctrlSuccess('编辑');
                        $state.go('app.member.memberList');
                        $modalInstance.close();
                        //$scope.query();

                        $rootScope.reflash = true;


                    } else {
                        $scope.errorMsg = res.message;
                        commonService.ctrlError('编辑', res.message);
                        $('.addMember').attr('disabled', false);
                    }
                });
            }

            //人员新增
            else {
                var $com = $resource("/api/mps-user/user");

                $com.save($scope.data, function (res) {
                    //console.log(res);
                    if (res.success) {
                        commonService.ctrlSuccess('添加');
                        //console.log('添加成功-----');
                        $state.go('app.member.memberList');
                        $modalInstance.close();
                        $rootScope.reflash = true;
                        //$scope.quer();

                    } else {
                        $scope.errorMsg = res.message;
                        commonService.ctrlError('添加', res.message);
                        $('.addMember').attr('disabled', false)
                    }
                })
            }
        }

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        }
    }])

//查看成员信息模态框
app.controller('detailMemberCtrl', ['$scope', '$modalInstance', 'userId', '$resource', function ($scope, $modalInstance, userId, $resource) {

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
            $scope.query = function () {
            var $com = $resource("/api/mps-user/user?userId=:userId", {
                userId: '@userId'
            });

            $com.get({userId: userId},
                function (data) {
                    console.log(data);
                    $scope.data = data.results[0];
                })
        }

    $scope.query();
}])


//角色添加成员
app.controller('addRoleMemberModal', ['$scope', '$rootScope', '$resource', 'commonService', '$state', 'info','$modalInstance','staticData','selectService',
    function ($scope, $rootScope, $resource, commonService, $state, info,$modalInstance,staticData,selectService) {

        $scope.selected = [];//初始化复选框
        $scope.selectedRoleMember = [];//右侧div东西
        $scope.arrAll = [] //全部数组用来添加人的(右侧)

        //console.log(info)
        $scope.roleId = info.roleId;
        $scope.name = info.name;

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
        //加载所有成员
        $scope.queryMember = function (queryValue) {
            //测试接口
            if (queryValue) {
                var userName = queryValue;
            } else {
                var userName = '';
            }

            //console.log('搜索关键字为：' + queryValue);
            var $com = $resource(staticData.hostUrl + "/api/mps-user/user?userName=:userName", {
                //var $com = $resource($scope.app.host + "/api/mps-filemanager/file?pageNo=:pageNo&pageSize=:pageSize&path=:path&keyword=:keyword", {

                userName: '@userName'
            });

            $com.get({ userName: userName},
                function (data) {
                    $scope.datas = data.results;
                })
        }
        $scope.queryMember();
        /**
         * 列出已选成员列表接口
         */
        $scope.queryRoleMember = function (roleId) {
            //测试接口
            if (roleId) {
                var userName = roleId;
            } else {
                var userName = '';
            }

            //console.log('搜索关键字为：' + queryValue);
            var $com = $resource(staticData.hostUrl + "/api/mps-user/role/:roleId/member", {
                //var $com = $resource($scope.app.host + "/api/mps-filemanager/file?pageNo=:pageNo&pageSize=:pageSize&path=:path&keyword=:keyword", {

                roleId: '@roleId'
            });

            $com.get({ roleId: roleId},
                function (data) {

                    var dataList = [];
                    var dataList2 = [];
                    for(var i = 0; i < data.results.length; i++){
                        if(data.results[i].check_flag == 'Y'){
                            dataList.push(data.results[i]);
                            dataList2.push(data.results[i].user_id)
                        }
                    }
                    $scope.arrAll = data.results;
                    //console.log(data)
                    $scope.selected = dataList2;
                    $scope.selectedRoleMember = dataList;
                })
        }

        $scope.queryRoleMember($scope.roleId)
        $scope.ok = function(){
            var userSelectedArr = $scope.selected


            var $com = $resource(staticData.hostUrl + "/api/mps-user/role/:id/member",{id:'@$scope.roleId'});
            $com.save({id:$scope.roleId} , userSelectedArr , function(data){
                if(data.success){
                    $modalInstance.close();
                    //$scope.query();

                    $rootScope.roleMemberFlash = true;
                }
            })

        }

        //搜索成员列表
        $scope.searchMember = function ( e,keyword) {
            if (e) {
                var keycode = window.event ? e.keyCode : e.which;
                if (keycode == 13) {

                    $scope.queryMember(keyword);

                }
            }else{
                $scope.queryMember(keyword);
            }

        }

        //select相关操作的方法绑定
        $scope.updateSelection = function(selected , e , userId,boole){
            //console.log($scope.selected.indexOf(userId))
            if(boole){
                if($scope.selected.indexOf(userId) >= 0){
                    for(var i = 0; i < $scope.selectedRoleMember.length; i++){
                        if($scope.selectedRoleMember[i].user_id == userId){
                            $scope.selectedRoleMember.splice(i, 1)
                        }
                    }
                }else if($scope.selected.indexOf(userId) == -1){
                    for( var i = 0; i < $scope.arrAll.length; i++){
                        //console.log($scope.arrAll)
                        if($scope.arrAll[i].user_id == userId){
                            $scope.selectedRoleMember.push($scope.arrAll[i])

                        }
                    }
                }
                selectService.updateSelection(selected , e , userId)
            }else{
                for(var i = 0; i < $scope.selectedRoleMember.length; i++){
                    if($scope.selectedRoleMember[i].user_id == userId){
                        $scope.selectedRoleMember.splice(i, 1)
                    }
                }
                selectService.updateSelectionRole(selected , e , userId)
            }

        }
        $scope.isSelected = selectService.isSelected
        $scope.isSelectedAll = selectService.isSelectedAll
        //滚动条
        //$scope.scrollHeight = function () {
        //    //console.log($(window).height())
        //    $('#scroll').css('height', $(window).height() - 230)
        //}
        //$scope.scrollHeight();
        //$(window).resize(function () {
        //    $('#scroll').css('height', $(window).height() - 230)
        //});
        //滚动条设置
        setTimeout(function () {
            var scroll = new Optiscroll(document.getElementById('rightMember'));
            var scroll2 = new Optiscroll(document.getElementById('leftMember'));
            //滚动底部的时候触发
            //$('#scroll').on('scrollreachbottom', function (ev) {
            //
            //});
        }, 500)
}])

//订单模块
//新建项目控制器
app.controller('addProjectCtrl' , ['$scope', '$modalInstance', '$resource' , 'staticData' , 'selectService' , 'formatDateService' , 'commonService','$state','info','$http','checkTimeService',
    function($scope, $modalInstance, $resource,staticData,selectService,formatDateService,commonService,$state,info,$http,checkTimeService){
        //初始化
        $scope.data = {}
        //给出费用默认值
        $scope.waySelectedArr = [1]
        $scope.data['projectSource'] = '1'
        $scope.data['customerCategory'] = '1'
        $scope.data.fromDate = undefined
        $scope.data.endDate = undefined
        $scope.editMode = false
        $scope.noRepeat = false

        $scope.options = {
            locale: 'zh-cn',
            format: 'YYYY/MM/DD',
            showClear: true,
            //minDate: new Date()
        }
        //w5c表单验证配置
        var vm = $scope.vm = {
            htmlSource: "",
            showErrorType: "1",
            showDynamicElement: true,
            dynamicName: "dynamicName",
            entity: {}
        };

        vm.saveEntity = function ($event) {
            //do somethings for bz
            alert("Save Successfully!!!");
        };
        //每个表单的配置，如果不设置，默认和全局配置相同
        vm.validateOptions = {
            blurTrig: true
        };


        //费用类别绑定
        $scope.wayList = staticData.feeType

        //select相关操作的方法绑定
        $scope.updateSelection = selectService.updateSelection
        $scope.selectAll = selectService.selectAll
        $scope.isSelected = selectService.isSelected
        $scope.isSelectedAll = selectService.isSelectedAll

        //判断是否为编辑模式
        if(info.projectId){
            $scope.editMode = true
            //查询项目详情
            $scope.query = function(projectId){
                var $com = $resource(staticData.hostUrl + '/api/cinema-adLaunch/adProject/:projectId' , {projectId:'@projectId'})
                $com.get({projectId:projectId} , function(res){
                    $scope.data = res
                    $scope.waySelectedArr = res.projectCosts
                    $scope.data.fromDate = res.projectBegintime
                    $scope.data.endDate = res.projectEndtime
                })
            }
            $scope.query(info.projectId)

        }


        $scope.submit = function(){
            var startDate,
                endDate
            $scope.noRepeat = true

            //整合发送数据
            var sendObj = $scope.data
            var fromDate = $scope.data.fromDate._d
            var fromDateTrans = formatDateService.getDate(fromDate)
            var endDate = $scope.data.endDate._d
            var endDateTrans = formatDateService.getDate(endDate)
            sendObj.projectBegintime = fromDateTrans
            sendObj.projectEndtime = endDateTrans

            sendObj.projectCosts = $scope.waySelectedArr
            sendObj.customerCategory = parseInt(sendObj.customerCategory)
            sendObj.projectSource = parseInt(sendObj.projectSource)

            startDate = checkTimeService.dateFormat(fromDateTrans)
            endDate = checkTimeService.dateFormat(endDateTrans)

            if(startDate - endDate <= 0){
                //校验是否选择费用类型
                if($scope.waySelectedArr.length == 0){
                    commonService.ctrlError('操作','费用类型不能为空')
                    $scope.noRepeat = false
                }else {
                    //编辑模式提交
                    if($scope.editMode){

                        var promise = $http({
                            method: 'put',
                            url:'/api/cinema-adLaunch/adProject',
                            data:sendObj,
                        })
                        promise.then(function (res) {
                            if(res.data.success) {
                                commonService.ctrlSuccess('编辑')
                                $modalInstance.close()

                            }else{
                                commonService.ctrlError('编辑', res.data.message)
                                $scope.noRepeat = false
                            }
                        })

                    }else {
                        var $com = $resource(staticData.hostUrl + '/api/cinema-adLaunch/adProject')
                        $com.save({} , sendObj , function(res){
                            if(res.success){
                                commonService.ctrlSuccess('添加');
                                $modalInstance.close()
                            }else{
                                commonService.ctrlError('添加', res.message)
                                $scope.noRepeat = false
                            }
                        })
                    }
                }
            }else {
                commonService.ctrlError('操作','起始日期不可大于结束日期')
                $scope.noRepeat = false
            }



        }

        //取消时的操作
        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
}])

//查看项目详情
app.controller('showProjectDetailCtrl' , ['$scope', '$modalInstance', '$resource' , 'staticData' ,'commonService','info',
    function($scope, $modalInstance, $resource,staticData,commonService,info){
        //初始化
        $scope.data = {}

        $scope.query = function(projectId){
            var $com = $resource(staticData.hostUrl + '/api/cinema-adLaunch/adProject/:projectId' , {projectId:'@projectId'})
            $com.get({projectId:projectId} , function(res){
                if(res.success == false){
                    commonService.ctrlError('查询',res.message)
                }else {
                    $scope.data = res
                }
            })
        }
        $scope.query(info.projectId)


        //取消时的操作u
        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

    }])

//选择投放点位
app.controller('setPointModal', ['$scope', '$rootScope', '$resource', 'commonService', '$state', 'info','$modalInstance','staticData','selectService', '$http','dataAccess',
    function ($scope, $rootScope, $resource, commonService, $state, info,$modalInstance,staticData,selectService,$http,dataAccess) {

        $scope.selected = info.select;//初始化复选框

        $scope.selectedRightMember = [];//右侧div东西
        $scope.arrAll = [] //全部数组用来添加人的(右侧)

        console.log(info)

        $scope.pointType = info.pointType;
        // if($scope.selected.length > 0){
        //     $scope.selectedRightMember = $scope.selected

        //     console.log($scope.selectedRightMember)
        // }
        //$scope.selectedRightMember = info.select;
        //$scope.data111 = [
        //    {
        //        "pointId": "efc9ffcbf4e9410792dfdf7a61982033",
        //        "pointForeId": "123243432",  //前端展示id
        //        "pointType": 1,
        //        "pointName":"123",
        //        "pointProvince":"湖北省",
        //        "pointCity":"武汉",
        //        "pointDistrict":"武昌区",
        //        "detailAddress":"武昌火车站",
        //        "showBeginTime": "14:29",
        //        "showEndTime": "14:30",
        //        "addTime":"2017-05-17 14:29:29",
        //        "state": "在线",
        //        "estimateFlow": 200
        //    },
        //    {
        //        "pointId": "efc9ffcbf4e9410792dfdf7a61982034",
        //        "pointForeId": "123243432",  //前端展示id
        //        "pointType": 1,
        //        "pointName":"234",
        //        "position":"2332",
        //        "showBeginTime": "14:29",
        //        "showEndTime": "14:30",
        //        "addTime":"2017-05-17 14:29:29",
        //        "state": "离线",
        //        "estimateFlow": 200
        //    },
        //    {
        //        "pointId": "efcbf4e9410792dfdf7a61982034",
        //        "pointForeId": "123243432",  //前端展示id
        //        "pointType": 1,
        //        "pointName":"bbbbb",
        //        "position":"2332",
        //        "showBeginTime": "14:29",
        //        "showEndTime": "14:30",
        //        "addTime":"2017-05-17 14:29:29",
        //        "state": "离线",
        //        "estimateFlow": 200
        //    },
        //    {
        //        "pointId": "efc9ffcbf4e9410792a61982034",
        //        "pointForeId": "123243432",  //前端展示id
        //        "pointType": 1,
        //        "pointName":"aaaaa",
        //        "position":"2332",
        //        "showBeginTime": "14:29",
        //        "showEndTime": "14:30",
        //        "addTime":"2017-05-17 14:29:29",
        //        "state": "离线",
        //        "estimateFlow": 200
        //    }
        //]
        //console.log($scope.pointType)
        //console.log($scope.selected)

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
        //循环加载右侧
        $scope.queryMember = function (province , city , district , queryValue, pointType) {
            //测试接口
            if (queryValue) {
                var pointName = queryValue;
            } else {
                var pointName = '';
            }

            //console.log('搜索关键字为：' + queryValue);
            var $com = $resource(staticData.hostUrl + "/api/cinema-point/point?province=:province&city=:city&district=:district&pointName=:pointName&pointType=:pointType&state=&pageNo=1&pageSize=10000", {
                //var $com = $resource($scope.app.host + "/api/mps-filemanager/file?pageNo=:pageNo&pageSize=:pageSize&path=:path&keyword=:keyword", {

                province: '@province' , city: '@city' , district: '@district' , pointName: '@pointName',pointType:'@pointType'
            });

            $com.get({ province: province , city: city , district: district , pointName: pointName , pointType: pointType},
                function (data) {
                    //console.log(data)
                    $scope.datas = data.pointList.dataList;
                })
        }

        //加载所有点位
        $scope.queryMemberAll = function (province , city , district , queryValue, pointType) {
            //测试接口
            if (queryValue) {
                var pointName = queryValue;
            } else {
                var pointName = '';
            }

            //console.log('搜索关键字为：' + queryValue);
            var $com = $resource(staticData.hostUrl + "/api/cinema-point/point?province=:province&city=:city&district=:district&pointName=:pointName&pointType=:pointType&state=&pageNo=1&pageSize=10000", {
                //var $com = $resource($scope.app.host + "/api/mps-filemanager/file?pageNo=:pageNo&pageSize=:pageSize&path=:path&keyword=:keyword", {

                province: '@province' , city: '@city' , district: '@district' , pointName: '@pointName',pointType:'@pointType'
            });

            $com.get({ province: province , city: city , district: district , pointName: pointName , pointType: pointType},
                function (data) {
                    //console.log(data)
                    $scope.datas = data.pointList.dataList;
                    for(var i = 0; i< $scope.selected.length; i++){
                        for(var k = 0; k < $scope.datas.length; k++){
                            if($scope.selected[i] == $scope.datas[k].pointId){
                                $scope.selectedRightMember.push($scope.datas[k])
                            }
                        }
                    }
                    //$scope.arrAll = data.pointList.results;
                })
        }
        $scope.queryMemberAll('','','','',$scope.pointType);
        /**
         * 列出已选成员列表接口
         */
        //if(dataAccess.sessionGet('allObj')){
        
        //}

        //function a(){
        //    $scope.datas = $scope.data111
        //    for(var i = 0; i< $scope.selected.length; i++){
        //        for(var k = 0; k < $scope.datas.length; k++){
        //            if($scope.selected[i] == $scope.datas[k].pointId){
        //                $scope.selectedRightMember.push($scope.datas[k])
        //            }
        //        }
        //    }
        //}
        //a()

        $scope.ok = function(){
            var selectPoint = $scope.selected
            $rootScope.$emit('selectPoint',{selectPoint:selectPoint});
            $modalInstance.dismiss('cancel');

        }

        //搜索成员列表
        $scope.searchMember = function ( e,selected, selected2, selected3,keyword) {
            if (e) {
                var keycode = window.event ? e.keyCode : e.which;
                if (keycode == 13) {

                    $scope.queryMember(selected, selected2, selected3, keyword,$scope.pointType);

                }
            }else{
                $scope.queryMember(selected, selected2, selected3, keyword,$scope.pointType);
            }

        }

        //select相关操作的方法绑定
        $scope.updateSelection = function(selected , e , pointId,boole){
            //console.log($scope.selected.indexOf(userId))
            if(boole){
                if($scope.selected.indexOf(pointId) >= 0){
                    for(var i = 0; i < $scope.selectedRightMember.length; i++){
                        if($scope.selectedRightMember[i].pointId == pointId){
                            $scope.selectedRightMember.splice(i, 1)
                        }
                    }
                }else if($scope.selected.indexOf(pointId) == -1){
                    for( var i = 0; i < $scope.datas.length; i++){
                        //console.log($scope.arrAll)
                        if($scope.datas[i].pointId == pointId){
                            $scope.selectedRightMember.push($scope.datas[i])

                        }
                    }
                }
                selectService.updateSelection(selected , e , pointId)
            }else{
                for(var i = 0; i < $scope.selectedRightMember.length; i++){
                    if($scope.selectedRightMember[i].pointId == pointId){
                        $scope.selectedRightMember.splice(i, 1)
                    }
                }
                selectService.updateSelectionRole(selected , e , pointId)
            }

        }
        $scope.isSelected = selectService.isSelected
        $scope.isSelectedAll = selectService.isSelectedAllRole

        //省市联动
        function getCity(pointType){
            $scope.list = [];
            var $com = $resource(staticData.hostUrl +
                "/api/cinema-point/point/pointLocation?pointType=:pointType",{pointType:'@pointType'});

            $com.get({ pointType:pointType},
                function (res) {
                    $scope.list = res.message;
                })
            $scope.c = function (selected, selected2, selected3, keyword) {
                $scope.selected2 = "";
                $scope.selected3 = "";
                $scope.queryMember(selected, $scope.selected2, $scope.selected3, keyword,$scope.pointType);
            };

            $scope.c2 = function (selected, selected2, selected3, keyword) {
                $scope.selected3 = "";
                $scope.queryMember(selected, selected2, $scope.selected3, keyword,$scope.pointType);
            };

            $scope.c3 = function (selected, selected2, selected3, keyword) {
                $scope.queryMember(selected, selected2, selected3, keyword,$scope.pointType);
            }
        }
        getCity($scope.pointType )


        //滚动条设置
        setTimeout(function () {
            var scroll = new Optiscroll(document.getElementById('rightMember'));
            var scroll2 = new Optiscroll(document.getElementById('leftMember'));
            //滚动底部的时候触发
            //$('#scroll').on('scrollreachbottom', function (ev) {
            //
            //});
        }, 500)
        //一键清空
        $scope.deleteArr = function(){
            //alert(0)
            $scope.selectedRightMember = [];
            $scope.selected = []
        }
        setTimeout(function(){
            $('#allCheck').on('click',function(){
                if($(this).is(':checked')){
                    var checkList = $('.siteCheck')
                    ////checkList.eq(0).trigger("click");
                    for(var i = 0; i < checkList.length; i++){
                        if(!checkList.eq(i).is(':checked')){
                            //alert(0)
                            checkList.eq(i).click();
                        }
                    }
                }else{
                    var checkList = $('.siteCheck')
                    for(var i = 0; i < checkList.length; i++){
                        if(checkList.eq(i).is(':checked')){
                            checkList.eq(i).click();
                        }
                    }
                }
            })
        },500)

    }])
//选择城市站点弹框
app.controller('selectCitySiteCtrl' , ['$scope', '$rootScope','$modalInstance', '$resource' , 'staticData' ,'selectService','dataAccess','selectCityService','commonService','info',
    function($scope,$rootScope, $modalInstance, $resource,staticData,selectService,dataAccess,selectCityService,commonService,info){
        //初始化
        $scope.data = {}

        var perSelectedArr = [[],[]]
        var userSelectedArr = []
        var name = ''//权限的名字用鱼取消该名字的时候使用

        $scope.selectSitesArr = [];
        $scope.allSiteNum = 0;

        $scope.pointType = info.pointType
        $scope.cityList = info.cityList
        $scope.citySite = info.citySite

        if($scope.citySite.length >= 0) {
            $scope.allSiteNum = $scope.citySite.length
        }

        //console.log($scope.cityList);
        //模拟数据
        //$scope.cityList = ['北京市','北京市1','北京市3','北京市2','海淀区','九江市']

        $('.groupNameFocus').focus(function(){
            $scope.errorMsg = false
        })

        $scope.getCityList = function () {
            ///api/cinema-point/point/pointLocation?pointType=xxx
            var $com = $resource(staticData.hostUrl + "api/cinema-point/point/pointLocation?pointType=:pointType", {
                //var $com = $resource($scope.app.host + "/api/mps-filemanager/file?pageNo=:pageNo&pageSize=:pageSize&path=:path&keyword=:keyword", {

                pointType: '@pointType'
            });

            $com.get({ pointType: $scope.pointType},
                function (data) {
                    if(data.success) {
                        $scope.results = data.message
                        console.log($scope.results);
                                                //模拟数据
                        // $scope.results = [{"province":"北京","cityList":[
                        // {"city":"北京市",'pointIdList':['1','2','3']},
                        // {"city":"北京市2",'pointIdList':['11','22','33']},
                        // {"city":"北京市3",'pointIdList':['111','222','333']},
                        // {"city":"海淀区",'pointIdList':['1111','2222','3333']}]},
                        // {"province":"江西省","cityList":[
                        // {"city":"南昌市",'pointIdList':['12','22','32']},
                        // {"city":"九江市",'pointIdList':['122','222','322']},
                        // {"city":"井冈山",'pointIdList':['133','233','333']},
                        // {"city":"上饶市",'pointIdList':['144','244','344']}]}
                        // ,{"province":"甘肃省","cityList":
                        // [{"city":"兰州市",'pointIdList':['1s','2s','3s']},
                        // {"city":"榆中市",'pointIdList':['1c','2c','3c']},
                        // {"city":"吉林",'pointIdList':['1a','2a','3a']}]}];

                        if($scope.cityList) {
                        for(var i = 0;i <= $scope.cityList.length - 1;i++) {
                            for(var j = 0;j <= $scope.results.length -1;j++) {
                                for(var k = 0;k<= $scope.results[j].cityList.length - 1;k++) {
                                    if($scope.cityList[i] == $scope.results[j].cityList[k].city) {
                                        console.log($scope.results[j].cityList[k])
                                        $scope.results[j].cityList[k].checked = true
                                    }
                                } 
                            }
                        }
                        } else {
                            console.log('没有回显过程');
                        }




                                        $scope.permissionDatas = $scope.results
                                console.log($scope.permissionDatas)

                                angular.forEach( $scope.permissionDatas , function(data,index){
                                    //console.log(index);
                                    perSelectedArr[index + 1] = []
                                    angular.forEach(data.cityList , function(mData){
                                        if(mData.checked === true){
                                            perSelectedArr[0].push(mData.city)
                                            perSelectedArr[index + 1].push(mData.city)

                                        $scope.selectSitesArr.push({
                                            name:mData.city,pointIdList:mData.pointIdList
                                        });
                                        }
                                    })
                                })
                    } else {
                        commonService.ctrlError('城市列表获取', res.msg)
                    }
                    //$scope.datas = data.results;
                })  
        }

        $scope.getCityList();



                //console.log(perSelectedArr)
                $scope.perSelectedArr = perSelectedArr
                    //select相关操作的方法绑定
                    $scope.updateSelection = selectCityService.updateSelection
                    $scope.selectAll = selectCityService.selectAll
                    $scope.isSelected = selectCityService.isSelected
                    $scope.isSelectedAll = selectCityService.isSelectedAll
                    $scope.selectChildAll = selectCityService.selectChildAll
                    $scope.isChildSelectedAll = selectCityService.isChildSelectedAll

                    $scope.isSelectedAllRole = selectCityService.isSelectedAllRole


        //取消时的操作
        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

        $scope.siteNum = [];

        //实时更新站点总数
        $scope.allSiteNumFun = function () {
            $scope.allSiteNum = 0;
            for(var i = 0;i <= $scope.selectSitesArr.length - 1; i++) {
                $scope.allSiteNum  = $scope.allSiteNum + $scope.selectSitesArr[i].pointIdList.length
            }
        }
        //$scope.allSiteNumFun();

        $scope.updateParentArr = function (selectedArr, childArr, e, originData) {
            var checkbox = e.target;

            if(checkbox.checked) {
                //添加元素
                for(var i = 0;i<= originData.cityList.length -1 ;i++) {
                    var selectedFlag = true;
                    for(var j = 0;j<= $scope.selectSitesArr.length - 1;j++) {
                        if(originData.cityList[i].city == $scope.selectSitesArr[j].name) {
                            console.log("一样的不用加");
                            selectedFlag = false;
                            break;
                        }
                    }
                    console.log(selectedFlag);
                    if(selectedFlag) {
                        $scope.selectSitesArr.push({
                            name:originData.cityList[i].city,
                            pointIdList:originData.cityList[i].pointIdList
                        });
                    } 
                }
                
            } else {
                //剔除元素
                for(var i = 0;i<= originData.cityList.length -1 ;i++) {
                    //var selectedFlag = true;
                    for(var j = 0;j<= $scope.selectSitesArr.length - 1;j++) {
                        if(originData.cityList[i].city == $scope.selectSitesArr[j].name) {
                            console.log("存在就剔除");
                            $scope.selectSitesArr.splice(j,1);
                            selectedFlag = false;
                            break;
                        }
                    }
                }

            }
            console.log($scope.selectSitesArr);
            $scope.allSiteNumFun();
        }

        //确定选择的城市
        $scope.submit = function () {
            //发送已选择信息的城市站点
            console.log('开始发送城市点位信息');
            console.log($scope.selectSitesArr);
            if($scope.selectSitesArr.length <= 0 ) {
                commonService.ctrlError('操作','请选择城市')
                return;
            }
            $rootScope.$emit('selectCityList',{selectCityList:$scope.selectSitesArr});
            //dataAccess.sessionSave('selectSitesArr',$scope.selectSitesArr);
            $modalInstance.close();
            //$scope.$on('newSelectList', function (event, args) {})
        }

        $scope.updateArr = function (arr,name,siteNum,pointIdList,e) {
            var checkbox = e.target;
            var checked = checkbox.checked;
            console.log(checked);
            if(checked) {
                $scope.selectSitesArr.push({
                    name:name,pointIdList:pointIdList
                });
            } else {
                for(var i = 0; i <= $scope.selectSitesArr.length -1;i++){
                    if($scope.selectSitesArr[i].name == name) {
                        $scope.selectSitesArr.splice(i,1);
                    }
                }
            }
            console.log($scope.selectSitesArr);
            $scope.allSiteNumFun();
        }
           
                    //尝试jq解决全选问题
            $('#allCheck').on('click',function(){
               if($(this).is(':checked')){
                   var checkList = $('.parent2Check')
                   for(var i = 0; i < checkList.length; i++){
                       if(!checkList.eq(i).is(':checked')){
                           checkList.eq(i).click();
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

//编辑点位弹框
app.controller('editPTCtrl', ['$scope', '$modalInstance', '$resource', '$state', '$http','commonService', 'staticData','info','checkTimeService','formatDateService','$timeout','$q','ptService',
    function ($scope, $modalInstance, $resource, $state, $http, commonService, staticData , info , checkTimeService,formatDateService,$timeout , $q,ptService) {
        //初始化
        var pointId = info.id
        var bool = info.bool
        var hostUrl = staticData.hostUrl

        $scope.cityList = [];

        $scope.editMode = false
        if(bool){
            $scope.editMode = true
        }

        $scope.createMap = function(){
            var map = new BMap.Map("map");            // 创建Map实例
            map.centerAndZoom(new BMap.Point(116.404, 39.915), 11);
            $scope.local = new BMap.LocalSearch(map, {
                renderOptions: {map: map},pageCapacity:1
            });

            console.log($scope.data)
            var address = $scope.data.pointProvince + $scope.data.pointCity + $scope.data.pointDistrict + $scope.data.detailAddress;
            $scope.local.search(address);
            //console.log(address)
        }




        $scope.c = function (selected,selected2,selected3,keyword,type) {
            //console.log(selected);
            $scope.selected2 = "";
            $scope.selected3 = "";
        };

        $scope.c2 = function (selected,selected2,selected3,keyword,type) {
            $scope.selected3 = "";
        };

        $scope.c3 = function (selected,selected2,selected3,keyword,type) {
        }
        

        //查询点位详情
        $scope.queryPTdetail = function(pointId){
            var $com = $resource(staticData.hostUrl + '/api/cinema-point/point/:pointId/detail',{pointId:'@pointId'})
            var defer = $q.defer();

            $com.get({pointId:pointId} , function(res){
                $scope.data = res

                $scope.beginTime= res.showBeginTime
                $scope.endTime= res.showEndTime

                $scope.data.showBeginTime = checkTimeService.getModelTime(res.showBeginTime)
                $scope.data.showEndTime = checkTimeService.getModelTime(res.showEndTime)

                $scope.detailAddress = res.detailAddress
                defer.resolve(res)
            })
            return defer.promise
        }

        $scope.queryPTdetail(pointId).then(function(){
            $scope.createMap()

            //城市json数据获取
            $http.get('admin/js/cityList.json').success(function(data) {
                //console.log(data);
                $scope.cityList = data

                $scope.selected = ptService.getStationLocations(data, $scope.data).selected
                $scope.selected2 = ptService.getStationLocations(data, $scope.data).selected2
                $scope.selected3 = ptService.getStationLocations(data, $scope.data).selected3
            });
        })

        //---测试数据---

        //$scope.data = {
        //    "pointId": "efc9ffcbf4e9410792dfdf7a61982033",
        //    "pointName": "1223",
        //    "addTime": "2017-04-17 14:29:29",
        //    "pointType": 1,
        //    "pointProvince":"湖北省",
        //    "pointCity":"武汉",
        //    "pointDistrict":"武昌区",
        //    "detailAddress":"武昌火车站",
        //    "showBeginTime": "14:29",
        //    "showEndTime": "21:56",
        //    "state": "在线",
        //    "estimateFlow": 200,
        //    "pointForeId": "123243432",  //前端展示id
        //}
        //$scope.data.showBeginTime = checkTimeService.getModelTime($scope.data.showBeginTime)
        //$scope.data.showEndTime = checkTimeService.getModelTime($scope.data.showEndTime)


        //---测试结束---

        //提交校验逻辑
        $scope.doSubmit = function(pointId){

            //时间输入合法标识符
            var timeComplete = false
            //时间格式合法标识符
            var timeCheck= false
            //始末时间校验
            var cycleCheck = false

            $scope.data.estimateFlow = parseInt($scope.data.estimateFlow)

            if($scope.data.showBeginTime && $scope.data.showEndTime){
                if($scope.data.showBeginTime.length == 4 && $scope.data.showEndTime.length == 4){
                    timeComplete = true
                    if( !checkTimeService.checkTime($scope.data.showBeginTime) && !checkTimeService.checkTime($scope.data.showEndTime)){
                        timeCheck = true
                        if($scope.data.showBeginTime < $scope.data.showEndTime){
                            cycleCheck = true

                            $scope.data.showBeginTime = checkTimeService.getSendTime($scope.data.showBeginTime)
                            $scope.data.showEndTime = checkTimeService.getSendTime($scope.data.showEndTime)
                        }
                    }
                }
            }
            //正常流程
            var $comUpdate = $resource(hostUrl + "/api/cinema-point/point/:pointId",{pointId:'@pointId'},{
                'update': { method:'PUT' }
            });

            $scope.data.pointProvince = $scope.selected.name
            $scope.data.pointCity = $scope.selected2.name
            $scope.data.pointDistrict = $scope.selected3.value
            //校验输入完整性和合法性并提示
            if(timeComplete){
                if(timeCheck){
                    if(cycleCheck){
                        $comUpdate.update({pointId:pointId},$scope.data,function(res){

                            if(res.success){
                                commonService.ctrlSuccess('保存')
                                $modalInstance.close();
                            }else {
                                commonService.ctrlError('保存', res.msg)
                            }
                        });
                    }else {
                        commonService.ctrlError('操作','起始时间必须小于结束时间')
                    }
                }else {
                    commonService.ctrlError('操作','时间格式有误')
                }
            }else {
                commonService.ctrlError('操作','时间字段未完整填写')
            }


            ////测试流程
            //var $com = $resource(hostUrl + "/api/mps-device/device/timeswitch/:deviceId",{deviceId:'@deviceId'})
            //
            ////校验输入完整性和合法性并提示
            //if(timeComplete){
            //    if(timeCheck){
            //        if( sendObj.daily ){
            //            $com.save({},sendObj,function(res){
            //                res.success ?
            //                    commonService.ctrlSuccess('保存') :
            //                    commonService.ctrlError('保存', res.msg)
            //            })
            //        }else {
            //            if(dateCheck){
            //                $com.save({},sendObj,function(res){
            //                    res.success ?
            //                        commonService.ctrlSuccess('保存') :
            //                        commonService.ctrlError('保存', res.msg)
            //                })
            //            }else {
            //                commonService.ctrlError('操作','请选择正确的日期')
            //            }
            //        }
            //    }else {
            //        commonService.ctrlError('操作','时间格式有误')
            //    }
            //}else {
            //    commonService.ctrlError('操作','时间字段未完整填写')
            //}

            //console.log(sendObj)

        }



        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

    }])

//默认素材列表弹窗
app.controller('defulatPlayListModalCtrl', ['$scope', 'staticData', '$resource', 'info' , 'commonService', '$rootScope' , '$modalInstance' , function ($scope, staticData, $resource, info , commonService, $rootScope, $modalInstance) {

    $scope.deviceType = info.pointType;
    switch ( $scope.deviceType){
        case 1: $scope.pointName = '3*3';
                break;
        case 2: $scope.pointName = '3*4';
            break;
        case 3: $scope.pointName = '1+1';
            break;
        case 4: $scope.pointName = '单屏';
            break;
        case 5: $scope.pointName = '1+1+1';
            break;
    }
    //判断新建
    if(info.defaultId){
        $scope.defaultId = info.defaultId;
        $scope.edit_bool = true
    }else{
        $scope.edit_bool = false
    }

    var hostUrl = staticData.hostUrl

    $scope.data = {
        "resouceName": "",
        "pointType": $scope.deviceType,
        "resourceItems": [],
        "screenType" : 2
    };

    var vm = $scope.vm = {
        htmlSource: "",
        showErrorType: "1",
        showDynamicElement: true,
        dynamicName: "dynamicName",
        entity: {}
    };

    vm.saveEntity = function ($event) {
        //do somethings for bz
        alert("Save Successfully!!!");
    };
    //每个表单的配置，如果不设置，默认和全局配置相同
    vm.validateOptions = {
        blurTrig: true
    };


    $scope.allDel = function () {

        commonService.ctrlModal('deleteAd').result.then(function () {
            console.log('清除素材');
            $scope.data.resourceItems = [];
            $scope.screen1 = false;
            $scope.screen2 = false;
            $scope.screen3 = false;
            $scope.screen4 = false;
            $scope.screen5 = false;
            $scope.gameType = false;
            if ($scope.playBool) {
                playerPre.paused();
            }
        });
    };

    $scope.selectMedia = function (number, format) {
        $scope.screenNum = number;
        var format = format;
        commonService.fileManagerModal('选择', '', format);
        //            commonService.addRoleMemberModal('b0b0ad174cfa4a449546c7ae599ab6da','%E6%B5%8B%E8%AF%95');

    };

    $rootScope.$on('selectFileObj', function (event, args) {
        //console.log(args.selectFileObj.uid)
        //console.log(args)
        //$scope.gameName = args.selectFileObj.name;
        console.log(args.selectFileObj.uid);
        $scope.query($scope.screenNum, args.selectFileObj.uid);
    });

    //播放器
    var playerPre = {};
    $scope.playBool = false;
    $scope.openOtherPlay = function (imgPath, videoPath) {
        if(!videoPath){
            return;
        }
        $('.video-jsPre1').attr('id', 'a' + parseInt(Math.random() * 25));
        var videoId = $('.video-jsPre1').attr('id');
        $scope.posterImg = $rootScope.address + imgPath;
        playerPre = videojs(videoId, {
            //"techOrder": ["flash","html"],
            "autoplay": false,
            "poster": $scope.posterImg

        });
        $scope.playBool = true;
        playerPre.src($rootScope.address + videoPath);
        playerPre.poster($scope.posterImg);
        playerPre.paused();
    };
    //预览
    $scope.query = function (screenNum, fileUid) {
        //console.log(fileUid);
        var $com = $resource(hostUrl + "/api/mps-filemanager/file/:fileUid/preview", {
            taskId: '@fileUid'
        });
        $com.get({ fileUid: fileUid }, function (data) {
            if (screenNum == 1) {
                $scope.screen1 = true;
                $('#order-video').fadeIn(200);
                $scope.openOtherPlay(data.message[0].picPath, data.message[0].videoPath);

                //去除相同位置的素材
                if ($scope.data.resourceItems.length > 0) {
                    for (var i = $scope.data.resourceItems.length - 1; i >= 0; i--) {
                        if ($scope.data.resourceItems[i].screenSeq == 1) {
                            $scope.data.resourceItems.splice(i, 1);
                        }
                    }
                }
                //console.log(data)
                $scope.data.resourceItems.push({
                    "resourceId": fileUid,
                    "resourceType": "video",
                    "resourceDuration": data.code*1000,
                    "screenSeq": "1"
                });
            } else if (screenNum == 3) {
                $scope.screen3 = true;
                $scope.screen3Pic = $rootScope.address + data.message[0].picPath;
                //$scope.data.fileInfo[2].fileId = fileUid;

                //去除相同位置的素材
                for (var i = $scope.data.resourceItems.length - 1; i >= 0; i--) {
                    if ($scope.data.resourceItems[i].screenSeq == 3) {
                        $scope.data.resourceItems.splice(i, 1);
                    }
                }
                $scope.data.resourceItems.push({
                    "screenSeq": 3,
                    "resourceId": fileUid,
                    "resourceDuration":10000,
                    "resourceType": "picture"
                });
            } else if (screenNum == 2) {
                $scope.screen2 = true;
                $scope.screen2Pic = $rootScope.address + data.message[0].picPath;
                //$scope.data.fileInfo[1].fileId = fileUid;

                //去除相同位置的素材
                for (var i = $scope.data.resourceItems.length - 1; i >= 0; i--) {
                    if ($scope.data.resourceItems[i].screenSeq == 2) {
                        $scope.data.resourceItems.splice(i, 1);
                    }
                }

                $scope.data.resourceItems.push({
                    "screenSeq": 2,
                    "resourceId": fileUid,
                    "resourceDuration":10000,
                    "resourceType": "picture"
                });
            } else if (screenNum == 4) {
                $scope.screen4 = true;
                $scope.screen4Pic = $rootScope.address + data.message[0].picPath;
                //$scope.data.fileInfo[3].fileId = fileUid;

                //去除相同位置的素材
                for (var i = $scope.data.resourceItems.length - 1; i >= 0; i--) {
                    if ($scope.data.resourceItems[i].screenSeq == 4) {
                        $scope.data.resourceItems.splice(i, 1);
                    }
                }

                $scope.data.resourceItems.push({
                    "screenSeq": 4,
                    "resourceId": fileUid,
                    "resourceDuration":10000,
                    "resourceType": "picture"
                });
            } else if (screenNum == 5) {
                $scope.screen5 = true;
                $scope.screen5Pic = $rootScope.address + data.message[0].picPath;

                //去除相同位置的素材
                for (var i = $scope.data.resourceItems.length - 1; i >= 0; i--) {
                    if ($scope.data.resourceItems[i].screenSeq == 2) {
                        $scope.data.resourceItems.splice(i, 1);
                    }
                }
                //$scope.data.fileInfo[1].fileId = fileUid;
                $scope.data.resourceItems.push({
                    "screenSeq": 2,
                    "resourceId": fileUid,
                    "resourceDuration":10000,
                    "resourceType": "picture"
                });
            }
        });
    };

    //换type
    $scope.changeType = function (num) {
        if (num == 2) {
            $scope.screen2 = false;
            $scope.screen3 = false;
            $scope.screen4 = false;
            for (var i = $scope.data.resourceItems.length - 1; i >= 0; i--) {
                if ($scope.data.resourceItems[i].screenSeq > 1) {
                    $scope.data.resourceItems.splice(i, 1);
                    //$scope.data.fileInfo[i].
                    //console.log($scope.data.fileInfo);
                }
            }
        } else {
            $scope.screen5 = false;
            for (var i = $scope.data.resourceItems.length - 1; i >= 0; i--) {
                if ($scope.data.resourceItems[i].screenSeq > 1) {
                    $scope.data.resourceItems.splice(i, 1);
                    //console.log($scope.data.fileInfo);
                }
            }
        }
    };

    //编辑时候的数据回显
    if($scope.edit_bool){
        var $com = $resource(hostUrl + '/api/mps-adschedule/defaultRes/itemDetail?defaultId=:defaultId',{defaultId : '@defaultId'});
        $com.get({defaultId:$scope.defaultId} , function (res) {
            if (res.success) {
                if(res.data.resourceItems.length ==2){
                    res.data.screenType = 2
                }else{
                    res.data.screenType = 1
                }
                $scope.data = res.data;
                console.log($scope.data)
                for(var i = 0; i < res.data.resourceItems.length; i++){
                    $scope.query(res.data.resourceItems[i].screenSeq, res.data.resourceItems[i].resourceId);
                }
            }
        });
    }

    //提交
    $scope.submit = function(){
        var sendObj = $scope.data;
        console.log(sendObj)
        switch ( $scope.deviceType){
            case 1: if(sendObj.resourceItems.length != 1){
                        commonService.ctrlError('创建','请选择素材');
                        return;
                    }
                break;
            case 2: if(sendObj.screenType == 2){
                        if(sendObj.resourceItems.length != 2){
                            commonService.ctrlError('创建','请选择素材');
                            return;
                        }
                    }else{
                        if(sendObj.resourceItems.length != 4){
                            commonService.ctrlError('创建','请选择素材');
                            return;
                        }
                    }
                break;
            case 3: if(sendObj.resourceItems.length != 2){
                        commonService.ctrlError('创建','请选择素材');
                        return;
                    }
                break;
            case 4: if(sendObj.resourceItems.length != 1){
                        commonService.ctrlError('创建','请选择素材');
                        return;
                    }
                break;
        }
        //发送数据请求
        if($scope.edit_bool){
            var $com = $resource(hostUrl + "/api/mps-adschedule/defaultRes/update");
            $com.save(sendObj, function (res) {
                //成功回调函数
                if (res.success) {
                    commonService.ctrlSuccess('编辑');
                    //$state.go('app.media.mediaList');
                    $rootScope.$broadcast('defaultPlayList',{bool:true});
                    $modalInstance.dismiss('cancel');
                } else {
                    commonService.ctrlError('编辑', res.message);
                    $modalInstance.dismiss('cancel');
                }
            })
        }else{
            var $com = $resource(hostUrl + "/api/mps-adschedule/defaultRes/submit");
            $com.save(sendObj, function (res) {
                //成功回调函数
                if (res.success) {
                    commonService.ctrlSuccess('创建');
                    //$state.go('app.media.mediaList');
                    $rootScope.$broadcast('defaultPlayList',{bool:true});
                    $modalInstance.dismiss('cancel');
                } else {
                    commonService.ctrlError('创建', res.message);
                    $modalInstance.dismiss('cancel');
                }
            })
        }

    }

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}]);

//1+1+1
app.controller('defulatPlayListModalNewCtrl', ['$scope', 'staticData', '$resource', 'info' , 'commonService', '$rootScope' , '$modalInstance' , function ($scope, staticData, $resource, info , commonService, $rootScope, $modalInstance) {

    //判断新建
    if(info.defaultId){
        $scope.defaultId = info.defaultId;
        $scope.edit_bool = true
    }else{
        $scope.edit_bool = false
    }

    var hostUrl = staticData.hostUrl;
    //视频时长字段
    var videoCode1 = 0
    var videoCode2 = 0

    $scope.data = {
        "resouceName": "",
        "pointType": 5,
        "resourceItems": [],
        "screenType" : 1
    };

    var vm = $scope.vm = {
        htmlSource: "",
        showErrorType: "1",
        showDynamicElement: true,
        dynamicName: "dynamicName",
        entity: {}
    };

    vm.saveEntity = function ($event) {
        //do somethings for bz
        alert("Save Successfully!!!");
    };
    //每个表单的配置，如果不设置，默认和全局配置相同
    vm.validateOptions = {
        blurTrig: true
    };


    $scope.allDel = function () {

        commonService.ctrlModal('deleteAd').result.then(function () {
            $scope.data.resourceItems = [];
            $scope.screen1 = false;
            $scope.screen2 = false;
            $scope.screen3 = false;
            $scope.screen4 = false;
            $scope.screen5 = false;
            $scope.gameType = false;
            if ($scope.playBool) {
                playerPre.paused();
                $('#order-video1').fadeOut(20);
            }
            if ($scope.playBool2) {
                playerPre2.paused();
                $('#order-video2').fadeOut(20);
            }
        });
    };

    $scope.selectMedia = function (number, format) {
        $scope.screenNum = number;
        var format = format;
        commonService.fileManagerModal('选择', '', format);
        //            commonService.addRoleMemberModal('b0b0ad174cfa4a449546c7ae599ab6da','%E6%B5%8B%E8%AF%95');

    };

    $rootScope.$on('selectFileObj', function (event, args) {
        //console.log(args.selectFileObj.uid);
        $scope.query($scope.screenNum, args.selectFileObj.uid);
    });

    //播放器
    var playerPre = {};
    $scope.playBool = false;
    $scope.openOtherPlay = function (imgPath, videoPath) {
        if(!videoPath){
            return;
        }
        $('.video-jsPre1').attr('id', 'e' + parseInt(Math.random() * 25));
        var videoId = $('.video-jsPre1').attr('id');
        $scope.posterImg = $rootScope.address + imgPath;
        playerPre = videojs(videoId, {
            //"techOrder": ["flash","html"],
            "autoplay": false,
            "poster": $scope.posterImg

        });
        $scope.playBool = true;
        playerPre.src($rootScope.address + videoPath);
        playerPre.poster($scope.posterImg);
        playerPre.paused();
    };
    //播放器2
    var playerPre2 = {};
    $scope.playBool2 = false;
    $scope.openOtherPlay2 = function (imgPath, videoPath) {
        if(!videoPath){
            return;
        }
        $('.video-jsPre2').attr('id', 'f' + parseInt(Math.random() * 25));
        var videoId = $('.video-jsPre2').attr('id');
        $scope.posterImg = $rootScope.address + imgPath;
        playerPre2 = videojs(videoId, {
            //"techOrder": ["flash","html"],
            "autoplay": false,
            "poster": $scope.posterImg

        });
        $scope.playBool2 = true;
        playerPre2.src($rootScope.address + videoPath);
        playerPre2.poster($scope.posterImg);
        playerPre2.paused();
    };
    //预览
    $scope.query = function (screenNum, fileUid) {
        //console.log(fileUid);
        var $com = $resource(hostUrl + "/api/mps-filemanager/file/:fileUid/preview", {
            taskId: '@fileUid'
        });
        $com.get({ fileUid: fileUid }, function (data) {
            if (screenNum == 1) {
                $scope.screen1 = true;
                $('#order-video1').fadeIn(200);
                $scope.openOtherPlay(data.message[0].picPath, data.message[0].videoPath);

                //去除相同位置的素材
                if ($scope.data.resourceItems.length > 0) {
                    for (var i = $scope.data.resourceItems.length - 1; i >= 0; i--) {
                        if ($scope.data.resourceItems[i].screenSeq == 1) {
                            $scope.data.resourceItems.splice(i, 1);
                            videoCode1 = data.code
                        }
                    }
                }
                //console.log(data)
                $scope.data.resourceItems.push({
                    "resourceId": fileUid,
                    "resourceType": "video",
                    "resourceDuration": data.code*1000,
                    "screenSeq": "1"
                });
            } else if (screenNum == 3) {
                $scope.screen3 = true;
                $('#order-video2').fadeIn(200);
                $scope.openOtherPlay2(data.message[0].picPath, data.message[0].videoPath);

                //去除相同位置的素材
                if ($scope.data.resourceItems.length > 0) {
                    for (var i = $scope.data.resourceItems.length - 1; i >= 0; i--) {
                        if ($scope.data.resourceItems[i].screenSeq == 3) {
                            $scope.data.resourceItems.splice(i, 1);
                        }
                    }
                }
                videoCode2 = data.code
                $scope.data.resourceItems.push({
                    "resourceId": fileUid,
                    "resourceType": "video",
                    "resourceDuration": data.code*1000,
                    "screenSeq": "3"
                });
            }else if (screenNum == 2) {
                $scope.screen5 = true;
                $scope.screen5Pic = $rootScope.address + data.message[0].picPath;

                //去除相同位置的素材
                for (var i = $scope.data.resourceItems.length - 1; i >= 0; i--) {
                    if ($scope.data.resourceItems[i].screenSeq == 2) {
                        $scope.data.resourceItems.splice(i, 1);
                    }
                }
                //$scope.data.fileInfo[1].fileId = fileUid;
                $scope.data.resourceItems.push({
                    "screenSeq": "2",
                    "resourceId": fileUid,
                    "resourceDuration":10000,
                    "resourceType": "picture"
                });
            }
        });
    };

    //编辑时候的数据回显
    if($scope.edit_bool){
        var $com = $resource(hostUrl + '/api/mps-adschedule/defaultRes/itemDetail?defaultId=:defaultId',{defaultId : '@defaultId'});
        $com.get({defaultId:$scope.defaultId} , function (res) {
            if (res.success) {
                //判断id是否相同从而判断是否和左屏幕同步
                var n,m;
                for(var i = 0; i < res.data.resourceItems.length; i++){
                    if(res.data.resourceItems[i].screenSeq == 1){
                        n = i;
                    }
                    if(res.data.resourceItems[i].screenSeq == 3){
                        m = i
                    }
                }
                if(res.data.resourceItems[n].resourceId == res.data.resourceItems[m].resourceId){
                    res.data.screenType = 2
                }else{
                    res.data.screenType = 1
                }
                $scope.data = res.data;
                //console.log($scope.data)
                for(var i = 0; i < res.data.resourceItems.length; i++){
                    $scope.query(res.data.resourceItems[i].screenSeq, res.data.resourceItems[i].resourceId);
                }
            }
        });
    }

    //提交
    $scope.submit = function(){
        var sendObj = $scope.data;
        console.log(sendObj)
        if(sendObj.screenType == 2){
            if(!$scope.playBool || !$scope.screen5){
                commonService.ctrlError('创建','请选择素材');
                return;
            }

            //把左屏幕复制给右屏幕
            var n;
            for(var i = 0; i < sendObj.resourceItems.length; i++){
                if(sendObj.resourceItems[i].screenSeq == 1){
                }
                if(sendObj.resourceItems[i].screenSeq == 3){
                    sendObj.resourceItems.splice(i, 1);
                }
            }
            for(var i = 0; i < sendObj.resourceItems.length; i++){
                if(sendObj.resourceItems[i].screenSeq == 1){
                    n = i
                }
            }
            sendObj.resourceItems.push({
                "resourceId": sendObj.resourceItems[n].resourceId,
                "resourceType": "video",
                "resourceDuration": sendObj.resourceItems[n].resourceDuration,
                "screenSeq": "3"
            });
        }else{
            if(!$scope.playBool2 || !$scope.playBool || !$scope.screen5){
                commonService.ctrlError('创建','请选择素材');
                return;
            }
            if(Math.abs(videoCode1 - videoCode2) > 1){
                var obj = {
                    videoCode1 : videoCode1,
                    videoCode2 : videoCode2
                }
                commonService.ctrlModal('videoCode' , obj)
                return;
            }
        }

        //发送数据请求
        if($scope.edit_bool){
            var $com = $resource(hostUrl + "/api/mps-adschedule/defaultRes/update");
            $com.save(sendObj, function (res) {
                //成功回调函数
                if (res.success) {
                    commonService.ctrlSuccess('编辑');
                    //$state.go('app.media.mediaList');
                    $rootScope.$broadcast('defaultPlayList',{bool:true});
                    $modalInstance.dismiss('cancel');
                } else {
                    commonService.ctrlError('编辑', res.message);
                    $modalInstance.dismiss('cancel');
                }
            })
        }else{
            var $com = $resource(hostUrl + "/api/mps-adschedule/defaultRes/submit");
            $com.save(sendObj, function (res) {
                //成功回调函数
                if (res.success) {
                    commonService.ctrlSuccess('创建');
                    //$state.go('app.media.mediaList');
                    $rootScope.$broadcast('defaultPlayList',{bool:true});
                    $modalInstance.dismiss('cancel');
                } else {
                    commonService.ctrlError('创建', res.message);
                    $modalInstance.dismiss('cancel');
                }
            })
        }

    }

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}]);

//点位冲突模态框
app.controller('conflictModalCtrl', ['$scope', '$modalInstance', '$state', 'info' , 'staticData', 'commonService' , '$resource' , function ($scope, $modalInstance, $state, info, staticData, commonService , $resource) {

    //$scope.modalType = info.typeInfo;

    $scope.obj = info.obj;
    var hostUrl = staticData.hostUrl

    $scope.ok = function () {

        var data = {"billId":$scope.obj.orderId,"billStatus":3}
        var $comUpdate = $resource(hostUrl + "/api/cinema-adLaunch/checkAdBillPermmison/throwIn",{},{
            'update': { method:'PUT' }
        });

        $comUpdate.update({},data,function(res){
            if(res.success){
                commonService.ctrlSuccess('审核');
                $state.go('app.order.checkSheetList')
                $modalInstance.dismiss('cancel');
            }else {
                //$('.btnSubmit').attr('disabled',false)
                //$scope.errorMsg = res.message
                commonService.ctrlError('操作' , res.message)
            }
        });
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    //$scope.goSheetList = function () {
    //    $state.go('app.order.orderList');
    //    $modalInstance.dismiss('cancel');
    //};
    setTimeout(function () {
        var scroll = new Optiscroll(document.getElementById('scroll1'));
        //滚动底部的时候触发
        $('#scroll').on('scrollreachbottom', function (ev) {});
    }, 100);
}]);

//addPointCtrl
app.controller('addPointCtrl' , ['$scope', '$modalInstance', '$resource' , 'staticData' ,'commonService','$state','randomStringServive','$compile',
    function($scope, $modalInstance, $resource,staticData,commonService,$state,randomStringServive,$compile){
        
        var hostUrl = staticData.hostUrl

        $scope.data = {};
        $scope.badId = [];        
        $scope.data.pointType = '';
        //添加副屏
        $scope.addScreen = function() {
            console.log($("#addScreen").children().length);
            if($("#addScreen").children().length >= 3) {
                commonService.ctrlError('操作','最多只能有三条副屏幕');
                return;
            }

            var number = $("#addScreen").children().length + 1;

            var str = randomStringServive.randomString();
            var addScreenHtml =  
                "<div class='input-class' id=" + str + ">"
                    + "<label>副屏" + number + "&nbsp;&nbsp;ID ： </label>"
                     +"<input class='inputText' type='text' ng-blur=\"checkId('"+ str +"')\"  name='pointName' ng-pattern='/^[\u4E00-\u9FA5A-Za-z0-9_]+$/' required maxlength='30'/>"
                     +"<input class='disableId' type='hidden'/>"
                     + "<i class='iconfont icon-shanchu "+ str +"' ng-click=\"deleteScreen('"+str+"')\"></i>" 
                     +"<br>&nbsp;&nbsp;<span class="+str+" style='color:red;padding-left:60px;display:inline-block;'></span>"
                    +"</div>";
            $("#addScreen").append($compile(addScreenHtml)($scope));
        }
        //提交
        $scope.submit = function () {
            
            if ($scope.data.pointType == '') {
                commonService.ctrlError('添加','请选择点位类型');
                return;
            }

            //for(var i = 0;i <= $("#addScreen").children().length - 1; i++) {
                $scope.data.mainScreenId = $("#mainScreenId").find('.inputText').val();
                $scope.data.firViceScreenId = $("#addScreen").children().eq(0).find('.inputText').val();
                $scope.data.secViceScreenId = $("#addScreen").children().eq(1).find('.inputText').val();
                $scope.data.thiViceScreenId = $("#addScreen").children().eq(2).find('.inputText').val();
            //}
            


            if($.inArray($scope.data.mainScreenId, $scope.badId) >= 0) {
                commonService.ctrlError('添加','请输入正确的ID');
                return;
            }            

            if($.inArray($scope.data.firViceScreenId, $scope.badId) >= 0) {
                commonService.ctrlError('添加','请输入正确的ID');
                return;
            }

            if($.inArray($scope.data.secViceScreenId, $scope.badId) >= 0) {
                commonService.ctrlError('添加','请输入正确的ID');
                return;
            }

            if($.inArray($scope.data.thiViceScreenId, $scope.badId) >= 0) {
                commonService.ctrlError('添加','请输入正确的ID');
                return;
            }

            $scope.data.mainScreenId = $("#mainScreenId").find('.disableId').val();
            $scope.data.firViceScreenId = $("#addScreen").children().eq(0).find('.disableId').val();
            $scope.data.secViceScreenId = $("#addScreen").children().eq(1).find('.disableId').val();
            $scope.data.thiViceScreenId = $("#addScreen").children().eq(2).find('.disableId').val();

            // $scope.data.firViceScreenId = $scope.data.firViceScreenId == undefined ? '' : $scope.data.firViceScreenId;
            // $scope.data.secViceScreenId = $scope.data.secViceScreenId == undefined ? '' : $scope.data.secViceScreenId;
            // $scope.data.thiViceScreenId = $scope.data.thiViceScreenId == undefined ? '' : $scope.data.thiViceScreenId;

            if(!$scope.data.firViceScreenId) {
                delete $scope.data.firViceScreenId
            }

            if(!$scope.data.secViceScreenId) {
                delete $scope.data.secViceScreenId
            }

            if(!$scope.data.thiViceScreenId) {
                delete $scope.data.thiViceScreenId
            }  

            var $com = $resource(hostUrl+"/api/cinema-point/point/add/point");
            console.log($scope.data);
            $com.save($scope.data, function (res) {
                console.log(res);
                if (res.success) {
                    commonService.ctrlSuccess('添加');
                    $modalInstance.close();
                    $state.go('app.PT.PTlist');
                } else {
                    commonService.ctrlError('添加', res.message);
                }
            })


        }

        $scope.checkId = function (str) {
            console.log(str);
           // /api/cinema-point/point/checkDevice/:deviceNewId
           console.log($("#"+str));
            var deviceNewId = $("#"+str).find('.inputText').val();
            if(deviceNewId == '') {
                return;
            }
            console.log(deviceNewId);
           var $com = $resource(staticData.hostUrl + '/api/cinema-point/point/checkDevice/:deviceNewId',{deviceNewId:'@deviceNewId'})

           $com.get({deviceNewId:deviceNewId} , function(res){
                console.log(res);
                if(res.success) {
                    //$scope.resInput = ''
                    $("#"+str).find('span').text('该ID可用');
                    //$("#"+str).find('.disableId').attr("value",str);
                    $("#"+str).find('.disableId').val(res.message);
                } else {
                    $scope.badId.push(deviceNewId);
                    $("#"+str).find('span').text(res.message + "请重新输入");
                }

           })
        }

        //删除副屏幕
        $scope.deleteScreen = function (str) {
            $("#"+str).remove();
            for(var j = 0;j <= $("#addScreen").children().length - 1; j++) {
                var m = parseInt(j + 1);
                $("#addScreen").children().eq(j).find('label').html("副屏 " + m + " ID:");
            }
        }

        //取消时的操作
        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
        
}])

//点位列表详情
app.controller('showPlayListCtrl' , ['$scope', '$modalInstance', '$resource' , 'staticData' ,'commonService','$state','info',
    function($scope, $modalInstance, $resource,staticData,commonService,$state,info){
        console.log(info);

        var hostUrl = staticData.hostUrl
        
        // $scope.query = function (date,pointId,deviceType) {
        //     ///api/cinema-adLaunch/{pointId}/{date}/{deviceType}/queryPointPlayDetail
        //     var $com = $resource("/api/cinema-adLaunch/:pointId/:date/:deviceType/queryPointPlayDetail", {
        //         date: '@date',
        //         pointId: '@pointId',
        //         deviceType: '@deviceId',
        //         //resourceIds: '@resourceIds'
        //     });
    
        //     $com.get({ date: date, pointId: pointId, deviceType: deviceType },
        //         function (data) {
        //             console.log(data);
        //         })
        // }
        $scope.query = function (date,pointId,deviceType,resourceIds) {
        var obj = {resourceIds:resourceIds};
        var $com = $resource(hostUrl+"/api/cinema-adLaunch/"+ pointId+"/"+date+"/"+deviceType+"/queryPointPlayDetail",
    {
                date: '@date',
                pointId: '@pointId',
                deviceType: '@deviceType',
                //resourceIds: '@resourceIds'
             });

        //console.log($scope.data);
        $com.save(obj, function (res) {
            console.log(res);
            $scope.datas = res.message;
            $scope.allTime = 0;
            for(var i = 0; i <= $scope.datas.length - 1;i++) {
                $scope.allTime = parseInt($scope.datas[i].fileDuration) +  parseInt($scope.allTime);
            }
        })
        }
        $scope.query(info.date,info.pointId,info.deviceType,info.resourceIds);
                //取消时的操作
                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };

        $scope.goToDetail = function(id) {
            //localStorage.userId = data;
            //$state.go('app.order.desc',{'id':id});
            var url = $state.href('app.order.desc',{'id':id});
            window.open(url,'_blank');//跳转到新开的一个页面
        }

}])