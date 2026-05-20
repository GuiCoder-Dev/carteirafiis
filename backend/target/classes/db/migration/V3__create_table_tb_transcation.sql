CREATE TABLE tb_transaction(
    id int primary key auto_increment,
    quantity int not null,
    unit_price Decimal(10, 2) not null,
    date date not null,
    total_expense Decimal(10, 2) not null,
    type varchar(255) not null,
    fii_id int not null,
    foreign key (fii_id) references tb_fii(id)
);


