const express = require("express");
const {
  sendFollowRequest,
  getPendingFollowRequests,
  getAcceptedFollowRequests,
  acceptFollowRequest,
  rejectFollowRequest,
} = require("./followController");

const router = express.Router();

router.post("/",       sendFollowRequest);
router.get("/pending", getPendingFollowRequests);
router.get("/accepted",getAcceptedFollowRequests);
router.put("/accept",  acceptFollowRequest);
router.put("/reject",  rejectFollowRequest);

module.exports = router;
