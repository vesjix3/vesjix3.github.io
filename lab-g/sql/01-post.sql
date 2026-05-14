create table post
(
    id      integer not null
        constraint post_pk
            primary key autoincrement,
    subject text not null,
    content text not null
);

create table book
(
    id          integer not null
        constraint book_pk
            primary key autoincrement,
    title       text not null,
    author      text not null,
    description text not null
);

