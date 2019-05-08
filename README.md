# 临床思维训练

## 环境



```
node v10.13.0
mysql 5.7
```


## 一、mysql数据导入
    
    
```
进入mysql数据库，创建一个新database(编码格式为utf8)或者在已有的database下导入“测试版（带数据）.sql”，
    “测试版（带数据）.sql”含有一些测试数据。
```


## 二、项目部署

### 1.从git上下载项目，终端执行 
  ```
  git clone git@gitee.com:xuegekeji/medical_thinking_training_api.git
  ```
也可以单独下载压缩文件，并解压。

### 2.根据创建的数据库，修改项目中“config/config.local.js”配置文件中的数据库配置

### 3.从终端进入项目目录，执行：
  ```
    npm i
  ```
### 4.执行完第二步后，执行：
  ```
  npm run dev 
  ```
  启动项目。

### 5.访问测试接口
`http://localhost:5001/mtt/api/test`

## 三、静态文件

`项目中需要的静态文件，比如：视频、音频、图片类的，存放于app/public/目录下`# met.admin
