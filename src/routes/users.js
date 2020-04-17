const router = require("express").Router();

module.exports = db => {
  router.get("/users/:name", (request, response) => {
    db.query(
      `
      SELECT
        id,
        name,
        categories,
        favorites
      FROM users
      WHERE name = $1::text
    `,
      [request.params.name]
    ).then(({ rows: user }) => {
      console.log(user);
      response.json(user);
    });
  });

  router.put("/users/:name", (request, response) => {

    const { name, categories, favorites } = request.body;

    // check if user exist in database
    db.query(
      `
      SELECT * FROM users WHERE name = $1::text
     `,
     [request.params.name]
    )
    .then(({ rows: result }) => {

      // if user exist in database
      if (result.length !== 0) {
        db.query(
          `
          UPDATE users SET 
          categories = $1::json,
          favorites = $2::json,
          WHERE name = $3::text
          `,
          [categories, favorites, name]
        ).then(() => {
          response.json(`database: data for user ${name} updated`);
        }).catch(error => console.log(error));

        // if user doesn't exist in database
      } else {
        db.query(
          `
          INSERT INTO budget (name, categories, favorites)
            VALUES ($1::text, $2::json, $3::json)
          `,
          [name, categories, favorites]
        ).then(() => {
          response.json(`database: data for user ${name} inserted`);
        }).catch(error => console.log(error));  
      }
    })
  
  });

  return router;
};
