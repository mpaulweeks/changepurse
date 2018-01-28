# updating coinmarketcap.json
# 0 9 * * * ec2-user cd /home/ec2-user/changepurse && ./cronjob.sh

git checkout master
git pull

source venv/bin/activate
python -m py.parse_names

git add .
git commit -m 'update coinmarketcap.json'
git push
