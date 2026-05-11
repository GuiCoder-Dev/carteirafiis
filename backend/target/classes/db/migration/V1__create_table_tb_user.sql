CREATE TABLE tb_user(
    id integer primary key auto_increment,
    name varchar(255) not null,
    email varchar(255) not null unique,
    password varchar(255) not null,
    status varchar(255) not null,
    role varchar(255) not null
);