import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Checking for existing access code "luzi"...');

    const existing = await prisma.appAccess.findUnique({
        where: { accessCode: 'luzi' }
    });

    if (existing) {
        console.log('✅ Access code "luzi" already exists.');
    } else {
        console.log('Creating access code "luzi"...');
        await prisma.appAccess.create({
            data: {
                accessCode: 'luzi',
            }
        });
        console.log('✅ Successfully created access code "luzi"!');
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
