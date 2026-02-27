================================================================================
  SPACE EXPLORER - DEPLOYMENT PACKAGE
================================================================================

This folder contains the READY-TO-DEPLOY static website. No node_modules, no
source code—only HTML, CSS, JS, and assets. File count is in the hundreds,
not thousands.

--------------------------------------------------------------------------------
WHAT TO DO
--------------------------------------------------------------------------------

1. UPLOAD THIS ENTIRE FOLDER to your web host:
   - Upload the *contents* of this "deploy" folder (all .html, _next/, images/, etc.)
   - Or zip this folder and upload the zip, then extract on the server.

2. POINT YOUR HOST at this folder:
   - "Publish directory" or "Web root" = this folder (or the folder that
     contains index.html and the rest).
   - Your site's home page must serve index.html from here.

3. DONE. The site runs as pure static files—no Node, no build step on the server.

--------------------------------------------------------------------------------
WHERE TO UPLOAD (examples)
--------------------------------------------------------------------------------

- Netlify: Drag this folder into "Deploy" → Netlify uses it as the publish dir.
- GitHub Pages: Push the contents of this folder to a branch, set Pages to that branch.
- Any static host (e.g. your host's "public_html", "www", or "htdocs"):
  Upload the contents so that index.html is at the site root.

--------------------------------------------------------------------------------
UPDATING THE SITE LATER
--------------------------------------------------------------------------------

Re-build from the main Space project:
   npm run build

Then copy the new "out" folder over this "deploy" folder again (or re-upload
the new "out" contents) and redeploy.

================================================================================
