const client = require("./client");

async function getRoutineActivityById(id) {
  const {
    rows: [activity],
  } = await client.query(`
      SELECT *
      FROM routine_activities
      WHERE id=${id}
    `);
  return activity;
}

async function addActivityToRoutine({
  routineId,
  activityId,
  count,
  duration,
}) {
  const {
    rows: [activity],
  } = await client.query(
    `
  INSERT INTO routine_activities("routineId", "activityId", count, duration) 
  VALUES($1, $2, $3, $4) 
   RETURNING *;
`,
    [routineId, activityId, count, duration]
  );

  return activity;
}

async function getRoutineActivitiesByRoutine({ id }) {
  const { rows } = await client.query(`
  SELECT * 
  FROM routine_activities
  WHERE "routineId"=${id};
`);

  return rows;
}

async function updateRoutineActivity({ id, ...fields }) {
  const setString = Object.keys(fields)
    .map((key, index) => `"${key}"=$${index + 1}`)
    .join(", ");

  if (setString.length === 0) {
    return;
  }
  const {
    rows: [user],
  } = await client.query(
    `
  UPDATE routine_activities
  SET ${setString}
  WHERE id=${id}
  RETURNING *;
`,
    Object.values(fields)
  );

  return user;
}

async function destroyRoutineActivity(id) {
  try {
    console.log("Deleting Routine Activities!");
    const {
      rows: [routine],
    } = await client.query(`
    DELETE FROM routine_activities
    WHERE id=${id}
    RETURNING *;
    `);
    console.log("Routine Activity Deleted!");
    return routine;
  } catch (error) {
    console.log(error);
  }
}

async function canEditRoutineActivity(routineActivityId, userId) {
  const {
    rows: [routineActivity],
  } = await client.query(
    `
  SELECT *
  FROM routine_activities
 
  WHERE id=$1;
`,
    [routineActivityId]
  );

  const {
    rows: [routine],
  } = await client.query(
    `
SELECT *
FROM routines
WHERE id=$1;
`,
    [routineActivity.routineId]
  );

  if (userId === routine.creatorId) {
    return true;
  }
  return false;
}

module.exports = {
  getRoutineActivityById,
  addActivityToRoutine,
  getRoutineActivitiesByRoutine,
  updateRoutineActivity,
  destroyRoutineActivity,
  canEditRoutineActivity,
};
