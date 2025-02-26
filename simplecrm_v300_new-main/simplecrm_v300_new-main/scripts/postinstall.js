import fse from "fs-extra";
import path from "path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const topDir = path.resolve(__dirname, "..");

const tinymceSource = path.join(topDir, "node_modules", "tinymce");
const tinymceDest = path.join(topDir, "public", "tinymce");

// Check if tinymce exists in node_modules
if (!fse.existsSync(tinymceSource)) {
  console.error(`Error: 'tinymce' is missing in node_modules. 
Make sure to install 'tinymce' before running postinstall.`);
  process.exit(1);
}

try {
  // Remove the tinymce directory forcefully
  if (fse.existsSync(tinymceDest)) {
    console.log(`Removing existing directory: ${tinymceDest}`);
    fse.rmSync(tinymceDest, { recursive: true, force: true }); // Force remove
  }

  // Copy files without creating symlinks
  console.log(`Copying 'tinymce' from ${tinymceSource} to ${tinymceDest}`);
  fse.copySync(tinymceSource, tinymceDest, { dereference: true }); // Dereference symlinks

  // Write the .htaccess file
  const htaccessContent = `Options -MultiViews
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule ^ index.html [QSA,L]
`;
  const htaccessPath = path.join(topDir, "public", ".htaccess");
  console.log(`Writing .htaccess to ${htaccessPath}`);
  fse.writeFileSync(htaccessPath, htaccessContent, { flag: "w+" });

  console.log("Postinstall script completed successfully.");
} catch (err) {
  console.error("An error occurred during the postinstall process:");
  console.error(err);
  process.exit(1);
}
