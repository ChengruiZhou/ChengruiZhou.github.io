---

title: "上位机LinkGDBserial."
header:
  overlay_color: "#333"
categories: 
  - 上位机
tags:
  - LinkGDBserialo
---

做相关的应用，很经常遇到的一个情况就是希望能够实时的观察单片机中的变量，从而更直观的判断数据或算法的正确性，例如无人机的姿态估计。

现有方案：

- 串口数据输出到PC->在PC端接收或存储数据->进一步的数据处理及可视化。
- 利用JLink的RTT功能把数据输出到PC，从而避免额外配置和占用STM32的一个串口。
- 可以直接使用JScope绘制曲线。
- 部分商业IDE也支持类似的功能。
- STM32CubeMonitor/STM studio，调试和诊断STM32应用程序的工具

上面提到的方法都有各自的局限性，使用串口通用性很好但是串口传输数据会占用CPU资源，编写上位机绘制曲线往往也耗时耗力，而商业IDE和JLink严格意义上说并不是免费的。覆盖面不全的问题，也亟需解决。

## LinkGDBserial上位机介绍

### 项目简介

本程序使用QT编写，用于硬件设备的调试，可直接驱动串口或各种调试器（基于OpenOCD支持）。Ref: LinkScope

### 开发环境

- IDE：Qt Creator
- QT版本：6.10.0

### 主要功能

- 实时查看和修改变量值
- 实时绘制变量值波形
- 导出采样数据
- 格式化日志输出

### 连接方式

- 调试器模式：软件直接驱动调试器读取目标芯片数据

    - 无需修改目标芯片程序

    - 理论上支持OpenOCD所支持的各种调试器及硬件芯片，如STLink、JLink、CMSIS-DAP、altera-usb-blaster等。

        > 附OpenOCD官方文档： [支持的调试器](https://openocd.org/doc/html/Debug-Adapter-Hardware.html)、[支持的芯片](https://openocd.org/doc/html/CPU-Configuration.html#Target-CPU-Types)

    - 对于需要专用OpenOCD驱动的芯片（如ESP32C3等），允许在外部手动开启OpenOCD进程后进行连接

    - 最高采样速度约100Hz

- 串口模式：软件和目标芯片间通过串口连接

    - 需将一段程序移植至目标芯片中

    - 可支持几乎所有带串口的芯片

    - 最高采样速度约80Hz

###  使用方法

1. 若使用串口连接，或需使用日志功能，需先将对应下位机程序移植到目标芯片中

    > 请查看[串口移植说明](#日志下位机程序说明)、[日志移植说明](#日志下位机程序说明)

    > 注：串口与日志功能不冲突，可以同时使用

2. 下载发行版文件，解压后双击`LinkGDBserial.exe`运行程序

3. 点击设置符号文件，然后设置要查看的变量

    * 添加变量

        * 在变量选择窗口添加（须先设置符号文件）

        * 在主窗口表格最后一行的变量名处手动填写

    * 删除变量

        * 在变量名上单击右键

        * 单击选中变量名后按Del键

    > 注：添加的变量名可以是任何合法的C语言表达式，可参考[进阶使用说明](#进阶使用说明)；结构体等复合类型只能查看，不能修改和绘图

4. 选择连接模式，连接芯片，连接成功后程序开始采样

    * 调试器模式下，在下拉框中选择调试器和芯片类型，点击连接目标；或勾选“外部进程”后直接连接到正在运行的OpenOCD进程

    * 串口模式下，点击刷新串口加载串口列表，选中所连接的串口，点击连接目标

5. 编辑`修改变量`列可以修改变量值，双击`图线颜色`列可以选择绘图颜色

6. 单击`变量名`列选中对应的变量，绘图窗口会加粗绘制波形，左下角会显示当前值和查看值（拖动鼠标进行查看）

7. 绘图界面中滚轮配合`Ctrl`、`Shift`、`Alt`可以实现画面的缩放和移动

![示意图](/pictures/2025-02/LinkGDB.png)

![操作演示](/pictures/2025-02/oper-sample.gif)

![日志输出](/pictures/2025-02/log-sample.gif)

### 主要菜单项说明

* `刷新连接配置`：若自行编写了配置文件，可以通过该菜单项将配置文件加载到下拉选框中，可参考[进阶使用说明](#进阶使用说明)
* `保存配置`：软件中所配置的连接模式、调试器型号、芯片型号、符号文件路径和各变量的配置都可以通过该菜单项保存到一个配置文件中
* `导入配置`：将上述保存的配置文件重新载入软件中
* `导出数据`：将获取到的各变量采样数据导出到CSV表格文件
* `高级设置`：打开高级设置窗口，可以设置串口参数配置、采样频率、GDB端口等

**下载链接:** 通过网盘分享的文件：LinkGDBserial
链接: https://pan.baidu.com/s/1wvWXbn7fzidBLCKYLZJdpg?pwd=2e57 提取码: 2e57
{: .notice--info}



---

### 进阶使用说明

* 在变量名处可以填写任意GDB支持的C语言表达式

    假设目标程序的`main.c`中含有如下全局变量

    ```c
    static int g_int = 0; //静态全局变量
    int g_arr[10] = {0}; //全局数组
    struct Pack {
        int var1,var2;
    } g_pack = {0}; //全局结构体变量
    ```

    则可以通过变量名实现下列查看

    ```c
    g_int //查看变量g_int的值
    &g_int //查看g_int的地址
    g_pack.var1 //查看g_pack中var1成员变量的值
    g_pack.var1+g_pack.var2 //对两个变量求和
    p_arr[0] 或 *g_arr //查看g_arr数组的第一个元素
    g_pack //查看整个结构体(不能绘图)
    g_arr[2]@3 //查看g_arr[2]至g_arr[4](不能绘图)
    'main.c'::g_int //指定查看main.c文件中的g_int
    *(int*)0x20005c5c //查看0x20005c5c地址上的一个int数据(此方式无需设置符号文件也能用)
    ```

* 可以通过修改OpenOCD配置文件自定义调试器模式下的连接

    * 配置文件位于`openocd/share/openocd/scripts`下的`target`和`interface`文件夹中，可以在其中进行修改或添加

    * 配置语法可以参考[OpenOCD官方文档](https://openocd.org/doc/html/Config-File-Guidelines.html)

    * 若新增了配置文件，可以通过`刷新连接配置`菜单项将其载入到软件下拉选框中

---

#### 使用注意事项

* 若不指定符号文件，无法使用变量名，只能通过绝对地址进行查看

* 修改符号文件路径后需要重新连接

* 本程序不带下载功能，连接目标前请确认已为目标芯片下载过指定程序；若更换为不同类型的调试器，即使芯片程序没有变动，也应使用更换后的调试器再次下载程序

* 下位机程序应使用与上位机同时发行的版本，更新上位机软件后应同时更新下位机程序



## 其他说明

**关于采样速度**

* 采样速度与CPU占用率、添加的变量数量、日志输出频率等因素相关，程序会以尽可能高的速度进行采样

* 简介中介绍的采样速度是在`i5-8265U`CPU接近空载时，添加单个变量并关闭日志的情况下测试得到的

* 调试器模式下获取单条日志用时约50ms，串口模式约90ms，获取过程中无法进行采样，若日志数量较多则会对采样速度造成较大影响

**关于实际支持的设备**

* 虽然理论上支持内置OpenOCD所支持的所有设备，但受各种因素影响，实际使用时仍可能在部分设备上无法工作

* 目前已测试过的设备如下：

    * 调试器：STLINK-V2、CMSIS-DAP

    * 目标芯片：STM32F103RCT6、STM32F103C8T6、STM32F407ZGT6、STM32F407IGH6、ESP32C3(内置JTAG+[专用OpenOCD](https://github.com/espressif/openocd-esp32))

---

## 日志下位机程序说明


### 相关文件

本下位机程序包含`log.c`、`log.h`两个文件
log.c文件 

```c
#include "log.h"

#ifdef LOG_ENABLE
//日志缓冲区定义
LogQueue logQueue={LOG_MAX_QUEUE_SIZE};
#endif
```
log.h文件
```c
#ifndef _LOG_H_
#define _LOG_H_

/**************↓配置区↓**************/

//标准库头文件
//若不希望使用对应函数可注释头文件后修改下方函数宏实现相应功能
#include <stdio.h> //使用sprintf
#include <string.h> //使用memcpy、strlen
//标准库函数移植宏
#define LOG_MEMCPY(dst,src,len) memcpy(dst,src,len) //内存拷贝
#define LOG_SPRINTF(buf,fmt,...) sprintf(buf,fmt,##__VA_ARGS__) //格式化字符串
#define LOG_STRLEN(str) strlen(str) //计算字符串长度

//日志缓冲区大小，总大小为下列两个值的乘积
#define LOG_MAX_LEN 100 //单条日志缓冲区大小，包含日志内容、时间戳、函数名等信息，建议不小于100
#define LOG_MAX_QUEUE_SIZE 10 //缓冲区可存日志条数

//获取时间戳接口(启动后经过的毫秒数)
#define LOG_GET_MS() HAL_GetTick() //本例使用STM32-HAL

//获取语句所在函数名的宏(一般由编译器提供)
#define LOG_GET_FUNC_NAME() (__FUNCTION__)

//是否开启日志输出(注释掉则所有输出语句会替换为空语句)
#define LOG_ENABLE

/**************↑配置区↑**************/

/**************↓日志输出接口↓**************/
//信息日志
#define LOG_INFO(tag,msg,...) LOG_ADD_FORMAT('i',(tag),(msg),##__VA_ARGS__)
//调试日志
#define LOG_DEBUG(tag,msg,...) LOG_ADD_FORMAT('d',(tag),(msg),##__VA_ARGS__)
//警告日志
#define LOG_WARN(tag,msg,...) LOG_ADD_FORMAT('w',(tag),(msg),##__VA_ARGS__)
//错误日志
#define LOG_ERROR(tag,msg,...) LOG_ADD_FORMAT('e',(tag),(msg),##__VA_ARGS__)
/**************↑日志输出接口↑**************/

//日志缓冲区类型，以队列方式存储
typedef struct{
	int maxSize; //队列最大长度，初始化时须赋值为LOG_MAX_QUEUE_SIZE
	char buf[LOG_MAX_QUEUE_SIZE][LOG_MAX_LEN]; //实际存储空间
	int lenBuf[LOG_MAX_QUEUE_SIZE]; //与buf一一对应，表示存储的日志长度
	int size,startPos;//当前队列长度和队头位置
}LogQueue;

#ifdef LOG_ENABLE
//日志输出集中处理，添加一条日志到缓冲区
#define LOG_ADD_FORMAT(attr,tag,msg,...) if(logQueue.size<LOG_MAX_QUEUE_SIZE){ \
	int index=(logQueue.startPos+logQueue.size+1)%LOG_MAX_QUEUE_SIZE; \
	char *bufStartAddr=logQueue.buf[index],*buf=bufStartAddr; int termLen=0; \
	*buf=attr; buf+=1; \
	termLen=LOG_STRLEN(tag)+1; LOG_MEMCPY(buf,tag,termLen); buf+=termLen; \
	LOG_SPRINTF(buf,msg,##__VA_ARGS__); termLen=LOG_STRLEN(buf)+1; buf+=termLen; \
	LOG_SPRINTF(buf,"%d",LOG_GET_MS()); termLen=LOG_STRLEN(buf)+1; buf+=termLen; \
	termLen=LOG_STRLEN(LOG_GET_FUNC_NAME())+1; LOG_MEMCPY(buf,LOG_GET_FUNC_NAME(),termLen); buf+=termLen; buf+=termLen; \
	logQueue.lenBuf[index]=buf-bufStartAddr; logQueue.size++; \
}
//声明缓冲区定义，实际定义可在任意一个源文件中
extern LogQueue logQueue;
#else
#define LOG_ADD_FORMAT(attr,tag,msg,...)
#endif

#endif
```

### 配置项

* **标准库函数配置项**

    * `#define LOG_MEMCPY(dst,src,len)`：内存拷贝函数，默认使用`string.h`中的`memcpy`函数

    * `#define LOG_SPRINTF(buf,fmt,...)`：格式化字符串打印函数，默认使用`stdio.h`中的`sprintf`函数

    * `#define LOG_STRLEN(str)`：字符串长度计算函数，默认使用`string.h`中的`strlen`函数

    > 注：标准库函数配置项是为了平台不支持标准库函数的情况设计的，一般无需修改

* **缓冲区大小配置项**

    * `#define LOG_MAX_LEN`：单条日志数据最大长度，包含日志标签、日志内容、时间戳、函数名等数据，建议不小于100

    * `#define LOG_MAX_QUEUE_SIZE`：缓冲区能存放的最大日志条数，需根据日志打印频率确定，默认值为10

    > 注：缓冲区总占用内存大小为上述两项的乘积，若短时间写入多条日志可能导致缓冲区溢出，后输出的日志将被丢弃

* **其他配置项**

    * `#define LOG_GET_MS()`：获取时间戳接口，需返回系统启动以来的毫秒数

    * `#define LOG_GET_FUNC_NAME()`：获取宏展开位置的函数名，一般由编译器提供`__FUNCTION__`宏实现，若平台不支持可替换为空字符串`("")`

    * `#define LOG_ENABLE`：日志输出使能项，若注释掉则所有输出语句将被替换为空语句


### 日志输出接口

* `#define LOG_INFO(tag,msg,...)`：输出信息日志，`tag`为日志标签，`msg`为日志内容，日志内容中可包含格式化占位符，与后面的可变参数一起进行格式化输出

    > 例：`LOG_INFO("sys","code=%d",123); //输出的日志标签为"sys"，日志内容为"code=123"`

* `#define LOG_DEBUG(tag,msg,...)`：输出调试日志，用法与信息日志相同

* `#define LOG_WARN(tag,msg,...)`：输出警告日志，用法与信息日志相同

* `#define LOG_ERROR(tag,msg,...)`：输出错误日志，用法与信息日志相同

### 移植说明

1. 将`log.h`和`log.c`添加到工程目录中

    > 注：若不想新增`log.c`文件或编译器不支持多个源文件，可以将其中的内容放入任何一个源文件中

2. 根据所用平台修改配置项

    * **一般情况下只需修改时间戳配置`LOG_GET_MS`即可**，其余参数可以保持默认

    * 若下位机内存不够，或希望输出更长的日志，或希望一次性写入更多条日志，可修改缓冲区大小配置`LOG_MAX_QUEUE_SIZE`、`LOG_MAX_LEN`

    * 若编译器不支持`__FUNCTION__`宏，需要将`LOG_GET_FUNC_NAME`替换为空字符串

    * 若编译器不支持标准库函数，需要自行实现各函数并替换到对应宏定义中

3. 在需要使用日志的文件中引用`log.h`，然后调用接口进行日志输出即可，上位机会定时查看并移除日志缓冲区中的数据

### 注意事项

* 日志输出频率不能持续过高，上位机读取速度约为10条/s，若长时间高于该频率输出日志会使缓冲区溢出而导致日志丢失

---

## 串口下位机程序说明

### 相关文件

本下位机程序仅包含单个文件`debug.c`文件
```c
// debug.c
#include <stdint.h>

#include "usart.h" //本例使用STM32，其他平台无需引用此头文件

/**************↓配置区↓**************/
//串口发送语句，需实现将buf指向的len个字节通过串口发出
#define DEBUG_SEND(buf,len) HAL_UART_Transmit_IT(&huart1,(buf),(len))
//复位指令，若设备不支持或无需此功能可不定义
#define DEBUG_RESET() { \
	__set_FAULTMASK(1); \
	NVIC_SystemReset(); \
}
//读地址限制条件，若请求的地址addr不符合条件则返回0x00，无需限制可不定义
#define DEBUG_READ_ADDR_RANGE(addr) (addr>=0x20000000 && addr<=0x20001000)
//写地址限制条件，若请求的地址addr不符合条件则不会写入，无需限制可不定义
#define DEBUG_WRITE_ADDR_RANGE(addr) (addr>=0x20000000 && addr<=0x20001000)
//读写偏移地址，无偏移可不定义
#define DEBUG_ADDR_OFFSET 0x00000000
/**************↑配置区↑**************/

//接收缓存区（循环队列）大小，不建议修改
#define DEBUG_RXBUF_SIZE 30
//发送缓存区大小，不建议修改
#define DEBUG_TXBUF_SIZE 30

//数据帧格式：帧头1B+帧长1B+命令码1B+数据
//固定帧头
#define DEBUG_FRAME_HEADER 0xDB
//命令码枚举，用于标记数据帧类型
typedef enum{
	SerialCMD_ReadMem, //读内存数据
	SerialCMD_WriteMem, //写内存数据
	SerialCMD_Reset //复位
}SerialCMD;

//串口发送缓存区
uint8_t debugTxBuf[DEBUG_TXBUF_SIZE];

//以下实现了一个循环队列用于串口接收，无溢出检查
struct{
	uint8_t buf[DEBUG_RXBUF_SIZE]; //缓存区
	uint16_t startPos,endPos; //队头队尾指针
}debugRxQueue={0};
//入队一个字符
#define DEBUG_QUEUE_PUSH(ch) { \
	debugRxQueue.buf[debugRxQueue.endPos++]=(ch); \
	if(debugRxQueue.endPos>=DEBUG_RXBUF_SIZE) \
		debugRxQueue.endPos-=DEBUG_RXBUF_SIZE; \
}
//出队一个字符
#define DEBUG_QUEUE_POP() { \
	debugRxQueue.startPos++; \
	if(debugRxQueue.startPos>=DEBUG_RXBUF_SIZE) \
		debugRxQueue.startPos-=DEBUG_RXBUF_SIZE; \
}
//获取队头字符
#define DEBUG_QUEUE_TOP() (debugRxQueue.buf[debugRxQueue.startPos])
//获取队列大小
#define DEBUG_QUEUE_SIZE() \
	(debugRxQueue.startPos<=debugRxQueue.endPos? \
	debugRxQueue.endPos-debugRxQueue.startPos: \
	debugRxQueue.endPos+DEBUG_RXBUF_SIZE-debugRxQueue.startPos)
//获取队列第pos个元素
#define DEBUG_QUEUE_AT(pos) \
	(debugRxQueue.startPos+(pos)<DEBUG_RXBUF_SIZE? \
	debugRxQueue.buf[debugRxQueue.startPos+(pos)]: \
	debugRxQueue.buf[debugRxQueue.startPos+(pos)-DEBUG_RXBUF_SIZE])

//函数声明
void Debug_SerialRecv(uint8_t *buf,uint16_t len);
void Debug_ParseBuffer(void);

//串口收到数据后传入本函数进行解析，需被外部调用
void Debug_SerialRecv(uint8_t *buf,uint16_t len)
{
	for(uint16_t i=0;i<len;i++) //将收到的数据依次入队
		DEBUG_QUEUE_PUSH(buf[i]);
	Debug_ParseBuffer(); //进入解析
}

//解析串口数据
void Debug_ParseBuffer()
{
	if(DEBUG_QUEUE_AT(0)==DEBUG_FRAME_HEADER) //第一个字节为帧头，可以继续解析
	{
		if(DEBUG_QUEUE_SIZE()>2 && DEBUG_QUEUE_SIZE()>=DEBUG_QUEUE_AT(1)) //帧长足够，可以解析
		{
			uint16_t frameLen=DEBUG_QUEUE_AT(1);//读出帧长
			uint8_t cmd=DEBUG_QUEUE_AT(2); //读出命令码
			if(cmd==SerialCMD_ReadMem) //若要读取内存数据
			{
				uint8_t byteNum=DEBUG_QUEUE_AT(3); //要读取的字节数
				if(byteNum>DEBUG_TXBUF_SIZE-3) //限制读取的字节数不能使帧长超过发送缓冲区大小
					byteNum=DEBUG_TXBUF_SIZE-3;
				uint32_t addr=0; //计算目标地址
				for(uint8_t i=0;i<4;i++)
					addr|=((uint32_t)DEBUG_QUEUE_AT(4+i))<<(i*8);
				#ifdef DEBUG_ADDR_OFFSET
					addr+=DEBUG_ADDR_OFFSET;
				#endif
				debugTxBuf[0]=DEBUG_FRAME_HEADER; //构建发送数据帧
				debugTxBuf[1]=byteNum+3;
				debugTxBuf[2]=SerialCMD_ReadMem;
				for(uint8_t i=0;i<byteNum;i++) //依次写入指定地址的数据
				{
					uint8_t byte=0;
					#ifdef DEBUG_READ_ADDR_RANGE
					if(DEBUG_READ_ADDR_RANGE((addr+i)))
					#endif
						byte=*(uint8_t*)(addr+i);
					debugTxBuf[i+3]=byte;
				}
				DEBUG_SEND(debugTxBuf,byteNum+3); //串口发送
				for(uint8_t i=0;i<frameLen;i++) //将本帧出队
					DEBUG_QUEUE_POP();
			}
			else if(cmd==SerialCMD_WriteMem) //若要写入内存数据
			{
				uint8_t byteNum=frameLen-7; //要写入的字节数
				uint32_t addr=0; //计算目标地址
				for(uint8_t i=0;i<4;i++)
					addr|=((uint32_t)DEBUG_QUEUE_AT(3+i))<<(i*8);
				#ifdef DEBUG_ADDR_OFFSET
					addr+=DEBUG_ADDR_OFFSET;
				#endif
				for(uint8_t i=0;i<byteNum;i++) //依次写入数据
				{
					#ifdef DEBUG_WRITE_ADDR_RANGE
					if(DEBUG_WRITE_ADDR_RANGE((addr+i)))
					#endif
						*(uint8_t*)(addr+i)=DEBUG_QUEUE_AT(7+i);
				}
				for(uint8_t i=0;i<frameLen;i++) //将本帧出队
					DEBUG_QUEUE_POP();
			}
			else if(cmd==SerialCMD_Reset) //若要复位
			{
				#ifdef DEBUG_RESET
				DEBUG_RESET();
				#endif
			}
			if(DEBUG_QUEUE_SIZE()>0) //若后面还有数据，进行递归解析
				Debug_ParseBuffer();
		}
	}
	else //数据帧错误
	{
		while(DEBUG_QUEUE_AT(0)!=DEBUG_FRAME_HEADER && DEBUG_QUEUE_SIZE()>0) //将错误数据出队
			DEBUG_QUEUE_POP();
		if(DEBUG_QUEUE_SIZE()>0) //若后面还有数据，继续解析
			Debug_ParseBuffer();
	}
}

```

### 配置项

* **`#define DEBUG_SEND(buf,len)`：需配置为所用平台的串口发送语句，将buf所指向的len个字节通过串口发出

* `#define DEBUG_RESET()`：需配置为所用平台的复位语句，上位机中点击复位并运行时会调用该语句

* `#define DEBUG_READ_ADDR_RANGE(addr)`：读地址限制条件，若请求的地址addr不符合条件则返回0x00

* `#define DEBUG_WRITE_ADDR_RANGE(addr)`：写地址限制条件，若请求的地址addr不符合条件则不会写入 

* `#define DEBUG_ADDR_OFFSET`：读写偏移地址，下位机会将收到的指令加上该偏移量后再进行读写操作

> 注：带**的项为必需配置，其余项若不需要对应功能可不定义

---

### 函数接口

* `void Debug_SerialRecv(uint8_t *buf,uint16_t len);`：外部程序需要在收到串口数据时调用该函数进行解析，buf为数据首地址，len为字节数

    > 注：程序使用循环队列作为接收数据缓存，自动处理分包和粘包，因此无需保证一次性传入完整数据帧，但应保证一个数据帧接收结束时及时调用该函数



### 移植说明

1. 开启一个串口，将下位机程序添加到项目工程中

2. 修改配置项

3. 在收到串口数据时调用`Debug_SerialRecv`函数


### 问题处理

**上位机点击连接后显示读取超时，下位机还在正常运行**

* 检查串口连接是否正常，包括串口参数配置（波特率等）、硬件接线、下位机相关程序等，确保下位机能收到串口数据并返回结果

**上位机点击连接后显示读取超时，下位机出现运行异常（进入硬件错误或发生复位现象等）**

* 这是读写地址越界导致的现象，请参照芯片手册将允许读写的地址上下限写到配置项`DEBUG_READ_ADDR_RANGE`和`DEBUG_WRITE_ADDR_RANGE`中

**上位机正常连接，但显示的数值不正确**

* 可能是由于下位机的实际地址与上位机符号文件间存在偏移导致的，需要测量出该偏移并写到配置项`DEBUG_ADDR_OFFSET`中

* 偏移测量方法：

    * 选取任意一个变量（假设为`var`）
    
    * 在上位机中查看变量`&var`的值（即为符号文件中的地址）
    
    * 在下位机程序中打印出`&var`的值（即为下位机中的实际地址）
    
    * 将两个值相减即可得到偏移（实际地址-符号文件地址）

---

### 移植示例

#### STM32 & HAL & 中断收发

```c

/****Debug.c****/
//...
//串口发送指令（使用串口1）
#define DEBUG_SEND(buf,len) HAL_UART_Transmit_IT(&huart1,(buf),(len))
//复位指令
#define DEBUG_RESET() { \
    __set_FAULTMASK(1); \
    NVIC_SystemReset(); \
}
//...

/****main.c****/
//...
int main(void)
{
    //...(需先进行串口初始化)
    __HAL_UART_ENABLE_IT(&huart1,UART_IT_RXNE); //使能串口RXNE中断
    //...
    while(1)
    {
        //...
    }
}
//...

/****stm32f1xx_it.c****/
//...
void USART1_IRQHandler(void) //串口中断服务函数
{
    if(__HAL_UART_GET_FLAG(&huart1,UART_FLAG_RXNE)!=RESET) //判定为RXNE中断
    {
        uint8_t ch=huart1.Instance->DR; //读出收到的字节
        Debug_SerialRecv(&ch,1); //进行解析
    }
}
//...

```

#### Arduino 串口轮询方式

```c++

/****main.ino****/

//...
#define DEBUG_SEND(buf,len) Serial.write((buf),(len))
//...(下位机程序其他部分)

void setup()
{
    //...
    Serial.begin(115200); //初始化串口波特率为115200
    //...
}

void loop()
{
    while(Serial.available())
    {
        uint8_t ch=Serial.read(); //读出串口数据
        Debug_SerialRecv(&ch,1); //进行解析
    }
    //...其余代码不能有阻塞情况，需尽快执行完毕
}

```
