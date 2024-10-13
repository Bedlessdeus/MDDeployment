import load from './loader.js';
import fs from 'fs';

const translationkey = JSON.parse(fs.readFileSync('./routes/translate/transkey.json', 'utf8')); 

const translationMiddleWare = async (content) => {
    content = await scrub(content, [
        handleLineBr1, handleLineBr2,
        handleNormalText,
        handleBold,
        h5Scrubber, h4Scrubber, h3Scrubber, h2Scrubber, h1Scrubber,
        headInject]);
    console.log("Finished Translation Middleware");
    return content;
}

const scrub = async(content, scrubbers) => {
    if (Array.isArray(scrubbers)) {
        for (const scrubber of scrubbers) {
            content = await scrubber(content);
        }
    } else {
        content = await scrubbers(content);
    }
    return content;
}

const headInject = async(content) => {
    let keyed = translationkey['MASTER'];
    return `<body style='${keyed.style}'>` + content + `</body>`;
}

const h1Scrubber = async(content) => {
    let keyed = translationkey['#'];
    return content.replaceAll('#', keyed.oTag.replace('%style%', keyed.style));
}

const h2Scrubber = async(content) => {
    let keyed = translationkey['##'];
    return content.replaceAll('##', keyed.oTag.replace('%style%', keyed.style));
}

const h3Scrubber = async(content) => {
    let keyed = translationkey['###'];
    return content.replaceAll('###', keyed.oTag.replace('%style%', keyed.style));
}

const h4Scrubber = async(content) => {
    let keyed = translationkey['####'];
    return content.replaceAll('####', keyed.oTag.replace('%style%', keyed.style));
}

const h5Scrubber = async(content) => {
    let keyed = translationkey['#####'];
    return content.replaceAll('#####', keyed.oTag.replace('%style%', keyed.style));
}

const handleLineBr1 = async(content) => {
    if(content.includes('---')) {
        content = content.replaceAll('---', '<hr>');
    }
    return content;
}

const handleLineBr2 = async(content) => {
    if(content.includes('***')) {
        content = content.replaceAll('***', '<hr>');
    }
    return content;
}

const handleNormalText = async(content) => {
    const lines = content.split('\n');
    content = lines.map(line => {
        if (!line.startsWith('#')) {
            return `<p>${line}</p>`;
        }
        return line;
    }).join('\n');
    return content;
}

const handleBold = async(content) => {
    return content.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
}

const handle = async(app) => {
    load(translationMiddleWare, app);
}

export default handle;