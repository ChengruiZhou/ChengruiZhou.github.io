# 基于C++的 ROS2基本使用

## 工作空间

> ROS工作空间是一个具有特定结构的目录。通常有一个 `src` 子目录。在该子目录下是ROS软件包的源代码所在位置。通常该目录开始时为空。
>
> colcon进行外部构建。默认情况下，它会创建以下目录作为 `src` 目录的同级目录：
>
> - `build` 目录将用于存储中间文件。对于每个软件包，将在其中创建一个子文件夹，例如在该子文件夹中调用 CMake。
> - `install` 目录是每个软件包将要安装到的位置。默认情况下，每个软件包将被安装到单独的子目录中。
> - `log` 目录包含有关每个 colcon 调用的各种日志信息。

### 创建工作空间

```bash
mkdir -p demo/src
cd demo/src
```

### 创建功能包

```bash
ros2 pkg create <packpage-name> --build-type ament_cmake --dependencies rclcpp
```

在本教程中，使用可选参数``--node-name``，它将在包中创建一个简单的Hello World类型的可执行文件：`ros2 pkg create --build-type ament_cmake --node-name my_node my_package`

### 创建节点

1. 头文件 #include "rclcpp/rclcpp.hpp"
2. 初始化 ROS2
3. 定义节点类
4. 循环节点
5. 释放资源

```c++
/* 头文件 #include "rclcpp/rclcpp.hpp" */
#include "rclcpp/rclcpp.hpp"
```

### 构建软件包

```bash
colcon build
colcon build --packages-select my_package
```

> `colcon build`的其他有用参数：
>
> - `--packages-up-to` 构建所需的包及其所有依赖项，而不是整个工作空间（节省时间）
> - `--symlink-install` 在您调整Python脚本时，无需每次重新构建
> - `--event-handlers console_direct+` 在构建时显示控制台输出（否则可在``log``目录中找到）

### 加载环境变量

当colcon成功构建完成后，输出将位于``install``目录中。在您可以使用任何已安装的可执行文件或库之前，您需要将它们添加到您的路径和库路径中。colcon会在``install``目录中生成bash/bat文件来帮助设置环境。这些文件将会将所有所需的元素添加到您的路径和库路径中，并提供由软件包导出的任何bash或shell命令。

```bash
source install/setup.bash
```





### 启动界面

http://www.network-science.de/ascii/



测试：`sudo run-parts /etc/update-motd.d` 



- 一. 进入update-motd.d目录cd /etc/update-motd.d, 里面的文件都是shell脚本, 用户登录时服务器会自动加载这个目录中的文件, 所以就能看到欢迎信息了.
  可以发现目录中的文件名都是数字开头的, 数字越小的文件越先加载
- 二. 比如创建60-my-welcome-info文件, sudo vim 60-my-welcome-info
  文件的第一行必须是#!/bin/sh或者#!/bin/bash, 这是告诉系统要用相关的shell解析该文件
  文件的第一行必须是#!/bin/sh或者#!/bin/bash, 这是告诉系统要用相关的shell解析该文件
  文件的第一行必须是#!/bin/sh或者#!/bin/bash, 这是告诉系统要用相关的shell解析该文件
  剩下的就根据自身需求写了, 使用的是shell脚本语法
- 
  三. 给脚本文件增加可执行权限,sudo chmod 755 60-my-welcome-info

