//剪切头像
$("#cut").on("click",function(){
    var div = $(".jcrop-holder>div:first-child");
    var w = div.width();
    var h = div.height();
    var x = div.position().left;
    var y = div.position().top;
    $.ajax({
        url:"/cutPic",
        type:"post",
        data:{
            "width":w,
            "height":h,
            "x":x,
            "y":y
        },
        success:function(data){
            window.location.href = "/"
        }
    });
});