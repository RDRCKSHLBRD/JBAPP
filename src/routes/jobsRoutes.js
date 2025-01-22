const express = require('express');
const {
    getAllJobs,
    getJobById,
    createJob,
    updateJob,
    deleteJob,
} = require('../queries/jobs');

const router = express.Router();

router.get('/', getAllJobs);
router.get('/:id', getJobById);
router.post('/', createJob);
router.put('/:id', updateJob);
router.delete('/:id', deleteJob);

module.exports = router;
