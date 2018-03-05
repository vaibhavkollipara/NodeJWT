var express = require("express");
var bodyparser = require('body-parser');
var jwt = require("jsonwebtoken");

var app = express();

const secretKey = "somesecretkey";

app.use(bodyparser.json());

//verify token middleware
let verifyToken = (req,res,next)=>{
    const bearerHeader = req.headers['authorization'];
    if(typeof bearerHeader != 'undefined'){
        const bearer = bearerHeader.split(" ");
        const token = bearer[1];
        jwt.verify(token,secretKey,(err,authData) => {
            if(err){
                res.status(403).json({error : "Invalid Token"});
            }else{
                req.user = authData;
                next();
            }
        });
    }else{
        res.sendStatus(403);
    }
}

app.get('/api', verifyToken, (req,res)=>{
    res.json({
        message : 'Hello authorized user.',
    });
});

app.post('/login', (req,res) =>{
    let user = {
        id: 1,
        username : 'user1',
        password : 'password',
        email : 'user@jwt.com'
    };
    if(req.body.username === user.username && req.body.password === user.password){
        jwt.sign({user},secretKey, (err,token)=>{
            res.json({
                token: token
            });
        });
    }else{
        res.json({
            Error : "Invalid Credentials"
        });
    }
});

app.listen(3000, ()=>{
    console.log("Server running at port 3000");
});
