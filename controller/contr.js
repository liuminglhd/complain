var db = require("../model/DAO.js");
var md5 = require("../model/MD5.js");
var date = require("silly-datetime");
var ObjectID = require("mongodb").ObjectID;
var formidable = require("formidable");
var path = require("path");
var session = require("express-session");
var gm = require("gm");
var fs = require("fs");
var num = null,name = null,form = null,time = null,id = null;
//显示首页
exports.index = function(req,res){
    db.count("messboard",req.session.active=="myMess"?{"name":req.session.name}:{},function(err,count){
        num = Math.ceil(count/6);
        res.render("index",{
            "num":num,
            state:req.session.state=="1"?true:false,
            active:req.session.state=="1"?req.session.active:"",
            name:req.session.state=="1"?req.session.name:"",
            picUrl:req.session.state=="1"?req.session.picUrl:""
        });
    });
};
//根据分页页数显示数据
exports.readMess = function(req,res){
    form = new formidable.IncomingForm();
    form.parse(req,function(err,fields,files){
        db.find("messboard",req.session.active=="myMess"?{"name":req.session.name}:{},{"size":6,"page":parseInt(fields.page),"sort":{"time":-1}},function(err,docs){
            res.send(docs);
        });
    });
};
exports.readAvatar = function(req,res){
    form = new formidable.IncomingForm();
    form.parse(req,function(err,fields,files){
        db.find("user",{"name":fields.name},function(err,docs){
            res.send(docs);
        });
    });
};
//注册
exports.doReg = function(req,res){
    form = new formidable.IncomingForm();
    form.parse(req,function(err,fields,files){
        db.count("user",{"name":fields.rname},function(err,result){
            if(result == 0){
                //以字母开头，长度在6~12之间，只能包含字符、数字和下划线
                if(/^[A-z][A-z0-9_]{5,11}$/.test(fields.rpwd)){
                    db.insertOne("user",{"name":fields.rname,"pwd":md5(fields.rpwd),"picUrl":"/images/user.jpg"}, function(err,result){
                        if(err){
                            res.send("-1"); //注册失败
                            return;
                        }
                        res.send("1");  //注册成功
                    });
                }else res.send("0");    //密码设置不符合
            }
            else res.send("-2");    //该用户名已被注册
        });
    });
};
//登录
exports.doLogin = function(req,res){
    form = new formidable.IncomingForm();
    form.parse(req,function(err,fields,files){
        db.find("user",{"name":fields.uname},function(err,result){
            if(result.length == 0) res.send("-2"); //用户名不存在
            else{
                if(result[0].pwd == md5(fields.upwd)){
                    req.session.state = "1";
                    req.session.active = "index";
                    req.session.name = fields.uname;
                    req.session.picUrl = result[0].picUrl;
                    res.send("1");  //登录成功
                }else res.send("-1"); //用户名存在但密码错误
            }
        });
    });
};
//注销
exports.cancel = function(req,res){
    req.session.state = -1;
    req.session.active = "index";
    res.redirect("/");
};
//头像
exports.userPic = function(req,res){
    res.render("pic",{
        state:req.session.state=="1"?true:false,
        active:req.session.state=="1"?req.session.active:"",
        name:req.session.state=="1"?req.session.name:"",
        picUrl:req.session.state=="1"?req.session.picUrl:""
    });
};
//保存头像
exports.uploadPic = function(req,res){
    form = new formidable.IncomingForm();
    form.uploadDir = "./uploads";
    form.parse(req,function(err,fields,files){
        var suffix = path.extname(files.photo.name);
        name = req.session.name + suffix;
        var newpath = "uploads/" + name;
        fs.rename(files.photo.path,newpath,function(err,data){
            req.session.picUrl = "/"+name;
            res.render("cut",{
                state:req.session.state=="1"?true:false,
                active:req.session.state=="1"?req.session.active:"",
                name:req.session.state=="1"?req.session.name:"",
                picUrl:req.session.state=="1"?req.session.picUrl:""
            });
        });
    });
};
//剪切头像
exports.cutPic = function(req,res){
    form = new formidable.IncomingForm();
    form.uploadDir = "./uploads";
    form.parse(req,function(err,fields,files){
        var w = fields.width;
        var h = fields.height;
        var x = fields.x;
        var y = fields.y;
        gm("./uploads/"+name).crop(w, h, x, y)
            .resize(100,100,"!")
            .write("./uploads/cut"+name,function(err){
                if(err) console.log(err);
            });
        db.updateMany("user",{"name":req.session.name},{$set:{"picUrl":"/"+name}},function(err,result){
            if(err) return;
            req.session.picUrl = "/"+name;
            res.send(req.session.picUrl);
        });
    });
};
//全部留言
exports.allMess = function(req,res){
    req.session.active = "allMess";
    res.redirect("/");
};
//我的留言
exports.myMess = function(req,res){
    req.session.active = "myMess";
    res.redirect("/");
};
//添加留言信息
exports.addMessage = function(req,res){
    form = new formidable.IncomingForm();
    time = date.format(new Date,"YYYY-MM-DD HH:mm:ss");
    form.parse(req,function(err,fields,files){
        var obj = {
            "name":req.session.name,
            "mess":fields.mess,
            "time":time
        };
        db.insertOne("messboard",obj,function(err,result){
            if(err) return;
        });
        res.redirect("/");
    });
};
//删除信息
exports.delMessage = function(req,res){
    db.deleteMany("messboard",{"_id":ObjectID(req.query.id)},function(err,result){
        if(err) return;
        res.redirect("/");
    });
};
