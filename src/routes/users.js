const router = require("express").Router();

module.exports = db => {
  
  router.get("/kard/:nick", (request, response) => {

    db.query(
      `
      SELECT *
      FROM users
      WHERE nickname = $1::text
    `,
      [ request.params.nick ]
    ).then(({ rows: results }) => {
      // console.log(user);
      response.json(results);
    });
  });
  
  router.get("/users/:user_id", (request, response) => {
    db.query(
      `
      SELECT
        id,
        user_id,
        categories,
        favorites,
        name,
        email,
        age,
        gender,
        nickname
      FROM users
      WHERE user_id = $1::text
    `,
      [request.params.user_id]
    ).then(({ rows: user }) => {
      // console.log(user);
      response.json(user);
    });
  });

  router.put("/users", (request, response) => {

    const { user_id, categories, favorites, name, email, age, gender, nickname } = request.body;
    console.log('recieved')
    console.log('===')
    console.log(user_id)
    console.log(categories)
    console.log(favorites)
    console.log(name)
    console.log(age)
    console.log(gender)

    console.log('===')

    // check if user exist in database
    db.query(
      `
      SELECT * FROM users WHERE user_id = $1::text
     `,
     [user_id]
    )
    .then(({ rows: result1 }) => {

      // if user exist in database
      if (result1.length !== 0) {
        // console.log('result length !== 0')
        // console.log('previous data', result1)
        // console.log('===')
        db.query(
          `
          UPDATE users SET 
          categories = $1::json,
          favorites = $2::json,
          name = $3::text,
          email = $4::text,
          age = $5::integer,
          gender = $6::text,
          nickname= $8::text
          WHERE user_id = $7::text
          `,
          [categories, favorites, name, email, age, gender, user_id, nickname]
        ).then(({ rows: result2 }) => {
          console.log('data saved')
          console.log('===')
          console.log('current data', result2)
          console.log('===')
          response.json(`database: data for user ${user_id} updated`);
        }).catch(error => console.log(error));

        // if user doesn't exist in database
      } else {
        // console.log('result length === 0')
        // console.log(result)
        // console.log('===')
        db.query(
          `
          INSERT INTO users (user_id, categories, favorites, name, email, age, gender, nickname)
            VALUES ($1::text, $2::json, $3::json, $4::text, $5::text, $6::integer, $7::text, $8::text)
          `,
          [user_id, categories, favorites, name, email, age, gender, nickname]
        ).then(({ rows: result2 }) => {
          console.log('data saved')
          console.log('===')
          console.log('current data', result2)
          console.log('===')
          response.json(`database: data for user ${user_id} inserted`);
        }).catch(error => console.log(error));  
      }
    })
  
  });

  return router;
};
