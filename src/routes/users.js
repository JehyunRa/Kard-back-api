const router = require("express").Router();

module.exports = db => {
  router.get("/users/:email", (request, response) => {
    db.query(
      `
      SELECT
        id,
        email,
        categories,
        favorites,
        name,
        age,
        gender
      FROM users
      WHERE email = $1::text
    `,
      [request.params.email]
    ).then(({ rows: user }) => {
      // console.log(user);
      response.json(user);
    });
  });

  router.put("/users", (request, response) => {

    const { email, categories, favorites, name, age, gender } = request.body;
    // console.log('recieved')
    // console.log('===')
    // console.log(email)
    // console.log(categories)
    // console.log(favorites)
    // console.log(name)
    // console.log(age)
    // console.log(gender)
    // console.log('===')

    // check if user exist in database
    db.query(
      `
      SELECT * FROM users WHERE email = $1::text
     `,
     [email]
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
          age = $4::integer,
          gender = $5::text
          WHERE email = $6::text
          `,
          [categories, favorites, name, age, gender, email]
        ).then(() => {
          // console.log('data saved')
          // console.log('===')
          // console.log('current data', result2)
          // console.log('===')
          response.json(`database: data for user ${email} updated`);
        }).catch(error => console.log(error));

        // if user doesn't exist in database
      } else {
        // console.log('result length === 0')
        // console.log(result)
        // console.log('===')
        db.query(
          `
          INSERT INTO users (email, categories, favorites, name, age, gender)
            VALUES ($1::text, $2::json, $3::json, $4::text, $5::integer, $6::text)
          `,
          [email, categories, favorites, name, age, gender]
        ).then(({ rows: result2 }) => {
          // console.log('data saved')
          // console.log('===')
          // console.log('current data', result2)
          // console.log('===')
          response.json(`database: data for user ${email} inserted`);
        }).catch(error => console.log(error));  
      }
    })
  
  });

  return router;
};
