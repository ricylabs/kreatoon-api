const User = require('../model/User');

const editRole = async (req, res) => {
    const { role } = req.body;
    if(role !== 'reader' || role !== 'creator' || role !== 'endorser') res.send('invalid role');
    const { _id } = req.user;
    const updatedUser = await User.updateOne({_id}, {role});
    res.send(updatedUser);
} 

module.exports = { editRole };