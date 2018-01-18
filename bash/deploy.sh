cd angular-app
npm run build

mkdir ../docs
mv ../docs/static/ _static
rm -r ../docs

mkdir ../docs
cp -a dist/ ../docs
mv _static ../docs/
cp README_BUILD.md ../docs/README.md

cd ..
git add .
git commit -m 'deploy'
git push
