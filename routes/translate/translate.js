import load from './loader.js';


const translationMiddleWare = async (content) => {
    content = await scrub(content, [h2Scrubber, h1Scrubber]);
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

const h1Scrubber = async(content) => {
    return content.replaceAll('#', '<h1>');
}

const h2Scrubber = async(content) => {
    return content.replaceAll('##', '<h2>');
}

const handle = async(app) => {
    load(translationMiddleWare, app);
}

export default handle;