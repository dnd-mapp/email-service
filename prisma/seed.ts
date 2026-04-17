import { PrismaClient } from '@/prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { templates } from './seed-data/email-templates';
import { senders } from './seed-data/sender-emails';

const {
    EMAIL_SERVICE_DB_HOST,
    EMAIL_SERVICE_DB_PORT,
    EMAIL_SERVICE_DB_USER,
    EMAIL_SERVICE_DB_PASSWORD,
    EMAIL_SERVICE_DB_SCHEMA,
} = process.env;

const adapter = new PrismaMariaDb({
    host: EMAIL_SERVICE_DB_HOST,
    port: Number.parseInt(EMAIL_SERVICE_DB_PORT!),
    database: EMAIL_SERVICE_DB_SCHEMA,
    user: EMAIL_SERVICE_DB_USER,
    password: EMAIL_SERVICE_DB_PASSWORD,
});

const prisma = new PrismaClient({ adapter: adapter });

async function main() {
    console.log('Seeding database from exports...');

    const emailToSenderId: Record<string, string> = {};

    for (const sender of senders) {
        const record = await prisma.senderEmail.upsert({
            where: { email: sender.email },
            update: { name: sender.name },
            create: {
                name: sender.name,
                email: sender.email,
            },
        });
        emailToSenderId[sender.email] = record.id;
        console.log(`Upserted sender: ${record.email}`);
    }

    for (const template of templates) {
        const senderId = emailToSenderId[template.senderEmail]!;

        const record = await prisma.emailTemplate.upsert({
            where: { name: template.name },
            update: {
                subject: template.subject,
                content: template.content,
                senderId: senderId,
            },
            create: {
                name: template.name,
                subject: template.subject,
                content: template.content,
                senderId: senderId,
            },
        });

        console.log(`Upserted template: ${record.name}`);

        for (const variableName of template.variables) {
            await prisma.emailTemplateVariable.upsert({
                where: {
                    templateId_name: {
                        templateId: record.id,
                        name: variableName,
                    },
                },
                update: {},
                create: {
                    name: variableName,
                    templateId: record.id,
                },
            });
        }
        console.log(`  - Upserted ${template.variables.length} variables for ${record.name}`);
    }

    console.log('Seeding complete.');
}

main()
    .catch((error: unknown) => {
        console.error(error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
