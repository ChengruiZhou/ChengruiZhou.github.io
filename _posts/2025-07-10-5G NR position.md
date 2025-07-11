---
title: "5G NR position"
header:
  overlay_color: "#333"
categories: 
  - 定位
toc: true

---

1.  Create Scenario

2. Configure **5G Carrier, PRS, and Path Loss**

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

   

3. 5G Signal Simulation

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

