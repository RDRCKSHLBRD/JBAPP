const express = require('express');
const {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
} = require('../queries/users');

const router = express.Router();

router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.post('/signup', createUser); // Signup route
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;
