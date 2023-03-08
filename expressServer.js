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
app.get('/faction/:id/chars', (req,res, next)=>{
    console.log(req.method);
    const typeId = parseInt(req.params.id);
    // Checks to see if the (/:id) is a valid number
    if (Number.isNaN(typeId)){
        console.log('Error Invalid Path Name')
        return res.status(404).send('Error Invalid Path Name')
    } else {
        console.log(`Request for chars with faction_id: ${typeId}`)
        pool.query('SELECT * FROM character WHERE faction_id = $1;', [typeId], (err, result)=>{
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

// GET request: Returns info to client for a specific character (/chars/:charid/) with a faction type (/npctype/:id/)
app.get('/faction/:id/chars/:charid', (req,res, next)=>{
    console.log(req.method);
    const typeId = parseInt(req.params.id);
    const charId = parseInt(req.params.charid);
    // Checks to see if (/:id) and (/:charid) are valid numbers
    if (Number.isNaN(typeId) || Number.isNaN(charId)){
        console.log('Error Invalid Path Name')
        return res.status(404).send('Error Invalid Path Name')
    } else {
        console.log(`Request for chars with faction_id: ${typeId} and char_id: ${charId}`)
        pool.query('SELECT * FROM character WHERE faction_id = $1 AND id = $2;', [typeId, charId], (err, result)=>{
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

// POST request: Takes in request body and creates an entry into character table with associated key from faction table (/:id/)
app.post('/faction/:id/chars', (req, res, next)=>{
    console.log(req.method);
    const { name, race, clas, factionId } = req.body;
    console.log(req.body);
    // checks for missing information in request and if the hitPoints block is a number
    if (!name || !race || !clas || !factionId) {
        console.log('Error: Input incorrect or missing information');
        return res.status(400).send('Error: Input missing or corrected information');
    } else {
        pool.query('INSERT INTO character (name, race, class, faction_id) VALUES ($1, $2, $3, $4) RETURNING *;',
        [name, race, clas, factionId], (err, result)=>{
            if (err){
                return next(err);
            }
            let charInfo = result.rows[0];
            console.log('Added: ' + name);
            res.status(200).send(charInfo);
        })
    } 
})

// PATCH request: Takes in request body and modifies an entry in the npc_char table (/chars/:charid/)
app.patch('/faction/:id/chars/:charid', (req,res, next)=>{
    console.log(req.method);
    const typeId = parseInt(req.params.id);
    const charId = parseInt(req.params.charid);
    // Checks to see if (/:id) and (/:charid) are valid numbers
    if (Number.isNaN(typeId) || Number.isNaN(charId)){
        console.log('Error Invalid Path Name')
        return res.status(404).send('Error Invalid Path Name')
    }
    const { name, race, clas, factionId } = req.body;
    // Checks if the character exists in the table
    pool.query('SELECT * FROM character WHERE id = $1 and faction_id = $2;', [charId, typeId], (err, result)=>{
        console.log(`Request to update char with faction_id: ${typeId} and char_id: ${charId}`)
        let info = result.rows[0];
        if (err){
            next(err);
        }
        if (info){
            // Returns notification if character is successfully updated
            if (name){
                pool.query('UPDATE character SET name = $1 WHERE id = $2;', [name, charId], (err, result)=>{
                    console.log(`Character name updated: ${name}`);
                });
            }
            if (race){
                pool.query('UPDATE character SET race = $1 WHERE id = $2;', [race, charId], (err, result)=>{
                    console.log(`Character race updated: ${race}`);
                });
            }
            if (clas){
                pool.query('UPDATE character SET class = $1 WHERE id = $2;', [clas, charId], (err, result)=>{
                    console.log(`Character class updated: ${clas}`);
                });
            }
            if (factionId){
                pool.query('UPDATE character SET faction_id = $1 WHERE id = $2;', [factionId, charId], (err, result)=>{
                    console.log(`Character npc type updated: ${factionId}`);
                });
            }
            return res.status(200).send('Character Updated');
        } else {
            // Returns not found if (/:id/ or /:charid/) doesn't match up
            console.log('Error Not Found');
            return res.status(404).send('Error Not Found');
        }
    });  
})

// DELETE request: Deletes a character (/:charid/) from the database and responds to client with deleted info
app.delete('/faction/:id/chars/:charid', (req,res, next)=>{
    console.log(req.method);
    const charId = parseInt(req.params.charid);
    // Checks to see if (/:id) and (/:charid) are valid numbers
    if (Number.isNaN(charId)) {
        console.log('Error Invalid Path Name');
        return res.status(404).send('Error Invalid Path Name');
    } else {
        pool.query('DELETE FROM character WHERE id = $1 RETURNING *;', [charId], (err, result)=>{
            if (err){
                return next(err);
            }
            let delChar = result.rows[0];
            // Checks if character was in the database and responds
            if (delChar){
                console.log(delChar);
                res.status(200).send(delChar);
            } else {
                console.log('Character not found');
                res.status(404).send('Error Not Found');
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