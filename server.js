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


    // console.log("Inside Get Favourites in server");
    dbhandler.searchFavourites(req.body.username, function (result) {



        // console.log("Sending Result");
        // console.log(result);
        res.send({fav : result});


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


app.get('/featured',function (req,res) {

    var url = "https://cricket.yahoo.com/news";
    request(url, function(error, response, html) {

        var $ = cheerio.load(html);

        if(!error)
        {

            var data = $("#mediablistmixedlpcatemp").html();
            res.send(data);
        }
    });

});

app.get('/interview1',function (req,res) {

    var url = "https://cricket.yahoo.com/blogs/yahoo-cricket-interviews";
    request(url, function(error, response, html) {

        var $ = cheerio.load(html);

        if(!error)
        {

            var data = $("#mediablogindex").html();
            res.send(data);
        }
    });

});


app.get('/interview2',function (req,res) {

    var url = "https://cricket.yahoo.com/blogs/yahoo-cricket-interviews/?page=2";
    request(url, function(error, response, html) {

        var $ = cheerio.load(html);

        if(!error)
        {

            var data = $("#mediablogindex").html();
            res.send(data);
        }
    });

});
app.get('/interview3',function (req,res) {

    var url = "https://cricket.yahoo.com/blogs/yahoo-cricket-interviews/?page=3";
    request(url, function(error, response, html) {

        var $ = cheerio.load(html);

        if(!error)
        {

            var data = $("#mediablogindex").html();
            res.send(data);
        }
    });

});

app.get('/interview4',function (req,res) {

    var url = "https://cricket.yahoo.com/blogs/yahoo-cricket-interviews/?page=4";
    request(url, function(error, response, html) {

        var $ = cheerio.load(html);

        if(!error)
        {

            var data = $("#mediablogindex").html();
            res.send(data);
        }
    });

});
app.get('/interview5',function (req,res) {

    var url = "https://cricket.yahoo.com/blogs/yahoo-cricket-interviews/?page=5";
    request(url, function(error, response, html) {

        var $ = cheerio.load(html);

        if(!error)
        {

            var data = $("#mediablogindex").html();
            res.send(data);
        }
    });

});
app.get('/interview6',function (req,res) {

    var url = "https://cricket.yahoo.com/blogs/yahoo-cricket-interviews/?page=6";
    request(url, function(error, response, html) {

        var $ = cheerio.load(html);

        if(!error)
        {

            var data = $("#mediablogindex").html();
            res.send(data);
        }
    });

});
app.get('/interview7',function (req,res) {

    var url = "https://cricket.yahoo.com/blogs/yahoo-cricket-interviews/?page=7";
    request(url, function(error, response, html) {

        var $ = cheerio.load(html);

        if(!error)
        {

            var data = $("#mediablogindex").html();
            res.send(data);
        }
    });

});
app.get('/interview8',function (req,res) {

    var url = "https://cricket.yahoo.com/blogs/yahoo-cricket-interviews/?page=8";
    request(url, function(error, response, html) {

        var $ = cheerio.load(html);

        if(!error)
        {
            var data = $("#mediablogindex").html();
            res.send(data);
        }
    });

});
app.get('/interview9',function (req,res) {

    var url = "https://cricket.yahoo.com/blogs/yahoo-cricket-interviews/?page=9";
    request(url, function(error, response, html) {

        var $ = cheerio.load(html);

        if(!error)
        {

            var data = $("#mediablogindex").html();
            res.send(data);
        }
    });

});

app.get('/interview10',function (req,res) {

    var url = "https://cricket.yahoo.com/blogs/yahoo-cricket-interviews/?page=10";
    request(url, function(error, response, html) {

        var $ = cheerio.load(html);

        if(!error)
        {

            var data = $("#mediablogindex").html();
            res.send(data);
        }
    });

});

app.get('/hl1',function (req,res) {

    var url = "http://indianexpress.com/section/sports/cricket";
    request(url, function(error, response, html) {

        var $ = cheerio.load(html);

        if(!error)
        {

            var data = $(".nation").html();
            res.send(data);
        }
    });

});


app.get('/hl2',function (req,res) {

    var url = "http://indianexpress.com/section/sports/cricket/psge/2";
    request(url, function(error, response, html) {

        var $ = cheerio.load(html);

        if(!error)
        {
            var data = $(".nation").html();
            res.send(data);
        }
    });

});

app.get('/hl3',function (req,res) {

    var url = "http://indianexpress.com/section/sports/cricket/page/3";
    request(url, function(error, response, html) {

        var $ = cheerio.load(html);

        if(!error)
        {
            var data = $(".nation").html();
            res.send(data);
        }
    });

});

app.get('/hl4',function (req,res) {

    var url = "http://indianexpress.com/section/sports/cricket/page/4";
    request(url, function(error, response, html) {

        var $ = cheerio.load(html);

        if(!error)
        {
            var data = $(".nation").html();
            res.send(data);
        }
    });

});

app.get('/hl5',function (req,res) {

    var url = "http://indianexpress.com/section/sports/cricket/page/5";
    request(url, function(error, response, html) {

        var $ = cheerio.load(html);

        if(!error)
        {
            var data = $(".nation").html();
            res.send(data);
        }
    });

});

app.get('/hl6',function (req,res) {

    var url = "http://indianexpress.com/section/sports/cricket/page/6";
    request(url, function(error, response, html) {

        var $ = cheerio.load(html);

        if(!error)
        {
            var data = $(".nation").html();
            res.send(data);
        }
    });

});

app.get('/hl7',function (req,res) {

    var url = "http://indianexpress.com/section/sports/cricket/page/7";
    request(url, function(error, response, html) {

        var $ = cheerio.load(html);

        if(!error)
        {
            var data = $(".nation").html();
            res.send(data);
        }
    });

});

app.get('/hl8',function (req,res) {

    var url = "http://indianexpress.com/section/sports/cricket/page/8";
    request(url, function(error, response, html) {

        var $ = cheerio.load(html);

        if(!error)
        {
            var data = $(".nation").html();
            res.send(data);
        }
    });

});

app.get('/hl9',function (req,res) {

    var url = "http://indianexpress.com/section/sports/cricket/page/9";
    request(url, function(error, response, html) {

        var $ = cheerio.load(html);

        if(!error)
        {
            var data = $(".nation").html();
            res.send(data);
        }
    });

});


app.get('/hl10',function (req,res) {

    var url = "http://indianexpress.com/section/sports/cricket/page/10";
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

})
app.get('/test1',function (req,res) {

    var url = "https://cricket.yahoo.com/matches/schedule/test-match";
    upcoming_records(url,function (result) {
        res.send(result);
    });
});

app.get('/test2',function (req,res) {

    var url = "https://cricket.yahoo.com/matches/schedule/test-match/page_2";
    upcoming_records(url,function (result) {
        res.send(result);
    });

});
app.get('/test3',function (req,res) {

    var url = "https://cricket.yahoo.com/matches/schedule/test-match/page_3";
    upcoming_records(url,function (result) {
        res.send(result);
    });

});

app.get('/test4',function (req,res) {

    var url = "https://cricket.yahoo.com/matches/schedule/test-match/page_4";
    upcoming_records(url,function (result) {
        res.send(result);
    });

});

app.get('/odi1',function (req,res) {

    var url = "https://cricket.yahoo.com/matches/schedule/odi-match";
    upcoming_records(url,function (result) {
        res.send(result);
    });


});

app.get('/odi2',function (req,res) {

    var url = "https://cricket.yahoo.com/matches/schedule/odi-match/page_2";
    upcoming_records(url,function (result) {
        res.send(result);
    });


});
app.get('/odi3',function (req,res) {

    var url = "https://cricket.yahoo.com/matches/schedule/odi-match/page_3";
    upcoming_records(url,function (result) {
        res.send(result);
    });


});
app.get('/odi4',function (req,res) {

    var url = "https://cricket.yahoo.com/matches/schedule/odi-match/page_4";
    upcoming_records(url,function (result) {
        res.send(result);
    });


});

app.get('/odi5',function (req,res) {

    var url = "https://cricket.yahoo.com/matches/schedule/odi-match/page_5";
    upcoming_records(url,function (result) {
        res.send(result);
    });


});


app.get('/t201',function (req,res) {

    var url = "https://cricket.yahoo.com/matches/schedule/twenty20-match";
    upcoming_records(url,function (result) {
        res.send(result);
    });

});

app.get('/t202',function (req,res) {

    var url = "https://cricket.yahoo.com/matches/schedule/twenty20-match/page_2";
    upcoming_records(url,function (result) {
        res.send(result);
    });


});

app.get('/t203',function (req,res) {


    var url = "https://cricket.yahoo.com/matches/schedule/twenty20-match/page_3";
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



app.post('/favourites', function (req, res) {

    dbhandler.searchFavourites(req.body.username, function (result) {

        // console.log("Searched All Favourites");
        res.send({favourites : result.favourites});

    });

});


app.listen(app.get('port'),function () {

    console.log("Server started and listening at port " + app.get('port'));
});

