CREATE DATABASE fresh;
\c fresh
drop table if EXISTS USER_REVIEW;
drop table if EXISTS WATCH;
drop table if EXISTS ACTS;
drop table if EXISTS MOVIE_IMAGE;
drop table if EXISTS USERs;
drop table if EXISTS OTT_NAME;
drop table if EXISTS CREW_IMAGE;
drop table if EXISTS CREW_NAME;
drop table if EXISTS CREW;
drop table if EXISTS OTT;
drop table if EXISTS ACTOR;
drop table if EXISTS MOVIE;
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE TABLE IF NOT EXISTS MOVIE(
    m_id text PRIMARY KEY,
    m_name varchar(255),
    synopsis text,
    poster text,
    genre text,
    original_language text,  
    director text,
    producer text,
    writer text,
    release_date_theaters text,
    runtime text,
    distributor text,
    production_co text,
    aspect_ratio text
);

CREATE TABLE IF NOT EXISTS MOVIE_IMAGE
(
    img_id SERIAL PRIMARY KEY,
    m_id TEXT ,
    FOREIGN KEY (m_id) REFERENCES MOVIE (m_id),
    m_image TEXT

);




CREATE TABLE IF NOT EXISTS CREW(
    m_id text ,
    FOREIGN KEY (m_id) REFERENCES MOVIE (m_id),
    c_id SERIAL Primary Key,
    c_name text,
    c_link text,
    c_role text
 
); 

CREATE TABLE IF NOT EXISTS OTT(
    m_id text,
    FOREIGN KEY (m_id) REFERENCES MOVIE (m_id),
    o_id SERIAL PRIMARY KEY,
    o_name Text ,
    o_link Text 
);


CREATE TABLE IF NOT EXISTS WATCH(

     m_id TEXT ,
     FOREIGN KEY (m_id) REFERENCES MOVIE (m_id),
     o_id INT,
     Foreign Key (o_id) REFERENCES OTT(o_id),
     Primary Key(m_id,o_id)


);

CREATE TABLE IF NOT EXISTS users (
    user_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_name VARCHAR(255) NOT NULL,
    user_email VARCHAR(255) NOT NULL,
    user_password VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS USER_REVIEW(
    r_id SERIAL PRIMARY KEY,
    m_id TEXT ,
    FOREIGN KEY (m_id) REFERENCES MOVIE (m_id),
    user_id uuid,
    FOREIGN KEY (user_id) REFERENCES USERS(user_id),
    review TEXT
);

CREATE TABLE IF NOT EXISTS review_log (
    log_id SERIAL PRIMARY KEY,
    m_id TEXT NOT NULL,
    user_id UUID NOT NULL,
    review_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE OR REPLACE FUNCTION log_review()
RETURNS TRIGGER AS $$
BEGIN
    -- Insert a log entry when a review is added
    INSERT INTO review_log (m_id, user_id, review_date)
    VALUES (NEW.m_id, NEW.user_id, CURRENT_TIMESTAMP);
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER review_added
AFTER INSERT ON USER_REVIEW
FOR EACH ROW
EXECUTE FUNCTION log_review();


\d