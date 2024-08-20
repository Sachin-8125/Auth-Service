const express = require('express');
const bodyParser = require('body-parser');

const {PORT} = require('./config/serverConfig');
const apiRoutes = require('./routes/index');

const db = require('./models/index');

// const UserRepository = require('./repository/user-repository');
// const UserService = require('./services/user-service');

const app = express();

const prepareAndStartServer = ()=> {
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended:true}));
    
    app.use('/api',apiRoutes);
    app.listen(PORT,()=> {
        console.log(`Server started on PORT: ${PORT}`);
        if(process.env.DB_SYNC){
            db.sequelize.sync({alter: true});
        }
        // const service = new UserService();
        // const newToken = service.createToken({email:'sachin2317080@gmail.com',id:1});
        // console.log("new token is ",newToken);
    });
}
prepareAndStartServer();