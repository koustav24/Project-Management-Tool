const express=require('express');
const { userAuth } = require('../middleware/Auth');
const { getMyChats, getMsgs, getMyChatDetails, sendAttachMents } = require('../controllers/chatHandler');
const { multerUpload } = require('../middleware/multer');
const route=express.Router();


route.use(userAuth);

route.get('/myChats',getMyChats);
route.get('/message/:chatId',getMsgs);
route.get('/specficChat/:chatId',getMyChatDetails);

route.post('/message',multerUpload.array('AttachFiles',5),sendAttachMents);

module.exports=route