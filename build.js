const esbuild = require('esbuild');
const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');

const srcDir = 'src';
const distDir = 'dist';
const assetsDir = 'assets';

async function build() {
    try {
        const isProduction = process.argv.includes('--prod');
        console.log(`Running ${isProduction ? 'production' : 'development'} build...`);

        // Common esbuild options
        const buildOptions = {
            bundle: true,
            sourcemap: !isProduction,
            minify: isProduction,
            target: 'esnext',
            define: {
                'process.env.NODE_ENV': isProduction ? "'production'" : "'development'",
            },
        };

        // Generate asset bundle
        console.log('Generating asset bundle...');
        execSync('node scripts/generate_assets.js', { stdio: 'inherit' });

        // Clean the dist directory
        await fs.emptyDir(distDir);

        // Build WebAssembly module
        console.log('Building WebAssembly module...');
        const wasmPath = path.join('rust', 'collision_logic');
        const wasmOutPath = path.resolve(__dirname, distDir, 'pkg'); // Use absolute path
        try {
            execSync(`wasm-pack build --target web --out-dir "${wasmOutPath}"`, { cwd: wasmPath, stdio: 'inherit' });
            console.log('WebAssembly module built successfully.');
        } catch (wasmError) {
            console.error('Failed to build WebAssembly module.');
            throw wasmError; // Propagate the error to stop the build
        }

        // Build main TypeScript
        await esbuild.build({
            ...buildOptions,
            entryPoints: [path.join(srcDir, 'main.ts')],
            outfile: path.join(distDir, 'bundle.js'),
            platform: 'browser',
        });

        // Build Web Workers
        const workerDir = path.join(srcDir, 'workers');
        const workerFiles = await fs.readdir(workerDir);
        for (const file of workerFiles) {
            if (file.endsWith('.ts')) {
                await esbuild.build({
                    ...buildOptions,
                    entryPoints: [path.join(workerDir, file)],
                    outfile: path.join(distDir, 'workers', file.replace('.ts', '.js')),
                    format: 'iife',
                });
            }
        }

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
