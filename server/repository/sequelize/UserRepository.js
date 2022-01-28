const User = require("../../model/sequelize/Person");
const Patient = require("../../model/sequelize/Patient");
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");


exports.signup = async (data) => {
    let { email, password } = data;

    if (password.length < 6 || password.length > 36)
        throw new Error('pwdLength');

    const salt = bcrypt.genSaltSync(8);
    password = bcrypt.hashSync(password, salt);

    const user = await User.create({ email: email, password: password});
    const patient = await Patient.create({ person_id: user.id });

    return {
        token: jwt.sign({ id: user.id, role: user.role }, process.env.SECRET, { expiresIn: 100_000_000 }),
        user: user,
        patient: patient
    };
}

exports.login = async (data) => {
    let { email, password } = data;
    const user = await User.findOne({ where: { email: email } });
    if (!user)
        throw new Error("emailNotFound")

    const valid = bcrypt.compareSync(password, user.password);
    if (!valid)
        throw new Error("pwdInvalid");
    
    const patient = await Patient.findOne({ where: { person_id: user.id } });
    console.log(patient);
    return {
        token: jwt.sign({ id: user.id, role: user.role }, process.env.SECRET, { expiresIn: 100_000_000 }),
        user: user,
        patient: patient
    };
}