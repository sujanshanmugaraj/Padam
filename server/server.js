const express = require("express")

const cors = require("cors")

require("dotenv").config()

const registerRoutes = require("./routes/registeration")

const app = express()

const bodyParser = require('body-parser');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const db = require("./db");
const {scrap_movie_name} = require("./scrap")
const {scrap_movie_info} = require("./scrap")
const {scrap_synopsis} = require("./scrap")
const {scrap_movie_img} = require("./scrap")
const {scrap_cast_and_crew} = require("./scrap");
const {scrap_movie_photos} = require("./scrap")
const {scrap_actor_info} = require("./castScrap");
const {scrap_ott} = require("./scrap");
const {scrap_search} = require("./scrap");
const { verify } = require("jsonwebtoken")
const { authorizeUser } = require("./middleware/authorize")
require("dotenv").config()
app.use(express.json()) //  Gets the value from the req.body
app.use(bodyParser.json());

const PORT = process.env.PORT || 5000

//Middleware
app.use(cors()) //Allows for multiple access from different sites

//Routes
app.post('/api/register', async (req, res) => {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (u_name, email, passwd) VALUES ($1, $2, $3) RETURNING *',
      [name, email, hashedPassword]
    );
    res.json({ user: result.rows[0] });
  });

app.get("/api/m/:movie_name",async (req,res)=>{
    const movie_name = req.params.movie_name;
    console.log(movie_name);
    let resp = await db.query(`select * from movie where m_id='${movie_name}'`);
    if(resp.rowCount===0){
        console.log("scrap")
        const mov= await scrap_movie_name(movie_name);
        const synop = await scrap_synopsis(movie_name);
        const poster =  await scrap_movie_img(movie_name);
        const info = await scrap_movie_info(movie_name);
        const images = await scrap_movie_photos(movie_name);
        const crew = await scrap_cast_and_crew(movie_name);
        const ott = await scrap_ott(movie_name);
        const s = await db.query("insert into movie(m_id,m_name,synopsis,poster,genre,original_language,director,producer,writer,release_date_theaters,runtime,distributor,production_co,aspect_ratio) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14) RETURNING *",[movie_name,mov,synop,poster,info.Genre,info.Original_Language,info.Director,info.Producer,info.Writer,info.Release_Date,info.Runtime,info.Distributor,info.Production_Co,info.Aspect_Ratio]);       
        for(const img of images){
            const b = await db.query("insert into movie_image(m_id,m_image) values($1,$2) RETURNING *",[movie_name,img.photo]);
        }
        for(const actor of crew){
            const c = await db.query("insert into crew(m_id,c_name,c_link,c_role) values($1,$2,$3,$4) RETURNING *",[movie_name,actor.actorName,actor.imageUrl,actor.characterName]);
        }
        for(const ot of ott){
            const o = await db.query("insert into ott(m_id,o_name,o_link) values($1,$2,$3) RETURNING *",[movie_name,ot.ottName,ot.ottLink]);   
        }
        res.json(s.rows[0])
    }
    else{
        console.log(resp.rowCount);
        res.json(resp.rows[0]);
    }
})

app.get("/api/search/:search_key", async (req,res) =>{
    const search_key =req.params.search_key;
    const s = await scrap_search(search_key);
    console.log(s);
    res.json(s);
})

app.get("/api/ott/:movie_name", async (req,res) => {
    const movie_name = req.params.movie_name;
    const ott = await scrap_ott(movie_name);
    const resp = await db.query(`SELECT * FROM ott WHERE m_id = $1`, [movie_name]);
    res.json(resp.rows);
})

app.get("/api/cast/:movie_name", async (req,res) => {
    const movie_name = req.params.movie_name;
    const ott = await scrap_cast_and_crew(movie_name);
    const resp = await db.query(`SELECT * FROM crew WHERE m_id = $1`, [movie_name]);
    res.json(resp.rows);
})

app.get("/api/photos/:movie_name", async (req,res) => {
    const movie_name = req.params.movie_name;
    const photos = await scrap_movie_photos(movie_name);
    const resp = await db.query(`SELECT * FROM movie_image WHERE m_id = $1`, [movie_name]);
    res.json(resp.rows);
})

app.get("/api/reviews/:movie_name", async (req, res) => {
    const movie_name = req.params.movie_name;
    const resp = await db.query(`SELECT review,user_name FROM user_review  join users on users.user_id=user_review.user_id WHERE m_id = $1`, [movie_name]);
    // const reviews = resp.rows.map(row => [{review:row.review,user_id:row.user_id}]);
    res.json(resp.rows);
});

app.post("/api/reviews/:movie_name", async (req, res) => {
    const movie_name = req.params.movie_name;
    const { review,jwt } = req.body;
    console.log(jwt);
    const user_id = await authorizeUser(jwt);
    // console.log(user_id);
    const resp = await db.query("INSERT INTO user_review (m_id, review,user_id) VALUES ($1, $2,$3) RETURNING *", [movie_name, review,user_id]);
    res.json({ message: "Review added successfully" });
});

app.use("/auth", registerRoutes)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})