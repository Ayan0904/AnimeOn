const express=require('express');
const app=express();
const bodyParser=require('body-parser');

const fetch=require("node-fetch");

app.use(bodyParser.urlencoded({extended:true}));

const https=require('https');
const { urlencoded } = require('body-parser');


app.use(express.static("public"));
//to use static files inside the browser .

app.set('view engine', 'ejs');

var animeList=[];
var temp=1;

app.get("/",(req,res)=>{
    if(temp==1){
        var url="https://api.jikan.moe/v3/search/anime?type=tv&status=airing";
        getAnime(url,res);
        temp++;
    }
    else{
        res.render("index",{animeList:animeList});
    }
});

app.post("/",(req,res)=>{
    // console.log(req.body);
    var animeName=req.body.animeName;
    var url="https://api.jikan.moe/v3/search/anime?q="+animeName+"&limit=18";
    getAnime(url,res);
});


app.get("/upcoming",(req,res)=>{
        var url="https://api.jikan.moe/v3/search/anime?type=tv&status=upcoming";
        getAnime(url,res);
});

app.get("/hentai",(req,res)=>{
    var url="https://api.jikan.moe/v3/search/anime?genre=hentai&rated=rx";
    getAnime(url,res);
});

app.get("/top",(req,res)=>{
    var url="https://api.jikan.moe/v3/top/anime";
    getTopAnime(url,res);
});

app.get("/summer",(req,res)=>{
    var url="https://api.jikan.moe/v3/season/2021/summer";
    getSummerAnime(url,res);
});




async function getSummerAnime(url,res){
    animeList=[];
    const response=await fetch(url);
    const data=await response.json();
    for(var i=0;i<data.anime.length;i++){
        let ani={
            "img_url":data.anime[i].image_url,
            "title":data.anime[i].title,
            "synopsis":data.anime[i].synopsis,
            "episodes":data.anime[i].episodes,
            "score":data.anime[i].score
        };
        animeList.push(ani);
    }
    if(temp==1){
        res.render("index",{animeList:animeList});
    }
    else{
        res.redirect("/");
    }
}




async function getTopAnime(url,res){
    animeList=[];
    const response=await fetch(url);
    const data=await response.json();
    for(var i=0;i<data.top.length;i++){
        let anime={
            "img_url":data.top[i].image_url,
            "title":data.top[i].title,
            "synopsis":data.top[i].synopsis,
            "episodes":data.top[i].episodes,
            "score":data.top[i].score
        };
        animeList.push(anime);
    }
    if(temp==1){
        res.render("index",{animeList:animeList});
    }
    else{
        res.redirect("/");
    }
}





async function getAnime(url,res){
    animeList=[];
    const response=await fetch(url);
    const data=await response.json();
    for(var i=0;i<data.results.length;i++){
        let anime={
            "img_url":data.results[i].image_url,
            "title":data.results[i].title,
            "synopsis":data.results[i].synopsis,
            "episodes":data.results[i].episodes,
            "score":data.results[i].score
        };
        animeList.push(anime);
    }
    if(temp==1){
        res.render("index",{animeList:animeList});
    }
    else{
        res.redirect("/");
    }
}

app.listen(process.env.PORT||3000,()=>{
    console.log("server running");
});