DROP TABLE IF EXISTS faction;
DROP TABLE IF EXISTS character;

CREATE TABLE  faction (
    id SERIAL PRIMARY KEY,
    name TEXT
);

CREATE TABLE character (
    id SERIAL PRIMARY KEY,
    name TEXT,
    race TEXT,
    class TEXT,
    faction_id INTEGER,
    CONSTRAINT FK_faction FOREIGN KEY (faction_id) REFERENCES faction(id) ON UPDATE CASCADE
);

INSERT INTO faction (name) VALUES ('Space Marines');
INSERT INTO faction (name) VALUES ('Adeptus Sororitas');
INSERT INTO faction (name) VALUES ('Astra Militarum');
INSERT INTO faction (name) VALUES ('Inquisition');

INSERT INTO character (name, race, class, faction_id) VALUES ('Alaric', 'Primaris Astartes', 'Vanguard', 1);
INSERT INTO character (name, race, class, faction_id) VALUES ('Selona', 'Human', 'Sister of Battle', 2);
INSERT INTO character (name, race, class, faction_id) VALUES ('Sgt Reinar', 'Human', 'Tempestus Scion', 3);
INSERT INTO character (name, race, class, faction_id) VALUES ('Benoir', 'Human', 'Inquisitor', 4);