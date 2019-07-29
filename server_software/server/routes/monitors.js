const passport = require('passport');

const express = require("express");
const router = express.Router();
// // Load input validation
// const validateAddTeamInput = require("../validation/add_team");
// Load Team model
const MonitorGroup = require("../models/MonitorGroup");

const {routeBuffer} = require('../passport-config');//authenticate specific routes


//list all teams and data registered within the program
router.get("/list", (req, res) => {//TODO
  MonitorGroup.find({}, (err, teams) => {
    res.send(teams);
  });

});
//make everything a protected route. Only users with perms can perform operations here
router.use('/edit', (req, res, next) => {
  routeBuffer.push("editMonitors");
  next();
});
router.use('/edit', passport.authenticate('jwt', {session: false}));


router.post('/edit/delete', (req, res) => {
  const id = req.body.id;
  MonitorGroup.deleteOne({_id: id}).then(() => res.status(200).json({success: true})).catch(err => res.status(400).json(err));

});
router.post('/edit', (req, res) => {
  const query = req.body;
  console.log(query);
  MonitorGroup.updateOne({_id: query.id}, {
    $set: {
      [query.type]: query.value

    }
  }).then(() => res.status(200).json({success: true})).catch(err => res.status(400).json(err));


});
module.exports = router;
