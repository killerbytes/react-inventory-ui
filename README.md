npm install
npm start

build:
webpack --config webpack-production.config.js --progress --inline --colors && cp app/index.html build/index.html

aws s3 sync . s3://central-2.favoritemedium.net --profile fm --region ap-southeast-1
