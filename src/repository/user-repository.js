const {User,Role} =require('../models/index');
const ClientError = require('../utils/client-error');
const ValidationError = require('../utils/validation-error');
const { StatusCodes } = require('http-status-codes');

class UserRepository{
    
    async create(data){
        try {
            const user = await User.create(data);
            return user;
        } catch (error) {
            if(error.name =='SequelizeValidationError'){
               throw new ValidationError(error);
            }
            console.log("Something went wrong in repository layer");
            throw error;
        }

    }

    async destroy(userId){
        try {
            const user = await User.destroy({
                where:{
                    id:userId
            }});
            return true;
        } catch (error) {
            console.log("Something went wrong in repository layer");
            throw error;
        }
    }

    async getById(userId){
        try {
            const user = await User.findByPk(userId,{
                attributes:['email','id',]
            });
            return user;
        } catch (error) {
            console.log("something went wrong at repository layer");
            throw error;
        }
    }

    async getByEmail(userId){
        try {
            const user = await User.findOne({wher:{
                email:userEmail
            }});
            if(!user){
                throw new ClientError(
                    'AttributeNotFound',
                    'Invalid email sent in the request',
                    'Please check email, as there is no record of the email',
                    StatusCodes.NOT_FOUND
                );
            }
            return user;
        } catch (error) {
            console.log("something went wrong at repository layer");
            throw error;
        }
    }

    async isAdmin(userId){
        try {
            const user = await User.findByPk(userId);
            const adminRole = await Role.find({
                where:{
                    name:'ADMIN'
                }
            });
            return user.hasRole(adminRole);
        } catch (error) {
            console.log("something went wrong at repository layer");
            throw error;
        }
    }

}

module.exports = UserRepository;