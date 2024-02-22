CREATE TABLE blogs (
  id SERIAL PRIMARY KEY,
  author text,
  url text NOT NULL,
  title text NOT NULL,
  likes integer DEFAULT 0
);

insert into blogs (author, url, title, likes) values ('Jimothy Timber', 'www.whodunit.com', 'Timber', 0);
insert into blogs (author, url, title, likes) values ('Robert Sargento', 'www.cheeselouise.com', 'Cheeseballs', 0);