---
sort: 3
---

## C和C++联合开发

工程链接[链接](https://github.com/ChengruiZhou/stm32-based-on-clion/tree/main/Demo_Cpp)

教程链接[链接](https://www.bilibili.com/video/BV1EhvFeLE8G/)



```tip
参考代码
```

```C

/*---------------------------- C Scope ---------------------------*/
// C头文件
#ifdef __cplusplus
extern "C" {
#endif

#include "main.h"
#include "gpio.h"


void Mymain(void);

#ifdef __cplusplus
}

/*---------------------------- C++ Scope ---------------------------*/
// C++头文件
#include "led.h"

#endif

```

