// config

var app =  
angular.module('app')
  .config(
    [        '$controllerProvider', '$compileProvider', '$filterProvider', '$provide',
    function ($controllerProvider,   $compileProvider,   $filterProvider,   $provide) {
        
        // lazy controller, directive and service
        app.controller = $controllerProvider.register;
        app.directive  = $compileProvider.directive;
        app.filter     = $filterProvider.register;
        app.factory    = $provide.factory;
        app.service    = $provide.service;
        app.constant   = $provide.constant;
        app.value      = $provide.value;
    }
  ])
  .config(['$translateProvider', '$breadcrumbProvider',function($translateProvider,$breadcrumbProvider){
    // Register a loader for the static files
    // So, the module will search missing translation tables under the specified urls.
    // Those urls are [prefix][langKey][suffix].
    $translateProvider.useStaticFilesLoader({
      prefix: 'l10n/',
      suffix: '.js'
    });
    // Tell the module what language to use by default
    $translateProvider.preferredLanguage('en');
    // Tell the module to store the language in the local storage
    $translateProvider.useLocalStorage();
    $breadcrumbProvider.setOptions({
        templateUrl: 'tpl/blocks/breadcrumb.html'
    });
  }])

//全局配置 w5cValidator.js angular-form插件
    .config(["w5cValidatorProvider", function (w5cValidatorProvider) {

        // 全局配置
        w5cValidatorProvider.config({
            blurTrig   : false,
            showError  : true,
            removeError: true

        });
        w5cValidatorProvider.setRules({
                email   : {
                required: "这是必填项，请输入邮箱",
                pattern : "请输入正确格式的公司邮箱",
                maxlength : "邮箱长度不可超过{maxlength}个字"
            },
            username      : {
                required      : "这是必填项，请输入姓名",
                pattern       : "请输入汉字或英文，不支持数字、标点、符号",
                maxlength : "姓名长度不可超过{maxlength}个字",
            },

            ID : {
                required : "这是必填项，请输入工号",
                pattern : "请输入数字，不支持标点、符号",
                maxlength : "工号长度必须介于4到6个字符之间",
                minlength : "工号长度必须介于4到6个字符之间"
            },
            departId : {
                required : "这是必选项，请选择部门"
            },
            roleId : {
                required : "这是必选项，请选择角色"
            },
            positionId : {
                required : "这是必填项，请输入职位",
                pattern: "请输入汉字或英文，不支持数字、标点、符号",
                maxlength : "职位长度不可超过{maxlength}个字"
            },
            mobile : {
                required : "联系电话不能为空",
                pattern : "请输入正确格式的11位手机号码"
            },
            wechat : {
                required : "微信号码不能为空"
            },
            projectId : {
                required : "项目名不能为空"
            },
            passwordInited:{
                required : "这是必填项，请输入密码",
                pattern: "请输入英文、数字、标点、符号",
                maxlength: "密码长度必须介于6到15个字符之间",
                minlength: "密码长度必须介于6到15个字符之间"
            },
            password      : {
                required : "这是必填项，请输入密码",
                pattern: "请输入英文、数字、标点、符号",
                maxlength: "密码长度必须介于6到15个字符之间",
                minlength: "密码长度必须介于6到15个字符之间"
            },
            repeatPassword: {
                required: "这是必填项，请再次输入密码",
                repeat  : "两次密码输入不一致"
            },
            editPassword      : {
                required : "这是必填项，请输入密码",
                pattern: "请输入英文、数字、标点、符号",
                maxlength: "密码长度必须介于6到15个字符之间",
                minlength: "密码长度必须介于6到15个字符之间"
            },
            editRepeatPassword: {
                required: "这是必填项，请再次输入密码",
                repeat  : "两次密码输入不一致"
            },
            categoryName : {
                required: "项目分类不能为空",
                maxlength : "分类长度不能大于{maxlength}",
                pattern : "分类名称只能输入汉字,字母,数字,下划线"
            },
            projectName : {
                required: "项目名不能为空",
                maxlength : "项目名长度不能大于{maxlength}",
                pattern : "项目名称只能输入汉字,字母,数字,下划线"
            },
            playListName : {
                required: "默认播放列表名不能为空",
                maxlength : "默认播放列表名长度不能大于{maxlength}",
                pattern : "默认播放列表名称只能输入汉字,字母,数字,下划线"
            },
            customerCompanyName : {
                required: "公司名称不能为空",
                maxlength : "公司名称长度不能大于{maxlength}",
                pattern : "公司名称只能输入汉字,字母,数字,下划线"
            },
            projectBudget : {
                required:'金额不能为空',
                maxlength : "金额长度不能大于{maxlength}",
                pattern : "请输入正确的金额格式"
            },
            customerContacts : {
                required: "联系人不能为空",
                maxlength : "联系人名称长度不能大于{maxlength}",
                pattern : "联系人名称只能输入汉字,字母,数字"
            },
            personInCharge : {
                required: "负责人不能为空",
                maxlength : "字段长度不能大于{maxlength}",
                pattern : "负责人名称只能输入汉字,字母,数字,下划线"
            },
            adSheetName : {
                required: "广告单名称不能为空",
                maxlength : "广告单名称长度不能大于{maxlength}",
                pattern : "广告单名称只能输入汉字,字母,数字,下划线"
            },
            tagName : {
                maxlength : "标签长度不能大于{maxlength}",
                pattern : "标签只能输入汉字,字母,数字,下划线"
            },
            remark : {
                maxlength : "备注长度不能大于{maxlength}"
            },
            rolaName : {
                required : "角色名不能为空",
                pattern : "角色名称只能输入汉字,字母,数字,下划线",
                maxlength : "角色名称长度不能大于{maxlength}"
            },
            programName : {
                required : "节目名不能为空",
                pattern : "节目名称只能输入汉字,字母,数字,下划线",
                maxlength : "节目名称长度不能大于{maxlength}"
            },
            taskName : {
                required : "作业名不能为空",
                pattern : "作业名称只能输入汉字,字母,数字,下划线",
                maxlength : "作业名称长度不能大于{maxlength}"
            },
            taskDescribe : {
                required : "作业描述不能为空",
                maxlength : "作业描述长度不能大于{maxlength}"
            },
            taskProduct :{
                required : "请选择目标产品"
            },
            taskPackage :{
                required : "请选择版本号"
            },
            startdate : {
                required : "请选择起始时间",
            },
            enddate : {
                required : "请选择结束时间",
            },
            productName : {
                required: "这是必填项，请输入产品名称",
                maxlength : "产品名称长度不能大于{maxlength}",
                pattern : "产品名称只能输入汉字,字母,数字,下划线"
            },
            productType : {
                required: "这是必填项，请输入产品型号",
                maxlength : "产品型号长度不能大于{maxlength}",
                pattern : "产品型号只能输入汉字,字母,数字,下划线,点"
            },
            productOs : {
                required : "这是必选项，请选择运行系统"
            },
            prodDesc : {
                maxlength : "产品描述长度不能大于{maxlength}"
            },
            delDesc : {
                required: "这是必填项，请输入删除原因",
                maxlength : "删除原因长度不能大于{maxlength}"
            },
            memberDevice : {
                maxlength : "启用/禁用原因长度不能大于{maxlength}"
            },
            packDesc : {
                maxlength : "更新包描述长度不能大于{maxlength}"
            },
            enableReason : {
                required: "这是必填项，请输入原因",
                maxlength : "原因长度不能大于{maxlength}"
            },
            rejectRequest : {
                required: "这是必填项，请输入原因",
                maxlength : "原因长度不能大于{maxlength}"
            },
            terminalName : {
                required: "这是必填项，请输入终端名称",
                maxlength : "终端名称长度不能大于{maxlength}",
                pattern : "终端名称只能输入汉字,字母,数字,下划线"
            },
            terminalMAC : {
                required: "这是必填项，请输入终端MAC",
                maxlength : "终端MAC长度不能大于{maxlength}",
                pattern : "终端MAC只能输入字母（A-F）,数字，输入格式为xx:xx:xx:xx:xx:xx"
            },
            terminalAddress : {
                maxlength : "终端详细地址长度不能大于{maxlength}",
                pattern : "终端详细地址只能输入汉字,字母,数字,下划线"
            },
            terminalDesc : {
                maxlength : "终端描述长度不能大于{maxlength}"
            },
            terminalSequNum : {
                maxlength : "终端SN长度不能大于{maxlength}",
                pattern : "终端SN只能输入字母,数字,中划线,下划线"
            },
            packBelone : {
                required : "这是必选项，请选择更新包所属产品"
            },
            updateType : {
                required : "这是必选项，请选择更新包类型"
            },
            updateName : {
                required: "这是必填项，请输入更新包名称",
                maxlength : "更新包名称长度不能大于{maxlength}",
                pattern : "更新包名称只能输入汉字,字母,数字,下划线"
            },
            updateVersion : {
                required: "这是必填项，请输入版本号",
                maxlength : "版本号长度不能大于{maxlength}",
                pattern : "版本号只能输入字母,数字,下划线,点"
            },
            newId : {
                required : "这是必填项，请输入产品ID",
                maxlength : "产品ID长度不能大于{maxlength}",
                pattern : "产品ID只能输入字母，数字"
            },

            customName : {
                required: "客户名称不能为空",
                maxlength : "客户名称长度不能大于{maxlength}",
                pattern : "客户名称只能输入汉字,字母,数字"
            },

            adName : {
                required : "这是必填项，请输入广告单名称",
                maxlength : "广告单名称长度不能大于{maxlength}",
                pattern : "广告单名称只能输入字母，数字"
            },
            roundCount : {
                required: "每轮播放次数不能为空",
                maxlength : "字段长度不能大于{maxlength}",
                pattern : "每轮播放次数只能输入0-9的数"
            },
            dayCount: {
                required: "每日播放次数不能为空",
                maxlength : "字段长度不能大于{maxlength}",
                pattern : "每日播放次数只能输入正整数"
            },
            addPlayTime: {
                required: "每轮播放次数不能为空",
                maxlength : "字段长度不能大于{maxlength}",
                pattern : "每轮播放次数只能输入正整数"
            },
            idName : {
                required: '请输入ID',
                maxlength : "字段长度不能大于{maxlength}",
                pattern : "请输入正确的ID"
            }
        });
}])

  //注册用户状态拦截器
    .config(['$httpProvider',function($httpProvider){
        $httpProvider.interceptors.push('UserInterceptor')
    }])

 //// rap 的 config注入
 //  .config([ '$httpProvider','ngRapProvider', function( $httpProvider , ngRapProvider) {
 //      ngRapProvider.script = 'http://rapapi.org/rap.plugin.js?projectId=19980'; // replce your host and project id
 //      ngRapProvider.enable({
 //          mode: 3
 //      });
 //      $httpProvider.interceptors.push('rapMockInterceptor');
 //  }])
 //




