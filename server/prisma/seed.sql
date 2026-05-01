-- seed.sql for users table
INSERT INTO "User" (firstname, lastname, email, password, role)
VALUES ('Jayrald', 'Bernales', 'jay@gmail.com', '$2b$10$w0xzEJqp2nD4nLuCIPUMOeNn8r7xdop7C5TbFQCwWjqyjkU2UEHkq
', 'user')
ON CONFLICT (email) DO NOTHING;
