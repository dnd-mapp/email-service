-- 1. Create database users.
CREATE USER IF NOT EXISTS 'prisma'@'%' IDENTIFIED BY 'prisma_password';

CREATE USER IF NOT EXISTS 'app'@'%' IDENTIFIED BY 'app_password';

-- 2. Create application database and grant privileges to created users.
CREATE DATABASE IF NOT EXISTS `app_db`
    CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

GRANT ALL PRIVILEGES ON `app_db`.* TO 'prisma'@'%';
GRANT SELECT, INSERT, UPDATE, DELETE ON `app_db`.* TO 'app';


-- 3. Create shadow database and grant privileges to created users.
CREATE DATABASE IF NOT EXISTS `app_db_shadow`
    CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

GRANT ALL PRIVILEGES ON `app_db_shadow`.* TO 'prisma'@'%';

-- 4. Apply privileges.
FLUSH PRIVILEGES;
