const express=require('express');
const { userAuth } = require('../middleware/Auth');
const { getComments, newComment } = require('../controllers/commentHandler');
const route=express.Router();

route.use(userAuth);

route.get('/:id',getComments);
route.post('/new',newComment);

module.exports=route;