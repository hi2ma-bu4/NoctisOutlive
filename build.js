const esbuild = require('esbuild');
const fs = require('fs-extra');
const path = require('path');

const srcDir = 'src';
const distDir = 'dist';
const assetsDir = 'assets';

async function build() {
  try {
    // Clean the dist directory
    await fs.emptyDir(distDir);

    // Build TypeScript
    await esbuild.build({
      entryPoints: [path.join(srcDir, 'main.ts')],
      bundle: true,
      outfile: path.join(distDir, 'bundle.js'),
      sourcemap: true,
      minify: true,
      target: 'esnext',
      platform: 'browser',
    });

    console.log('TypeScript build successful.');

    // Copy HTML and CSS
    await fs.copy(path.join(srcDir, 'index.html'), path.join(distDir, 'index.html'));
    await fs.copy(path.join(srcDir, 'style.css'), path.join(distDir, 'style.css'));
    console.log('HTML and CSS copied.');

    // Copy assets
    const assetsSrc = path.join(assetsDir);
    const assetsDest = path.join(distDir, assetsDir);
    if (fs.existsSync(assetsSrc)) {
      await fs.copy(assetsSrc, assetsDest);
      console.log('Assets copied.');
    } else {
        console.log('No assets directory found to copy.');
    }


    console.log('Build finished successfully!');
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

build();
