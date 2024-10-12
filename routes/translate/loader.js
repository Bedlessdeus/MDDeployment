import fs from 'fs';
import cne from '../../util/console.js';
import path from 'path';

cne.setPrefix("[FILESYS] ");

const inputPath = "./routes/input/";
const outputPath = "./routes/site/";
let files = [];

/*
* @return JSONObject
*/
const readAllFiles = async (dir) => {
    let results = [];
    const list = await fs.promises.readdir(dir);
    for (const file of list) {
        const filePath = `${dir}/${file}`;
        const stat = await fs.promises.stat(filePath);
        if (stat && stat.isDirectory()) {
            results = results.concat(await readAllFiles(filePath));
        } else {
            results.push(filePath);
        }
    }
    return results;
};

const readInput = async () => {
    const input = await readAllFiles(inputPath);
    let out = [];
    input.forEach(element => {
        let path = element.toString().replaceAll(inputPath + "/", '');
        path = path.replaceAll(inputPath, '');
        out.push({ content: fs.readFileSync(element.toString().replaceAll("//", "/"), { encoding: 'utf8' }), path: path });
    });
    files = out;
    return out;
};

const writeDirs = async (middleWare) => {
    for (let file of files) {
        if (file.path.endsWith('.md')) {
            let dirN = path.join(outputPath, file.path.replace(/\.md$/i, '') + ".html");
            try {
                fs.mkdir(path.dirname(dirN), { recursive: true }, () => {});
                fs.writeFileSync(dirN, middleWare ? await middleWare(file.content) : file.content);
            } catch (error) {
                console.error(`Error creating directory ${path.dirname(dirN)}:`, error);
            }
        }
    }
    return;
};


const publish = async (app) => {
    for (let file of files) {
        if (file.path.endsWith('.md')) {
            let dirN = path.join(outputPath, file.path.replace(/\.md$/i, '') + ".html");
            console.log("Posting: " + `/${file.path.replace(/\.md$/i, '')}`)
            console.log("From: " + path.resolve(dirN));
            app.get(`/${file.path.replace(/\.md$/i, '')}`, (req, res) => {
                res.sendFile(path.resolve(dirN));
            });
        }
    }
    return;
};

const load = async (middleware, app) => {
    await readInput();
    await writeDirs(middleware);
    await publish(app);
    return;
}

export {
    files
};

export default load;
/*
import fs from 'fs';
import cne from '../../util/console.js';
import path from 'path';

cne.setPrefix("[FILESYS] ");

const inputPath = "./routes/input/";
const outputPath = "./routes/site/";
let files = [];

const readAllFiles = async (dir) => {
    let results = [];
    const list = await fs.promises.readdir(dir);
    for (const file of list) {
        const filePath = `${dir}/${file}`;
        const stat = await fs.promises.stat(filePath);
        if (stat && stat.isDirectory()) {
            results = results.concat(await readAllFiles(filePath));
        } else {
            results.push(filePath);
        }
    }
    return results;
};

const readInput = async () => {
    const input = await readAllFiles(inputPath);
    let out = [];
    input.forEach(element => out.push(element.toString().replaceAll(inputPath, '')));
    files = out;
    return out;
}

const writeDirs = async () => {
    for(let file in files) {
        for (let file of files) {
            if (file.endsWith('.md')) {
                let dirN = outputPath + file;
                await fs.promises.mkdir(path.dirname(dirN), { recursive: true });
                fs.writeFileSync(dirN, "Nothin");
            }
        }
    }
    return;
}

const doShit = async () => {
    await readInput();
    await writeDirs();
}

export default doShit;
*/