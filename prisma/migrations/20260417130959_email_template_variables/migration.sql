-- CreateTable
CREATE TABLE `email_template_variables` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `template_id` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `email_template_variables_template_id_name_key`(`template_id`, `name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `email_template_variables` ADD CONSTRAINT `fk_email_template_variable_email_template` FOREIGN KEY (`template_id`) REFERENCES `email_templates`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
