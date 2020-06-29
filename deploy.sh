#!/usr/bin/env sh
# 确保脚本抛出遇到的错误
set -e

# 生成静态文件
npm run build

# 进入生成的文件夹
cd docs/.vuepress/dist

# deploy to github
if [ -z "$GITHUB_TOKEN" ]; then #判断是否存在token
  msg='deploy'
  githubUrl=git@github.com:yufeng-ltx/yufeng-ltx.github.io.git
else
  msg='github action deploy'
  githubUrl=https://yufeng-ltx:${GITHUB_TOKEN}@github.com/yufeng-ltx/yufeng-ltx.github.io.git
  git config --global user.name "yufeng-ltx"
  git config --global user.email "yufeng.ltx@gmail.com"
fi
git init
git add -A
git commit -m "${msg}"
git push -f $githubUrl master # publish github

cd -
