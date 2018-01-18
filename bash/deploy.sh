cd angular-app
npm run build

mkdir ../docs
rm -r ../docs

mkdir ../docs
cp -a dist/ ../docs
cp README_BUILD.md ../docs/README.md

cd ..
git add .
git commit -m 'deploy'
git push
