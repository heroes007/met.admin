#!/bin/bash
# 自动部署环境脚本

#当前目录
pwd=`pwd`;
echo "项目目录:${pwd}";

#git首次后免密码输入
credential='[credential]';
git_path='./.git/config';
if cat ${git_path} | grep "credential">/dev/null
then
 echo "git已配置免密"
else
  echo "[credential]" >> ${git_path};
  echo "        helper = store" >> ${git_path};
  echo "git配置免密成功"
fi
git pull
npm run stop;
npm run start;
