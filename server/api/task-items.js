const router = require('express').Router()
const { TaskItem, Task } = require('../db/models')
module.exports = router

router.get('/:communityId', async (req, res, next) => {
  try {
    const communityId = req.params.communityId
    const taskItems = await TaskItem.findAll({
      where: {
        communityId
      }
    })
    res.json(taskItems)
  }
  catch (err) {
    console.log(err)
  }
})

router.put('/updateTask', async (req, res, next) => {
  try {
    const incomingTask = req.body
    const updatedTask = await TaskItem.update({incomingTask})
    res.json(updatedTask)
  }
  catch (err) {
    next(err)
  }
})

router.get('/', async (req, res, next) => {
  try {
    const tasks = await TaskItem.findAll()
    res.json(tasks)
  }
  catch (err) {
    next(err)
  }
})
