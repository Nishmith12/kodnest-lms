import app from './app';
import { env } from './config/env';

const PORT = env.PORT;

app.listen(PORT, () => {
    console.log(`🚀 Kodnest LMS Backend running on http://localhost:${PORT}`);
    console.log(`Environment: ${env.NODE_ENV}`);
});
