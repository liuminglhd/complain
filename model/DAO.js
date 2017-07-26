//增删改查
var mongoClient = require("mongodb").MongoClient;
var settings = require("../settings");
function _connectDB(callback){
    var url = settings.dburl;
    mongoClient.connect(url,function(err,db){
        if(err){
            callback(err,null);
        }
        callback(null,db);
    });
}
exports.insertOne = function (collectionName,json,callback){
    _connectDB(function(err,db){
        db.collection(collectionName).insertOne(json,function(err,result){
           callback(err,result);
        });
        db.close();
    });
};
exports.updateMany = function(collectionName,oldjson,newjson,callback){
    _connectDB(function(err,db){
        db.collection(collectionName).updateMany(oldjson,newjson,{"multi":true},function(err,result){
            callback(err,result);
        });
        db.close();
    });
};
exports.deleteMany = function(collectionName,json,callback){
  _connectDB(function(err,db){
      db.collection(collectionName).deleteMany(json,function(err,result){
          callback(err,result);
      });
      db.close();
  })
};
exports.count = function(collectionName,json,callback){
    _connectDB(function(err,db){
        db.collection(collectionName).count(json).then(function(count){
           callback(err,count);
        });
        db.close();
    })
};
exports.find = function(collectionName,json,a,b){
    if(arguments.length == 3){
        var callback = a,
            skipnum = 0,
            limitnum = 0,
            sort ={};
    }else if(arguments.length == 4){
        var args = a,
            skipnum = args.size * (args.page - 1) || 0,
            limitnum = args.size || 0,
            sort = args.sort || {},
            callback = b;
    }
    _connectDB(function(err,db){
        var all = db.collection(collectionName).find(json).skip(skipnum).limit(limitnum).sort(sort);
        all.toArray(function(err,docs){
            if(err){
                callback(err,null);
                db.close();
                return;
            }
            callback(null,docs);
            db.close();
        });
  });
};
