import fs from 'fs';
import path from 'path';
import pool from '../config/db';

async function seedDatabase() {
    try {
        const seedPath = path.join(__dirname, 'seed.sql');
        const seed = fs.readFileSync(seedPath, 'utf-8');

        const statements = seed
            .split(';')
            .map(s => s.trim())
            .filter(s => s.length > 0);

        const connection = await pool.getConnection();

        for (const statement of statements) {
            await connection.query(statement);
        }

        connection.release();
        console.log('✅ Database seeded successfully');
        process.exit(0);
    } catch (error) {
        console.error('❌ Failed to seed database:', error);
        process.exit(1);
    }
}

seedDatabase();
