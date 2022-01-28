module.exports = async (err, req, res, next) => {
    const errors = [];
    console.log(err);

    if (err.errors) { 
        err.errors.forEach(e => errors.push(
            {
                path: e.path,
                message: e.message
            }
        ))
    }

    if (err.message === 'pwdLength') {
        errors.push({
            path: "password",
            message: err.message
        })
    }

    if (err.message === 'pwdInvalid')
        errors.push({
            path: "password",
            message: err.message
        });
    
    if (err.message === 'emailNotFound') {
        errors.push({
            path: "email",
            message: err.message
        })
    }
    

    res.status(500).json({
        message: 'Internal Server Error',
        errors: errors
    });

    next();
}