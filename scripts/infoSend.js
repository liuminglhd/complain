//打开页面加载
function getByPage(pageNum){
    $.ajax({
        url:"/readMess",
        type:"post",
        data:{"page":pageNum},
        error: function(){
            console.log("error");
        },
        success: function(dataMess){
            var compiled = _.template(($("#temp1")).html());
            $("#info").html("");
            (function iterator(i){
                $.ajax({
                    url:"/readAvatar",
                    type:"post",
                    data:{"name":dataMess[i].name},
                    success:function(dataUser){
                        dataMess[i].picUrl = dataUser[0].picUrl;
                        console.log(dataMess[i])
                        $("#info").append(compiled({"docs": dataMess[i]}));
                        iterator(i+1);
                    }
                })
            })(0);
        }
    });
}

$(function(){
    getByPage(1);
});
$("[data-page=\"1\"]").addClass("active");
$(".showPage").on("click",function(){
    getByPage(parseInt($(this).attr("data-page")));
    $(this).addClass("active").siblings().removeClass("active");
});

//登录
function hint(obj){
    obj.next().html("");
}
function log(name,pwd){
    $.ajax({
        url:"/doLogin",
        type:"post",
        data:{
            "uname":name.val(),
            "upwd":pwd.val()
        },
        success:function(data){
            if(data=="1") window.location.href = "/";
            else if(data=="-2"){
                name.next().html("用户名不存在").css("color","#f00");
            }else if(data=="-1"){
                pwd.next().html("密码不正确").css("color","#f00");
            }
        }
    });
}
$("#login").on("click",function(){
    log($("#uname"),$("#upwd"));
});
$("#ulogin").on("click",function(){
    log($("#uuname"),$("#uupwd"));
});

//注册
$("#reg").on("click",function(){
    $.ajax({
        url:"/doReg",
        type:"post",
        data:{
            "rname":$("#rname").val(),
            "rpwd":$("#rpwd").val()
        },
        success:function(data){
            if(data=="-1"){
                alert("注册失败");
            }else if(data == "-2"){
                $("#rname").next().html("该用户名已被注册").css("color","red");
            }else if(data == "0"){
                $("#rpwd").next().html("密码设置不正确").css("color","red");
            }else if(data == "1"){
                alert("注册成功，欢迎使用！");
                window.location.href = "/";
            }
        }
    });
});
$("input").on("focus",function(){
    hint($(this));
});



