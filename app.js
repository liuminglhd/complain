var express = require("express");
var contr = require("./controller");
var session = require("express-session");
var app = express();
app.use(session({
    secret: "keyboard cat",
    cookie:{maxAge:120*1000},
    resave: true,
    saveUninitialized: true
}));
app.listen(4000);
app.use(express.static("./public"));
app.use(express.static("./scripts"));
app.use(express.static("./uploads"));
app.set("view engine","ejs");
//路由列表
app.get("/",contr.index);
app.post("/readMess",contr.readMess);
app.post("/readAvatar",contr.readAvatar);
app.post("/doReg",contr.doReg);
app.post("/doLogin",contr.doLogin);
app.get("/cancel",contr.cancel);
app.get("/userPic",contr.userPic);
app.post("/uploadPic",contr.uploadPic);
app.post("/cutPic",contr.cutPic);
app.get("/allMess",contr.allMess);
app.get("/myMess",contr.myMess);
app.post("/add",contr.addMessage);
app.get("/del",contr.delMessage);

