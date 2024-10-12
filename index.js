import express from 'express';
import dotevn from 'dotenv';
import fs from 'fs';

import cne from './util/console.js';
import handle from './routes/translate/translate.js';

dotevn.config();

const app = express();
const port = process.env.PORT || 3000;

cne.overrideConsole();

const handleClear = async () => {
    if (process.env.CLEAR_RELOAD === 'true') {
        cne.setPrefix("[FILESYS] ");
        try {
            console.log("Clearing routes/site/ directory...");
            await fs.promises.rm("./routes/site/", { recursive: true });
        } catch (e) {}
        try {
            console.log("Creating routes/site/ directory...");
            await fs.promises.mkdir("./routes/site", { recursive: true });
        } catch (e) { }
    }
    return;
}

const handleStartup = async () => {
    await handleClear();
    handle(app);
}

handleStartup();

cne.setPrefix("[SERVER] ");
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});