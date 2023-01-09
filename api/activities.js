const express = require("express");
const router = express.Router();
const {
  getPublicRoutinesByActivity,
  getAllActivities,
  createActivity,
  getActivityByName,
  getActivityById,
  updateActivity,
} = require("../db");
const { requireUser } = require("./utils");
router.use((req, res, next) => {
  console.log("A request is being made to /activities");

  next(); 
});
// GET /api/activities/:activityId/routines
router.get('/:activityId/routines', async (req, res, next) => {
  
   const { activityId } = req.params;
   try {
     const routines  = await getPublicRoutinesByActivity({id:activityId})
     console.log("TESTING ROUTINES", routines)
   
    if(routines.length) {
     res.send(routines )
    } else {
      next({
        error:"ERROR",
        name: 'UnauthorizedError',
        message: `Activity ${activityId } not found`
      })
    }
     
   } catch ({ name, message }) {
     
       next({ name, message })
   } 
 });




// GET /api/activities
router.get("/", async (req, res, next) => {
  try {
    const allActivities = await getAllActivities();

    res.send(allActivities);
  } catch ({ description, id, name }) {
    next({ description, id, name });
  }
});
// POST /api/activities
router.post("/", requireUser, async (req, res, next) => {
  const { name, description } = req.body;

  try {
    const activitiy = await getActivityByName(name);

    if (activitiy) {
      res.send({
        error: "Error",
        message: `An activity with name ${name} already exists`,
        name: "Activities exist",
      });
    } else {
      console.log("new activity");
    }

    await createActivity({
      name,
      description,
    });

    res.send({
      message: "Activity Created",
      name,
      description,
    });
  } catch ({ name, message }) {
    next({ name, message });
  }
});

// PATCH /api/activities/:activityId
router.patch('/:activityId', requireUser, async (req, res, next) => {
  const { activityId } = req.params;
  const {name,description } = req.body;

  

 
 

  try {
    
      const activitiy = await getActivityByName(name);
     
      if (activitiy) {
       
        res.send({
        error:"Error",
        message: `An activity with name ${name} already exists`,
      name: 'Activities ex',
        });
      } else{
        console.log("new activity")
      }
    const originalActivity = await getActivityById(activityId);
console.log(originalActivity)
    if (originalActivity) {
      const updatedActivity = await updateActivity({id: activityId, name, description});
      res.send( updatedActivity )
    } else {
      next({
        name: 'UnauthorizedUserError',
        message:`Activity ${activityId} not found`,
        error: " Error can't edit "
      })
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});




module.exports = router;
