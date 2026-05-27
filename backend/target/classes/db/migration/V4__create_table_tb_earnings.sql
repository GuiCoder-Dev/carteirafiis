CREATE TABLE tb_earnings(
    id int primary key auto_increment,
    fii_id int,
    unit_value_payment Decimal(10, 2) not null,
    payment_date Date not null,
    total_gain Decimal(10, 2) not null,
    FOREIGN KEY (fii_id) REFERENCES tb_fii(id)
);

