import fs from 'fs';
import path from 'path';
import pool from '../config/db';

async function initDatabase() {
    try {
        const schemaPath = path.join(__dirname, 'schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf-8');

        const statements = schema
            .split(';')
            .map(s => s.trim())
            .filter(s => s.length > 0);

        const connection = await pool.getConnection();

        for (const statement of statements) {
            await connection.query(statement);
        }

        connection.release();
        console.log('✅ Database schema initialized successfully');
        process.exit(0);
    } catch (error) {
        console.error('❌ Failed to initialize database:', error);
        process.exit(1);
    }
}

initDatabase();
