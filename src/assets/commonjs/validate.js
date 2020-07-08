import Vue from 'vue';
/**所有的验证条件
{
    required:false,
    mobile:false,
    mail:false,
    IDNumber:false,
    plateNum:false,
    pattern:null,
    max:null,
    min:null
};
 **/
//定义全局指令v-val验证信息
Vue.directive('val',function(el,binding){
    //获取数据以及规则
    var rules = binding.value.rule;
    var data = binding.value.data;
    //设置el上的默认验证为通过，验证信息为空
    el.dataset.validate = "true";
    el.dataset.errormsg = "";
    //验证方法,value值为验证规则，obj表示是自定义规则，string表示是默认的规则，例如mobile默认有对应的验证正则
    var valFunction = function(value){
        if(value&&(typeof value)==='string'){
            switch(value){
                case 'required':
                    var redRequired = new RegExp('^\s$');
                    if(data == undefined || data.length===0 ||redRequired.test(data)){
                        return false;
                    }else{
                        return true;
                    }
                case 'mobile'://正常情况下，空也是可以匹配的，只匹配输入的数据是否正确，不匹配数据是否填写，是否填写由required来进行判断
                    var regMobile = new RegExp('(^(0|86|17951)?(13[0-9]|15[012356789]|17[0-9]|18[0-9]|14[57])[0-9]{8}$)|^\s$');
                    if(Vue.prototype.isEmpty(data)){
                        return true;//数据为空的情况下也算通过，只有在数据不为空的情况下进行数据匹配
                    }else{
                        return regMobile.test(data);
                    }
                case 'mail':
                    var regMail = new RegExp('(^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$)|^\s$');
                    if(Vue.prototype.isEmpty(data)){
                        return true;
                    }else{
                        return regMail.test(data);
                    }
                case 'IDNumber':
                    var regIDNumber = new RegExp('(^[1-9][0-9]{5}[1-3][0-9]{7}[0-9]{3}([0-9]|X)$)|^\s$',"i");
                    if(Vue.prototype.isEmpty(data)){
                        return true;
                    }else{
                        return regIDNumber.test(data);
                    }
                case 'plateNum':
                    var regPlateNum = new RegExp('(^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$)|^\s$',"i");
                    if(Vue.prototype.isEmpty(data)){
                        return true;
                    }else{
                        return regPlateNum.test(data);
                    }
            }
        }else if(value&&(typeof value) === 'object'){
            if(value['pattern']){
                var reg = new RegExp(value['pattern'].trim().replace(/^\/|\/$/g,""),'g');//消除开头和结尾的'/'
                return reg.test(data);
            }else if(value['max']){
                return (data.length <= value['max']);
            }else if(value['min']){
                return (data.length >= value['min']);
            }
        } else{
            return '验证参数必须为键值对对象或字符串。'
        }
    };
    //遍历所有规则
    for(var i="0";i<rules.length;i++){
        //获取所有验证规则名
        var keys = Object.keys(rules[i].rule);
        //遍历规则下的每一个限制条件，遇到任何一个条件不符合即设置错误信息并中断遍历
        for(var j= 0;j<keys.length;j++) {
            var keysValue = rules[i].rule[keys[j]];
            if(keys[j] === 'pattern' || keys[j] === 'max' || keys[j] === 'min') {
                var obj = {};
                obj[keys[j]] = keysValue;
                if (valFunction(obj) === false) {
                    el.dataset.validate = 'false';
                    el.dataset.errormsg = rules[i].errorMsg;
                    return;
                }
            }else if(keys[j]==='required'||keys[j] ==='mobile'||keys[j]==='mail'||keys[j]==='IDNumber'||keys[j]==='plateNum') {
                if(keysValue&&valFunction(keys[j])===false){
                    el.dataset.validate = 'false';
                    el.dataset.errormsg = rules[i].errorMsg;
                    return;
                }
            }else{
                console.error("请输入正确的验证属性名称");
                return;
            }
        }
    }
});

/**定义全局方法返回报错信息**/
Vue.prototype.$valForm = function(formName){
    var form = document.querySelector("form[name='"+formName+"']");
    var errorValue = form.querySelector("*[data-validate='false']");
    if(errorValue){
        return errorValue.dataset.errormsg;
    }else{
        return null;
    }
};

