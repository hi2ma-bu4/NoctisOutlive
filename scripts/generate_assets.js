const fs = require('fs-extra');
const path = require('path');

const assetsDir = path.resolve(__dirname, '../assets');
const outputDir = path.resolve(__dirname, '../src/generated');
const outputFile = path.join(outputDir, 'AssetBundle.ts');

async function generateAssetBundle() {
    try {
        const imageDir = path.join(assetsDir, 'images');
        const soundDir = path.join(assetsDir, 'sounds');

        const imageFiles = await fs.readdir(imageDir);
        const soundFiles = await fs.readdir(soundDir);

        const imageAssets = imageFiles.map(file => ({
            alias: path.parse(file).name,
            src: `assets/images/${file}`
        }));

        const soundAssets = soundFiles.map(file => ({
            alias: path.parse(file).name,
            src: `assets/sounds/${file}`
        }));

        const content = `// This file is generated automatically. Do not edit.

export const imageAssets = ${JSON.stringify(imageAssets, null, 4)};

export const soundAssets = ${JSON.stringify(soundAssets, null, 4)};
`;

        await fs.ensureDir(outputDir);
        await fs.writeFile(outputFile, content);

        console.log('Asset bundle generated successfully!');

    } catch (error) {
        console.error('Error generating asset bundle:', error);
        process.exit(1);
    }
}

generateAssetBundle();
