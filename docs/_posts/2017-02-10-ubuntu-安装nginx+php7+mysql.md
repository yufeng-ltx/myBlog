---
title: ubuntu 安装nginx+php7+mysql
date: 2017-02-10 15:04:23
categories: 
  - 编程学习
tags: 
  - Linux
sidebar: auto
permalink: /pages/2017-02-10-ubuntu-安装nginx+php7+mysql/
---

升级php7，在ubuntu服务器上折腾了半天，这里做一下安装总结。

<!-- more -->

## 安装nginx

去nginx官网下载最新版本的tar包

地址：[http://nginx.org/en/download.html](http://nginx.org/en/download.html)

先在 usr/local/目录下建 nginx文件夹

    cd /usr/local/nginx

下载：

    wget http://nginx.org/download/nginx-1.10.3.tar.gz

解压：

    tar -xvf  nginx-1.10.3.tar.gz

配置，这里prefix是指定安装目录

 

    ./configure --prefix=/usr/local/nginx/

编译

    make && make install

以上就已经成功安装了nginx

下面是配置nignx.conf，进入目录

    cd /usr/local/nginx/conf

编辑nginx.conf文件

    vi nginx.conf

这里列一段php-fpm 的配置代码：

``` R
server {
    listen 80;
    server_name test.com;
    location / {
        root /www/;
        index index.php index.html index.htm;
    }
    location ~* \.php$ {
        root /www/;
        fastcgi_index index.php;
        fastcgi_pass 127.0.0.1:9000;
        include fastcgi_params;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        fastcgi_param SCRIPT_NAME $fastcgi_script_name;
    }
}
```
软链nginx到bin目录下

    ln /usr/local/nginx/sbin/nginx /usr/local/bin

就可以查看nginx的版本

    nginx -v
    
## 安装php7

先去php官网下载最新版的tar包

[http://php.net/downloads.php](http://php.net/downloads.php)

在/usr/local/目录下创建php7文件夹

    cd /usr/local/php7

下载php7

    wget http://cn2.php.net/distributions/php-7.1.2.tar.gz

解压

    tar -xvf php-7.1.2.tar.gz

进入安装目录后，准备配置configure，安装一些必要的库

    ./configure \
    --prefix=/usr/local/php7 \
    --enable-opcache \
    --enable-mysqlnd \
    --with-mysqli \
    --with-pdo-mysql \
    --with-mysql-sock=/var/run/mysqld/mysqld.sock \
    --enable-fpm \
    --enable-static \
    --enable-inline-optimization \
    --enable-sockets \
    --enable-wddx \
    --enable-zip \
    --enable-calendar \
    --with-iconv \
    --with-openssl \
    --enable-bcmath \
    --enable-soap \
    --with-xmlrpc \
    --enable-mbstring \
    --enable-shared \
    --with-curl \
    --enable-xml \
    --enable-ftp \
    --with-mhash \
    --enable-shmop \
    --enable-sysvsem \
    --enable-mbregex \
    --enable-pcntl \
    --enable-session \
    --with-gettext \
    --disable-ipv6 \
    --disable-debug \
    --disable-maintainer-zts \
    --disable-rpath \
    --with-zlib \
    --with-freetype-dir \
    --with-gd \
    --with-jpeg-dir \
    --with-png-dir \
    --enable-gd-native-ttf \
    --enable-gd-jis-conv \
    --disable-fileinfo \
    --with-mcrypt \

上面配置的内容，我这里解释一下。

*`–enable-fpm`   //开启fpm，这是一个PHPFastCGI管理器，让php代码能够在nginx下运行。*

`–with-mysql-sock=/var/run/mysqld/mysqld.sock`  

*//这一段是指定mysqld.sock的位置，如果不指定的话，安装完，还不能直接访问mysql数据，需要在php.ini里面指定pdo_mysql.default_socket=。

*`–disable-fileinfo`   //这段是为了防止服务器内存不够的出错。**

正常来说，上面的代码再服务器上运行后，会报错，因为会提示找不到某些库。

这个时候，就要根据报错的内容个，逐一安装啦。。。

安装这些必要库的方法也比较简单，都是去官网找tar包，然后./configure ,make && make install 来安装。默认情况下，都是安装在/usr/local目录下。如果要指定安装目录，也可以在 ./configure 指定 –prefix=/路径/。有些库也是相互依赖。所以这里建议最好都是使用默认安装目录，不必指定prefix;

下面列一下必要库的下载路径，也可以去[http://php.net/manual/en/funcref.php](http://php.net/manual/en/funcref.php)查找扩展库的地址

curl: [https://curl.haxx.se/download.html](https://curl.haxx.se/download.html)

mhash: [https://sourceforge.net/projects/mhash/files/](https://sourceforge.net/projects/mhash/files/)

mcrypt: [ftp://mcrypt.hellug.gr/pub/crypto/mcrypt/libmcrypt/](ftp://mcrypt.hellug.gr/pub/crypto/mcrypt/libmcrypt/)

openssl: [https://www.openssl.org/source/](https://www.openssl.org/source/)

zlib: [http://zlib.net/](http://zlib.net/)

freetype:[https://sourceforge.net/projects/freetype/files/](https://sourceforge.net/projects/freetype/files/)

gd:[https://github.com/libgd/libgd/releases](https://github.com/libgd/libgd/releases)

png:[https://sourceforge.net/projects/libpng/files/](https://sourceforge.net/projects/libpng/files/)

jpeg:[http://www.ijg.org/](http://www.ijg.org/)

安装好必要的扩展库后，./configure 就基本可以通过了，

    make && make install

这个过程可能还会报错。要具体问题具体分析。比如我遇到过找不到freetype.h,然后，我直接去/usr/local/include 目录下把freetype下的子目录全部移到include下面。

上面编译完成后，会在/usr/local/php7目录下生成一些文件夹。

进入php7目录

    cd /usr/local/php7

复制配置文件，文件在etc目录下

    cp ./etc/php-fpm.conf.default ./etc/php-fpm.conf

复制www.conf文件，文件在etc/php-fpm.d目录下

    cp ./etc/php-fpm.d/www.conf.default ./etc/php-fpm.d/www.conf

复制php.ini到lib目录

    cp ./php-7.1.2/php.ini-development ./lib/php.ini

查看php版本

    ./bin/php -v

软链php-fpm

    ln ./sbin/php-fpm /usr/local/bin

启动php-fpm

    php-fpm

修改php.ini文件，需要重启php-fpm，可以使用下面命令重启，

先关闭所有php-fpm

    killall php-fpm

再运行php-fpm命令

    php-fpm

## 安装mysql

可以直接去官网下载deb包，然后用dpkg -i *.deb来安装

[https://dev.mysql.com/downloads/mysql/](https://dev.mysql.com/downloads/mysql/)

这里直接使用apt-get install 方式安装

    apt-get install mysql-server

安装完后会提示设置密码

可以使用service指令来重启或者关闭mysql，mysql的配置文件在 /etc/mysql

`service mysql restart` //重启mysql
这里列一下mysql创建用户权限问题

先登录mysql

    mysql -u root -p

输入密码，就可以进入mysql命令行了

查看mysql的用户列表

    select user,host from mysql.user;

设置用户权限，这里新建一个root用户，把host设置为%，这样就可以远程连接服务器上的mysql

这里设置了一个用户名为root1,密码为password，host是‘%’的用户，并赋予了所有数据库的所有权限。

    grant all privileges on *.* to user@'%' identified by ‘password’;

刷新权限

    flush privileges

可以用show grants来查看某个用户的权限

    show grants for root1@'%';

