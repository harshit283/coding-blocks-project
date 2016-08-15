const mongodb = require('mongodb');
const mongoClient = mongodb.MongoClient;
const assert = require('assert');
const url = "mongodb://node-project:node-project@ds145315.mlab.com:45315/node-project";
function check_user(obj,callback)
{
    //console.log("Check User Called");
    mongoClient.connect(url, function (err, db)
    {
        assert.equal(err,null);

        var handler = db.collection('documents');

        //console.log("hello");
        handler.find({'username':obj.username}).toArray(function (err,result) {

            //console.log("result of check user function");
            //console.log(result);
            //console.log("done");
            assert.equal(err,null);
            if(result.length)
            {
                db.close();
                callback(1);
            }

            else
            {
                db.close();
                callback(0);
            }
        });
    });
}
function new_user(obj,callback)
{

    mongoClient.connect(url, function (err, db)
    {
        assert.equal(err,null);

        var handler = db.collection('documents');

        handler.find({'username':obj.username}).toArray(function (err,result) {

            assert.equal(err,null);
            if(result.length)
            {
                db.close();
                callback(0);
            }

            else
            {
                handler.insertOne(
                    {
                        'username':obj.username,
                        'password':obj.password,
                        'phone' : obj.phone,
                        'email' : obj.email,
                        'age' : obj.age,
                        'favourites' : []

                    },function (err,result) {

                        assert.equal(err,null);
                        db.close();
                        callback(1);
                    }
                )
            }
        });
    });
}

function fetchUser(username, callback) {

    mongoClient.connect(url, function (err, db)
    {
        assert.equal(err,null);

        var handler = db.collection('documents');

        handler.find({'username': username}).toArray(function (err,result) {

            if (err)
            {
                throw  err;
            }

            if(result.length == 0)
            {
                throw  err;
            }

            //console.log("callback");
            callback(result);
            db.close();


        });
    });
}
function updateInfo(obj, callback) {

    mongoClient.connect(url, function (err, db)
    {
        //console.log("Inside Update Info");
        //console.log(obj);
        assert.equal(err,null);
        var handler = db.collection('documents');

        handler.find({'username' : obj.l_username}).toArray(function (err, result) {

            //console.log("Result of finding query of update info");
            //console.log(result);
            obj['password'] = result[0].password;
            obj['favourites'] = result[0].favourites;

            handler.deleteOne({username : obj.l_username}, function (err, result) {

                if (err)
                {
                    //console.log(err);
                }


                handler.insertOne({
                    'username':obj.username,
                    'password':obj.password,
                    'phone' : obj.phone,
                    'email' : obj.email,
                    'age' : obj.age,
                    'favourites' : obj.favourites

                },function (err, result) {

                    if (err)
                    {
                        //console.log(err);
                    }

                    db.close();
                    callback(true);



                });

            });


        });
    });
}


function deleteAll() {


    mongoClient.connect(url, function (err, db)
    {
        //console.log("Inside Delete All");
        ////console.log(obj);
        assert.equal(err,null);
        var handler = db.collection('documents');
        handler.deleteMany({}, function (err, result) {

            //console.log(result);
            //console.log("Deleted");

        });
    });



}

function UpdatePassword(obj, callback)
{

    mongoClient.connect(url, function (err, db)
    {
        //console.log("Inside Update Password");
        //console.log(obj);
        assert.equal(err,null);
        var handler = db.collection('documents');

        handler.find({'username' : obj.username}).toArray(function (err, result) {

            //console.log("Result of finding query of update info");
            //console.log(result);
            if(obj.pass1!=result[0].password)
            {
                //console.log("Update Password Sending Value Zero");
                callback(0);
                db.close();
                return;
            }
            // obj['password'] = result[0].password;
            obj['age'] = result[0].age;
            obj['email'] = result[0].email;
            obj['phone'] = result[0].phone;
            obj['favourites'] = result[0].favourites;

            handler.deleteMany({username : obj.username}, function (err, result) {

                if (err)
                {
                    //console.log(err);
                }


                handler.insertOne({
                    'username':obj.username,
                    'password':obj.pass2,
                    'phone' : obj.phone,
                    'email' : obj.email,
                    'age' : obj.age,
                    'favourites' : obj.favourites
                },function (err, result) {

                    if (err)
                    {
                        //console.log(err);
                    }

                    db.close();
                    callback(1);



                });

            });


        });
    });

}

function  login(obj, callback) {

    //console.log("Login Called");
    mongoClient.connect(url, function (err, db)
    {
        assert.equal(err,null);
        //console.log("Object passed is");
        //console.log(obj);
        var handler = db.collection('documents');

        //console.log("hello");
        handler.find({'username':obj.username}).toArray(function (err,result) {

            //console.log("result of login function");
            //console.log(result);
            //console.log("done");
            assert.equal(err,null);
            if(result.length == 0)
            {
                db.close();
                callback(0);
            }

            else
            {
                if(obj.password === result[0].password)
                {
                    db.close();
                    callback(1);

                }
                else
                {
                    db.close();
                    callback(0);
                }
            }
        });
    });


}

function  addFavourites(username, string, path, callback) {

    //console.log("Add Favourites Called");
    mongoClient.connect(url, function (err, db)
    {
        assert.equal(err,null);
        // //console.log("Object passed is");
        ////console.log(obj);
        var handler = db.collection('documents');

        ////console.log("hello");
        //console.log("Username received is");
        //console.log(username);
        //console.log("PAth");
        //console.log(path);
        //console.log(string);
        if(username == null || username == "")
        {
            db.close();
            callback(0);
            return;
        }
        handler.find({'username': username}).toArray(function (err,result) {

            assert.equal(err,null);
            //console.log("result of add favourites function");
            //console.log(result[0]);
            if(result == undefined || typeof result == 'undefined' || typeof result == undefined || result == 'undefined' || result == null)
            {
                db.close();
                callback(0);
                return;
            }

            result[0].favourites.push([string, path]);
            //console.log("done");
            handler.deleteOne({'username': username}, function (data, status) {

                //console.log(data);
                //console.log("deleted");
                handler.insertOne({

                    'username':result[0].username,
                    'password':result[0].password,
                    'phone' : result[0].phone,
                    'email' : result[0].email,
                    'age' : result[0].age,
                    'favourites' : result[0].favourites

                }, function (err, result) {

                    //console.log("Added Favourites Everything Fine");
                    callback(1);

                })

            })




        });
    });


}

function  searchFavourites(username, callback) {

    //console.log("Add Favourites Called");
    mongoClient.connect(url, function (err, db)
    {
        assert.equal(err,null);
        // //console.log("Object passed is");
        ////console.log(obj);
        var handler = db.collection('documents');

        ////console.log("hello");
        handler.find({'username': username}).toArray(function (err,result) {

            //console.log("result of favourites function");
            //console.log(result[0].favourites);
            //console.log("done");
            assert.equal(err,null);

            //result[0].favourites.push(string);
            callback(result[0].favourites);
            db.close();

        });
    });


}


module.exports = {

    check_user: check_user,
    new_user : new_user,
    fetchUser : fetchUser,
    deleteAll : deleteAll,
    updateInfo : updateInfo,
    updatePassword : UpdatePassword,
    login : login,
    addFavourites : addFavourites,
    searchFavourites : searchFavourites
};