---
title: "【开源分享】BeagleBone Black单板计算机."
header:
  overlay_color: "#333"
categories: 
  - 硬件设计
tags:
  - Cadence
toc: true
---



# 详细的硬件设计

本节提供了 Hardware design 的详细说明。 这对于连接、编写驱动程序或使用它来提供帮助非常有用 修改您自己设计的细节。

[![BeagleBone Black 框图](https://docs.beagle.cc/_images/image30.jpg)](https://docs.beagle.cc/_images/image30.jpg)

*图片 427* BeagleBone Black 框图

## 电源部分

[![高级电源框图](https://docs.beagle.cc/_images/image31.png)](https://docs.beagle.cc/_images/image31.png)

*图 428* High Level Power 框图

本节介绍设计的 power 部分和所有 *TPS65217C*执行的函数。

### TPS65217C PMIC

系统中的主要电源管理 IC （PMIC） 是 *TPS65217C*它是一个单芯片电源管理 IC，由线性 双输入电源路径、3 个降压转换器和 4 个 LDO。LDO （LDO） 代表 Low Drop Out。如果您想了解更多关于 LDO 的信息，您可以 转到 [http://en.wikipedia.org/wiki/Low-dropout_regulator](https://en.wikipedia.org/wiki/Low-dropout_regulator) 。如果您想了解有关降压转换器的更多信息，您可以访问

[http://en.wikipedia.org/wiki/DC-to-DC_converter](https://en.wikipedia.org/wiki/DC-to-DC_converter)

系统由 USB 端口或 DC 适配器供电。三 高效 2.25MHz 降压转换器旨在提供 板子的内核电压、MPU 和内存电压。

降压转换器在轻负载时进入低功耗模式，以 在尽可能宽的负载电流范围内实现最高效率。 对于低噪声应用，这些器件可以强制固定 频率 PWM 使用 I2C 接口。降压转换器允许 使用小型电感器和电容器实现小尺寸 solution size 的 solution size。

LDO1 和 LDO2 旨在支持系统待机模式。在正常情况下 作，它们每个可以支持高达 100mA 的电流。LDO3 和 LDO4 可以支持 每个高达 285mA。

默认情况下，只有 LDO1 始终导通，但任何电源轨都可以配置为 保持 SLEEP 状态。特别是 DCDC 转换器可以保留 在低功耗 PFM 模式下启动 以支持处理器挂起模式。*TPS65217C* 提供灵活的上电和断电排序，以及 多种内务处理功能，如电源良好输出、按钮 监视器、硬件复位功能和温度传感器，以保护 电池。

有关 *TPS65217C* 的更多信息，请参阅 http://www.ti.com/product/tps65217C

[![TPS65217C框图](https://docs.beagle.cc/_images/image37.png)](https://docs.beagle.cc/_images/image37.png)

*图片 429* TPS65217C 框图

### 直流输入

[![TPS65217 DC 连接](https://docs.beagle.cc/_images/image38.png)](https://docs.beagle.cc/_images/image38.png)

*图片 430* TPS65217 DC 连接

5VDC 电源可用于为电路板供电。功率 电源电流取决于扩展板的数量和类型 连接到 Board。对于典型使用，额定电流为 1A 的 5VDC 电源 应该足够了。如果较重地使用扩展接头或 USB 需要 host 端口，则需要更高的电流供应。

使用的连接器是一个 2.1MM 中心正极 x 5.5mm 外筒。这 5VDC 导轨连接到扩展接头。可以供电 板卡通过扩展卡的扩展针座。5VDC 是 当电源由 板上的 5VDC 插孔。

### USB 电源

该板也可以从 USB 端口供电。典型的 USB 端口是 限制为最大 500mA。从 USB 端口供电时，VDD_5V导轨 未提供给扩展接头，因此需要 5V 的 capes 铁路供应开普敦直达，绕过*TPS65217C*，将不会有 该导轨可供使用。USB 端口的 5VDC 电源是 在 SYS_5V 上提供，即来自 **TPS65217C** 导轨的那个 的扩展标头供 Cape 使用。*图 24* 是连接 PMIC 上的 USB 电源输入。

[![USB 电源连接](https://docs.beagle.cc/_images/image96.png)](https://docs.beagle.cc/_images/image96.png)

*图片 431* USB 电源连接

### 功率选择

选择 5VDC 或 USB 作为电源是 在内部处理到*TPS65217C*并自动切换到 5VDC 如果两者都连接，则为 power。软件可以通过 处理器的 I2C 接口。此外，SW 可以读取 **TPS65217C** 并确定主板是否在 5VDC 输入上运行 或 USB 输入。了解 电路板为工作频率等提供电流，以及 扩展卡。

可以从 USB 输入为板供电，然后连接 DC 电源。板将自动切换到 DC 输入。

### 电源按钮

电源按钮连接到 *TPS65217C* 的输入端。这是一个 Momentary Switch，用于 reset 和 boot 的相同类型的 switch 选择。

如果按下该按钮，*TPS65217C* 将向 处理器。然后由处理器拉动**PMIC_POWER_EN** pin low 在正确的时间关闭电路板的电源。此时， 假设电源输入未被移除，PMIC 仍然处于活动状态。 按下电源按钮将导致板子再次上电，如果 processor 将主板置于 Power Off 模式。

在关机模式下，RTC 导轨仍处于活动状态，保持 RTC 供电 并关闭主电源输入。如果您移除该电源，则 RTC 将不通电。您还可以选择使用电池 如果需要，板上的孔用于连接电池，如 next 部分。

如果按住按钮超过 8 秒，则 PMIC 将关闭电源。但是，当电源 LED 指示灯亮起时，您必须松开按钮 关闭。按住按钮超过该点将导致板 重启。

### 电池访问垫

板上提供了四个焊盘，用于访问电池引脚 在*TPS65217C*。焊盘可以加载 4x4 接头，或者您可以 只需将电池连接到垫子中即可。此外，他们还可以提供访问权限 如果需要，通过海角。这四个信号在下面*的表 3* 中列出。

| 针          | 指定     | 功能                                              |
| ----------- | -------- | ------------------------------------------------- |
| **蝙蝠**    | TP5 系列 | 电池连接点                                        |
| **意义**    | TP6 系列 | 电池电压感应输入，直接在电池端子处连接到 BAT。    |
| **TS 系列** | TP7 系列 | 温度感应输入。连接到 NTC 热敏电阻以感应电池温度。 |
| **接地**    | TP8 系列 | 系统接地。                                        |

*TPS65217C* 不提供电量计功能。那会 如果需要该功能，则需要添加。如果要添加 电量计，可选择使用 1-Wire SPI 或 I2C 器件。您将需要 使用扩展标头添加此 URL 并将其放置在扩展上 板。

注意： 在*将任何东西连接到这些引脚之前**，请参阅 TPS65217C 文档* +。

### 功耗

该板的功耗因电源场景和 板启动进程。使用板子在 以下配置：

- DC 供电和 USB 供电
- 已连接 HDMI 监视器
- USB 集线器
- 4GB USB 闪存驱动器
- 以太网连接 @ 100M
- 已连接串行调试电缆

| 模式              | USB接口 | 直流 | DC+USB 接口 |
| ----------------- | ------- | ---- | ----------- |
| 重置              | 待定    | 待定 | 待定        |
| 怠速 @ UBoot      | 210     | 210  | 210         |
| 内核引导 （峰值） | 460     | 460  | 460         |
| 内核空闲          | 350     | 350  | 350         |
| 内核空闲显示空白  | 280     | 280  | 280         |
| 加载网页          | 430     | 430  | 430         |

电流会随着各种激活的发生而波动，例如 LED on 和 microSD/eMMC 访问。

### 处理器接口

*TPS65217C*处理器通过几个不同的 信号。下面将介绍这些信号中的每一个。

**I2C0 封装**

I2C0 是处理器和 *TPS65217C* 之间的控制接口。 它允许处理器控制 **TPS65217C** 内的寄存器，用于电压缩放和输入轨的切换等作。

**PMIC_POWR_EN**

通电时，*VDD_RTC*轨首先激活。在 RTC 电路之后 在处理器已激活时，它会指示**TPS65217C** 启动 通过*PMIC_POWR_EN*采取 它嗨。当断电时，处理器可以将此引脚置于低电平以启动 Power Down 进程。

**LDO_GOOD**

该信号连接到 *RTC_PORZn* 信号，RTC 上电复位。这 小 *N 表示该信号是低电平有效信号。词 处理器似乎无法在单词上加上一个条，所以 **n** 是 常用于电子领域。由于 RTC 电路首先出现，因此 信号指示 LDO（1.8V VRTC 电源轨）已启动且稳定。 这将启动启动过程。

**PMIC_PGOOD**

一旦所有 rails 都启动，*PMIC_PGOOD* 信号就会变高。这 释放处理器上的 **PORZn** 信号，该处理器保存 处理器重置。

**唤醒**

来自 *TPS65217C* 的 WAKEUP 信号连接到处理器上的 **EXT_WAKEUP** 信号。这用于在处理器 处于睡眠模式。当 *TPS65217C* 检测到事件时，例如 当按下 Power 按钮时，它会生成此信号。

**PMIC_INT**

*PMIC_INT* 信号是发送到处理器的中断信号。紧迫 电源按钮将向处理器发送中断，允许其 有序地实现掉电模式，进入睡眠模式， 或使其从睡眠模式中唤醒。所有这些都需要 SW 支持。

### 电源轨

[![电源轨](https://docs.beagle.cc/_images/image39.jpg)](https://docs.beagle.cc/_images/image39.jpg)

*图片 432* 电源轨

**VRTC 导轨**

*VRTC* 轨是 1.8V 轨，是 电源排序。它为处理器上的 RTC 域供电 以及 **TPS65217C** 的 I/O 导轨。它可以提供高达 250mA 的电流 最大。

**VDD_3V3A Rail**

*VDD_3V3A* 导轨由 **TPS65217C** 提供，并提供 处理器导轨为 3.3V，可提供高达 400mA 的电流。

**VDD_3V3B Rail**

*VDD_3V3A*轨提供的电流不足以供电 板上的所有 3.3V 电源轨。因此，提供了第二个 LDO，U4， **TL5209A**，用于获取 *VDD_3V3B* 轨。它只是通电 在*VDD_3V3A*轨之后。

**VDD_1V8 Rail**

*VDD_1V8* 轨可提供高达 400mA 的电流并提供电源 处理器和 HDMI 成帧器上的 1.8V 轨需要。这 Rail 无法在主板上的其他任何位置使用。

**VDD_CORE Rail**

*VDD_CORE*轨可在 1.1V 电压下提供高达 1.2A 的电流。此栏杆不是 可在电路板上的其他任何位置使用，并且只能连接到 处理器。此电源轨固定在 1.1V，不应由 SW 调整 使用 PMIC。如果这样做，则处理器将不再工作。

**VDD_MPU Rail**

*VDD_MPU*轨可提供高达 1.2A 的电流。此栏杆不可触及 用于主板上的任何其他位置，并且仅连接到处理器。 此电源轨默认为 1.1V，可以放大以允许更高的 频率作。电压的变化是通过 I2C 设置的 接口。

**VDDS_DDR Rail**

*VDDS_DDR*轨默认为 1.5V** 以支持 DDR3L 轨和 可提供高达 1.2A 的电流。可以将此电压轨向下调整 降至 *1.35V*，以实现 DDR3L 器件的低功耗运行。仅 DDR3L 器件可以支持 1.35V 的电压设置。

**电源排序**

加电过程由几个阶段和事件组成。*图 26* 描述了构成 处理器。此图在其他地方用于传达 其他信息。我认为没有必要把它缩小 图。它来自 Texas 提供的处理器数据表 仪器。

[![Power Rail 上电排序](https://docs.beagle.cc/_images/image40.png)](https://docs.beagle.cc/_images/image40.png)

*图片 433* Power Rail 上电排序

*图 27* **TPS65217C** 的电压轨排序 上电和每个电源轨上的电压。电源排序从 15 然后去 1 个。这就是 *TPS65217C* 的配置方式。 有关更多信息，请参阅 TPS65217C 数据表。

[![TPS65217C Power Sequencing 时序](https://docs.beagle.cc/_images/image41.png)](https://docs.beagle.cc/_images/image41.png)

*图片 434* TPS65217C Power Sequencing 时序

### 电源 LED 指示灯

电源 LED 是一个蓝色 LED，一旦*TPS65217C*亮起 已完成 Power up 程序。如果您看到 LED 闪烁一次， 这意味着 TPS65217C** 启动了进程并遇到了 导致其关闭的问题。LED 的连接如图 *25* 所示。

### TPS65217C Power Up 过程

下图显示了 **TPS65217C** 和 处理器。它是从原理图的 PDF 格式中剪切出来的，反映了 原理图上的内容。

[![电源处理器接口](https://docs.beagle.cc/_images/image42.jpg)](https://docs.beagle.cc/_images/image42.jpg)

*图片 435* 电源处理器介面

当施加 DC 或 USB 电压时，*TPS65217C* 连接电源 到驱动开关和 LDO 的 SYS 输出引脚 **TPS65217C**。

通电时，除 VRTC LDO （1.8V） 外，所有开关和 LDO 均关闭，*VRTC LDO* （1.8V） 为 VRTC 电源轨和控制器供电 **处理器的 RTC_PORZn** 输入引脚，用于启动电源 处理器的进程。一旦 RTC 轨上电，*RTC_PORZn* 引脚由来自 *TPS65217C* 的 *LDO_PGOOD* 信号驱动，则 处理器被释放。

释放 *RTC_PORZn* 重置后，处理器将启动 初始化过程。RTC 稳定后，处理器启动 通过激活连接到启动 *TPS65217C* 上电过程的 **TPS65217C PMIC_POWER_EN** 信号来执行 Power Up 过程的其余部分。

*LDO_PGOOD* 信号由 TPS65217C 提供给处理器。 由于该信号是来自*TPS65217C*的 1.8V，因此*TPS65217C* VIO 轨设置为 1.8V，而处理器上的 *RTC_PORZ* 信号 为 3.3V，使用电压电平转换器 *U4*。一旦 LDO 和 切换器*TPS65217C*启动，此信号激活释放 处理器。*TPS65217C*上的 LDO 用于为 VRTC 供电 处理器上的滑轨。

### 处理器控制接口

上面的*图 28* 显示了处理器和 上电序列后用于控制的**TPS65217C**具有 完成。

第一个是 *I2C0* 总线。这允许处理器打开并 off rails 并将每个稳压器的电压电平设置为 supports 例如电压缩放。

第二个是中断信号。这允许 *TPS65217C* 发出警报 处理器（当发生事件时，例如当电源按钮为 压。中断是一个开漏输出，这使得它很容易 连接到处理器的 3.3V 接口。

### 低功耗模式支持

本节介绍三种可用的常规 Power Down 模式。 这些模式仅从硬件的角度进行描述，因为它相关 到 HW 设计。

**仅限 RTC**

在此模式下，除 *VDD_RTC* 外，所有 rails 均处于关闭状态。这 处理器需要关闭所有 Rails 才能进入此模式。 保持开启状态的 **VDD_RTC** 将使 RTC 保持活动状态，并提供 唤醒接口激活以响应唤醒事件。

**RTC 加 DDR**

在此模式下，除 *VDD_RTC* 和 **VDDS_DDR**，为 DDR3L 内存提供动力。处理器将需要 关闭所有滑轨以进入此模式。*VDD_RTC* 将保持 RTC 处于活动状态，并提供唤醒接口 active 响应唤醒事件。

DDR3L 的 *VDDS_DDR* 轨由 1.5V 轨提供 **TPS65217C，VDDS_DDR**处于活动状态时，可以将 DDR3L 放置在 处理器在断电前的自刷新模式，允许 要保存的内存数据。

目前，标准软件中不包含此功能 释放。计划将其包含在未来的版本中。

**电压缩放**

对于在不进入睡眠状态的情况下可以实现最低功率的模式， 此模式允许降低 ARM 处理器上的电压 降低处理器频率。I2C0 总线用于 控制 *TPS65217C* 中的电压缩放功能。

## Sitara AM3358BZCZ100处理器

该板旨在使用 Sitara AM3358BZCZ100 处理器 15 x 15 封装。该板的早期修订版使用了 XM3359AZCZ100 处理器。

### 描述

下图显示了处理器的高级框图。有关处理器的更多信息，请转到 http://www.ti.com/product/am3358

[![Sitara AM3358BZCZ 框图](https://docs.beagle.cc/_images/image43.png)](https://docs.beagle.cc/_images/image43.png)

*图片 436* Sitara AM3358BZCZ 方框图

### 高级功能

| 操作系统             | Linux、Android、Windows Embedded CE、QNX、ThreadX | **MMC/SD （标准）**     | 3                 |
| -------------------- | ------------------------------------------------- | ----------------------- | ----------------- |
| **待机功率**         | 7 毫瓦                                            | **能**                  | 2                 |
| **ARM CPU**          | 1 个 ARM Cortex-A8                                | **UART （SCI）**        | 6                 |
| **ARM MHz（最大）**  | 275,500,600,800,1000                              | **模数转换器**          | 8 通道 12 位      |
| **ARM MIPS（最大）** | 1000,1200,2000                                    | **PWM（通道）**         | 3                 |
| **图形加速**         | 1 个 3D                                           | **eCAP**                | 3                 |
| **其他硬件加速**     | 2 PRU-ICSS，加密加速器                            | **eQEP**                | 3                 |
| **片上 L1 缓存**     | 64 KB （ARM Cortex-A8）                           | **RTC （音视频）**      | 1                 |
| **片上 L2 缓存**     | 256 KB （ARM Cortex-A8）                          | **I2C 接口**            | 3                 |
| **其他片上存储器**   | 128 KB                                            | **MCASP 系列**          | 2                 |
| **显示选项**         | 液晶显示器                                        | **SPI 系列**            | 2                 |
| **通用存储器**       | 1 个 16 位（GPMC、NAND 闪存、NOR 闪存、SRAM）     | **DMA （Ch） （通道）** | 64 通道 EDMA      |
| **内存**             | 1 个 16 位（LPDDR-400、DDR2-532、DDR3-400）       | **IO 电源 （V）**       | 1.8V（ADC），3.3V |
| **USB 端口**         | 2                                                 | **工作温度范围 （C）**  | 40 至 90          |

### 文档

有关该处理器的完整文档，请访问 TI 网站 http://www.ti.com/product/am3358 主板上使用的当前处理器。确保您始终使用 最新的数据表和技术参考手册 （TRM）。

### Crystal Circuitry

[![处理器晶体](https://docs.beagle.cc/_images/image44.png)](https://docs.beagle.cc/_images/image44.png)

*图片 437* 处理器晶体

### 重置电路

*图 31* 是 Board Reset 电路。初始开机重置为 由 **TPS65217C** 电源管理 IC 生成。它还处理 reset 的 Real Time Clock 的 set 。

板 reset 是 SYS_RESETn 信号。这与 处理器的 NRESET_INOUT 针脚。此引脚可以充当 input 或 输出。当按下 reset 按钮时，它会向 处理器和系统。

在修订版 A5D 板上，进行了更改。开机时， NRESET_INOUT信号可以充当输出。在这种情况下，它可能会导致 SYS_RESETn线过早地走高。为了防止这种情况， 来自 TPS65217C 的 PORZn 信号连接到 SYS_RESETn 线 使用开漏缓冲器。这些确保线路不会 在 Power Up 时暂时变高。

[![电路板复位电路](https://docs.beagle.cc/_images/image45.png)](https://docs.beagle.cc/_images/image45.png)

*图片 438* 板复位电路

此更改也适用于 A5D 之后的所有修订版。

DDR3L 内存

BeagleBone Black 使用单个 MT41K256M16HA-125 512MB DDR3L 设备 从通过 16 条数据线连接到处理器的 Micron，16 地址行和 14 个控制行。在版本 C 中，我们添加了金士顿 *KE4CN2H5A-A58* 器件作为 DDR3L 器件的源**。

以下部分提供了有关设计的更多详细信息。

### 存储设备

该设计支持标准 DDR3 和 DDR3L x16 设备，并构建 使用 DDR3L。板上使用单个 x16 设备，并且有 不支持两个 x8 设备。DDR3 器件在 1.5V 下工作， DDR3L 器件可以工作到

1.35V 以实现更低的功率。DDR3L 采用 96 球 FBGA 封装 间距为 0.8 mil。也可以支持其他标准 DDR3 设备， 但 DDR3L 是功耗较低的设备，因此被选中是因为它的能力 工作在 1.5V 或 1.35V 下。DDR3L 运行的标准频率 在板上为 400MHZ。

### DDR3L 内存设计

*图 32* 是 DDR3L 内存器件的原理图。每个 以下几行描述了信号组。

**地址行：**为 ACTIVATE 命令提供行地址，为 READ/WRITE 命令提供列地址和自动预充电位 （A10），以便从相应 bank 的内存阵列中选择一个位置。在 PRECHARGE 命令期间采样的 A10 将确定 PRECHARGE 是应用于一个库（A10 LOW，由 BA[2：0] 选择的库）还是所有库（A10 HIGH）。必访之地 inputs 还在 LOAD MODE 命令期间提供作码。地址 inputs 以 VREFCA 为参考。A12/BC#：在 register （MR） 中，A12 在 READ 和 WRITE 命令期间采样，以 确定是否执行突发斩波（即时）（HIGH = BL8 或无突发斩波，LOW = BC4 突发斩波）。

**银行地址行：**BA[2：0] 定义 ACTIVATE 到的 bank， 正在应用 READ、WRITE 或 PRECHARGE 命令。BA[2：0] 定义哪个 模式寄存器（MR0、MR1、MR2 或 MR3）在 LOAD MODE 期间加载 命令。BA[2：0] 引用 VREFCA。

**CK 和 CK# Lines：** 是差分 clock inputs。所有地址和 控制输入信号在正边沿的交叉处采样 的 CK 和 CK# 的负边。输出数据选通 （DQS， DQS#） 为 引用 CK 和 CK# 的交叉。

**Clock Enable Line（时钟使能线）：**CKE 启用 （注册为高电平） 和禁用 （注册为低电平）DRAM 上的内部电路和时钟。特定的 启用/禁用的电路取决于 DDR3 SDRAM 配置和作模式。服用 CKE LOW 可提供 PRECHARGE 掉电和 SELF REFRESH作（所有 SoundBank 均处于空闲状态）或活动状态 power-down （行在任何 bank 中处于活动状态）。CKE 在断电时是同步的 entry 和 exit 以及 for self refresh entry。CKE 对自身是异步的 refresh 退出。输入缓冲器（不包括 CK、CK#、CKE、RESET# 和 ODT） 在 powerdown 期间被禁用。输入缓冲器（不包括 CKE 和 RESET#） 在 SELF REFRESH 期间被禁用。CKE 引用 VREFCA。

[![DDR3L 内存设计](https://docs.beagle.cc/_images/image46.png)](https://docs.beagle.cc/_images/image46.png)

*图 439* DDR3L 内存设计

**Chip Select Line（芯片选择线）：**CS# 启用（注册为 LOW）和禁用 （注册为 HIGH）命令解码器。当 CS# 时，所有命令都被屏蔽 注册为 HIGH。CS# 为系统提供外部排名选择 具有多个等级。CS# 被视为命令代码的一部分。CS# 是 引用 VREFCA。

**Input Data Mask 行：**DM 是写入数据的输入掩码信号。输入 当 DM 采样为高电平时，数据被屏蔽，同时在 写入访问权限。虽然 DM 球仅输入，但 DM 负载为 设计与 DQ 和 DQS 球相匹配。DM 引用 VREFDQ 的

**On-die Termination Line： 片上端接线：**ODT 启用 （注册为高电平） 和禁用 DDR3L SDRAM 内部的 （Registered LOW） 终止电阻。 在正常作中启用时，ODT 仅应用于每个 以下球：x8 的 DQ[7：0]、DQS、DQS# 和 DM;DQ[3：0]， DQS， DQS# 和 DM 用于 x4。如果通过 LOAD MODE 命令。ODT 引用 VREFCA。

### 电源轨

*DDR3L* 内存设备和处理器上的 DDR3 导轨是 由 **TPS65217C** 提供。默认电压为 1.5V，但可以缩放 如果需要，可低至 1.35V。

### VREF （垂直引用）

*VREF* 信号由**VDDS_DDR** 上的分压器产生 为处理器 DDR 导轨和 DDR3L 设备本身供电的导轨。下面的*图 33* 显示了该信号的配置，并且 连接到 DDR3L 内存设备和处理器。

[![DDR3L VREF 设计](https://docs.beagle.cc/_images/image47.jpg)](https://docs.beagle.cc/_images/image47.jpg)

*图 440* DDR3L VREF 设计

### 4GB eMMC 内存

eMMC 是一种通信和大容量数据存储设备，包括一个 Multi-MediaCard （MMC） 接口、NAND Flash 组件和 控制器位于高级 11 信号总线上，符合 MMC 标准 系统规范。非易失性 eMMC 无需维护 存储数据，在广泛的作范围内提供高性能 温度，并抵抗冲击和振动干扰。

SD 卡面临的问题之一是，在不同的 品牌，甚至在同一品牌内，效果可能会有所不同。卡牌用途 不同的控制器和不同的记忆，所有这些都可能很糟糕 控制器处理的位置。但控制器可能是 针对读取或写入进行了优化。你永远不知道你会得到什么。 这可能会导致性能速率不同。eMMC 卡是已知的 控制器，当与 8 位模式结合使用时，则为 8 位数据 4 分，您将获得双倍的性能，这应该会导致更快的启动 次。

以下部分介绍了 实现此接口的板子。

### eMMC 器件

使用的设备是以下两种不同设备之一：

- 微米 *MTFC4GLDEA 0M WT*
- 金士顿 *KE4CN2H5A-A58*

该封装在两个器件上都是一个 153 球 WFBGA 器件。

### eMMC 电路设计

*图 34* 是 eMMC 电路的设计。eMMC 设备是 已连接到处理器上的 MMC1 端口。MMC0 仍用于 microSD 卡，就像目前在原始 BeagleBone 上所做的那样。尺寸 的 eMMC 现在是 4GB。

该器件在内部和外部 I/O 轨均以 3.3V 电压运行。这 VCCI 是器件的内部电压轨。制造商 建议将 1uF 电容器连接到此电源轨，但 2.2uF 被选中以提供一点边距。

上拉电阻器用于将信号的上升时间增加到 补偿电路板上的任何电容。

[![eMMC 内存设计](https://docs.beagle.cc/_images/image48.png)](https://docs.beagle.cc/_images/image48.png)

*图 441* eMMC 内存设计

eMMC1 在启动模式下使用的引脚如下*表 6* 所示。

[![eMMC 引导引脚](https://docs.beagle.cc/_images/image49.png)](https://docs.beagle.cc/_images/image49.png)

*图 442* eMMC 启动管脚

对于 eMMC 设备，ROM 将仅支持原始模式。ROM 代码读取 从文件系统中的映像或引导文件中输出原始扇区 和靴子。在 raw 模式下，引导映像可以位于 在主区域中的四个连续位置中：偏移 0x0 / 0x20000 （128 KB） / 0x40000 （256 KB） / 0x60000 （384 KB）。因此，一个 引导映像的大小不得超过 128KB。但是，可以 刷写映像大于 128KB 的设备，从 上述地点。因此，ROM 代码不会检查 图像大小。唯一的缺点是图像会越过 后续图像边界。读取扇区检测原始模式 #0, #256, #512, #768.然后验证这些扇区的内容 存在 TOC 结构。对于 *GP 设备*，则 配置标头 （CH）*必须*位于后面的第一个扇区中 通过 *GP 标头*。CH 可能为空（仅包含 CHSETTINGS 项的 Valid 字段为零）。

ROM 仅支持 4 位模式。初始引导后，交换机 可以设置为 8 位模式，以提高 eMMC 接口。

### 板 ID EEPROM

BeagleBone 配备了一个 32Kbit（4KB） 24LC32AT-I/OT EEPROM 允许 SW 识别电路板。*表 7* 定义如下 EEPROM 的内容。

| 名字     | 大小 （字节） | 内容                                                         |
| -------- | ------------- | ------------------------------------------------------------ |
| 页眉     | 4             | 0xAA、0x55、0x33、EE                                         |
| 板名称   | 8             | ASCII 中的板名称：**A335BNLT**                               |
| 版本     | 4             | ASCII 主板的硬件版本号：**Rev A3 为 00A3，Rev A4 为 00A4，Rev A5 为 00A5，Rev A6 为 00A6，Rev B 为 00B0，Rev C 为 00C0。** |
| 序号     | 12            | 主板的序列号。这是一个 12 个字符的字符串，即： **WWYY4P16nnnn** 其中，WW = 生产年份的 2 位数字周 YY = 2 位数字生产年份 BBBK = BeagleBone Black nnnn = 递增板号 |
| 配置选项 | 32            | 显示此板上的配置设置的代码。**所有 FF**                      |
| RSVD     | 6             | FF FF FF FF FF FF                                            |
| RSVD     | 6             | FF FF FF FF FF FF                                            |
| RSVD     | 6             | FF FF FF FF FF FF                                            |
| 可用     | 4018          | 其他非易失性代码/数据的可用空间                              |

[![EEPROM 设计版本 A5](https://docs.beagle.cc/_images/image50.png)](https://docs.beagle.cc/_images/image50.png)

*图片 443* EEPROM Design Rev A5

EEPROM 由处理器使用 I2C 0 总线访问。*WP* 引脚默认启用。通过将测试点接地，写入 保护已删除。

如果您选择使用 extras 存储空间用于其他目的。如果你这样做，它 可能会阻止主板正常启动，因为 SW 会使用它 信息来确定如何设置板。

#### 微型安全数字

板上的 microSD 连接器将支持 microSD 卡，该卡可以 用于 BeagleBone Black 上的启动或文件存储。

### microSD 设计

[![microSD 设计](https://docs.beagle.cc/_images/image51.png)](https://docs.beagle.cc/_images/image51.png)

*图 444* microSD 设计

信号 *MMC0-3* 是用于在两者之间传输数据的数据线 处理器和 microSD 连接器。

*MMC0_CLK* 信号对 microSD 卡的数据进出进行计时。

*MMCO_CMD* 信号表示正在执行命令与数据 送。

microSD 规范中没有单独的卡检测引脚。它 将 *MMCO_DAT3* 用于该函数。但是，大多数 microSD 连接器 仍然在连接器上提供 CD 功能。在 BeagleBone Black 中 设计，此引脚连接到 **MMC0_SDCD** 引脚，供 处理器。您也可以将 pin 更改为 *GPIO0_6*，这样就可以 插入 microSD 卡时将处理器从睡眠模式唤醒 插入连接器。

信号上提供上拉电阻器以增加上升时间 的信号来克服 PCB 电容。

电源由 *VDD_3V3B* 轨提供，10uF 电容器 用于筛选。

## 6.6 用户 LED 指示灯

BeagleBone Black 上有四个用户 LED。这些连接到 处理器上的 GPIO 针脚。*图 37* 显示了 用户 LED。

[![用户 LED](https://docs.beagle.cc/_images/image52.png)](https://docs.beagle.cc/_images/image52.png)

*图片 445* 用户 LED

电阻器 R71-R74 在修订版 A5B 及更高版本中更改为 4.75K 板。

| 搭载了LED | GPIO 信号 | PROC 引脚 |
| --------- | --------- | --------- |
| USR0      | GPIO1_21  | V15 系列  |
| USR1      | GPIO1_22  | U15       |
| USR2      | GPIO1_23  | T15       |
| USR3      | GPIO1_24  | V16 系列  |

逻辑电平为“1”将导致 LED 亮起。

### 引导配置

该设计支持板上的两组引导选项。用户 可以通过 Boot 按钮在这些模式之间切换。主引导 source 是板载的 eMMC 设备。通过按住 Boot 按钮，用户 可以强制开发板从 microSD 插槽启动。这将使 eMMC 在需要时被覆盖，或者只是引导备用镜像。这 以下部分介绍了引导配置的工作原理。

在大多数应用程序中，包括那些使用提供的演示的应用程序 [beagleboard.org](http://beagleboard.org/) 提供的发行版处理器外部引导代码由两个阶段组成。在 处理器 ROM 中的主引导代码传递控制，即辅助阶段 （辅助程序加载器 – “SPL” 或 “MLO”） 接管。SPL 阶段 仅初始化所需的设备以继续引导过程，并且 然后控制权转移到第三阶段 “U-boot”。基于 设置引导引脚，ROM 知道去哪里获取 SPL 和 UBoot 代码。对于 BeagleBone Black，则为 eMMC 或 microSD 基于启动开关的位置。

### 引导配置设计

*图 38* 显示了引导中涉及的电路 配置过程。上电时，这些引脚由处理器读取 以确定引导顺序。S2 用于更改一位的电平 从 HI 更改为 LO，这会更改引导顺序。

[![处理器引导配置设计](https://docs.beagle.cc/_images/image53.png)](https://docs.beagle.cc/_images/image53.png)

*图片 446* 处理器启动配置设计

可以通过扩展标头覆盖这些设置。但 小心不要添加过多的负载，以免干扰 HDMI 接口或 LCD 面板的作。如果您选择 覆盖这些设置，强烈建议您控制这些 信号替换为 *SYS_RESETn* 信号。这确保了出来后 的 reset 这些信号将从扩展引脚中删除。

### 默认引导选项

根据下图 *39* 中所选的选项，每个 将显示两个设置中每个设置的引导顺序。

[![处理器启动配置](https://docs.beagle.cc/_images/image54.jpg)](https://docs.beagle.cc/_images/image54.jpg)

*图片 447* 处理器启动配置

<<图-39>> 中的第一行是默认设置。在启动时， 处理器将首先在 MMC1 端口上查找 eMMC，然后是 MMC0、USB0 和 UART0 上的 microSD 插槽。在没有 microSD 的情况下 卡且 eMMC 为空，则 UART0 或 USB0 可以作为板子 源。

如果您有需要从中启动的 microSD 卡，请按住 启动按钮按下。启动时，处理器将查找 SPIO0 端口 首先，然后是 MMC0 端口上的 microSD，然后是 USB0 和 UART0。在 没有 microSD 卡且 eMMC 为空、USB0 或 UART0 时 可以用作板源。

## 10/100 以太网

BeagleBone Black 配备了 10/100 以太网接口。它 使用与原始 BeagleBone 上相同的 PHY。设计是 在以下各节中介绍。

### 以太网处理器接口

[![以太网处理器接口](https://docs.beagle.cc/_images/image55.png)](https://docs.beagle.cc/_images/image55.png)

*图 448* 以太网处理器接口

这与 BeagleBone 上使用的接口相同。没有变化 采用此设计为电路板。

### 以太网连接器接口

PHY 连接的板外侧如下面的*图 41* 所示。

[![以太网连接器接口](https://docs.beagle.cc/_images/image56.png)](https://docs.beagle.cc/_images/image56.png)

*图片 449* 以太网络连接器接口

这与 BeagleBone 上使用的接口相同。电路板的此设计未进行任何更改。

### 以太网 PHY 电源、复位和时钟

[![以太网 PHY、电源、复位和时钟](https://docs.beagle.cc/_images/image57.png)](https://docs.beagle.cc/_images/image57.png)

*图片 450* 以太网 PHY、电源、重置和时钟

**VDD_3V3B Rail**

VDD_3V3B轨是 *LAN8710A* 的主电源轨。它 源自 VD_3V3B 稳压器，是 支持开发板上的所有外设。此导轨还提供 VDDIO 轨，用于设置所有 I/O 信号的电压电平 在处理器和 LAN8710A 之间。

**VDD_PHYA Rail**

VDD_3V3B轨的滤波版本连接到 VDD 轨 LAN8710和以太网信号上的终端电阻。是的 标记为 *VDD_PHYA*。滤波电感有助于阻止瞬变 这可能在 VDD_3V3B 导轨上看到。

**PHY_VDDCR Rail**

*PHY_VDDCR*轨源自LAN8710A内部。筛选和旁通 电容器用于过滤电源轨。只有 LAN8710A 使用此边栏。

**SYS_RESET**

LAN8710A的复位是通过 *SYS_RESETn* 信号 主板复位线。

**时钟信号**

晶体用于创建 LAN8710A 的时钟。处理器 使用 *RMII_RXCLK* 信号为数据提供时钟 在处理器和LAN8710A之间。

## LAN8710A 模式引脚

LAN8710A上有模式引脚，用于设置作模式 从 reset 出来时的 PHY。这些信号还用于 处理器和 LAN8710A 之间的通信。因此，这些 信号可以由处理器驱动，这可能导致 PHY 不 已正确初始化。为了确保这种情况不会发生，三个低 使用值上拉电阻器。下面的*图 43* 显示了三种模式 pin 电阻器。

[![以太网 PHY 模式引脚](https://docs.beagle.cc/_images/image97.png)](https://docs.beagle.cc/_images/image97.png)

*图 451* Ethernet PHY 模式针脚

这会将模式设置为 111，这将启用所有模式并启用 auto-negotiation 的 intent 语句。

## HDMI 接口

BeagleBone Black 具有一个板载 HDMI 成帧器，可将 LCD 信号和音频信号来驱动 HDMI 监视器。该设计使用 NXP *TDA19988* HDMI 成帧器。

以下部分提供了有关此设计的更多详细信息 接口。

### 支持的分辨率

BeagleBone Black 支持的最大分辨率为 1280x1024 @ 60Hz。下面的*表 9* 显示了支持的分辨率。并非全部 分辨率可能适用于所有显示器，但这些分辨率已经过测试和 显示至少在一个显示器上工作。EDID 在 BeagleBone 黑色。根据来自所连接监视器的 EDID 读数， 选择最高兼容分辨率。

| 分辨率            | 音频 |
| ----------------- | ---- |
| 800 x 600 @60Hz   |      |
| 800 x 600 @56Hz   |      |
| 640 x 480 @75Hz   |      |
| 640 x 480 @60Hz   | 是的 |
| 720 x 400 @70Hz   |      |
| 1280 x 1024 @75Hz |      |
| 1024 x 768 @75Hz  |      |
| 1024 x 768 @70Hz  |      |
| 1024 x 768 @60Hz  |      |
| 800 x 600 @75Hz   |      |
| 800 x 600 @72Hz   |      |
| 720 x 480 @60Hz   | 是的 |
| 1280 x 720 @60Hz  | 是的 |
| 1920 x 1080 @24Hz | 是的 |

注意：Rev A5B 及更高版本主板上使用的更新软件映像 添加了对 [1920x1080@24HZ](mailto:1920x1080@24HZ) 的支持。

音频仅限于 CEA 支持的分辨率。LCD 面板仅激活 CEA 模式下的音频。这是规范的一个函数，并且是 不是可以通过硬件更改或 软件更改。

### HDMI 成帧器

*TDA19988* 是高清多媒体接口 （HDMI） 1.4a 发射机。它向后兼容 DVI 1.0 并且可以连接 到任何 DVI 1.0 或 HDMI 接收器。设计中不使用 HDCP 模式。 该设备的非 HDCP 版本用于 BeagleBone Black 设计。

该器件提供额外的嵌入式功能，如 CEC（消费类 电子控制）。CEC 是一条双向总线，用于传输 通过此总线连接的家用电器网络上的 CEC。这 无需任何其他设备来处理此功能。 虽然此设备支持此功能，但截至目前，SW 支持此功能尚未实现，也不是一项功能 这被认为是关键的。它可以切换到非常低的功率 待机或睡眠模式可在不使用 HDMI 时节省电量。*TDA19988* 嵌入了 I~2~C-bus 主接口，用于 DDC 总线通信读取 EDID 的。该设备可通过 I~2~C-bus 进行控制或配置 接口。

### HDMI 视频处理器接口

*图 44* 显示了处理器和 HDMI 之间的连接 framer 设备。显示数据有 16 位，5-6-5 用于 驱动 Framer。16 位的原因是允许 与 显示器和 LCD Capes 的兼容性 原始 BeagleBone。**TDA19988** 上未使用的位被打成低位。在 除数据信号外，还有 VSYNC、HSYNC、DE 和 PCLK 信号 完善了处理器的视频接口。

[![HDMI 成帧器处理器接口](https://docs.beagle.cc/_images/image58.png)](https://docs.beagle.cc/_images/image58.png)

*图片 452* HDMI Framer 处理器接口

### HDMI 控制处理器接口

为了使用 *TDA19988*，处理器需要设置设备。 这是通过处理器和 **TDA19988**。*TDA19988*上有两个信号可能是 用于设置 *TDA19988* 的地址。在这个设计中，他们都是 并列低。I2C 接口支持 400kHz 和 100KhZ作。*表 10* 显示了 I2C 地址。

[![TDA19988 I2C 地址](https://docs.beagle.cc/_images/image59.png)](https://docs.beagle.cc/_images/image59.png)

*图片 453* TDA19988 I2C 地址

### 中断信号

有一个 HDMI_INT 信号从 TDA19988 连接到 处理器。此信号可用于提醒处于某种状态的处理器 HDMI 接口上的更改。

### 音频接口

处理器和 *TDA19988* 之间有一个 I2S 音频接口。立体声音频可通过 HDMI 接口传输至 配备音频的显示器。为了创建所需的时钟 频率，使用外部 24.576MHz 振荡器*Y4*。从这个 clock，处理器会为 *TDA19988* 生成所需的 clock frequency。

有三个信号用于将数据从处理器传递到 *TDA19988*。SCLK 是串行时钟。SPI1_CS0 是 **TDA199888**。SPI1_D0 是单词 sync pin。这些信号是 配置为 I2S 接口。

音频仅限于 CEA 支持的分辨率。LCD 面板仅激活 CEA 模式下的音频。这是规范的一个函数，并且是 不是可以通过硬件更改或 软件更改。

为了创建正确的时钟频率，我们必须添加一个 外部 *24.576MHz* 振荡器。不幸的是，这必须被输入到 处理器使用以前用于 **GPIO3_21** 的 pin。为了 保持GPIO3_21功能，我们提供了一种禁用振荡器的方法 如果需要，请使用扩展接头上的引脚。*数字 45* 显示了振荡器电路。

[![24.576MHZ 振荡器](https://docs.beagle.cc/_images/image60.png)](https://docs.beagle.cc/_images/image60.png)

*图片 454* 24.576MHZ 振荡器

### 电源连接

*图 46* 显示了 **TDA19988** 设备的电源连接。都 该器件的电压轨为 1.8V。过滤器提供给 将 1.8V 电源轨返回器件的任何噪声降至最低。

[![HDMI 电源连接](https://docs.beagle.cc/_images/image64.png)](https://docs.beagle.cc/_images/image64.png)

*图片 455* HDMI 电源连接

处理器和 *TDA19988* 之间的所有接口均为 3.3V 宽容允许直接连接。

### HDMI 连接器接口

*图 47* 显示了 HDMI Framer 之间的接口设计 和连接器。

[![连接器接口电路](https://docs.beagle.cc/_images/image65.png)](https://docs.beagle.cc/_images/image65.png)

*图片 456* 连接器接口电路

HDMI 接口的连接器是 microHDMI。需要注意的是 此连接器的引脚排列与 Standard 或 Mini 不同 HDMI 连接器。D6 和 D7 是 ESD 保护器件。

## USB 主机

该板配备了一个 USB 主机接口，可从 单个 USB Type A 母头连接器。<<图 48>> 是 USB 的设计 主机电路。

[![USB 主机电路](https://docs.beagle.cc/_images/image66.png)](https://docs.beagle.cc/_images/image66.png)

*图片 457* USB Host 电路

### 电源开关

*U8* 是一个允许打开连接器电源的开关 或由处理器关闭。它还具有过流检测功能，可以 如果电流过高，则通过 **USB1_OC** 提醒处理器 信号。电源*USB1_DRVBUS*由来自 处理器。

### ESD 保护

*U9* 是针对进入连接器的信号的 ESD 保护。

### 过滤器选项

添加 *FB7* 和 FB8** 以帮助通过 FCC 辐射测试。 处理器使用 *USB1_VBUS* 信号来检测 5V 是否 存在于连接器上。*FB7* 已填充，*FB8* 已替换为 一个 .1 欧姆电阻。

## PRU-ICSS

PRU-ICSS 模块位于 AM3358 处理器内部。访问 这些引脚由扩展接头提供，并与 板上的其他功能。并非所有 可用引脚。

所有文档均位于 [http://github.com/beagleboard/am335x_pru_package_](https://github.com/beagleboard/am335x_pru_package)

Texas Instruments 不支持此功能。

### PRU-ICSS 特点

PRU-ICSS 的功能包括：

两个独立的可编程实时 （PRU） 内核：

- 32 位加载/存储 RISC 架构
- 每个内核 8K 字节指令 RAM（2K 指令）
- 每个内核 8K 字节数据 RAM
- 12K 字节共享 RAM
- 工作频率为 200 MHz
- PRU作是类似于 ARM 处理器的小端
- PRU-ICSS 中的所有存储器都支持奇偶校验
- 包括用于系统事件处理的中断控制器
- 快速 I/O 接口

每个 PRU 内核 16 个输入引脚和 16 个输出引脚。*（并非所有 可在 BeagleBone Black 上访问）。*

### PRU-ICSS 框图

[![PRU-ICSS 框图](https://docs.beagle.cc/_images/image67.png)](https://docs.beagle.cc/_images/image67.png)

*图片 458* PRU-ICSS 框图

### PRU-ICSS 引脚访问

PRU 0 和 PRU1 均可从扩展接头访问。有些人可能会 如果不先禁用 LCD 等板上的功能，则无法使用 例如。下面列出了每个 PRU 上可以访问的端口。

- 8 个输出或 9 个输入
- 13 个输出或 14 个输入
- UART0_TXD、UART0_RXD、UART0_CTS UART0_RTS

| 针   | 产品      | 名字     |                              |                              |      |
| ---- | --------- | -------- | ---------------------------- | ---------------------------- | ---- |
| 11   | R12 系列  | GPIO1_13 |                              | pr1_pru0_pru_r30_15 （输出） |      |
| 12   | T12       | GPIO1_12 |                              | pr1_pru0_pru_r30_14 （输出） |      |
| 15   | U13       | GPIO1_15 |                              | pr1_pru0_pru_r31_15 （输入） |      |
| 16   | V13 版本  | GPIO1_14 |                              | pr1_pru0_pru_r31_14 （输入） |      |
| 20   | V9 系列   | GPIO1_31 | pr1_pru1_pru_r30_13 （输出） | pr1_pru1_pru_r31_13 （输入） |      |
| 21   | U9 系列   | GPIO1_30 | pr1_pru1_pru_r30_12 （输出） | pr1_pru1_pru_r31_12 （输入） |      |
| 27   | U5 系列   | GPIO2_22 | pr1_pru1_pru_r30_8 （输出）  | pr1_pru1_pru_r31_8 （输入）  |      |
| 28   | V5 版本   | GPIO2_24 | pr1_pru1_pru_r30_10 （输出） | pr1_pru1_pru_r31_10 （输入） |      |
| 29   | R5 系列   | GPIO2_23 | pr1_pru1_pru_r30_9 （输出）  | pr1_pru1_pru_r31_9 （输入）  |      |
| 39   | T3        | GPIO2_12 | pr1_pru1_pru_r30_6 （输出）  | pr1_pru1_pru_r31_6 （输入）  |      |
| 40   | T4        | GPIO2_13 | pr1_pru1_pru_r30_7 （输出）  | pr1_pru1_pru_r31_7 （输入）  |      |
| 41   | T1 航站楼 | GPIO2_10 | pr1_pru1_pru_r30_4 （输出）  | pr1_pru1_pru_r31_4 （输入）  |      |
| 42   | T2 航站楼 | GPIO2_11 | pr1_pru1_pru_r30_5 （输出）  | pr1_pru1_pru_r31_5 （输入）  |      |
| 43   | R3 系列   | GPIO2_8  | pr1_pru1_pru_r30_2 （输出）  | pr1_pru1_pru_r31_2 （输入）  |      |
| 44   | R4 系列   | GPIO2_9  | pr1_pru1_pru_r30_3 （输出）  | pr1_pru1_pru_r31_3 （输入）  |      |
| 45   | R1 系列   | GPIO2_6  | pr1_pru1_pru_r30_0 （输出）  | pr1_pru1_pru_r31_0 （输入）  |      |
| 46   | R2        | GPIO2_7  | pr1_pru1_pru_r30_1 （输出）  | pr1_pru1_pru_r31_1 （输入）  |      |

| 针   | 产品     | 名字      |                             |                              |                             |
| ---- | -------- | --------- | --------------------------- | ---------------------------- | --------------------------- |
| 17   | 答 16    | I2C1_SCL  | pr1_uart0_txd               |                              |                             |
| 18   | B16 系列 | I2C1_SDA  | pr1_uart0_rxd               |                              |                             |
| 19   | D17      | I2C2_SCL  | pr1_uart0_rts_n             |                              |                             |
| 20   | D18      | I2C2_SDA  | pr1_uart0_cts_n             |                              |                             |
| 21   | B17 系列 | UART2_TXD | pr1_uart0_rts_n             |                              |                             |
| 22   | 答 17    | UART2_RXD | pr1_uart0_cts_n             |                              |                             |
| 24   | D15      | UART1_TXD | pr1_uart0_txd               | pr1_pru0_pru_r31_16 （输入） |                             |
| 25   | 答 14    | GPIO3_21  | pr1_pru0_pru_r30_5 （输出） | pr1_pru0_pru_r31_5 （输入）  |                             |
| 26   | D16      | UART1_RXD | pr1_uart0_rxd               | pr1_pru1_pru_r31_16          |                             |
| 27   | C13 系列 | GPIO3_19  | pr1_pru0_pru_r30_7 （输出） | pr1_pru0_pru_r31_7 （输入）  |                             |
| 28   | C12      | SPI1_CS0  | eCAP2_in_PWM2_out           | pr1_pru0_pru_r30_3 （输出）  | pr1_pru0_pru_r31_3 （输入） |
| 29   | B13 系列 | SPI1_D0   | pr1_pru0_pru_r30_1 （输出） | pr1_pru0_pru_r31_1 （输入）  |                             |
| 30   | D12      | SPI1_D1   | pr1_pru0_pru_r30_2 （输出） | pr1_pru0_pru_r31_2 （输入）  |                             |
| 31   | 答 13    | SPI1_SCLK | pr1_pru0_pru_r30_0 （输出） | pr1_pru0_pru_r31_0 （输入）  |                             |

注意

GPIO3_21也是处理器的 24.576MHZ 时钟输入，用于启用 HDMI 音频。 要使用此引脚，必须禁用振荡器。