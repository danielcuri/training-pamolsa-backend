-- Permisos para Prisma Migrate (shadow database en `migrate dev`)
GRANT CREATE, DROP, ALTER, INDEX, REFERENCES ON *.* TO 'nestuser'@'%';
FLUSH PRIVILEGES;
