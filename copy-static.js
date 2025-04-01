const fs = require('fs-extra');
const path = require('path');

async function copyStaticFiles() {
  try {
    // Copier le dossier public vers .next/standalone/public
    await fs.copy(
      path.join(__dirname, 'public'),
      path.join(__dirname, '.next', 'standalone', 'public')
    );

    // Copier le dossier .next/static vers .next/standalone/.next/static
    await fs.copy(
      path.join(__dirname, '.next', 'static'),
      path.join(__dirname, '.next', 'standalone', '.next', 'static')
    );

    console.log('✅ Fichiers statiques copiés avec succès');
  } catch (err) {
    console.error('❌ Erreur lors de la copie des fichiers statiques:', err);
    process.exit(1);
  }
}

copyStaticFiles();
