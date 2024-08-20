const validateUserAuth = (req,res,next) => {
    if(!res.body.email || !req.body.password){
        return res.status(400).json({
            success: false,
            data: {},
            message:'Something went wrong',
            err: 'Email or password missing in the request'
        })
    }
    next();
}

const valiadateIsAdminRequest = (req,res,next)=>{
    if(!req.body.id){
        return res.status(400).json({
            success: false,
            data:{},
            err: 'user id not given',
            message:'Something went wrong'
        })
    }
    next();
}
module.exports = {
    validateUserAuth,
    valiadateIsAdminRequest
}