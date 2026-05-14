CREATE TABLE tb_fii(
    id int primary key auto_increment,
    code varchar(255) not null,
    type varchar(255) not null,
    user_id int not null,
    foreign key (user_id) references tb_user(id)
);


