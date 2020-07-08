---
title: linux上安装nginx及配置
date: 2020-05-22 16:25:33
permalink: /pages/2020-05-22-linux上安装nginx及配置/
sidebar: auto
categories: 
  - 服务器
tags: 
  - nginx
---

Ubuntu 2020上安装nginx步骤

<!-- more -->

## 依赖安装

> 先安装依赖，主要包括openssl，zlib，pcre

openssl 安装步骤 [下载地址：](https://www.openssl.org/source/)

> 如果服务器不只是要支持HTTP，还需要在更安全的SSL协议上传输HTTP，那么需要拥有OpenSSL。另外，如果我们想使用MD5、SHA1等散列函数，那么也需要安装

``` shell
# 下载
wget https://www.openssl.org/source/openssl-1.1.1g.tar.gz

# 解压
tar -xzf openssl-1.1.1g.tar.gz

# 进入目录
cd openssl-1.1.1g

# 可以指定安装目录 prefix
./config # --prefix=/usr/local/openssl

# 执行命令
./config -t

# 编译安装
make && make install

```

pcre 安装步骤 [下载地址：](https://ftp.pcre.org/pub/pcre/)

> PCRE库支持正则表达式。如果我们在配置文件nginx.conf中使用了正则表达式，那么在编译Nginx时就必须把PCRE库编译进Nginx，因为Nginx的HTTP模块需要靠它来解析正则表达式。另外，pcre-devel是使用PCRE做二次开发时所需要的开发库，包括头文件等，这也是编译Nginx所必须使用的

``` shell
# 下载
wget https://ftp.pcre.org/pub/pcre/pcre-8.44.tar.gz

# 解压
tar -xzf pcre-8.44.tar.gz

# 进入目录
cd pcre-8.44

# 可以指定安装目录 prefix libdir includedir
./configure # --prefix=/usr/local/pcre --libdir=/usr/local/lib/pcre --includedir=/usr/local/include/pcre

# 编译安装
make && make install

```

zlib 安装步骤 [下载地址：](http://www.zlib.net/)

> zlib库用于对HTTP包的内容做gzip格式的压缩，如果我们在nginx.conf中配置了gzip on，并指定对于某些类型（content-type）的HTTP响应使用gzip来进行压缩以减少网络传输量，则在编译时就必须把zlib编译进Nginx。zlib-devel是二次开发所需要的库

``` shell
# 下载
wget http://www.zlib.net/zlib-1.2.11.tar.gz

# 解压
tar -xzf zlib-1.2.11.tar.gz

# 进入目录
cd zlib-1.2.11

# 可以指定安装目录 prefix
./configure # --prefix=/usr/local/zlib

# 编译安装
make && make install

```

## nginx 安装

[下载地址](http://nginx.org/en/download.html)

``` shell
# 下载
wget http://nginx.org/download/nginx-1.18.0.tar.gz

# 解压
tar -xzf nginx-1.18.0.tar.gz

# 进入目录
cd nginx-1.18.0

# 可以指定安装目录 prefix
./configure --prefix=/usr/local/nginx

# 编译安装
make && make install

# 开启服务器
cd /usr/local/nginx/sbin/

./nginx

# 添加全局命令
ln -s /usr/local/nginx/sbin/nginx /usr/local/bin/nginx

# nginx查看状态
ps -aux | grep nginx

```

**报错了，error while loading shared libraries: libpcre.so.1: cannot open shared object file: No such file or directory，按照下面方式解决**

``` shell
# 查找libpcre.so.1 位置
whereis libpcre.so.1

# 链接到lib64目录
ln -s /usr/local/lib/libpcre.so.1 /lib64

# 链接到lib目录
ln -s /usr/local/lib/libpcre.so.1 /lib

```

## nginx 配置

一份简单的nginx 配置

``` shell
#user  nobody;
worker_processes  1;

#error_log  logs/error.log;
#error_log  logs/error.log  notice;
#error_log  logs/error.log  info;

#pid        logs/nginx.pid;


events {
    worker_connections  1024;
}


http {
    include       mime.types;
    default_type  application/octet-stream;

    #log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
    #                  '$status $body_bytes_sent "$http_referer" '
    #                  '"$http_user_agent" "$http_x_forwarded_for"';

    #access_log  logs/access.log  main;

    sendfile        on;
    #tcp_nopush     on;
    
    keepalive_timeout  65;

    #gzip  on;

    # localhost
    server {
        listen       80;
        server_name  localhost;

        #charset koi8-r;

        #access_log  logs/host.access.log  main;

        location / {
            root   html;
            index  index.html index.htm;
        }

        #error_page  404              /404.html;

        # redirect server error pages to the static page /50x.html
        #
        error_page   500 502 503 504  /50x.html;
        location = /50x.html {
            root   html;
        }
    }

    # https://www.test.com
    server {
        listen   443;
        server_name  test.com;

        ssl on;

        ssl_certificate      cert/www.test.com.pem;
        ssl_certificate_key  cert/www.test.com.key;
        
        ssl_session_cache shared:SSL:1m;
        ssl_session_timeout  5m;
        ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE:ECDH:AES:HIGH:!NULL:!aNULL:!MD5:!ADH:!RC4;
        ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
        ssl_prefer_server_ciphers  on;

        location / {
            root /www/test/;
            index  index.html index.htm;
        }
    }
}

```
