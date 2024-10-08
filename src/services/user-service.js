const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const UserRepository = require('../repository/user-repository');

const {JWT_KEY}= require('../config/serverConfig');
const AppErrors = require('../utils/error-handler');


class UserService{
    constructor(){
        this.userRepository = new UserRepository();
    }

    async create(data){
        try {
            const user = await this.userRepository.create(data);
            return user;
        } catch (error) {
            if(error.name=='ValidationError'){
                throw error;
            }
            console.log("something went wrong in service layer");
            throw error;
        }
    }

    async signIn(email,plainPassword){
        try {
            //step1 -> fetching user using email
            const user = await this.userRepository.getByEmail(email);
            //step2 -> compare plain password with encrypted password
            const passwordsMatch = this.checkPassword(plainPassword,user.password);
            if(!passwordsMatch){
                console.log("password doesn't match");
                throw {error: 'Incorrect password'};
            }
            //step3 -> if passwords match then create a token and send it to the user
            const newJWT = this.createToken({email:user.email,id:user.id});
            return newJWT;
        } catch (error) {
            if(error.name=='AttributeNotFound'){
                throw error;
            }
            console.log("something went wrong in sign in process");
            throw error;
        }
    }

    async isAuthenticated(token){
        try {
            const isTokenVerified = this.verifyToken(token);
            if(!isTokenVerified){
                throw{error: 'Invalid token'};
            }
            const user = this.userRepository.getById(response.id);
            if(!user){
                throw{error:"No user with the coresponding token exists"};
            }
            return user.id;
        } catch (error) {
            console.log("something wnet wrong in auth process");
            throw error;
        }
    }

    createToken(user) {
        try {
            const result = jwt.sign(user,JWT_KEY,{expiresIn:'1h'});
            return result;
        } catch (error) {
            console.log("something wnet wrong in token creation");
            throw error;
        }
    }

    verifyToken(token){
        try {
            const response = jwt.verify(token,JWT_KEY);
            return response;
        } catch (error) {
            console.log("something wnet wrong in token validation",error);
            throw error;
        }
    }

    checkPassword(userInputPlainPassword,encryptedPassword){
        try {
            return bcrypt.compareSync(userInputPlainPassword,encryptedPassword);
        } catch (error) {
            console.log("something went wrong in password comparision");
            throw error;
        }
    }

    isAdmin(userId){
        try {
            return this.userRepository.isAdmin(userId);
        } catch (error) {
            console.log("something went wrong in service layer");
            throw error;
        }
    }
}
module.exports = UserService;