const express = require('express');
const app = express();
const md5 = require('md5');
const dbhandler = require('./dbhandler');
const body_parser = require('body-parser');

const cheerio= require('cheerio');
const request = require('request');
app.use(body_parser.urlencoded({extended:true}));
app.use(body_parser.json());

app.use('/',express.static('public_html'));

app.set('port',process.env.PORT || 4000);


app.post('/checkuser',function (req,res) {

    var obj ={
        username:req.body.name,
        password:md5(req.body.pswd)
    };

    dbhandler.check_user(obj,function (result) {

        if(result==1)
            res.send(1);
        else
            res.send(0);
    });
});


app.post('/newuser',function (req,res) {

    var obj ={
        username:req.body.name,
        password:md5(req.body.pswd),
        phone : req.body.phone,
        email : req.body.email,
        age : req.body.age
    };

    dbhandler.new_user(obj,function (result) {

        if(result==0)
            res.send("no");
        else
            res.send("yes");
    });

});

app.post('/fetchUser', function (req,res) {

    console.log("fetch user called");
    dbhandler.fetchUser(req.body.username, function (result) {

        console.log("Sending result");
        console.log(result);
        res.send(result);

    });

});

app.post('/delete', function (req, res) {

    dbhandler.deleteAll();
    res.send({val : 1});

});

app.post('/updateInfo', function (req, res) {

    console.log("Update info called");

    if(req.body.l_username!= req.body.username)
    {
        dbhandler.check_user({username : req.body.username}, function (result) {

            console.log("result received from check user");
            console.log(result);

            if(result == 1)
            {
                res.send({result : 0});
                return;
            }
            dbhandler.updateInfo({

                l_username : req.body.l_username,
                username: req.body.username,
                // password:md5(req.body.pswd),
                phone: req.body.phone,
                email: req.body.email,
                age: req.body.age

            }, function (b) {

                console.log("Inside Call back of update info inside server");
                console.log("result received is " + b);
                if (b) {
                    res.send({result: 1});
                }
                else {
                    res.send({result: 2});
                }

            });

        });
    }
    else
    {
        dbhandler.updateInfo({

            l_username : req.body.l_username,
            username: req.body.username,
            // password:md5(req.body.pswd),
            phone: req.body.phone,
            email: req.body.email,
            age: req.body.age

        }, function (b) {

            console.log("Inside Call back of update info inside server");
            console.log("result received is " + b);
            if (b) {
                res.send({result: 1});
            }
            else {
                res.send({result: 2});
            }

        });
    }


});

app.post('/updatePassword',function (req, res) {

    console.log("requests Object received to update password");
    console.log(req.body);
    dbhandler.updatePassword({
        pass1 : md5(req.body.password),
        pass2 : md5(req.body.n_password),
        username : req.body.username
    }, function (bool) {
        console.log("Sending to front end");
        console.log(bool);
        res.send({val : bool});

    })
});

app.post('/login',function (req, res) {

    dbhandler.login({
        username : req.body.username,
        password : md5(req.body.password)
    }, function (value) {

        console.log("login function sending value " + value);
        if (value == 1)
        {
            res.send({val : 1});
        }
        else
        {
            res.send({val : 0});
        }

    });

});

app.post('/getFavourites', function (req,res) {

    dbhandler.searchFavourites(req.body.username, function (result) {

        res.send({fav : result});


    });

});


app.post('/review', function (req ,res) {

    dbhandler.review({name : req.body.name , str2 : req.body.str2, str3 : req.body.str3,  str4 : req.body.str4 }, function (arg) {
        res.send({val : 1});
    });
});


function get_records(url,callback)
{
    request(url, function(error, response, html) {

        var $ = cheerio.load(html);

        if(!error)
        {
            var data = $(".engineTable").html();
            callback(data);
        }
    });
}


function upcoming_records(url,callback) {

    request(url, function(error, response, html) {

        var $ = cheerio.load(html);

        if(!error)
        {

            var data = $("#ycric-series-schedule").html();
            callback(data);
        }
    });

}

app.get('/live-matches',function (req,res) {

    var url = "http://cricscore-api.appspot.com/csa";
    request(url, function(error, response, html) {
        if(!error)
            res.send(html);
    });
});

app.get('/get-scores',function (req,res) {

    var url = "http://cricscore-api.appspot.com/csa?id="+req.query.id;
    request(url, function(error, response, html) {
        if(!error)
            res.send(html);
    });
});

app.get('/interview',function (req,res) {

    var url;
    if(req.query.id==1)
     url = "https://cricket.yahoo.com/blogs/yahoo-cricket-interviews";
    else
        url =  "https://cricket.yahoo.com/blogs/yahoo-cricket-interviews/?page=" +req.query.id;
    request(url, function(error, response, html) {

        var $ = cheerio.load(html);

        if(!error)
        {
            var data = $("#mediablogindex").html();
            res.send(data);
        }
    });

});



app.get('/hl',function (req,res) {

    var url;
    if(req.query.id==1)
     url = "http://indianexpress.com/section/sports/cricket";
    else url =  "http://indianexpress.com/section/sports/cricket/page/"+req.query.id;
    request(url, function(error, response, html) {
        var $ = cheerio.load(html);
        if(!error)
        {
            var data = $(".nation").html();
            res.send(data);
        }
    });

});


app.get('/photo',function (req,res) {

    //var url = "https://cricket.yahoo.com/photos";
    var url = "http://indianexpress.com/section/sports/cricket";
    request(url, function(error, response, html) {

        var $ = cheerio.load(html);

        if(!error)
        {

           // var data = $("#mediamosaiclistlpca").html();
            var data = $(".nation").html();
            res.send(data);
        }
    });

});
app.get('/test',function (req,res) {

    var url;
    if(req.query.id==1)
     url = "https://cricket.yahoo.com/matches/schedule/test-match";
    else
        url = "https://cricket.yahoo.com/matches/schedule/test-match/page_"+req.query.id;
    upcoming_records(url,function (result) {
        res.send(result);
    });
});

app.get('/odi',function (req,res) {

    var url;
    if(req.query.id==1)
     url = "https://cricket.yahoo.com/matches/schedule/odi-match";
    else
        url = "https://cricket.yahoo.com/matches/schedule/odi-match/page_"+req.query.id;

    upcoming_records(url,function (result) {
        res.send(result);
    });

});


app.get('/t20',function (req,res) {

    var url;
    if(req.query.id==1)
     url = "https://cricket.yahoo.com/matches/schedule/twenty20-match";
    else
        url = "https://cricket.yahoo.com/matches/schedule/twenty20-match/page_"+req.query.id;
    upcoming_records(url,function (result) {
        res.send(result);
    });

});


app.get('/test-up1',function (req,res) {

    var url = "https://cricket.yahoo.com/matches/archive/test-match";
    upcoming_records(url,function (result) {
        res.send(result);
    });
});

app.get('/test-up2',function (req,res) {

    var url ="https://cricket.yahoo.com/matches/archive/test-match/page_2";
    upcoming_records(url,function (result) {
        res.send(result);
    });

});

app.get('/odi-up1',function (req,res) {

    var url = "https://cricket.yahoo.com/matches/archive/odi-match";
    upcoming_records(url,function (result) {
        res.send(result);
    });

});
app.get('/odi-up2',function (req,res) {

    var url = "https://cricket.yahoo.com/matches/archive/odi-match/page_2";
    upcoming_records(url,function (result) {
        res.send(result);
    });

});
app.get('/odi-up3',function (req,res) {

    var url = "https://cricket.yahoo.com/matches/archive/odi-match/page_3";
    upcoming_records(url,function (result) {
        res.send(result);
    });

});

app.get('/t20-up1',function (req,res) {


    var url = "https://cricket.yahoo.com/matches/archive/twenty20-match";
    upcoming_records(url,function (result) {
        res.send(result);
    });

});
app.get('/t20-up2',function (req,res) {


    var url = "https://cricket.yahoo.com/matches/archive/twenty20-match/page_2";
    upcoming_records(url,function (result) {
        res.send(result);
    });

});
app.get('/t20-up3',function (req,res) {


    var url = "https://cricket.yahoo.com/matches/archive/twenty20-match/page_3";
    upcoming_records(url,function (result) {
        res.send(result);
    });

});
app.get('/t20-up4',function (req,res) {


    var url = "https://cricket.yahoo.com/matches/archive/twenty20-match/page_4";
    upcoming_records(url,function (result) {
        res.send(result);
    });

});
app.get('/t20-up5',function (req,res) {


    var url = "https://cricket.yahoo.com/matches/archive/twenty20-match/page_5";
    upcoming_records(url,function (result) {
        res.send(result);
    });

});


app.get('/test-btr-1',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/223646.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'test-btr-1','TEST/batting/test-btr-1.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});
app.get('/test-btr-2',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/208504.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'test-btr-2','TEST/batting/test-btr-2.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});

app.get('/test-btr-3',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/284258.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'test-btr-3','TEST/batting/test-btr-3.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});

app.get('/test-btr-4',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/282847.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'test-btr-4','TEST/batting/test-btr-4.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});

app.get('/test-btr-5',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/282849.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'test-btr-5','TEST/batting/test-btr-5.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});
app.get('/test-btr-6',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records//284248.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'test-btr-6','TEST/batting/test-btr-6.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});
app.get('/test-btr-7',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/284248.html";

    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'test-btr-7','TEST/batting/test-btr-7.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});
app.get('/test-btr-8',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/282860.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'test-btr-8','TEST/batting/test-btr-8.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});
app.get('/test-btr-9',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/282863.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'test-btr-9','TEST/batting/test-btr-9.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});
app.get('/test-btr-10',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/282874.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'test-btr-10','TEST/batting/test-btr-10.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});

app.get('/test-btr-11',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/233006..html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'test-btr-11','TEST/batting/test-btr-11.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});
app.get('/test-btr-12',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/284225.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'test-btr-12','TEST/batting/test-btr-12.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});
app.get('/test-btr-13',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/282884.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'test-btr-13','TEST/batting/test-btr-13.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});
app.get('/test-btr-14',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/284221.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'test-btr-14','TEST/batting/test-btr-14.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});
app.get('/test-btr-15',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/284214.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'test-btr-15','TEST/batting/test-btr-15.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});
app.get('/test-btr-16',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/282898.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'test-btr-16','TEST/batting/test-btr-16.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});
app.get('/test-btr-17',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/282904.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'test-btr-17','TEST/batting/test-btr-17.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});
app.get('/test-btr-18',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/282905.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'test-btr-18','TEST/batting/test-btr-18.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});

app.get('/test-btr-19',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/282910.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'test-btr-19','TEST/batting/test-btr-19.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});
app.get('/test-btr-20',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/284192.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'test-btr-20','TEST/batting/test-btr-20.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});

app.get('/test-btr-21',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/284189.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'test-btr-21','TEST/batting/test-btr-21.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});

app.get('/test-btr-22',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/239555.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'test-btr-22','TEST/batting/test-btr-22.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});

app.get('/test-btr-23',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/284185.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'test-btr-23','TEST/batting/test-btr-23.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});

app.get('/test-btr-24',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/282931.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'test-btr-24','TEST/batting/test-btr-24.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});

app.get('/test-btr-25',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/227046.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'test-btr-25','TEST/batting/test-btr-25.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});


app.get('/test-btr-26',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/230344.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'test-btr-26','TEST/batting/test-btr-26.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});

app.get('/test-btr-27',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/282944.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'test-btr-27','TEST/batting/test-btr-27.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});

app.get('/test-btr-28',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/284168.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'test-btr-28','TEST/batting/test-btr-28.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});

app.get('/test-btr-29',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/282951.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'test-btr-29','TEST/batting/test-btr-29.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});

app.get('/test-btr-30',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/282953.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'test-btr-30','TEST/batting/test-btr-30.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});

app.get('/test-btr-31',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/282955.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'test-btr-31','TEST/batting/test-btr-31.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});

app.get('/test-btr-32',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/142011.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'test-btr-32','TEST/batting/test-btr-32.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});

app.get('/test-btr-33',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/284160.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'test-btr-33','TEST/batting/test-btr-33.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});

app.get('/test-btr-34',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/282968.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'test-btr-34','TEST/batting/test-btr-34.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});

app.get('/test-btr-35',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/282976.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'test-btr-35','TEST/batting/test-btr-35.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});


app.get('/test-btr-36',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/282979.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'test-btr-36','TEST/batting/test-btr-36.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});


app.get('/test-btr-37',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/230132.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'test-btr-37','TEST/batting/test-btr-37.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});

app.get('/test-btr-38',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/231596.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'test-btr-38','TEST/batting/test-btr-38.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});

app.get('/test-btr-39',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/282986.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'test-btr-39','TEST/batting/test-btr-39.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});

app.get('/test-btr-40',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/284143.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'test-btr-40','TEST/batting/test-btr-40.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});

app.get('/test-btr-41',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/284141.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'test-btr-41','TEST/batting/test-btr-41.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});

app.get('/test-btr-42',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/282994.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'test-btr-42','TEST/batting/test-btr-42.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});

app.get('/test-btr-43',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/282998.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'test-btr-43','TEST/batting/test-btr-43.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});

app.get('/test-btr-44',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/210170.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'test-btr-44','TEST/batting/test-btr-44.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});

app.get('/test-btr-45',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283003.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'test-btr-45','TEST/batting/test-btr-45.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});

app.get('/test-btr-46',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/452793.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'test-btr-46','TEST/batting/test-btr-46.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});
app.get('/test-btr-47',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/452792.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'test-btr-47','TEST/batting/test-btr-47.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});

app.get('/test-btr-48',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/284135.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'test-btr-48','TEST/batting/test-btr-48.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});

app.get('/test-btr-49',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/284133.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'test-btr-49','TEST/batting/test-btr-49.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});

app.get('/test-btr-50',function (req,res) {

    var url="http://stats.espncricinfo.com/ci/content/records/283006.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'test-btr-50','TEST/batting/test-btr-50.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});

app.get('/test-btr-51',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/284129.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'test-btr-51','TEST/batting/test-btr-51.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});

app.get('/test-btr-52',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/284128.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'test-btr-52','TEST/batting/test-btr-52.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});



app.get('/odi-bow-1',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/83548.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'odi-bow-1','ODI/batting/odi-bow-1.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});
app.get('/odi-bow-2',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/216972.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'odi-bow-2','ODI/batting/odi-bow-2.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});

app.get('/odi-bow-3',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/284257.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'odi-bow-3','ODI/batting/odi-bow-3.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});

app.get('/odi-bow-4',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/284251.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'odi-bow-4','ODI/batting/odi-bow-4.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});

app.get('/odi-bow-5',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/282854.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'odi-bow-5','ODI/batting/odi-bow-5.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});
app.get('/odi-bow-6',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/284242.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'odi-bow-6','ODI/batting/odi-bow-6.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});
app.get('/odi-bow-7',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/284237.html";

    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'odi-bow-7','ODI/batting/odi-bow-7.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});
app.get('/odi-bow-8',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/282870.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'odi-bow-8','ODI/batting/odi-bow-8.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});
app.get('/odi-bow-9',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/278847.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'odi-bow-9','ODI/batting/odi-bow-9.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});
app.get('/odi-bow-10',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/284224.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'odi-bow-10','ODI/batting/odi-bow-10.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});

app.get('/odi-bow-11',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/284219.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'odi-bow-11','ODI/batting/odi-bow-11.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});
app.get('/odi-bow-12',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/284213.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'odi-bow-12','ODI/batting/odi-bow-12.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});
app.get('/odi-bow-13',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/284210.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'odi-bow-13','ODI/batting/odi-bow-13.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});
app.get('/odi-bow-14',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/284205.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'odi-bow-14','ODI/batting/odi-bow-14.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});
app.get('/odi-bow-15',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/233754.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'odi-bow-15','ODI/batting/odi-bow-15.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});
app.get('/odi-bow-16',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/284184.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'odi-bow-16','ODI/batting/odi-bow-16.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});
app.get('/odi-bow-17',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/284178.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'odi-bow-17','ODI/batting/odi-bow-17.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});
app.get('/odi-bow-18',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/282935.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'odi-bow-18','ODI/batting/odi-bow-18.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});

app.get('/odi-bow-19',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/284167.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'odi-bow-19','ODI/batting/odi-bow-19.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});
app.get('/odi-bow-20',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/284164.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'odi-bow-20','ODI/batting/odi-bow-20.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});

app.get('/odi-bow-21',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/284159.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'odi-bow-21','ODI/batting/odi-bow-21.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});

app.get('/odi-bow-22',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/282969.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'odi-bow-22','ODI/batting/odi-bow-22.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});

app.get('/odi-bow-23',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/284149.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'odi-bow-23','ODI/batting/odi-bow-23.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});

app.get('/odi-bow-24',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/282975.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'odi-bow-24','ODI/batting/odi-bow-24.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});

app.get('/odi-bow-25',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/282987.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'odi-bow-25','ODI/batting/odi-bow-25.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});


app.get('/odi-bow-26',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/282995.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'odi-bow-26','ODI/batting/odi-bow-26.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});

app.get('/odi-bow-27',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/284138.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'odi-bow-27','ODI/batting/odi-bow-27.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});

app.get('/odi-bow-28',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/211608.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'odi-bow-28','ODI/batting/odi-bow-28.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});

app.get('/test-wk-1',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283791.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'test-wk-1','TEST/wickets/test-wk-1.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});

app.get('/test-wk-2',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283802.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'test-wk-2','TEST/wickets/test-wk-2.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});

app.get('/test-wk-3',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283810.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'test-wk-3','TEST/wickets/test-wk-3.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});

app.get('/test-wk-4',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283369.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'test-wk-4','TEST/wickets/test-wk-4.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});

app.get('/test-wk-5',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283365.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'test-wk-5','TEST/wickets/test-wk-5.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});

app.get('/test-wk-6',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283355.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'test-wk-6','TEST/wickets/test-wk-6.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});

app.get('/test-wk-7',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283348.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'test-wk-7','TEST/wickets/test-wk-7.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});

app.get('/test-wk-8',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283344.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'test-wk-8','TEST/wickets/test-wk-8.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});

app.get('/test-wk-9',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283340.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'test-wk-9','TEST/wickets/test-wk-9.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});

app.get('/test-wk-10',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283329.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'test-wk-10','TEST/wickets/test-wk-10.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});

app.get('/test-wk-11',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283323.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'test-wk-11','TEST/wickets/test-wk-11.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});

app.get('/test-wk-12',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283321.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'test-wk-12','TEST/wickets/test-wk-12.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});

app.get('/test-wk-13',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283853.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'test-wk-13','TEST/wickets/test-wk-13.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});

app.get('/test-wk-14',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283866.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'test-wk-14','TEST/wickets/test-wk-14.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});

app.get('/test-wk-15',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283316.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'test-wk-15','TEST/wickets/test-wk-15.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});

app.get('/odi-wk-1',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283792.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'odi-wk-1','ODI/wicket-keeping/odi-wk-1.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});

app.get('/odi-wk-2',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283803.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'odi-wk-2','ODI/wicket-keeping/odi-wk-2.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});

app.get('/odi-wk-3',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283368.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'odi-wk-3','ODI/wicket-keeping/odi-wk-3.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});

app.get('/odi-wk-4',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283817.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'odi-wk-4','ODI/wicket-keeping/odi-wk-4.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});

app.get('/odi-wk-5',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283828.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'odi-wk-5','ODI/wicket-keeping/odi-wk-5.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});

app.get('/odi-wk-6',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283343.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'odi-wk-6','ODI/wicket-keeping/odi-wk-6.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});

app.get('/odi-wk-7',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283339.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'odi-wk-7','ODI/wicket-keeping/odi-wk-7.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});

app.get('/odi-wk-8',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283328.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'odi-wk-8','ODI/wicket-keeping/odi-wk-8.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});

app.get('/odi-wk-9',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283320.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'odi-wk-9','ODI/wicket-keeping/odi-wk-9.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});

app.get('/odi-wk-10',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283314.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'odi-wk-10','ODI/wicket-keeping/odi-wk-10.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});

app.get('/test-fld-1',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283548.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'test-fld-1','TEST/fielding/test-fld-1.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});


app.get('/test-fld-2',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283555.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'test-fld-2','TEST/fielding/test-fld-2.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});

app.get('/test-fld-3',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283561.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'test-fld-3','TEST/fielding/test-fld-3.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});
app.get('/test-fld-4',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283632.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'test-fld-4','TEST/fielding/test-fld-4.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});

app.get('/test-fld-5',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283627.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'test-fld-5','TEST/fielding/test-fld-5.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});

app.get('/test-fld-6',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283623.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'test-fld-7','TEST/fielding/test-fld-6.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});


app.get('/odi-fld-1',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283651.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'odi-fld-1','ODI/fielding/odi-fld-1.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});

app.get('/odi-fld-2',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283642.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'odi-fld-2','ODI/fielding/odi-fld-2.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});

app.get('/odi-fld-3',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283630.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'odi-fld-3','ODI/fielding/odi-fld-3.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});

app.get('/odi-fld-4',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283626.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'odi-fld-4','ODI/fielding/odi-fld-4.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});



app.get('/test-ar-1',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/282786.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'test-ar-1','TEST/all-round/test-ar-1.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});

app.get('/test-ar-2',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/282789.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'test-ar-2','TEST/all-round/test-ar-2.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});


app.get('/test-ar-3',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/287370.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'test-ar-3','TEST/all-round/test-ar-3.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});

app.get('/test-ar-4',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/287370.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'test-ar-4','TEST/all-round/test-ar-4.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});

app.get('/test-ar-5',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/282801.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'test-ar-5','TEST/all-round/test-ar-5.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});

app.get('/test-ar-6',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/287359.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'test-ar-6','TEST/all-round/test-ar-6.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});

app.get('/test-ar-7',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/287356.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'test-ar-7','TEST/all-round/test-ar-7.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});


app.get('/test-ar-8',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/287353.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'test-ar-8','TEST/all-round/test-ar-8.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});


app.get('/test-ar-9',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/284278.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'test-ar-9','TEST/all-round/test-ar-9.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});

app.get('/test-ar-10',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/282824.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'test-ar-10','TEST/all-round/test-ar-10.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});

app.get('/odi-ar-1',function (req,res) {

    console.log("odi alround called");
    var url ="http://stats.espncricinfo.com/ci/content/records/282787.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'odi-ar-1','ODI/all-round/odi-ar-1.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });

    });


});
app.get('/odi-ar-2',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/302543.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'odi-ar-2','ODI/all-round/odi-ar-2.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});

app.get('/odi-ar-3',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/287367.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'odi-ar-3','ODI/all-round/odi-ar-3.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});

app.get('/odi-ar-4',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/282798.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'odi-ar-4','ODI/all-round/odi-ar-4.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});

app.get('/odi-ar-5',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/287364.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'odi-ar-5','ODI/all-round/odi-ar-5.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});

app.get('/odi-ar-6',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/287358.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'odi-ar-6','ODI/all-round/odi-ar-6.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});

app.get('/odi-ar-7',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/287355.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'odi-ar-7','ODI/all-round/odi-ar-7.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});

app.get('/odi-ar-8',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/287352.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'odi-ar-8','ODI/all-round/odi-ar-8.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});

app.get('/odi-ar-9',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/284276.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'odi-ar-9','ODI/all-round/odi-ar-9.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});

app.get('/odi-ar-10',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/315604.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'odi-ar-10','ODI/all-round/odi-ar-10.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});

app.get('/odi-ar-11',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/282825.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'odi-ar-11','ODI/all-round/odi-ar-11.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});

app.get('/test-bwl-1',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/93276.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'test-bwl-1','TEST/bowling/test-bwl-1.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});

app.get('/test-bwl-2',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283203.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'test-bwl-2','TEST/bowling/test-bwl-2.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    });
});

app.get('/test-bwl-3',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283211.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'test-bwl-3','TEST/bowling/test-bwl-3.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});
app.get('/test-bwl-4',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/122207.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'test-bwl-4','TEST/bowling/test-bwl-4.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});
app.get('/test-bwl-5',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/229904.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'test-bwl-5','TEST/bowling/test-bwl-5.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});

app.get('/test-bwl-6',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283954.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'test-bwl-6','TEST/bowling/test-bwl-6.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});

app.get('/test-bwl-7',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283233.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'test-bwl-7','TEST/bowling/test-bwl-7.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});
app.get('/test-bwl-8',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283939.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'test-bwl-8','TEST/bowling/test-bwl-8.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});
app.get('/test-bwl-9',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283246.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'test-bwl-9','TEST/bowling/test-bwl-9.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});
app.get('/test-bwl-10',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283928.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'test-bwl-10','TEST/bowling/test-bwl-10.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});
app.get('/test-bwl-11',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283254.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'test-bwl-11','TEST/bowling/test-bwl-11.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});

app.get('/test-bwl-12',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283256.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'test-bwl-12','TEST/bowling/test-bwl-12.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});
app.get('/test-bwl-13',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283265.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'test-bwl-13','TEST/bowling/test-bwl-13.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});
app.get('/test-bwl-14',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283274.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'test-bwl-14','TEST/bowling/test-bwl-14.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});
app.get('/test-bwl-15',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283903.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'test-bwl-15','TEST/bowling/test-bwl-15.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});
app.get('/test-bwl-16',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283292.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'test-bwl-16','TEST/bowling/test-bwl-16.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});

app.get('/test-bwl-17',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283299.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'test-bwl-17','TEST/bowling/test-bwl-17.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});
app.get('/test-bwl-18',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283881.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'test-bwl-18','TEST/bowling/test-bwl-18.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});
app.get('/test-bwl-19',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283869.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'test-bwl-19','TEST/bowling/test-bwl-19.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});
app.get('/test-bwl-20',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283859.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'test-bwl-20','TEST/bowling/test-bwl-20.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});
app.get('/test-bwl-21',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283850.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'test-bwl-21','TEST/bowling/test-bwl-21.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});

app.get('/test-bwl-22',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283841.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'test-bwl-22','TEST/bowling/test-bwl-22.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});
app.get('/test-bwl-23',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283835.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'test-bwl-23','TEST/bowling/test-bwl-23.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});
app.get('/test-bwl-24',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283354.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'test-bwl-24','TEST/bowling/test-bwl-24.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});
app.get('/test-bwl-25',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283370.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'test-bwl-25','TEST/bowling/test-bwl-25.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});
app.get('/test-bwl-26',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283376.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'test-bwl-26','TEST/bowling/test-bwl-26.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});

app.get('/test-bwl-27',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283388.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'test-bwl-27','TEST/bowling/test-bwl27.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});
app.get('/test-bwl-28',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283390.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'test-bwl-28','TEST/bowling/test-bwl-28.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});
app.get('/test-bwl-29',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283789.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'test-bwl-29','TEST/bowling/test-bwl-29.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});
app.get('/test-bwl-30',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283787.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'test-bwl-30','TEST/bowling/test-bwl-30.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});
app.get('/test-bwl-31',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283781.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'test-bwl-31','TEST/bowling/test-bwl-31.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});
app.get('/test-bwl-32',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283779.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'test-bwl-32','TEST/bowling/test-bwl-32.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});


app.get('/odi-bwl-1',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283193.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'odi-bwl-1','ODI/bowling/odi-bwl-1.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});

app.get('/odi-bwl-2',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283204.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'odi-bwl-2','ODI/bowling/odi-bwl-2.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});
app.get('/odi-bwl-3',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283967.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'odi-bwl-3','ODI/bowling/odi-bwl-3.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});
app.get('/odi-bwl-4',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283219.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'odi-bwl-4','ODI/bowling/odi-bwl-4.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});
app.get('/odi-bwl-5',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283953.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'odi-bwl-5','ODI/bowling/odi-bwl-5.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});
app.get('/odi-bwl-6',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283947.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'odi-bwl-6','ODI/bowling/odi-bwl-6.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});
app.get('/odi-bwl-7',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283937.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'odi-bwl-7','ODI/bowling/odi-bwl-7.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});

app.get('/odi-bwl-8',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283927.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'odi-bwl-8','ODI/bowling/odi-bwl-8.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});


app.get('/odi-bwl-9',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283257.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'odi-bwl-9','ODI/bowling/odi-bwl-9.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});
app.get('/odi-bwl-10',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283266.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'odi-bwl-10','ODI/bowling/odi-bwl-10.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});
app.get('/odi-bwl-11',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283275.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'odi-bwl-11','ODI/bowling/odi-bwl-11.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});
app.get('/odi-bwl-12',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283900.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'odi-bwl-12','ODI/bowling/odi-bwl-12.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});
app.get('/odi-bwl-13',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283293.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'odi-bwl-13','ODI/bowling/odi-bwl-13.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});

app.get('/odi-bwl-14',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283300.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'odi-bwl-14','ODI/bowling/odi-bwl-14.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});
app.get('/odi-bwl-15',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283880.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'odi-bwl-15','ODI/bowling/odi-bwl-15.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});
app.get('/odi-bwl-16',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283868.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'odi-bwl-16','ODI/bowling/odi-bwl-16.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});
app.get('/odi-bwl-17',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283858.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'odi-bwl-17','ODI/bowling/odi-bwl-17.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});
app.get('/odi-bwl-18',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283849.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'odi-bwl-18','ODI/bowling/odi-bwl-18.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});
app.get('/odi-bwl-19',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283840.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'odi-bwl-19','ODI/bowling/odi-bwl-19.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});

app.get('/odi-bwl-20',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283826.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'odi-bwl-20','ODI/bowling/odi-bwl-20.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});
app.get('/odi-bwl-21',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283818.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'odi-bwl-21','ODI/bowling/odi-bwl-21.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});
app.get('/odi-bwl-22',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283811.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'odi-bwl-22','ODI/bowling/odi-bwl-22.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});
app.get('/odi-bwl-23',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283382.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'odi-bwl-23','ODI/bowling/odi-bwl-23.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});
app.get('/odi-bwl-24',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283797.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'odi-bwl-24','ODI/bowling/odi-bwl-24.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});
app.get('/odi-bwl-25',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283786.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'odi-bwl-25','ODI/bowling/odi-bwl-25.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});

app.get('/odi-bwl-26',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283778.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'odi-bwl-26','ODI/bowling/odi-bwl-26.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});


app.get('/test-ptr-1',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283573.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'test-ptr-1','TEST/partnership-rec/test-ptr-1.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});

app.get('/test-ptr-2',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/254836.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'test-ptr-2','TEST/partnership-rec/test-ptr-2.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});
app.get('/test-ptr-3',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283604.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'test-ptr-3','TEST/partnership-rec/test-ptr-3.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});
app.get('/test-ptr-4',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283604.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'test-ptr-4','TEST/partnership-rec/test-ptr-4.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});
app.get('/test-ptr-5',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283597.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'test-ptr-5','TEST/partnership-rec/test-ptr-5.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});
app.get('/test-ptr-6',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283590.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'test-ptr-6','TEST/partnership-rec/test-ptr-6.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});
app.get('/test-ptr-7',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283583.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'test-ptr-7','TEST/partnership-rec/test-ptr-7.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});
app.get('/test-ptr-8',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283575.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'test-ptr-8','TEST/partnership-rec/test-ptr-8.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});
app.get('/test-ptr-9',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283567.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'test-ptr-9','TEST/partnership-rec/test-ptr-9.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});
app.get('/test-ptr-10',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283560.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'test-ptr-10','TEST/partnership-rec/test-ptr-10.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});
app.get('/test-ptr-11',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283553.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'test-ptr-11','TEST/partnership-rec/test-ptr-11.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});
app.get('/test-ptr-12',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283526.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'test-ptr-12','TEST/partnership-rec/test-ptr-12.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});

app.get('/odi-ptr-1',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283574.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'odi-ptr-1','ODI/prt-rec/odi-ptr-1.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});
app.get('/odi-ptr-2',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/252072.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'odi-ptr-2','ODI/prt-rec/odi-ptr-2.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});
app.get('/odi-ptr-3',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283609.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'odi-ptr-3','ODI/prt-rec/odi-ptr-3.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});
app.get('/odi-ptr-4',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283602.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'odi-ptr-4','ODI/prt-rec/odi-ptr-4.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});
app.get('/odi-ptr-5',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283595.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'odi-ptr-5','ODI/prt-rec/odi-ptr-5.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});
app.get('/odi-ptr-6',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283588.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'odi-ptr-6','ODI/prt-rec/odi-ptr-6.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});
app.get('/odi-ptr-7',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283582.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'odi-ptr-7','ODI/prt-rec/odi-ptr-7.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});
app.get('/odi-ptr-8',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283572.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'odi-ptr-8','ODI/prt-rec/odi-ptr-8.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});
app.get('/odi-ptr-9',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283566.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'odi-ptr-9','ODI/prt-rec/odi-ptr-9.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});
app.get('/odi-ptr-10',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283559.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'odi-ptr-10','ODI/prt-rec/odi-ptr-10.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});
app.get('/odi-ptr-11',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283552.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'odi-ptr-11','ODI/prt-rec/odi-ptr-11.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});
app.get('/odi-ptr-12',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283524.html";
    get_records(url,function (result) {
        dbhandler.addFavourites(req.query.username,'odi-ptr-12','ODI/prt-rec/odi-ptr-12.html',function (response) {

            // console.log("Response received from add Favourites");
            // console.log(response);
            res.send(result);
        });
    })
});



app.get('/w-test-bt-1',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/284265.html";
    get_records(url,function (result) {
        res.send(result);
    })
});

app.get('/w-test-bt-2',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/284261.html";
    get_records(url,function (result) {
        res.send(result);
    })
});


app.get('/w-test-bt-3',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/284252.html";
    get_records(url,function (result) {
        res.send(result);
    })
});

app.get('/w-test-bt-4',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/284250.html";
    get_records(url,function (result) {
        res.send(result);
    })
});

app.get('/w-test-bt-5',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/284245.html";
    get_records(url,function (result) {
        res.send(result);
    })
});
app.get('/w-test-bt-6',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/284235.html";
    get_records(url,function (result) {
        res.send(result);
    })
});
app.get('/w-test-bt-7',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/284172.html";
    get_records(url,function (result) {
        res.send(result);
    })
});
app.get('/w-test-bt-8',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/284162.html";
    get_records(url,function (result) {
        res.send(result);
    })
});
app.get('/w-test-bt-9',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/284157.html";
    get_records(url,function (result) {
        res.send(result);
    })
});
app.get('/w-test-bt-10',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/284154.html";
    get_records(url,function (result) {
        res.send(result);
    })
});
app.get('/w-test-bt-11',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/284151.html";
    get_records(url,function (result) {
        res.send(result);
    })
});
app.get('/w-test-bt-12',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/284145.html";
    get_records(url,function (result) {
        res.send(result);
    })
});
app.get('/w-test-bt-13',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/284124.html";
    get_records(url,function (result) {
        res.send(result);
    })
});
app.get('/w-test-bt-14',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/284118.html";
    get_records(url,function (result) {
        res.send(result);
    })
});
app.get('/w-test-bt-15',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/284118.html";
    get_records(url,function (result) {
        res.send(result);
    })
});
app.get('/w-test-bt-16',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/284114.html";
    get_records(url,function (result) {
        res.send(result);
    })
});
app.get('/w-test-bt-17',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283995.html";
    get_records(url,function (result) {
        res.send(result);
    })
});
app.get('/w-test-bt-18',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/284085.html";
    get_records(url,function (result) {
        res.send(result);
    })
});

app.get('/w-test-bt-19',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/284078.html";
    get_records(url,function (result) {
        res.send(result);
    })
});
app.get('/w-test-bt-20',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/284061.html";
    get_records(url,function (result) {
        res.send(result);
    })
});

app.get('/w-test-bt-21',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/284054.html";
    get_records(url,function (result) {
        res.send(result);
    })
});
app.get('/w-test-bt-22',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/284029.html";
    get_records(url,function (result) {
        res.send(result);
    })
});


app.get('/w-test-bw-1',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283977.html";
    get_records(url,function (result) {
        res.send(result);
    })
});

app.get('/w-test-bw-2',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283972.html";
    get_records(url,function (result) {
        res.send(result);
    })
});


app.get('/w-test-bw-3',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283968.html";
    get_records(url,function (result) {
        res.send(result);
    })
});

app.get('/w-test-bw-4',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283965.html";
    get_records(url,function (result) {
        res.send(result);
    })
});

app.get('/w-test-bw-5',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283957.html";
    get_records(url,function (result) {
        res.send(result);
    })
});
app.get('/w-test-bw-6',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283228.html";
    get_records(url,function (result) {
        res.send(result);
    })
});
app.get('/w-test-bw-7',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283916.html";
    get_records(url,function (result) {
        res.send(result);
    })
});
app.get('/w-test-bw-8',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283912.html";
    get_records(url,function (result) {
        res.send(result);
    })
});
app.get('/w-test-bw-9',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283907.html";
    get_records(url,function (result) {
        res.send(result);
    })
});
app.get('/w-test-bw-10',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283872.html";
    get_records(url,function (result) {
        res.send(result);
    })
});
app.get('/w-test-bw-11',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283862.html";
    get_records(url,function (result) {
        res.send(result);
    })
});
app.get('/w-test-bw-12',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283854.html";
    get_records(url,function (result) {
        res.send(result);
    })
});
app.get('/w-test-bw-13',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283820.html";
    get_records(url,function (result) {
        res.send(result);
    })
});
app.get('/w-test-bw-14',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283812.html";
    get_records(url,function (result) {
        res.send(result);
    })
});
app.get('/w-test-bw-15',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283807.html";
    get_records(url,function (result) {
        res.send(result);
    })
});
app.get('/w-test-bw-16',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283785.html";
    get_records(url,function (result) {
        res.send(result);
    })
});
app.get('/w-test-bw-17',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283794.html";
    get_records(url,function (result) {
        res.send(result);
    })
});
app.get('/w-test-bw-18',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283718.html";
    get_records(url,function (result) {
        res.send(result);
    })
});

app.get('/w-test-bw-19',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283710.html";
    get_records(url,function (result) {
        res.send(result);
    })
});
app.get('/w-test-bw-20',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283702.html";
    get_records(url,function (result) {
        res.send(result);
    })
});

app.get('/w-test-bw-21',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283670.html";
    get_records(url,function (result) {
        res.send(result);
    })
});

app.get('/w-test-bw-22',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283678.html";
    get_records(url,function (result) {
        res.send(result);
    })
});


app.get('/w-test-fld-1',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283646.html";
    get_records(url,function (result) {
        res.send(result);
    })
});

app.get('/w-test-fld-2',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283637.html";
    get_records(url,function (result) {
        res.send(result);
    })
});
app.get('/w-test-fld-3',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283633.html";
    get_records(url,function (result) {
        res.send(result);
    })
});
app.get('/w-test-fld-4',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283629.html";
    get_records(url,function (result) {
        res.send(result);
    })
});


app.get('/w-test-ar-1',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/287369.html";
    get_records(url,function (result) {
        res.send(result);
    })
});

app.get('/w-test-ar-2',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/287368.html";
    get_records(url,function (result) {
        res.send(result);
    })
});

app.get('/w-test-ar-3',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/287363.html";
    get_records(url,function (result) {
        res.send(result);
    })
});

app.get('/w-test-prt-1',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283607.html";
    get_records(url,function (result) {
        res.send(result);
    })
});
app.get('/w-test-prt-2',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283600.html";
    get_records(url,function (result) {
        res.send(result);
    })
});

app.get('/w-test-prt-3',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283593.html";
    get_records(url,function (result) {
        res.send(result);
    })
});

app.get('/w-test-prt-4',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283586.html";
    get_records(url,function (result) {
        res.send(result);
    })
});

app.get('/w-test-prt-5',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283579.html";
    get_records(url,function (result) {
        res.send(result);
    })
});

app.get('/w-test-prt-6',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283570.html";
    get_records(url,function (result) {
        res.send(result);
    })
});

app.get('/w-test-prt-7',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283564.html";
    get_records(url,function (result) {
        res.send(result);
    })
});

app.get('/w-test-prt-8',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283557.html";
    get_records(url,function (result) {
        res.send(result);
    })
});

app.get('/w-test-prt-9',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283550.html";
    get_records(url,function (result) {
        res.send(result);
    })
});

app.get('/w-test-prt-10',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283519.html";
    get_records(url,function (result) {
        res.send(result);
    })
});


app.get('/w-test-wk-1',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283380.html";
    get_records(url,function (result) {
        res.send(result);
    })
});


app.get('/w-test-wk-2',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283375.html";
    get_records(url,function (result) {
        res.send(result);
    })
});



app.get('/w-test-wk-3',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283371.html";
    get_records(url,function (result) {
        res.send(result);
    })
});


app.get('/w-test-wk-4',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283367.html";
    get_records(url,function (result) {
        res.send(result);
    })
});


app.get('/w-test-wk-5',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283358.html";
    get_records(url,function (result) {
        res.send(result);
    })
});


app.get('/w-test-wk-6',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283351.html";
    get_records(url,function (result) {
        res.send(result);
    })
});


app.get('/w-test-wk-7',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283345.html";
    get_records(url,function (result) {
        res.send(result);
    })
});


app.get('/w-test-wk-8',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283342.html";
    get_records(url,function (result) {
        res.send(result);
    })
});


app.get('/w-test-wk-9',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283332.html";
    get_records(url,function (result) {
        res.send(result);
    })
});

app.get('/w-test-wk-10',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283326.html";
    get_records(url,function (result) {
        res.send(result);
    })
});
app.get('/w-test-wk-11',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283322.html";
    get_records(url,function (result) {
        res.send(result);
    })
});

app.get('/w-test-wk-12',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283319.html";
    get_records(url,function (result) {
        res.send(result);
    })
});



app.get('/w-odi-prt-1',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283606.html";
    get_records(url,function (result) {
        res.send(result);
    })
});
app.get('/w-odi-prt-2',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283599.html";
    get_records(url,function (result) {
        res.send(result);
    })
});

app.get('/w-odi-prt-3',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283592.html";
    get_records(url,function (result) {
        res.send(result);
    })
});

app.get('/w-odi-prt-4',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283585.html";
    get_records(url,function (result) {
        res.send(result);
    })
});

app.get('/w-odi-prt-5',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283578.html";
    get_records(url,function (result) {
        res.send(result);
    })
});

app.get('/w-odi-prt-6',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283569.html";
    get_records(url,function (result) {
        res.send(result);
    })
});

app.get('/w-odi-prt-7',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283563.html";
    get_records(url,function (result) {
        res.send(result);
    })
});

app.get('/w-odi-prt-8',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283556.html";
    get_records(url,function (result) {
        res.send(result);
    })
});

app.get('/w-odi-prt-9',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283549.html";
    get_records(url,function (result) {
        res.send(result);
    })
});

app.get('/w-odi-prt-10',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283518.html";
    get_records(url,function (result) {
        res.send(result);
    })
});


app.get('/w-odi-fld-1',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283644.html";
    get_records(url,function (result) {
        res.send(result);
    })
});

app.get('/w-odi-fld-2',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283325.html";
    get_records(url,function (result) {
        res.send(result);
    })
});
app.get('/w-odi-fld-3',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283628.html";
    get_records(url,function (result) {
        res.send(result);
    })
});



app.get('/w-odi-wk-1',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283379.html";
    get_records(url,function (result) {
        res.send(result);
    })
});


app.get('/w-odi-wk-2',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283374.html";
    get_records(url,function (result) {
        res.send(result);
    })
});



app.get('/w-odi-wk-3',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283366.html";
    get_records(url,function (result) {
        res.send(result);
    })
});


app.get('/w-odi-wk-4',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283357.html";
    get_records(url,function (result) {
        res.send(result);
    })
});


app.get('/w-odi-wk-5',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283350.html";
    get_records(url,function (result) {
        res.send(result);
    })
});


app.get('/w-odi-wk-6',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283341.html";
    get_records(url,function (result) {
        res.send(result);
    })
});


app.get('/w-odi-wk-7',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283331.html";
    get_records(url,function (result) {
        res.send(result);
    })
});


app.get('/w-odi-wk-8',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283325.html";
    get_records(url,function (result) {
        res.send(result);
    })
});


app.get('/w-odi-wk-9',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283318.html";
    get_records(url,function (result) {
        res.send(result);
    })
});

app.get('/w-odi-ar-1',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/302544.html";
    get_records(url,function (result) {
        res.send(result);
    })
});

app.get('/w-odi-ar-2',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/302542.html";
    get_records(url,function (result) {
        res.send(result);
    })
});
app.get('/w-odi-ar-3',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/287366.html";
    get_records(url,function (result) {
        res.send(result);
    })
});
app.get('/w-odi-ar-4',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/287365.html";
    get_records(url,function (result) {
        res.send(result);
    })
});
app.get('/w-odi-ar-5',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/287362.html";
    get_records(url,function (result) {
        res.send(result);
    })
});
app.get('/w-odi-ar-6',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/287354.html";
    get_records(url,function (result) {
        res.send(result);
    })
});
app.get('/w-odi-ar-7',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/287351.html";
    get_records(url,function (result) {
        res.send(result);
    })
});
app.get('/w-odi-ar-8',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/315605.html";
    get_records(url,function (result) {
        res.send(result);
    })
});
app.get('/w-odi-ar-9',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/284270.html";
    get_records(url,function (result) {
        res.send(result);
    })
});


app.get('/w-odi-bw-1',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283976.html";
    get_records(url,function (result) {
        res.send(result);
    })
});

app.get('/w-odi-bw-2',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283971.html";
    get_records(url,function (result) {
        res.send(result);
    })
});

app.get('/w-odi-bw-3',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283963.html";
    get_records(url,function (result) {
        res.send(result);
    })
});
app.get('/w-odi-bw-4',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283956.html";
    get_records(url,function (result) {
        res.send(result);
    })
});
app.get('/w-odi-bw-5',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283924.html";
    get_records(url,function (result) {
        res.send(result);
    })
});
app.get('/w-odi-bw-6',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283915.html";
    get_records(url,function (result) {
        res.send(result);
    })
});
app.get('/w-odi-bw-7',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283911.html";
    get_records(url,function (result) {
        res.send(result);
    })
});
app.get('/w-odi-bw-8',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283906.html";
    get_records(url,function (result) {
        res.send(result);
    })
});
app.get('/w-odi-bw-9',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283871.html";
    get_records(url,function (result) {
        res.send(result);
    })
});
app.get('/w-odi-bw-10',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283861.html";
    get_records(url,function (result) {
        res.send(result);
    })
});
app.get('/w-odi-bw-11',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283819.html";
    get_records(url,function (result) {
        res.send(result);
    })
});
app.get('/w-odi-bw-12',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283806.html";
    get_records(url,function (result) {
        res.send(result);
    })
});
app.get('/w-odi-bw-13',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283800.html";
    get_records(url,function (result) {
        res.send(result);
    })
});
app.get('/w-odi-bw-14',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283782.html";
    get_records(url,function (result) {
        res.send(result);
    })
});
app.get('/w-odi-bw-15',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283790.html";
    get_records(url,function (result) {
        res.send(result);
    })
});
app.get('/w-odi-bw-16',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283717.html";
    get_records(url,function (result) {
        res.send(result);
    })
});
app.get('/w-odi-bw-17',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283709.html";
    get_records(url,function (result) {
        res.send(result);
    })
});
app.get('/w-odi-bw-18',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283701.html";
    get_records(url,function (result) {
        res.send(result);
    })
});
app.get('/w-odi-bw-19',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283669.html";
    get_records(url,function (result) {
        res.send(result);
    })
});
app.get('/w-odi-bw-20',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/283676.html";
    get_records(url,function (result) {
        res.send(result);
    })
});


app.get('/w-odi-bt-1',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/284264.html";
    get_records(url,function (result) {
        res.send(result);
    })
});


app.get('/w-odi-bt-2',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/284260.html";
    get_records(url,function (result) {
        res.send(result);
    })
});

app.get('/w-odi-bt-3',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/284249.html";
    get_records(url,function (result) {
        res.send(result);
    })
});

app.get('/w-odi-bt-4',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/284244.html";
    get_records(url,function (result) {
        res.send(result);
    })
});

app.get('/w-odi-bt-5',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/284234.html";
    get_records(url,function (result) {
        res.send(result);
    })
});

app.get('/w-odi-bt-6',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/284170.html";
    get_records(url,function (result) {
        res.send(result);
    })
});

app.get('/w-odi-bt-7',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/284161.html";
    get_records(url,function (result) {
        res.send(result);
    })
});

app.get('/w-odi-bt-8',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/284156.html";
    get_records(url,function (result) {
        res.send(result);
    })
});

app.get('/w-odi-bt-9',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/284153.html";
    get_records(url,function (result) {
        res.send(result);
    })
});

app.get('/w-odi-bt-10',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/284144.html";
    get_records(url,function (result) {
        res.send(result);
    })
});

app.get('/w-odi-bt-11',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/284123.html";
    get_records(url,function (result) {
        res.send(result);
    })
});

app.get('/w-odi-bt-12',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/284119.html";
    get_records(url,function (result) {
        res.send(result);
    })
});
app.get('/w-odi-bt-13',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/284117.html";
    get_records(url,function (result) {
        res.send(result);
    })
});

app.get('/w-odi-bt-14',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/284113.html";
    get_records(url,function (result) {
        res.send(result);
    })
});

app.get('/w-odi-bt-15',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/284084.html";
    get_records(url,function (result) {
        res.send(result);
    })
});
app.get('/w-odi-bt-16',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/284077.html";
    get_records(url,function (result) {
        res.send(result);
    })
});

app.get('/w-odi-bt-17',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/284060.html";
    get_records(url,function (result) {
        res.send(result);
    })
});

app.get('/w-odi-bt-18',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/284053.html";
    get_records(url,function (result) {
        res.send(result);
    })
});

app.get('/w-odi-bt-19',function (req,res) {

    var url ="http://stats.espncricinfo.com/ci/content/records/284040.html";
    get_records(url,function (result) {
        res.send(result);
    })
});

app.get('/w-headlines',function (req,res) {

    var url = "http://www.icc-cricket.com/search?q=women%20cricket&page="+req.query.id;
    request(url, function(error, response, html) {

        var $ = cheerio.load(html);
        if(!error)
        {
            var data = $(".searchResults").html();
            res.send(data);
        }
    });

});

app.get('/featuring-news',function (req,res) {

    var url ="http://www.espncricinfo.com/women/content/story/features.html?object=207455";
    request(url, function(error, response, html) {

        var $ = cheerio.load(html);
        if(!error)
        {
            var data = $(".story-item");
            console.log(data.length);
            var str= "";
            for(var i=0;i<data.length;i++)
            {
                str += data.eq(i).html();
            }
            res.send(str);
        }
    });
});

app.get('/w-photos',function (req,res) {

    var url ="http://www.espncricinfo.com/women/content/image/index.html?object=207455";
    request(url, function(error, response, html) {

        var $ = cheerio.load(html);
        if(!error)
        {
            var data = $(".img-thumbnails").html();
            res.send(data);
        }
    });
});


app.get('/w-rankings',function (req,res) {

    var url ="http://www.espncricinfo.com/women/content/page/374213.html";
    request(url, function(error, response, html) {

        var $ = cheerio.load(html);
        if(!error)
        {
            var data = $(".pnl650M").html();
            res.send(data);
        }
    });
});



app.get('/w-results',function (req,res) {

   var url ="http://www.espncricinfo.com/icc-womens-championship-2014-16/engine/series/772563.html";
    request(url, function(error, response, html) {

        var $ = cheerio.load(html);
        if(!error)
        {
           // var data = $(".row").filter('.collapse').html();
            var data = $(".news-pannel").html();
            res.send(data);
        }
    });
});

app.get('/w-fixtures',function (req,res) {

    var url ="http://www.espncricinfo.com/women/content/match/fixtures.html?class=8;class=9;class=10;future=1";
    request(url, function(error, response, html) {

        var $ = cheerio.load(html);
        if(!error)
        {
            var data = $(".fixtures_list").filter('.clearfix').html();
            res.send(data);
        }
    });
});

app.get('/w-scores',function (req,res) {

    var url = req.query.url;
    request(url, function(error, response, html) {

        var $ = cheerio.load(html);
        if(!error)
        {
            var data = $("#full-scorecard").html();
            res.send(data);
        }
    });
});


app.post('/favourites', function (req, res) {

    dbhandler.searchFavourites(req.body.username, function (result) {

        res.send({favourites : result.favourites});

    });

});

app.listen(app.get('port'),function () {
    console.log("Server started and listening at port " + app.get('port'));
});

