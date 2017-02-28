var express = require('express');
var path = require('path');
var _ = require('underscore');
var mongoose = require('mongoose');
var Movie = require('./models/movie')
var serveStatic = require('serve-static');
var bodyParser = require('body-parser');
var port = process.env.PORT || 3000;
var app = express();
mongoose.Promise = require('bluebird');
mongoose.connect('mongodb://localhost:27017/imooc');

app.set('views','./views/pages');
app.set('view engine','jade');
app.use(bodyParser.json() );
app.use(bodyParser.urlencoded({extended: true}));
app.use(serveStatic('public'));
app.locals.moment = require('moment');
app.listen(port);
console.log('Setver is running at ' + port);

app.get('/',(req,res)=>{
  Movie.fetch(function(err,movies) {
    if(err){
      console.log(err);
    }
    res.render('index',{
      title:'MOMO 首页',
      movies:movies
    })
  })
})

app.get('/movie/:id',(req,res)=>{
  console.log('enter detail');
  var id = req.params.id;
  Movie.findById(id,function(err,movie) {
    if(err) {
      console.log(err);
    }
    res.render('detail',{
      title:'MOMO'+movie.title,
      movie:movie
    })
  })
})

app.get('/admin/update/:id',function(req,res) {
  var id = req.params.id;
  if(id){
    Movie.findById(id,function(err,movie) {
      res.render('admin',{
        title:"immoc 后台更新页",
        movie:movie
      })
    })
  }
})  

app.get('/admin/movie',(req,res)=>{
  console.log('enter admin');
  res.render('admin',{
      title:'MOMO 后台',
      movie:{
        doctor:'',
        country:'',
        title:'',
        year:'',
        poster:'',
        language:'',
        flash:'',
        summary:'',
      }
  })
})

//admin update
app.get('/admin/update/:id',function(req,res) {
  var id = req.params.id;
  if(id){
    Movie.findById(id,function(err,movie) {
      res.render('admin',{
        title:"immoc 后台更新页",
        movie:movie
      })
    })
  }
})

//admin post movie
app.post('/admin/movie/new',function(req,res) {
  console.log('enter post');
  var id = req.body.movie._id;
  var movieObj =req.body.movie;
  var _movie;
  if(id !== 'undefined'){
    Movie.findById(id,function(err,movie){
      if(err){
        console.log(err);
      }
      _movie = _.extend(movie,movieObj)
      _movie.save(function(err,movie) {
        if(err){
          console.log(err);
        }
        res.redirect('/movie/'+movie._id);
      })
    })
  }
  else{
    _movie = new Movie({
      doctor:movieObj.doctor,
      title:movieObj.title,
      country:movieObj.country,
      language:movieObj.language,
      year:movieObj.year,
      poster:movieObj.poster,
      summary:movieObj.summary,
      flash:movieObj.flash
    })
    _movie.save(function(err,movie) {
      if(err){
        console.log(err);
      }
      res.redirect('/movie/'+movie._id);
    })
  }
})

app.get('/admin/list',(req,res)=>{
  Movie.fetch(function(err,movies) {
    if(err){
      console.log(err);
    }
    res.render('list',{
      title:'MOMO 列表页',
      movies:movies
    })
  })
})

//list
app.delete('/admin/list',function(req,res) {
  var id = req.query.id;
  if(id) {
    Movie.remove({_id: id},function(err,movie) {
      if(err){
        console.log(err);
      }
      else{
        res.json({success: 1});
      }
    })
  }
})