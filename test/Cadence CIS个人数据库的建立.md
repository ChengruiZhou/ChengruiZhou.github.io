\---
sort: 3
\---


# Cadence CIS个人数据库的建立

## 前言

Cadence OrCAD支持强大的数据库功能，可以实现不同电脑之间共用数据库，方便统一管理。特别是在大公司，不同的人在画原理图和PCB时候为了保证大家的库是一致的，使用Database Part功能就显得非常方便，同时支持ERP等系统管理，可以做到设计、采购、生产之间数据同步。

## 一、MySQL数据库安装

本教程使用的是MySQL数据库，配合数据库管理软件HeidiSQL来实现，该方式免费，安装使用起来方便，当然也可以使用微软的Access数据库软件来实现。

1. 首先下载MySQL数据库https://dev.mysql.com/downloads/mysql/5.7.html#downloads
   下载完成后双击进行安装，选择自定义安装
2. 选择TCP/IP方式，端口选择3306，如果有感叹号说明被占用了，换一个就好，点击Next
3. 输入登陆密码，一定要记住不然没办法使用数据库
4. 数据库安装完成后，需要配置环境变量，在系统变量Path，添加MySQL安装位置

![image-20240822131152606](https://github.com/ChengruiZhou/ChengruiZhou.github.io/raw/main/pictures/CIS datasheet/image-20240822131152606.png)

![image-20240822131212068](https://github.com/ChengruiZhou/ChengruiZhou.github.io/raw/main/pictures/CIS datasheet/image-20240822131212068.png)

在CMD命令行中输入mysql -u root -p，并输入刚才的密码，如下图表示安装成功了

![image-20240822131259164](https://github.com/ChengruiZhou/ChengruiZhou.github.io/raw/main/pictures/CIS datasheet/image-20240822131259164.png)

## 二、数据库管理

安装好数据库，我们还需要一个软件来进行创建和管理我们的数据库，这里使用免费的HeidiSQL数据库管理软件。

- 下载HeidiSQL：https://www.heidisql.com/download.php
- 下载完后直接安装

打开软件，新建会话

![image-20240822131441936](https://github.com/ChengruiZhou/ChengruiZhou.github.io/raw/main/pictures/CIS datasheet/image-20240822131441936.png)

输入安装时设置的密码，进入会话。新建一个数据库，命名为Cadence_Lib，选择字符为gb2312_chinese_ci，否则会出现乱码

![image-20240822131537525](https://github.com/ChengruiZhou/ChengruiZhou.github.io/raw/main/pictures/CIS datasheet/image-20240822131537525.png)

新建好数据库，我们再新建表来管理我们的元器件信息，如电阻，电容，芯片等。这里以电容为例

![image-20240822131632885](https://github.com/ChengruiZhou/ChengruiZhou.github.io/raw/main/pictures/CIS datasheet/image-20240822131632885.png)

![image-20240822131644964](C:\Users\Mr.zhou\AppData\Roaming\Typora\typora-user-images\image-20240822131644964.png)

在表中添加如下字段，数据类型选择VARCHAR，其中前面6个是必须要添加的，其它看个人需求添加即可，主要用了管理元器件信息，点击保存

![image-20240822131740683](https://github.com/ChengruiZhou/ChengruiZhou.github.io/raw/main/pictures/CIS datasheet/image-20240822131740683.png)

添加数据，注意Schemitic Part和PCB Footprint必须和你的库名称对应

![image-20240822131758065](https://github.com/ChengruiZhou/ChengruiZhou.github.io/raw/main/pictures/CIS datasheet/image-20240822131758065.png)

## 三、配置数据源

安装MySQL ODBC Driver，一定要安装64位的，17.4只能用64位，下载地址
https://dev.mysql.com/downloads/connector/odbc/3.51.html

下载好直接安装即可

ODBC 数据源 64位![image-20240822131913623](https://github.com/ChengruiZhou/ChengruiZhou.github.io/raw/main/pictures/CIS datasheet/image-20240822131913623.png)

点击添加，选择MySQL ODBC Driver![image-20240822132011181](https://github.com/ChengruiZhou/ChengruiZhou.github.io/raw/main/pictures/CIS datasheet/image-20240822132011181.png)

按如下输入配置信息，密码是之前数据库的密码，完成添加

![image-20240822132153227](https://github.com/ChengruiZhou/ChengruiZhou.github.io/raw/main/pictures/CIS datasheet/image-20240822132153227.png)

## 四、Capture CIS配置

建立好数据库后，需要将数据库和我们软件关联起来

1. 打开OrCAD软件，<u>新建立一个工程</u>，选择Option中的CIS Configuration

   ![image-20240822132740029](https://github.com/ChengruiZhou/ChengruiZhou.github.io/raw/main/pictures/CIS datasheet/image-20240822132740029.png)

2. 选择New，再选择下一页

   ![image-20240822132802311](https://github.com/ChengruiZhou/ChengruiZhou.github.io/raw/main/pictures/CIS datasheet/image-20240822132802311.png)

3. 选择刚刚添加的数据库

   ![image-20240822132834803](https://github.com/ChengruiZhou/ChengruiZhou.github.io/raw/main/pictures/CIS datasheet/image-20240822132834803.png)

4. 勾选我们建立的表，点击下一页

   ![image-20240822132847737](https://github.com/ChengruiZhou/ChengruiZhou.github.io/raw/main/pictures/CIS datasheet/image-20240822132847737.png)

5. 自动关联参数，默认即可，下一步

   ![image-20240822132859484](https://github.com/ChengruiZhou/ChengruiZhou.github.io/raw/main/pictures/CIS datasheet/image-20240822132859484.png)

6. 勾选PCB Footprint即可，下一步

   ![image-20240822132910874](https://github.com/ChengruiZhou/ChengruiZhou.github.io/raw/main/pictures/CIS datasheet/image-20240822132910874.png)

7. 勾选BOM需要输出的信息，点击下一步

   ![image-20240822132936161](https://github.com/ChengruiZhou/ChengruiZhou.github.io/raw/main/pictures/CIS datasheet/image-20240822132936161.png)

   ![image-20240822133000781](https://github.com/ChengruiZhou/ChengruiZhou.github.io/raw/main/pictures/CIS datasheet/image-20240822133000781.png)

8. 以下是查看元件属性是要看到的信息，全部勾选

   ![image-20240822133013507](https://github.com/ChengruiZhou/ChengruiZhou.github.io/raw/main/pictures/CIS datasheet/image-20240822133013507.png)

9. 设置键值，默认就行

   ![image-20240822133025888](https://github.com/ChengruiZhou/ChengruiZhou.github.io/raw/main/pictures/CIS datasheet/image-20240822133025888.png)

   ![image-20240822133154009](https://github.com/ChengruiZhou/ChengruiZhou.github.io/raw/main/pictures/CIS datasheet/image-20240822133154009.png)

这时候我们选择Database Part就能看到我们刚刚的数据库了

![image-20240822133225962](https://github.com/ChengruiZhou/ChengruiZhou.github.io/raw/main/pictures/CIS datasheet/image-20240822133225962.png)

![image-20240822133301514](https://github.com/ChengruiZhou/ChengruiZhou.github.io/raw/main/pictures/CIS datasheet/image-20240822133301514.png)