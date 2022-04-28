CREATE DATABASE bdegueu;

CREATE TABLE polyuser(
    polyuser_id SERIAL PRIMARY KEY,
    polyuser_name VARCHAR(255) NOT NULL,
    polyuser_role VARCHAR(255) NOT NULL DEFAULT 'basic',
    polyuser_mail VARCHAR(255) UNIQUE NOT NULL,
    polyuser_password VARCHAR(255) NOT NULL,
    polyuser_description VARCHAR(500) NOT NULL DEFAULT 'pas de description'
);

CREATE TABLE goodies(
    goodies_id SERIAL PRIMARY KEY,
    goodies_name VARCHAR(255) NOT NULL,
    goodies_pic VARCHAR(500) NOT NULL,
    goodies_price INT
);

CREATE TABLE evt(
    evt_id SERIAL PRIMARY KEY,
    evt_pic VARCHAR(500) NOT NULL,
    evt_name VARCHAR(255) NOT NULL,
    evt_city VARCHAR(255) NOT NULL,
    evt_date VARCHAR(255) NOT NULL,
    evt_description VARCHAR(5000) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE article(
    article_id SERIAL PRIMARY KEY,
    article_name VARCHAR(255) NOT NULL,
    article_type VARCHAR(255) NOT NULL,
    article_pic VARCHAR(500) NOT NULL,
    article_description VARCHAR(5000) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    article_likes INT NOT NULL DEFAULT 0,
    article_dislikes INT NOT NULL DEFAULT 0
);

CREATE TABLE comment(
    comment_id SERIAL PRIMARY KEY,
    comment_description VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    comment_likes INT NOT NULL DEFAULT 0,
    comment_dislikes INT NOT NULL DEFAULT 0,
    comment_article INT NOT NULL,
    comment_polyuser INT NOT NULL,
    FOREIGN KEY (comment_article) REFERENCES article(article_id) ON DELETE CASCADE,
    FOREIGN KEY (comment_polyuser) REFERENCES polyuser(polyuser_id)
);

CREATE TABLE likes_comment(
    likes_id SERIAL PRIMARY KEY,
    likes_liked BOOLEAN NOT NULL,
    likes_polyuser INT NOT NULL,
    likes_comment INT NOT NULL,
    FOREIGN KEY (likes_polyuser) REFERENCES polyuser(polyuser_id),
    FOREIGN KEY (likes_comment) REFERENCES comment(comment_id) ON DELETE CASCADE
);

CREATE TABLE likes_article(
    likes_id SERIAL PRIMARY KEY,
    likes_liked BOOLEAN NOT NULL,
    likes_polyuser INT NOT NULL,
    likes_article INT NOT NULL,
    FOREIGN KEY (likes_polyuser) REFERENCES polyuser(polyuser_id),
    FOREIGN KEY (likes_article) REFERENCES article(article_id) ON DELETE CASCADE
);