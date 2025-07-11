---
title: "5G NR position"
header:
  overlay_color: "#333"
categories: 
  - 定位
toc: true

---

# Create Scenario

uavTruth and gNBTruth

```matlab
   Identity：name
   Position：
   Velocity：
   ObjectID：number
 # numel(x)计算数组x中的数组元素数目  
```

**getCarrierAndPRSConfigurations(numgNBs,numUAVs)**，numgNBs和numUAVs表示gNBs和UAVs的个数

## 配置载波的相关说明

% configures the carriers for all the gNBs and PRS configurations for each gNB and UAV pair.

> [!IMPORTANT]
>
> - **NCellID**: Physical layer cell identity, specified as an integer from 0 to 1007.
>
> - **Subcarrier spacing** in kHz, for all channels and reference signals of the carrier, specified as `15`, `30`, `60`, `120`, `240`, `480`, or `960`.
>
> - **Cyclic prefix length**, specified as one of these options.
>
>   - `'normal'` — Use this value to specify normal cyclic prefix. This option corresponds to 14 OFDM symbols in a slot.
>   - `'extended'` — Use this value to specify extended cyclic prefix. This option corresponds to 12 OFDM symbols in a slot. For the numerologies specified in TS 38.211 Section 4.2, extended cyclic prefix length applies for only 60 kHz subcarrier spacing.
>
> - **Number of RBs in the carrier resource grid**, specified as an integer from 1 to 275. The default value of `52` corresponds to the maximum number of RBs of a 10 MHz carrier with 15 kHz SCS.
>
> - **NSizeGrid**: Number of RBs in the carrier resource grid, specified as an integer from 1 to 275. The default value of `52` corresponds to the maximum number of RBs of a 10 MHz carrier with 15 kHz SCS.
>
> - **NStartGrid**: Start of carrier resource grid relative to CRB 0, specified as an integer from 0 to 2199. This property is the higher-layer parameter *offsetToCarrier*.
>
> - **NSlot**: Slot number, specified as a nonnegative integer. You can set `NSlot` to a value larger than the number of slots per frame. For example, you can set this value using transmission loop counters in a MATLAB® simulation. In this case, you may have to ensure that the property value is modulo the number of slots per frame in a calling code.
>
> - **NFrame**: System frame number, specified as a nonnegative integer. You can set `NFrame` to a value larger than the maximum frame number 1023. For example, you can set this value using transmission loop counters in a MATLAB simulation. In this case, you may have to ensure that the property value is modulo 1024 in a calling code.
>
> - **Intracell guard bands** for operation with shared spectrum channel access for FR1, specified as one of these options:
>
>   - *N*GB-by-2 matrix of nonnegative integers — *N*GB is the number of guard bands. Each row defines a guard band: the first column specifies the start of the guard band relative to the first CRB of the carrier, specified by [`NStartGrid`](https://ww2.mathworks.cn/help/releases/R2025a/5g/ref/nrcarrierconfig.html#mw_object_nrCarrierConfig_sep_mw_b4301222-b865-4350-a02f-081751489b6d), and the second column defines the size of the guard band in RBs.
>   - Cell array of [`nrIntraCellGuardBandsConfig`](https://ww2.mathworks.cn/help/releases/R2025a/5g/ref/nrintracellguardbandsconfig.html) objects — Only those guard band configurations that have the same subcarrier spacing as the [`SubcarrierSpacing`](https://ww2.mathworks.cn/help/releases/R2025a/5g/ref/nrcarrierconfig.html#mw_object_nrCarrierConfig_sep_mw_5af25740-a086-4ff7-97ac-68a9c6b1c0d1) object property are applicable.
>
>   The default value of `[]` indicates that intracell guard bands are not configured, which means that all resources are available.
>
>   This property corresponds to higher-layer parameter *IntraCellGuardBandsPerSCS* in TS 38.331[[2\]](https://ww2.mathworks.cn/help/releases/R2025a/5g/ref/nrcarrierconfig.html#mw_0f25964a-d086-4ac0-9f5f-32b9dda1c2c4).
>
> - This property is read-only.
>
>   Number of OFDM **symbols per slot**, returned as `14` for normal cyclic prefix or `12` for extended cyclic prefix. The object sets this property based on the [`CyclicPrefix`](https://ww2.mathworks.cn/help/releases/R2025a/5g/ref/nrcarrierconfig.html#mw_object_nrCarrierConfig_sep_mw_657a9836-801a-4574-886b-da4d4da33aa2) property.
>
> - This property is read-only.
>
>   **Number of slots per 1 ms subframe**, returned as `1`, `2`, `4`, `8`, `16`, `32` or `64`. The object sets this property based on the [`SubcarrierSpacing`](https://ww2.mathworks.cn/help/releases/R2025a/5g/ref/nrcarrierconfig.html#mw_object_nrCarrierConfig_sep_mw_5af25740-a086-4ff7-97ac-68a9c6b1c0d1) property values `15`, `30`, `60`, `120`, `240`, `480`, and `960`, respectively.
>
> - This property is read-only.
>
>   **Number of slots per 10 ms frame,** returned as `10`, `20`, `40`, `80`, `160`, `320`, or `640`. The object sets this property based on the [`SubcarrierSpacing`](https://ww2.mathworks.cn/help/releases/R2025a/5g/ref/nrcarrierconfig.html#mw_object_nrCarrierConfig_sep_mw_5af25740-a086-4ff7-97ac-68a9c6b1c0d1) property values `15`, `30`, `60`, `120`, `240`, `480`, and `960`, respectively.



##  Configure PRS properties

> [!IMPORTANT]
>
> - **PRSResourceSetPeriod:** PRS resource set slot periodicity and slot offset, specified as one of these options.
>
>   - `'on'` — All of the PRS resources are present in the operating slot.
>   - `'off'` — All of the PRS resources are absent in the operating slot.
>   - Two-element vector of the form [*TPRSPeriod*, *TPRSOffset*] — *TPRSPeriod* is the resource set slot periodicity. The nominal value of *TPRSPeriod* must equal 2μ multiplied by one of the values in the set {4, 5, 8, 10, 16, 20, 32, 40, 64, 80, 160, 320, 640, 1280, 2560, 5120, 10,240}, where μ is the subcarrier spacing configuration with a value of 0, 1, 2, or 3. *TPRSOffset* is the resource set slot offset and must equal a value in the range [0, *TPRSPeriod* – 1].
>
> - **PRSResourceoffset:** Slot offset of each PRS resource (0-based) provided by the higher layer parameter *dl-PRS-ResourceSlotOffset-r16*, specified as a scalar in the range [0, 511] or a vector of integers in the range [0, 511]. This property represents the starting slot offset of a PRS resource relative to the PRS resource set offset (*TPRSOffset*).
>
>   Configure this property for each resource in a resource set separately based on one of these options.
>
>   - When a single resource is present, specify this property as a scalar.
>   - When multiple resources are present, specify this property as a scalar or vector. If you specify a scalar, the object applies that value to all of the PRS resources in a PRS resource set. If you specify a vector, the object applies the vector element values to the corresponding PRS resource. The length of this vector must be equal to the number of PRS resources to be configured in a PRS resource set.
>
> - **PRSResourceRepetition :** PRS resource repetition factor provided by the higher layer parameter *dl-PRS-ResourceRepetitionFactor-r16*, specified as `1`, `2`, `4`, `6`, `8`, `16`, or `32`. This property value is the same for all of the PRS resources in a PRS resource set.



# Configure **5G Carrier, PRS, and Path Loss**

gNB向定位服务器上报每个PRS资源的水平维角度和垂直维角度

PRS(定位参考信号)用于提供定位测量量，包括DL RSTD、 DL PRS RSRP、DL  PRS子径接收功率和UE收发时间差等

OFDM 符号个数4096

```matlab
# TEST
ofdmInfo = 

  包含以下字段的 struct:

                   Nfft: 4096
             SampleRate: 61440000
    CyclicPrefixLengths: [320 288 288 288 288 288 288 320 288 288 288 288 288 288]
          SymbolLengths: [4416 4384 4384 4384 4384 4384 4384 4416 4384 4384 4384 4384 4384 4384]
              Windowing: 144
           SymbolPhases: [0 0 0 0 0 0 0 0 0 0 0 0 0 0]
         SymbolsPerSlot: 14
       SlotsPerSubframe: 1
          SlotsPerFrame: 10
```



# 5G Signal Simulation

- Get the positions of UAVs and gNodeBs for 5G Simulation

- Get the gNB and UAV positions

- Initialize with the slot number that corresponds to 'time'

- Generate **5G time-domain waveform** for the transmission from all the gNBs

- Check whether PRS is present in the current time instance or not. If not, continue to the next time instance

- Apply **line-of-sight path loss and path delays**

- **Estimate TOA** values for each UAV and gNB pair in terms of nano seconds

- Assemble toaInformation as objectDetection using gNB positions.

- For the set of TOA detections from each UAV, compute the TDOA detections using the difference between each TOA and the reference TOA (1st TOA)

- For each TDOA set of detections from a unique UAV, compute position detections using spherical intersection algorithm.
- Track UAVs by feeding their position estimates to a tracker

