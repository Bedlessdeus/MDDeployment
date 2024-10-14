import load from './loader.js';
import fs from 'fs';

const translationkey = JSON.parse(fs.readFileSync('./routes/translate/transkey.json', 'utf8')); 

const translationMiddleWare = async (content) => {
    content = await scrub(content, [
        handleEmpty,
        handleLineBr1, handleLineBr2,
        handleNormalText,
        handleBold,
        h5Scrubber, h4Scrubber, h3Scrubber, h2Scrubber, h1Scrubber
    ]);
    content = await headInject(content);
    console.log("Finished Translation Middleware");
    return content;
}

const scrub = async(content, scrubbers) => {
    if (Array.isArray(scrubbers)) {
        const lines = content.split('\n');
        for (let i = 0; i < lines.length; i++) {
            for (const scrubber of scrubbers) {
                lines[i] = await scrubber(lines[i]);
            }
        }
        content = lines.join('\n');
    } else {
        const lines = content.split('\n');
        for (let i = 0; i < lines.length; i++) {
            lines[i] = await scrubbers(lines[i]);
        }
        content = lines.join('\n');
    }
    return content;
}

const headInject = async(content) => {
    let keyed = translationkey['MASTER'];
    return `<body style='${keyed.style}'>\n${content}\n</body>`;
}

const h1Scrubber = async(content) => {
    let key = '#';
    let keyed = translationkey[key];
    if(!content.startsWith(key + " ")) return content;
    return content.replace(/^(#) (.*)/, (match, p1, p2) => {
        return `${keyed.oTag.replace("%style%", keyed.style)}${p2}${keyed.cTag}`;
    });
}

const h2Scrubber = async(content) => {
    let key = '##';
    let keyed = translationkey[key];
    if(!content.startsWith(key + " ")) return content;
    return content.replace(/^(##) (.*)/, (match, p1, p2) => {
        return `${keyed.oTag.replace("%style%", keyed.style)}${p2}${keyed.cTag}`;
    });
}

const h3Scrubber = async(content) => {
    let key = '###';
    let keyed = translationkey[key];
    if(!content.startsWith(key + " ")) return content;
    return content.replace(/^(###) (.*)/, (match, p1, p2) => {
        return `${keyed.oTag.replace("%style%", keyed.style)}${p2}${keyed.cTag}`;
    });
}

const h4Scrubber = async(content) => {
    let key = '####';
    let keyed = translationkey[key];
    if(!content.startsWith(key + " ")) return content;
    return content.replace(/^(####) (.*)/, (match, p1, p2) => {
        return `${keyed.oTag.replace("%style%", keyed.style)}${p2}${keyed.cTag}`;
    });
}

const h5Scrubber = async(content) => {
    let key = '#####';
    let keyed = translationkey[key];
    if(!content.startsWith(key + " ")) return content;
    return content.replace(/^(#####) (.*)/, (match, p1, p2) => {
        return `${keyed.oTag.replace("%style%", keyed.style)}${p2}${keyed.cTag}`;
    });
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
    let key = '';
    let keyed = translationkey[key];
    if(!content.startsWith(key + " ")) return content;
    return content.replace(/^() (.*)/, (match, p1, p2) => {
        return `${keyed.oTag.replace("%style%", keyed.style)}${p2}${keyed.cTag}`;
    });
}

const handleEmpty = async(content) => {
    if(!content) {
        return '<br>';
    }
    return content;
}

const handleBold = async(content) => {
    return content.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
}

const handle = async(app) => {
    load(translationMiddleWare, app);
}

export default handle;