const router = require('express').Router();
const Users = require('./users-model.js');

router.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
      const user = await Users.findById(id);
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Error retrieving user" });
    }
  });

  module.exports = router;
