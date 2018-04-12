/**
 * Created by chenqi1 on 2017/6/13.
 */
app.controller('mediaCtrl', ['$scope', '$rootScope', '$http', '$resource', '$state', '$timeout', 'selectService', 'backPathService', 'mediaService', 'commonService','FileUploader','checkBtnService','checkUpdateStateService','staticData',
    function ($scope, $rootScope, $http, $resource, $state, $timeout, selectService, backPathService, mediaService, commonService,FileUploader,checkBtnService,checkUpdateStateService,staticData) {
        var mediaSelectedArr = []
        $scope.dirPath = ''
        $scope.mediaSelectedArr = mediaSelectedArr
        $scope.datas = []
        $scope.errorNumber = 0;

        //分页每页条目数
        $scope.pageSize = staticData.pageSize
        //分页索引显示数

        $scope.maxSize = staticData.pageMaxSize

        $scope.showSelectBox = false;//初始化不能上传文件


        var fileId = 1;
        //列表页数
        var pageNo = 1;
        //存储路径
        var pathList = {};
         $rootScope.filePath = '';

        $scope.listimg = function(item){
            var item = item;
            //alert(item)
            if(item == undefined) return;
            var list = item.split('/');
            if(list[0] == 'image'){
                return './admin/img/img.png'
            }else if( list[0] == 'video'){
                return './admin/img/video.png'
            }else{
                return './admin/img/other.png'
            }
        }
        //上传文件关联文件夹
        $scope.fileUploadDir = function (data) {
            var $com = $resource($scope.app.host + "/api/mps-filemanager/file?op=create");
            $com.save({}, data, function (res) {
                res.success ?
                    commonService.ctrlSuccess('上传') :
                    commonService.ctrlError('上传' , res.message)
                $scope.query($scope.dirPath)
            })
        }

        //初始化上传插件
        var uploader = $scope.uploader = new FileUploader({
        });

        //支持多文件上传
        uploader.filters.push({
            name: 'uploadBtn',
            fn: function(item , options) {
                return this.queue ;
            }
        });

        //文件添加结束时
        uploader.onAfterAddingFile = function(fileItem) {
            console.log(fileItem);
            fileItem.url = '/api/mps-upload/upload/'+fileId+'/file' ;

            fileItem.isReady = true;
            pathList[fileId] =  $rootScope.filePath;
            //console.log(pathList);
            fileId++;
        };
        uploader.onAfterAddingAll = function(addedFileItems) {
            $('#uploadListBtn').click();
            uploader.uploadAll();

        };
        uploader.onErrorItem = function(fileItem, response, status, headers) {
            $scope.errorNumber ++;
            fileItem.progress = 0;
        };
        //文件上传成功回调
        uploader.onSuccessItem = function(item,response, status, headers){
            if(response.success){
                var name = response.materialInfo.name;
                var cdata = {
                    dir : false,
                    //path : pathList[response.id],
                    path: $scope.dirPath,
                    name : name,
                    md5 : response.materialInfo.md5,
                    size : response.materialInfo.size,
                    type : response.type,
                    savePath : response.storagePath,
                    duration :response.materialInfo.videoLength
                }
                $scope.fileUploadDir(cdata)
            }else{
                $scope.errorNumber ++;
                item.progress = 0;
                item.isReady= false
                item.isUploading= false
                item.isUploaded= false
                item.isSuccess= false
                item.isCancel= false
                item.isError= true
            }

        }
        //文件上传完毕事件
        uploader.onCompleteAll = function() {
            //console.log(123)
            if($scope.errorNumber > 0){
                $('#panelError').slideDown(1000);
                setTimeout(function(){
                    $('#panelError').slideUp(1000);
                    $scope.errorNumber = 0;

                },3000)
            }
            $scope.query($scope.dirPath)
        };
        //开始全部上传
       // uploader.uploadAll()
        //全部取消
        //uploader.clearQueue()

        //跳转点击
        $scope.clickUp = function(){
            if($scope.showSelectBox) {
                $("#uploadBtn").click();
            } else {
                commonService.ctrlModal('noPerType')
            }

        }
        
        //检查是否具有上传权限
        $scope.checkUpdateState = function() {
            checkUpdateStateService.check("/api/mps-upload/upload/:id/file",'post').then(function(){
                $rootScope.filePath = $scope.dirPath;
                $scope.showSelectBox = true;
                return;
            })
        }

        $scope.checkUpdateState();


        //给右侧的上传列表预留的事件
        $(document).on("click", "#uploadListBtn", function(){
            //$scope.scrollHeight();
            $('#upload').addClass('active')
        });

        //默认查找根目录
        $scope.query = function (path,keyword, pageNo, pageSize) {
            //测试接口
            var $com = $resource($scope.app.host + "/api/mps-filemanager/file?pageNo=:pageNo&pageSize=:pageSize&path=:path&keyword=:keyword&neededCheckFile=", {
                path: '@path',
                keyword: '@keyword',
                pageNo: '@pageNo',
                pageSize: '@pageSize'
            });

            $com.get({path: path,keyword:keyword, pageNo: pageNo, pageSize: pageSize},
                function (data) {
                        if(data.success == false){
                            commonService.ctrlError('查询',data.message)
                        }else {
                            $scope.datas = data.dataList
                            $scope.mediaList = data.dataList
                            $scope.dirPath = path.replace(/%26/g, '&')
                            $scope.currentPath = backPathService.getCurrentSpace(path.replace(/%26/g, '&'))
                            $scope.addDirBool = false
                            $scope.mediaSelectedArr = []

                            $scope.totalItems = data.total
                            $scope.numPages = data.pages
                            $scope.currentPage = data.pageNo
                        }
                })
        }
        //根据关键字查询数据

        $scope.query($scope.dirPath , '' , 1 , $scope.pageSize)



        $scope.search = function (name , dirBool , keyword, path  , pageNo, pageSize , e) {

            //var path2 = path //转义问题
            if(keyword){
                keyword = keyword.replace(/&/g, '%26')
            }
            if(path){
                //console.log(path)
                path = path.replace(/&/g, '%26')

            }
            if(e){
                var keycode = window.event?e.keyCode:e.which;
                if(keycode==13){
                    $scope.query(path, keyword, pageNo, pageSize)
                }
            }else {
                if (dirBool) {
                    $scope.dirPath = path
                    $scope.query($scope.dirPath,'', pageNo, pageSize)
                    //$scope.dirPath = path2
                }
            }
        }

        //查询上一级
        $scope.backSearch = function (data) {
            $scope.dirPath = backPathService.getBackSpace(data)
            $scope.query($scope.dirPath)
            $scope.keyword = ''
        }

        //select相关操作的方法绑定
        $scope.updateSelection = selectService.updateSelection
        $scope.selectAll = selectService.selectAll
        $scope.isSelected = selectService.isSelected
        $scope.isSelectedAll = selectService.isSelectedAll

        //删除资源
        $scope.delete = function (data , keyword) {

            //检测删除权限
            checkBtnService.check("/api/mps-filemanager/file?op=delete",'post').then(function(){
                //获取删除项对象集合
                var sendObj = mediaService.getSelectedMedia(data, $scope.datas, $scope.dirPath)
                if(sendObj.fileList.length == 0){
                    commonService.ctrlError('操作','请先选择文件/文件夹')
                }else {
                    commonService.ctrlModal("deleteMediaType").result.then(function () {

                        var $com = $resource($scope.app.host + "/api/mps-filemanager/file?op=delete");

                        $com.save({}, sendObj, function (res) {
                            res.success ?
                                commonService.ctrlSuccess('删除') :
                                commonService.ctrlError('删除' , res.message)
                            $scope.mediaSelectedArr = []
                            $scope.query($scope.dirPath , keyword )
                        })

                    })
                }
            })
        }

        //发送新建文件夹请求
        $scope.submitDir = function () {
            var sendObj = {}
            //var newDirPath = $scope.dirPath + '/' + $scope.dirName
            sendObj.path = $scope.dirPath
            sendObj.name = $scope.dirName

            var $com = $resource($scope.app.host + "/api/mps-filemanager/file?op=create")
            $com.save({}, sendObj, function (res) {
                res.success ?
                    commonService.ctrlSuccess('新建文件夹') :
                    commonService.ctrlError('新建文件夹' , res.message)
                $scope.query($scope.dirPath.replace(/&/g, '%26'))
                $scope.dirName = '新建文件夹'
            })
        }

        //监听按键
        $scope.doAddDir = function(e){
            if(e){
                var keycode = window.event?e.keyCode:e.which;

                switch (keycode) {
                    case 13 :
                        $scope.submitDir()
                        break
                    case 27 :
                        $scope.addDirBool = false
                        break
                }

            }else {
                $scope.submitDir()
            }
        }


        //发送重命名文件夹请求
        $scope.editDir = function (newName, path, dir , keyword) {
            var sendObj = {}
            var editEleScope = angular.element('.editTr').scope()
            sendObj.path = path
            sendObj.newName = newName
            sendObj.dir = dir

            var promise = $http({method: 'put', url: $scope.app.host + '/api/mps-filemanager/file', data: sendObj})

            promise.then(function (res) {
                res.data.success ?
                    commonService.ctrlSuccess('重命名'):
                    commonService.ctrlError('重命名' , res.data.message)
                $scope.query($scope.dirPath , keyword)
                editEleScope.editDirBool = false
            })
        }

        $scope.doRenameDir = function(newName, path, dir , keyword , e){
            if(e){
                var keycode = window.event?e.keyCode:e.which;

                switch (keycode) {
                    case 13 :
                        $scope.editDir(newName, path, dir , keyword)
                        break
                    case 27 :
                        var editEleScope = angular.element('.editTr').scope()
                        editEleScope.editDirBool = false
                        break
                }

            }else {
                    $scope.editDir(newName, path, dir , keyword)
            }
        }

        /**
         * 移动文件操作的函数
         */
        $scope.removeFiles = function(data){
            console.log(data);
            var sendObj = mediaService.getSelectedMedia(data, $scope.datas, $scope.dirPath);
            if (!sendObj.fileList.length) {
                commonService.ctrlError('操作','未选择文件或文件夹');
                return;
            }
            checkBtnService.check("/api/mps-filemanager/file?op=move", 'post').then(function () {
            //"/api/mps-filemanager/file?op=move"
            commonService.fileManagerModal('移动',sendObj);
        })
        }

        /**
         * 复制文件操作的函数
         */
        $scope.copyFiles = function(data){
            console.log(data);
            var sendObj = mediaService.getSelectedMedia(data, $scope.datas, $scope.dirPath);
            if (!sendObj.fileList.length) {
                commonService.ctrlError('操作','未选择文件或文件夹');
                return;
            }
            //"/api/mps-filemanager/file?op=copy"
            checkBtnService.check("/api/mps-filemanager/file?op=copy", 'post').then(function () {
            commonService.fileManagerModal('复制',sendObj);
        })
    }
        //监听复制移动后刷新位置
        $scope.$on('queryMedia', function (event, args) {

            //console.log(args)
            if(args.queryMedia){
                $scope.query($scope.dirPath.replace(/&/g, '%26'),'', '', '')
            }
            //console.log(args.newSelectList);
            //console.log($scope.datas);
        });

        //播放器
        var player = {}
        //播放标志位
        var playBool = false
        $scope.imgOnly = false
        $scope.openOtherPlay = function(imgPath,videoPath){
            if(videoPath != ''){
                $scope.imgOnly = false
                $scope.posterImg = $rootScope.address + imgPath
                player = videojs("my-video", {
                    //"techOrder": ["flash","html"],
                    "autoplay":false,
                    "poster": $scope.posterImg
                    //"src":"http://vjs.zencdn.net/v/oceans.mp4",
                    //controlBar: {
                    //    captionsButton: false,
                    //    chaptersButton : false,
                    //    liveDisplay:false,
                    //    playbackRateMenuButton: false,
                    //    subtitlesButton:false
                    //}

                });
                player.src($rootScope.address+videoPath)
                player.poster($scope.posterImg)
                playBool = true
            }else{
                //tupian
                $scope.imgOnly = true
                $scope.picPath = $rootScope.address+imgPath
            }
            if(playBool){
                player.paused();
            }

        }

        //预览
        $scope.openPlay = function (fileUid) {
            //checkBtnService.check("/api/mps-materialList/task/:taskId/preview",'get').then(function(){
                var $com = $resource($scope.app.host +
                    "/api/mps-filemanager/file/:fileUid/preview", {
                    taskId: '@fileUid'
                });
                $com.get({ fileUid: fileUid},
                    function (data) {
                        //if(!data.success){
                        //    commonService.ctrlError('预览', data.message)
                        //}else if(data.message.length == 0){
                        //    commonService.ctrlError('预览', '此节目单下没有可预览的素材')
                        //} else{
                            $scope.dataImg = data.message;
                            //console.log($scope.dataImg)
                            $('#videoMask').fadeIn(200);
                            $('#video').fadeIn(200);
                            $scope.openOtherPlay($scope.dataImg[0].picPath,$scope.dataImg[0].videoPath)
                            //setTimeout(function(){
                            //    var num =parseInt($('.videoListInfo').width() / 270)
                            //    //console.log(num)
                            //    jQuery("#videoList").slide({pnLoop:false,scroll:num,delayTime:400,mainCell:".bd ul",autoPage:true,effect:"left",autoPlay:false,vis:num,prevCell:".prev",nextCell:".next" });
                            //
                            //},10)
                        //}

                    })

            //})

        }

        //关闭播放器
        $scope.closePlay = function(){
            //player.dispose();
            if(playBool){
                player.paused();
            }
            $('#videoMask').fadeOut(200);
            $('#video').fadeOut(200);
        }


        //获取素材待审核数量
        $scope.toCheckNum = function(){
            //测试接口
            var $com = $resource($scope.app.host + "/api/mps-filemanager/file?pageNo=&pageSize=&path=&keyword=&neededCheckFile=3");

            $com.get(function (data) {
                if(data.success == false){
                    commonService.ctrlError('查询',data.message)

                }else {
                    $scope.toCheckNumber = data.total

                }
            })
        }
        $scope.toCheckNum()

        //素材下载
        $scope.download = function(id){
            var $com = $resource($scope.app.host +
                "/api/mps-filemanager/file/:fileUid/preview", {
                taskId: '@id'
            });
            $com.get({ fileUid: id},
                function (data) {
                    $scope.dataImg = data.message;
                    console.log($scope.dataImg[0].picPath)
                    console.log($scope.dataImg[0].videoPath)
                    if($scope.dataImg[0].format == 'video'){
                        var downloadAddress = $rootScope.address + $scope.dataImg[0].videoPath;
                        window.location=downloadAddress;
                    }else if($scope.dataImg[0].format == 'picture'){
                        var downloadAddress = $rootScope.address + $scope.dataImg[0].picPath;
                        window.location=downloadAddress;
                    }else{
                        var downloadAddress = $rootScope.address + $scope.dataImg[0].otherPath;
                        window.location=downloadAddress;
                    }
                })
        }

        //右侧滚动条
        setTimeout(function () {
            var scroll = new Optiscroll(document.getElementById('uploadList'));
        }, 100);
    }])

//素材审核模块
app.controller('checkMediaCtrl' , ['$scope' , 'staticData' , '$resource' , 'commonService', '$http' ,'$rootScope',
    function($scope , staticData , $resource , commonService , $http,$rootScope){
    //设备状态选项绑定
    $scope.stateGroup = staticData.checkState
    $scope.state = $scope.stateGroup[0].id

        //分页每页条目数
        $scope.pageSize = staticData.pageSize
        //分页索引显示数

        $scope.maxSize = staticData.pageMaxSize

        //默认查找根目录
        $scope.query = function (keyword,neededCheckFile, pageNo, pageSize) {
            //测试接口
            var $com = $resource($scope.app.host + "/api/mps-filemanager/file?pageNo=:pageNo&pageSize=:pageSize&path=&keyword=:keyword&neededCheckFile=:neededCheckFile", {
                keyword: '@keyword',
                neededCheckFile: '@neededCheckFile',
                pageNo: '@pageNo',
                pageSize: '@pageSize'
            });

            $com.get({keyword:keyword,neededCheckFile:neededCheckFile, pageNo: pageNo, pageSize: pageSize},
                function (data) {
                    if(data.success == false){
                        commonService.ctrlError('查询',data.message)
                    }else {

                        $scope.datas = data.dataList
                        $scope.totalItems = data.total
                        $scope.numPages = data.pages
                        $scope.currentPage = data.pageNo
                    }
                })
        }
        //根据关键字查询数据

        $scope.query("",0 , 1 ,$scope.pageSize)

        $scope.search = function (keyword, neededCheckFile , e , pageNo, pageSize ) {
            if(keyword){
                keyword = keyword.replace(/&/g, '%26')
            }
            if(e){
                var keycode = window.event?e.keyCode:e.which;
                if(keycode==13){
                    $scope.query(keyword, neededCheckFile , pageNo, pageSize)
                }
            }else {
                $scope.query(keyword, neededCheckFile , pageNo, pageSize)
            }
        }


//查询审核权限
        $scope.checkExamine = function(){

            var promise = $http({method: 'put', url: $scope.app.host + '/api/mps-filemanager/checkFilePermmison'})
            promise.then(function(res){
                if(res.data.code == 'noPop' && res.data.access == "notpermission"){
                    //没审核权限，只显示状态
                    $scope.onlyShowState = true
                }else if(res.data.access == "havepermmison"){
                    //有审核权限，显示操作项
                    $scope.onlyShowState = false
                }
            })
        }

        $scope.checkExamine()


        //素材审核
        $scope.examine = function(uid , checkStatus){

            var sendObj = {
                uid:uid ,
                checkStatus:checkStatus
            }

            commonService.ctrlModal("examineType" , {checkStatus:checkStatus}).result.then(function(){
                var promise = $http({method: 'put', url: $scope.app.host + '/api/mps-filemanager/checkFilePermmison/checkFile',data:sendObj})
                promise.then(function(res){
                    res.data.success?
                        commonService.ctrlSuccess("操作"):
                        commonService.ctrlError("操作",res.data.message)
                    $scope.query($scope.keyword , $scope.state)
                    $scope.toCheckNum()
                })
            })
        }

        //获取素材待审核数量
        $scope.toCheckNum = function(){
            //测试接口
            var $com = $resource($scope.app.host + "/api/mps-filemanager/file?pageNo=&pageSize=&path=&keyword=&neededCheckFile=3");

            $com.get(function (data) {
                    if(data.success == false){
                        commonService.ctrlError('查询',data.message)

                    }else {
                        $scope.toCheckNumber = data.total

                    }
                })
        }
        $scope.toCheckNum()

        //播放器
        var player = {};
        //播放标志位
        var playBool = false;
        $scope.imgOnly = false;
        $scope.openOtherPlay = function (imgPath, videoPath) {
            if (videoPath != '') {
                //alert(1)
                $scope.imgOnly = false;
                $scope.posterImg = $rootScope.address + imgPath;
                player = videojs("my-video1", {
                    //"techOrder": ["flash","html"],
                    "autoplay": false,
                    "poster": $scope.posterImg
                    //"src":"http://vjs.zencdn.net/v/oceans.mp4",
                    //controlBar: {
                    //    captionsButton: false,
                    //    chaptersButton : false,
                    //    liveDisplay:false,
                    //    playbackRateMenuButton: false,
                    //    subtitlesButton:false
                    //}

                });
                player.src($rootScope.address + videoPath);
                player.poster($scope.posterImg);
                playBool = true;
            } else {
                //tupian
                //alert(0)
                $scope.imgOnly = true;
                $scope.picPath = $rootScope.address + imgPath;
            }
            if (playBool) {
                player.paused();
            }
        };

        //预览
        $scope.openPlay1 = function (fileUid) {
            //checkBtnService.check("/api/mps-materialList/task/:taskId/preview",'get').then(function(){
            var $com = $resource($scope.app.host + "/api/mps-filemanager/file/:fileUid/preview", {
                taskId: '@fileUid'
            });
            $com.get({ fileUid: fileUid }, function (data) {
                //if(!data.success){
                //    commonService.ctrlError('预览', data.message)
                //}else if(data.message.length == 0){
                //    commonService.ctrlError('预览', '此节目单下没有可预览的素材')
                //} else{
                $scope.dataImg = data.message;
                //console.log($scope.dataImg)
                $('#videoMask').fadeIn(200);
                $('#video').fadeIn(200);
                $scope.openOtherPlay($scope.dataImg[0].picPath, $scope.dataImg[0].videoPath);
                //setTimeout(function(){
                //    var num =parseInt($('.videoListInfo').width() / 270)
                //    //console.log(num)
                //    jQuery("#videoList").slide({pnLoop:false,scroll:num,delayTime:400,mainCell:".bd ul",autoPage:true,effect:"left",autoPlay:false,vis:num,prevCell:".prev",nextCell:".next" });
                //
                //},10)
                //}
            });

            //})
        };

        //关闭播放器
        $scope.closePlay1 = function () {
            //player.dispose();
            if (playBool) {
                player.paused();
            }
            $('#videoMask').fadeOut(200);
            $('#video').fadeOut(200);
        };

        //素材下载
        $scope.download = function(id){
            var $com = $resource($scope.app.host +
                "/api/mps-filemanager/file/:fileUid/preview", {
                taskId: '@id'
            });
            $com.get({ fileUid: id},
                function (data) {
                    $scope.dataImg = data.message;
                    console.log($scope.dataImg[0].picPath)
                    console.log($scope.dataImg[0].videoPath)
                    if($scope.dataImg[0].format == 'video'){
                        var downloadAddress = $rootScope.address + $scope.dataImg[0].videoPath;
                        window.location=downloadAddress;
                    }else if($scope.dataImg[0].format == 'picture'){
                        var downloadAddress = $rootScope.address + $scope.dataImg[0].picPath;
                        window.location=downloadAddress;
                    }else{
                        var downloadAddress = $rootScope.address + $scope.dataImg[0].otherPath;
                        window.location=downloadAddress;
                    }
                })
        }
}])