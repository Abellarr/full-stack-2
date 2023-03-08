const express = require('express');
const app = express();
const fs = require('fs');
const { Pool } = require('pg');
const cors = require('cors');
const port = process.env.PORT || 3000;
app.use(express.json());
app.use(cors());

const pool = require('./connectDB.js');


// GET request: Returns info to client for all characters regardless of type
app.get('/faction/all/chars', (req,res, next)=>{
    console.log(req.method);
    console.log('Request for all chars')
    pool.query('SELECT * FROM character;', (err, result)=>{
        if (err){
            return next(err);
        }
        let rows = result.rows;
        res.status(200).send(rows);
    })
})

// GET request: Returns info to client for all characters with a specific type (/npctype/:id/)
app.get('/api/npctype/:id/chars', (req,res, next)=>{
    console.log(req.method);
    const typeId = parseInt(req.params.id);
    // Checks to see if the (/:id) is a valid number
    if (Number.isNaN(typeId)){
        console.log('Error Invalid Path Name')
        return res.status(404).send('Error Invalid Path Name')
    } else {
        console.log(`Request for chars with type_id: ${typeId}`)
        pool.query('SELECT * FROM npc_char WHERE type_id = $1;', [typeId], (err, result)=>{
            if (err){
                return next(err);
            }
            let chars = result.rows;
            // Checks if any chars are returned before responding
            if (chars[0]) {
                res.status(200).send(chars);
            } else {
                res.status(404).send('Error: Type not found')
            }
        })
    }
})

// GET request: Returns info to client for a specific character (/chars/:charid/) with a specific type (/npctype/:id/)
app.get('/api/npctype/:id/chars/:charid/', (req,res, next)=>{
    console.log(req.method);
    const typeId = parseInt(req.params.id);
    const charId = parseInt(req.params.charid);
    // Checks to see if (/:id) and (/:charid) are valid numbers
    if (Number.isNaN(typeId) || Number.isNaN(charId)){
        console.log('Error Invalid Path Name')
        return res.status(404).send('Error Invalid Path Name')
    } else {
        console.log(`Request for chars with type_id: ${typeId} and char_id: ${charId}`)
        pool.query('SELECT * FROM npc_char WHERE type_id = $1 AND id = $2;', [typeId, charId], (err, result)=>{
            if (err){
                return next(err);
            }
            let char = result.rows;
            // Checks if any chars are returned before responding
            if (char[0]) {
                res.status(200).send(char);
            } else {
                res.status(404).send('Error Not found')
            }
        })
    }
})

// Generic error handling for any internal next() errors encountered.
app.use((err,req,res,next)=>{
    console.log('Error sent to middleware')
    res.status(500).send('Internal Error');
})

// Sets my server to listen to the port variable, which is currently 3000
app.listen(port, ()=>{
    console.log(`Server is listening on ${port}`);
})