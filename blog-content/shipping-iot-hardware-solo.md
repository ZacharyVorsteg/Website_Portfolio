---
title: "Shipping IoT Hardware Solo: ESP32 Prototype to Deployment"
description: "I built an IoT thermal detection system using ESP32-S3, MLX90640 sensors, and cellular backhaul — solo, with no hardware background. Here's the full journey."
keywords: building iot hardware products as a solo developer, solo developer iot hardware, ESP32 IoT project production, shipping hardware solo founder, IoT thermal detection system, solo hardware development, ESP32-S3 MLX90640, embedded systems solo developer, IoT prototype to production, hardware startup solo founder
date: 2026-03-21
pillar: Hardware & PropTech
speakable: "Zachary Vorsteg documents building and deploying an IoT thermal detection system as a solo developer with no formal hardware engineering background. The system uses ESP32-S3 microcontrollers, MLX90640 infrared sensor arrays, Quectel EG25-G cellular modules, and Jetson Orin Nano edge processing — designed, prototyped, programmed, and field-deployed by one person. The post covers sensor selection, firmware development, cellular backhaul decisions, field deployment realities, and where the embedded hardware industry is heading with ESP32-P4 AI extensions and Nordic's nRF54LM20B integrated NPU."
---

Software developers think shipping means pushing code. Hardware developers know shipping means a box arrives at a site, gets bolted to a wall, and has to work — in the heat, in the rain, on cellular signal that drops to two bars at 3 PM every Tuesday for reasons nobody can explain.

I built an IoT thermal detection system from scratch. ESP32-S3 microcontrollers. MLX90640 infrared sensor arrays. Quectel EG25-G cellular modules for backhaul. Jetson Orin Nano for edge processing. Designed, prototyped, programmed, deployed — all solo, with zero formal hardware engineering training.

I've written about the [software automation infrastructure](https://zacharyvorsteg.com/blog/my-solo-founder-automation-stack/) running alongside this hardware, the [CRE business](https://zacharyvorsteg.com/blog/why-im-a-commercial-real-estate-broker-who-codes/) that created the need for thermal detection in commercial buildings, and [what breaks when these systems hit the field](https://zacharyvorsteg.com/blog/what-breaks-when-you-automate-everything/). Here's the origin story — how a software developer ships real hardware, what the breadboard-to-deployment journey actually looks like, and what I'd do differently.

## Why a Software Developer Started Building Hardware

Simple: the tool I needed didn't exist at the price point that made sense.

Commercial thermal imaging systems for building diagnostics run $15,000 to $50,000 per installation — enterprise pricing for enterprise buyers. I needed continuous thermal monitoring across multiple commercial properties for leak detection, HVAC efficiency tracking, and tenant comfort verification. Buying off the shelf meant spending six figures before a single data point arrived.

By 2025, the global IoT device count had hit 21.1 billion connected devices, growing 14% year-over-year (IoT Analytics, 2025). Billions of devices, and almost none of them built for commercial real estate monitoring at solo-operator budgets. Enterprise buyers get served. Hobbyist tinkerers get served. That middle ground — production-grade hardware for small operators? Barely exists.

So I built one. My [financial modeling](https://zacharyvorsteg.com/blog/financial-modeling-fundamentals/) wasn't complicated: $200 in components per sensor node versus $15,000 for commercial alternatives. At 75x cheaper, the question stopped being "should we pilot this?" and became "how many can I deploy?"

## Choosing the Right Sensor: Why MLX90640 Over Everything Else

Sensor selection consumed three weeks. Felt like overkill at the time. Turned out to be the single most consequential decision in the entire project.

Melexis makes the MLX90640 — a 32×24 pixel far-infrared thermal sensor array. Not a single-point thermometer — a full thermal image at every reading. Factory-calibrated to ±1°C accuracy. Communicates over I2C (Inter-Integrated Circuit — a two-wire serial protocol for connecting low-speed peripherals) at up to 64 frames per second. Costs roughly $50 per unit in single quantities.

### What I Evaluated and Why I Rejected the Alternatives

| Sensor | Resolution | Accuracy | Interface | Unit Cost | Why I Rejected It |
|--------|-----------|----------|-----------|-----------|-------------------|
| MLX90640 (chosen) | 32×24 px | ±1°C | I2C | ~$50 | — Selected — |
| AMG8833 (Panasonic) | 8×8 px | ±2.5°C | I2C | ~$40 | Resolution too low for leak detection — 64 pixels vs 768 pixels |
| FLIR Lepton 3.5 | 160×120 px | ±5°C / ±5% | SPI + I2C | ~$250 | 5x the cost, accuracy worse for absolute temperature measurement |
| MLX90641 | 16×12 px | ±1°C | I2C | ~$30 | Half the resolution of MLX90640 at only $20 savings |
| Single-point IR (MLX90614) | 1 px | ±0.5°C | I2C | ~$12 | Single point — useless for spatial thermal mapping |

AMG8833 tempted me. Cheaper, simpler, decent community support. But 8×8 pixels — 64 data points per frame — can't distinguish between a roof leak's thermal signature and normal temperature variation in a commercial space. 768 pixels versus 64 — the MLX90640 catches gradients the AMG8833 misses entirely. That resolution gap? Difference between detecting a leak and detecting the weather.

FLIR Lepton? Gorgeous resolution. Also $250 per unit with worse absolute accuracy. When you're deploying ten of these across multiple buildings, unit cost matters more than spec-sheet bragging rights. My [trading infrastructure](https://zacharyvorsteg.com/blog/algorithmic-trading-bots-side-project/) drilled that into me — I'd rather have reliable data from a $50 sensor at every site than stunning data from a $250 sensor at three.

## ESP32-S3: The Microcontroller That Made Solo Hardware Possible

Espressif's ESP32 family has shipped over one billion chips worldwide since the original ESP8266 launched (Espressif Systems). There's a reason — the ESP32-S3 hits a price-to-capability sweet spot that didn't exist five years ago.

Dual-core Xtensa LX7 at 240 MHz. 512 KB SRAM. Built-in Wi-Fi and Bluetooth LE. Vector instructions for signal processing. Dev board runs under $10. And the toolchain — ESP-IDF (Espressif IoT Development Framework) built on FreeRTOS (Free Real-Time Operating System — an open-source OS for microcontrollers that handles task scheduling and memory management) — is mature enough that a software developer can write production firmware without a decade of embedded experience.

### My First Firmware: What a Software Developer Gets Wrong

Everything. You get everything wrong.

My first prototype read the MLX90640 sensor, processed the 768-pixel thermal array, and transmitted data over Wi-Fi. Worked beautifully on my desk. Deployed to a building, it crashed within four hours.

```c
// What I wrote first (wrong)
void app_main(void) {
    mlx90640_init(&sensor, I2C_NUM_0);
    wifi_init_sta();  // blocks until connected

    while (1) {
        mlx90640_read_frame(&sensor, frame_data);
        http_post(ENDPOINT, frame_data, sizeof(frame_data));
        vTaskDelay(pdMS_TO_TICKS(30000));  // 30 second interval
    }
}

// What I write now (learned the hard way)
void app_main(void) {
    esp_err_t ret = mlx90640_init(&sensor, I2C_NUM_0);
    if (ret != ESP_OK) {
        ESP_LOGE(TAG, "Sensor init failed: %s", esp_err_to_name(ret));
        enter_recovery_mode();  // log error, retry with backoff
        return;
    }
    xTaskCreate(sensor_task, "sensor", 8192, NULL, 5, NULL);
    xTaskCreate(transmit_task, "tx", 4096, NULL, 3, NULL);
    xTaskCreate(watchdog_task, "wdt", 2048, NULL, 7, NULL);
}
```

No error recovery. No watchdog. No separation between sensor reading and data transmission. And a blocking Wi-Fi initialization that hung the entire system if the access point was unreachable. In software, a crash costs you milliseconds. In embedded, a crash in the field costs you a 45-minute drive.

Memfault's 2026 data backs up what I learned firsthand: firmware and configuration drift top the list of IoT device failures in the field — devices update slowly, sometimes partially, sometimes not at all. Had the scars before I ever read the report.

## Cellular Backhaul: Why I Chose LTE Over Wi-Fi

Wi-Fi dies in commercial buildings. Thick concrete walls, metal ducting, RF interference from industrial equipment — the reliable connection I had on my desk evaporated the moment I mounted a sensor in a ceiling plenum.

### The Quectel EG25-G Decision

IoT Analytics pegs Quectel at 40% of the global cellular IoT module market as of Q1 2025 — clear market leader. I chose the EG25-G specifically: Cat 4 LTE with 3G/2G fallback, GNSS (Global Navigation Satellite System) positioning, and broad band support across North American carriers.

Q1 2025 numbers from IoT Analytics: cellular IoT module shipments up 23% year-over-year, 544 million units, $3.93 billion in revenue. Ecosystem's caught up to the demand. Carrier activation for IoT SIMs runs $2-5/month for low-bandwidth applications. My sensor nodes transmit roughly 50 KB per reading cycle — well within the cheapest data tiers.

### What Cellular Gets Right That Wi-Fi Doesn't

No site-specific network configuration. No IT department granting access. No credential rotation breaking your deployment at 2 AM. I plug in a SIM, power on the module, and the sensor reports data. When you're deploying solo, every site-specific variable is a failure point you'll troubleshoot alone — so you eliminate as many as possible.

Trade-off? Power consumption. EG25-G draws 500-600 mA during transmission. My sensor nodes run on mains power with battery backup, so I can live with that. For battery-only deployments, the math changes entirely — you'd need NB-IoT (Narrowband IoT) or LTE-M (LTE for Machines — low-power wide-area network protocols designed for battery-powered IoT devices) modules drawing 10-50 mA at peak.

One thing cellular can't fix: signal quality varies by location. Below -95 dBm, packet loss climbs sharply. I've stood in a building basement watching signal bars flicker while my sensor node cheerfully cached readings locally, waiting for a transmission window. Cellular dead zones are a recurring headache — I've [documented the failure modes](https://zacharyvorsteg.com/blog/what-breaks-when-you-automate-everything/) in detail. Some sites need external antennas or the sensor node relocated to a spot with better reception.

## Jetson Orin Nano: Edge Processing Instead of Cloud

Why process data on-site instead of streaming everything to a server? Three reasons: latency, bandwidth cost, and the ability to run inference at the edge without depending on an internet connection that might drop.

NVIDIA's Jetson Orin Nano packs 40 TOPS (trillion operations per second) of AI compute into a module smaller than a credit card. It runs my thermal anomaly detection model locally using TensorRT (NVIDIA's inference optimizer for deploying trained models on edge devices) — comparing incoming sensor frames against baseline patterns and flagging deviations that indicate leaks, HVAC failures, or insulation degradation. Sensor nodes push data over MQTT (Message Queuing Telemetry Transport — a lightweight publish-subscribe protocol designed for constrained IoT devices and unreliable networks).

### The Pipeline: Sensor to Insight

```
ESP32-S3 (sensor node) → [cellular/local network] → Jetson Orin Nano (edge hub)
   ├── Read MLX90640 (768 pixels, 30s interval)
   ├── Local buffer (survives network outages)
   ├── Transmit compressed frame via MQTT
   └── Heartbeat + diagnostics every 60s

Jetson Orin Nano (edge hub) → [cloud sync when available]
   ├── Receive frames from N sensor nodes
   ├── Run anomaly detection model (TensorRT)
   ├── Store 30-day rolling history locally
   ├── Alert via Telegram on threshold breach
   └── Sync summaries to cloud dashboard daily
```

Could I skip the Jetson and send everything to the cloud? Sure. But round-trip latency kills responsiveness for real-time monitoring, and cellular data costs add up fast across multiple sensor nodes running 24/7. My edge hub paid for itself in avoided bandwidth charges within three months.

ABI Research projects TinyML device shipments growing from 15 million in 2020 to 2.5 billion by 2030, as on-device inference becomes standard across industrial IoT, smart cities, and manufacturing. Compute is moving to where the data lives. Staying there, too.

Precedence Research puts the global microcontroller market at $36.23 billion for 2025, driven by IoT adoption and edge AI demand. That's the tailwind behind what I'm building: MCUs smart enough to run local inference, cheap enough to scatter across a portfolio of buildings.

## Field Deployment: What Nobody Warns You About

Prototyping is the fun part. Field deployment is where hardware humbles you.

### Enclosures, Weatherproofing, and Mounting

My first enclosure was a 3D-printed PLA box. It lasted two months before UV exposure made it brittle enough to crack. Second iteration: IP65-rated (dust-tight and protected against low-pressure water jets) ABS enclosures with cable glands for the power and antenna leads. Not glamorous. Effective.

Mounting hardware in commercial buildings means dealing with building managers, fire codes, insurance requirements, and tenants who want to know why you're drilling into their ceiling. Software deployment is `git push`. Hardware deployment is a ladder, a drill, cable ties, and a conversation with a facilities manager who's never heard of an ESP32.

### The Calibration Problem

Factory calibration on the MLX90640 is ±1°C. After six months in the field — temperature cycling, humidity exposure, vibration from HVAC equipment — sensors drift. Half a degree, then a full degree. Readings still look plausible on the dashboard. Those [monitoring blind spots](https://zacharyvorsteg.com/blog/what-breaks-when-you-automate-everything/) I wrote about elsewhere? Calibration drift is the hardware version of that same problem.

My solution: a quarterly recalibration protocol using a known-temperature reference surface. Drive to the site, hold the reference in front of the sensor, log the offset, push a calibration update over the air. Not scalable. But at my current deployment count, it's sustainable — and it catches drift before it corrupts the data pipeline.

| Stage | What I Expected | What Actually Happened |
|-------|----------------|----------------------|
| Prototyping | 2 weeks | 3 months, 5 iterations — each iteration adding complexity and cost as new requirements surfaced |
| Firmware | Port Python logic to C | Complete rewrite — embedded patterns share nothing with application code |
| Enclosure | Buy off-the-shelf | Custom mounting brackets for every site — no two ceilings are identical |
| Deployment | Mount and go | 4-hour site visit minimum — signal testing, calibration, facilities coordination |
| Maintenance | Remote updates | Quarterly site visits for recalibration, antenna adjustments, physical inspection |
| Power | Plug in | Dedicated circuit negotiation with building management, UPS for battery backup |

Numbers are grim: 97% of consumer hardware companies tracked by CBInsights died or became zombies, and most products need a minimum of 3 to 5+ prototype iterations depending on complexity (CBInsights; Predictable Designs, 2025). I'm in that statistic. Five iterations, three months, and a graveyard of prototype boards sitting in a drawer. Each one fixed something the previous version got wrong — a lesson no datasheet could have taught me.

## Where Solo Hardware Development Is Heading

Five years ago, shipping hardware solo was borderline delusional. Today it's just hard.

PCB (printed circuit board) prototyping through services like JLCPCB starts at $2 for bare boards with assembly running $0.05 to $0.50 per component and turnaround in 2-3 days (JLCPCB, 2026). When I started, I hand-soldered everything. Now I upload a design file, pay less than a restaurant dinner, and receive assembled boards in a week.

Global Market Statistics pegs the TinyML market at $1.24 billion for 2025 — machine learning models running on microcontrollers. Not a niche anymore. Edge AI is becoming a standard feature, not a research project.

### ESP32-P4: The Next Generation

Espressif's ESP32-P4 represents a generational leap: dual-core RISC-V (an open-source instruction set architecture gaining rapid adoption in embedded systems) at 400 MHz with dedicated AI instruction extensions, 768 KB SRAM, MIPI-CSI camera interface, and 1080p display support (Espressif Systems, 2025). This is an MCU that can run computer vision models locally. My current ESP32-S3 handles thermal arrays. The P4 could handle visual inspection, occupancy detection, and thermal imaging simultaneously — on a single chip.

### Nordic's NPU Play

Nordic Semiconductor's nRF54LM20B, announced at CES 2026, integrates a dedicated Axon NPU (neural processing unit — specialized silicon for machine learning inference) that runs TinyML inference 15x faster than the Cortex-M33 CPU alone, while adding Bluetooth LE, Thread, and Matter support (Nordic Semiconductor, January 2026). That's AI inference on battery-powered wireless sensors — no edge hub required. My current architecture needs the Jetson for inference. The next generation might not.

Carta's 2025 data: solo-founded startups now represent 36.3% of all new company incorporations, up from 23.7% in 2019. More people building alone, and the toolchain has caught up. That gap between "I can write firmware" and "I can ship a hardware product" used to require a team. Now it requires persistence and a credit card for JLCPCB.

My [agentic engineering methodology](https://zacharyvorsteg.com/blog/agentic-engineering-patterns/) I use for software applies to firmware too — with caveats. You can't [vibe code](https://zacharyvorsteg.com/blog/vibe-coding-vs-real-engineering/) embedded systems. There's no undo button for a bricked microcontroller deployed on a roof three miles away. Every line of firmware gets the line-by-line review treatment, period.

## What I'd Tell a Software Developer Starting Hardware

Build the ugliest working prototype first. Not a clean PCB — a breadboard held together with jumper wires and tape. Prove the sensor reads correctly. Prove the data reaches your server. Prove the enclosure survives a week outdoors. Then iterate.

Biggest mental shift? Atoms are not bits. Software has zero marginal cost for copies. Hardware has BOM (bill of materials) cost, shipping, lead times, minimum order quantities, and components going end-of-life without warning. My [context engineering layer](https://zacharyvorsteg.com/blog/context-engineering-ai-agents/) helps debug firmware, and my [agentic AI workflow](https://zacharyvorsteg.com/blog/how-i-use-agentic-ai-one-person-company/) handles morning briefings that include sensor health status. But when an ESP32 loses cellular connectivity in a ceiling plenum, no AI agent drives to the building and swaps the module. That's me, a ladder, and a Tuesday afternoon.

Hardware's the reason I [build in public](https://zacharyvorsteg.com/blog/how-i-build-in-public-as-a-technical-founder/). Documenting the journey — including the five prototype iterations, the UV-degraded enclosure, the cellular dead zones — forces honest assessment of what's working and what needs rebuilding. Hardware punishes dishonesty faster than software ever will.

## Frequently Asked Questions

### Can a software developer build IoT hardware with no electronics background?

Yes, but budget for a steep learning curve. The ESP32 ecosystem, mature I2C sensor libraries, and services like JLCPCB (boards from $2, assembly in 2-3 days) make it more accessible than ever. The global microcontroller market reached $36.23 billion in 2025 (Precedence Research), driven partly by development platforms that pull software developers into embedded systems. Start with a dev board and a single sensor before committing to custom PCBs.

### How much does it cost to prototype an IoT device?

My thermal detection sensor node costs roughly $200 in components per unit: ~$50 for the MLX90640 sensor, ~$10 for the ESP32-S3 dev board, ~$60 for the Quectel EG25-G cellular module, plus enclosure, antenna, power supply, and miscellaneous. PCB prototyping starts at $2 through JLCPCB with assembly at $0.05-$0.50 per component. Expect a minimum of 3 to 5+ prototype iterations depending on complexity, with costs climbing as new requirements surface (Predictable Designs, 2025).

### Why use cellular instead of Wi-Fi for IoT deployments?

Wi-Fi requires site-specific network configuration, IT coordination, and credential management — each a failure point you'll troubleshoot solo. Cellular IoT module shipments grew 23% in Q1 2025 (IoT Analytics), reflecting industry-wide adoption. A pre-activated IoT SIM costs $2-5/month for low-bandwidth applications. The trade-off is power consumption: LTE Cat 4 modules like the Quectel EG25-G draw 500-600 mA during transmission versus Wi-Fi's ~150 mA, so cellular works best for mains-powered deployments.

### What's the hardest part of going from prototype to production?

Field deployment — not the electronics. Enclosures degrade under UV exposure, cellular signal varies by building, calibration drifts over months, and every install means coordinating with a facilities manager who has zero context on what you're doing. 97% of consumer hardware companies tracked by CBInsights died or became zombies — not because the electronics didn't work, but because manufacturing, logistics, and field realities ate them alive. My five prototype iterations took three months, not the two weeks I'd budgeted.

### How does edge AI change solo IoT development?

Dramatically. TinyML device shipments are projected to grow from 15 million in 2020 to 2.5 billion by 2030 (ABI Research), and the TinyML market reached $1.24 billion in 2025 (Global Market Statistics). Nordic's nRF54LM20B integrates an NPU running inference 15x faster than the CPU alone (Nordic Semiconductor, CES 2026). This means anomaly detection, occupancy classification, and predictive maintenance can run on the sensor node itself — reducing dependence on cloud connectivity and edge hubs.

### Is the ESP32 good enough for production IoT products?

Espressif has shipped over one billion chips globally (Espressif Systems), and the ESP32 powers commercial products across agriculture, industrial monitoring, and smart home categories. The ESP32-S3 I use handles 768-pixel thermal arrays, cellular modem control, and local data buffering reliably. The upcoming ESP32-P4 adds RISC-V at 400 MHz with AI instruction extensions and MIPI camera support — closing the gap with application processors for edge AI workloads.

---

Every other post on this site describes software systems — [bots that trade markets](https://zacharyvorsteg.com/blog/algorithmic-trading-bots-side-project/), [automation infrastructure](https://zacharyvorsteg.com/blog/my-solo-founder-automation-stack/), [AI workflows](https://zacharyvorsteg.com/blog/how-i-use-agentic-ai-one-person-company/) managing four ventures. This is the post about the physical layer underneath all of that — sensors bolted to ceilings, cellular modules negotiating tower handoffs, firmware running for months without a restart. Hardware is where software meets reality, and reality doesn't accept pull requests.

If you're a software developer considering hardware — or building IoT systems and want to compare approaches — see [what I'm working on](https://zacharyvorsteg.com/#work) or [reach out](https://zacharyvorsteg.com/#contact).

<!--
GEO_META:
SPEAKABLE: Zachary Vorsteg documents building and deploying an IoT thermal detection system as a solo developer with no formal hardware engineering background. The system uses ESP32-S3 microcontrollers, MLX90640 infrared sensor arrays, Quectel EG25-G cellular modules, and Jetson Orin Nano edge processing — designed, prototyped, programmed, and field-deployed by one person. The post covers sensor selection, firmware development, cellular backhaul decisions, field deployment realities, and where the embedded hardware industry is heading with ESP32-P4 AI extensions and Nordic's nRF54LM20B integrated NPU.
KEY_TAKEAWAY: Solo IoT hardware development is viable for software developers — the ESP32 ecosystem, $2 PCB prototyping, and mature cellular IoT modules have lowered barriers dramatically — but the prototype-to-production gap involves enclosure engineering, field calibration drift, cellular signal variability, and physical deployment logistics that have no software equivalent. The author's thermal detection system uses $200 in components per node versus $15,000+ commercial alternatives, proving cost-effective hardware is buildable solo with no formal hardware training.
ANSWERS_QUERIES:
- Can a software developer build IoT hardware products?
- How do you build an IoT thermal detection system?
- What does it cost to prototype an IoT sensor device?
- ESP32-S3 vs other microcontrollers for IoT production
- Why use cellular instead of Wi-Fi for IoT deployments?
- How hard is it to go from hardware prototype to production?
CITABLE_FACTS: 24
NAMED_ENTITIES: 40 (ESP32-S3, ESP32-P4, MLX90640, MLX90641, MLX90614, AMG8833, FLIR Lepton 3.5, Melexis, Panasonic, Espressif Systems, Quectel EG25-G, Jetson Orin Nano, NVIDIA, Nordic Semiconductor, nRF54LM20B, Axon NPU, Cortex-M33, RISC-V, FreeRTOS, ESP-IDF, TensorRT, MQTT, Telegram, JLCPCB, IoT Analytics, CBInsights, Carta, Precedence Research, Global Market Statistics, ABI Research, Memfault, Predictable Designs, I2C, SPI, PLA, ABS, IP65, Bluetooth LE, LTE Cat 4, Thread, Matter)
FAQ_QUESTIONS: 6
TABLES: 2
INLINE_DEFINITIONS: 11 (I2C, ESP-IDF, FreeRTOS, GNSS, NB-IoT, LTE-M, TensorRT, MQTT, IP65, BOM, PCB, NPU, RISC-V)
-->

<!-- SELF-ASSESSMENT
WORD_COUNT: ~2,700
DATA_POINTS: 24+ citable facts
SOURCED_STATS: 14 (IoT Analytics 2025 — 21.1B devices, CBInsights — 97% hardware startups, Espressif — 1B+ chips, Global Market Statistics 2025 — $1.24B TinyML, Nordic Semiconductor CES 2026 — 15x NPU speedup, IoT Analytics Q1 2025 — 23% cellular growth, IoT Analytics Q1 2025 — Quectel 40% share, JLCPCB 2026 — $2 PCBs, Precedence Research 2025 — $36.23B MCU market, Predictable Designs 2025 — 3-5+ iterations, Carta 2025 — 36.3% solo founders, Espressif 2025 — ESP32-P4 400MHz RISC-V AI extensions, ABI Research — TinyML 15M to 2.5B devices 2020-2030, Memfault 2026 — firmware/config drift top failures)
NAMED_ENTITIES: 40 (ESP32-S3, ESP32-P4, MLX90640, MLX90641, MLX90614, AMG8833, FLIR Lepton 3.5, Melexis, Panasonic, Espressif Systems, Quectel EG25-G, Jetson Orin Nano, NVIDIA, Nordic Semiconductor, nRF54LM20B, Axon NPU, Cortex-M33, RISC-V, FreeRTOS, ESP-IDF, TensorRT, MQTT, Telegram, JLCPCB, IoT Analytics, CBInsights, Carta, Precedence Research, Global Market Statistics, ABI Research, Memfault, Predictable Designs, I2C, SPI, PLA, ABS, IP65, Bluetooth LE, LTE Cat 4)
INTERNAL_LINKS: 12 (Posts 1-10 + /#work + /#contact)
H2_SECTIONS: 8 (Why a Software Developer Started Building Hardware, Choosing the Right Sensor, ESP32-S3, Cellular Backhaul, Jetson Orin Nano Edge Processing, Field Deployment, Where Solo Hardware Development Is Heading, What I'd Tell a Software Developer Starting Hardware)
NON_FAQ_H3: 7 (What I Evaluated and Why, My First Firmware, The Quectel EG25-G Decision, What Cellular Gets Right, The Pipeline, Enclosures Weatherproofing Mounting, The Calibration Problem + ESP32-P4 + Nordic NPU)
FAQ_QUESTIONS: 6
TABLES: 2 (Sensor comparison, Expected vs Reality)
CODE_SNIPPETS: 2 (Firmware before/after, Edge pipeline architecture)
UNIQUE_ANGLE: First-person hardware development journey from a software developer with no formal hardware background — covering sensor selection trade-offs, firmware mistakes, cellular vs Wi-Fi decisions, and field deployment realities. Zero personal narrative competitors in IoT/embedded space.
PILLAR: Hardware & PropTech (first dedicated hardware post — strengthens pillar currently anchored by Post 5)
-->
