ALTER TABLE tb_user
    ADD COLUMN verification_code varchar(6),
    ADD COLUMN verification_code_expiration datetime,
    ADD COLUMN email_verified boolean default false;
