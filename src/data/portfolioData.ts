import { Project, Experience, SkillCategory, Certification } from '../types';

export const PERSONAL_INFO = {
  name: 'Harish Bawin K P',
  initials: 'HB',
  tagline: 'Embedded Systems Engineer | Multilayer PCB Design | Real-Time Signal Processing',
  email: 'harishbawinas@gmail.com',
  phone: '+91 93455 87489',
  location: 'Chennai, India',
  linkedin: 'https://linkedin.com/in/harish-bawin',
  linkedinHandle: 'in/harish-bawin',
  github: 'https://github.com/harishbawin18',
  githubHandle: 'github.com/harishbawin18',
  summary: `Electronics and Communication Engineering student at College of Engineering Guindy (Anna University) with hands-on experience in bare-metal embedded firmware development, ARM Cortex-M peripheral driver development, and multilayer PCB design. Proficient in Embedded C/C++, STM32, ESP32, Raspberry Pi, and Verilog, with strong fundamentals in register-level programming, communication protocols, and embedded systems.`,
  hardwareBio: 'Hardware & multilayer PCB designer experienced in KiCad, high-density sensor routing, power integrity optimization, and wearable form factors.',
  firmwareBio: 'Embedded firmware engineer specializing in bare-metal register programming on ARM Cortex-M, custom peripheral driver libraries, and real-time DSP pipelines.',
};

export const PROJECTS: Project[] = [
  {
    id: 'stm32-driver-dev',
    title: 'Bare-Metal STM32 Peripheral Driver Development',
    category: 'firmware',
    categoryLabel: 'Bare-Metal Firmware',
    organization: 'Independent Hardware & Firmware Project',
    timeline: 'Core Technical Initiative',
    summary: 'Developed a comprehensive bare-metal peripheral driver library for STM32 ARM Cortex-M microcontrollers directly using register manipulation without ST HAL or standard peripheral libraries.',
    image: '/src/assets/images/stm32_driver_thumb_1788973761362.jpg',
    highlights: [
      'Implemented GPIO, SPI, I2C, USART, interrupt configuration, and peripheral clock management through direct register-level programming without vendor HAL.',
      'Designed clean, modular, and reusable driver APIs based on the STM32F4/F1 Reference Manuals, emphasizing code reusability across Cortex-M targets.',
      'Configured nested vectored interrupt controller (NVIC), priority grouping, and pending bit routines for low-latency asynchronous events.',
      'Verified timing and signal integrity on STM32 Nucleo hardware using an external logic analyzer and digital oscilloscope.',
    ],
    specs: {
      mcu: 'STM32F401RE / STM32F446RE (ARM Cortex-M4)',
      protocols: ['SPI (Full-Duplex)', 'I2C (Standard & Fast Mode)', 'USART (Async)', 'GPIO'],
      software: ['Bare-Metal Embedded C', 'GNU Arm Toolchain', 'STM32CubeIDE', 'GDB/OpenOCD'],
    },
    codeSnippet: {
      language: 'c',
      filename: 'stm32f401xx_gpio_driver.c',
      code: `/* Bare-Metal STM32 GPIO Pin Configuration without HAL */
#include "stm32f401xx.h"

void GPIO_Init(GPIO_Handle_t *pGPIOHandle) {
    uint32_t temp = 0;
    
    // 1. Configure Pin Mode (Input, Output, Alt Function, Analog)
    if (pGPIOHandle->GPIO_PinConfig.GPIO_PinMode <= GPIO_MODE_ANALOG) {
        temp = (pGPIOHandle->GPIO_PinConfig.GPIO_PinMode << (2 * pGPIOHandle->GPIO_PinConfig.GPIO_PinNumber));
        pGPIOHandle->pGPIOx->MODER &= ~(0x3 << (2 * pGPIOHandle->GPIO_PinConfig.GPIO_PinNumber));
        pGPIOHandle->pGPIOx->MODER |= temp;
    }
    
    // 2. Configure Output Speed
    temp = (pGPIOHandle->GPIO_PinConfig.GPIO_PinSpeed << (2 * pGPIOHandle->GPIO_PinConfig.GPIO_PinNumber));
    pGPIOHandle->pGPIOx->OSPEEDR &= ~(0x3 << (2 * pGPIOHandle->GPIO_PinConfig.GPIO_PinNumber));
    pGPIOHandle->pGPIOx->OSPEEDR |= temp;
    
    // 3. Configure Pull-Up / Pull-Down
    temp = (pGPIOHandle->GPIO_PinConfig.GPIO_PinPuPdControl << (2 * pGPIOHandle->GPIO_PinConfig.GPIO_PinNumber));
    pGPIOHandle->pGPIOx->PUPDR &= ~(0x3 << (2 * pGPIOHandle->GPIO_PinConfig.GPIO_PinNumber));
    pGPIOHandle->pGPIOx->PUPDR |= temp;
}`,
    },
    keyTakeaway: 'Mastery of ARM Cortex-M memory mapping, bitmask manipulation, and bus clock trees (AHB1, APB1, APB2) at the silicon register level.',
  },
  {
    id: 'wearable-biosensing-pcb',
    title: '20 × 25 mm Multilayer Wearable Biosensing PCB',
    category: 'hardware',
    categoryLabel: 'PCB & Hardware Design',
    organization: 'IBT Aura — Internship Project',
    timeline: 'Dec 2025 – Feb 2026',
    summary: 'Designed an ultra-compact 20 × 25 mm multilayer wearable hardware system incorporating PPG optical sensing, 6-axis motion tracking, and ultra-low power management.',
    image: '/src/assets/images/pcb_biosensing_thumb_1788973778277.jpg',
    highlights: [
      'Designed a miniature 4-layer 20 × 25 mm rigid PCB in KiCad optimized for space-constrained wearable biometric monitoring.',
      'Achieved robust signal routing, controlled impedance traces, and solid ground planes to suppress RF and switching noise.',
      'Integrated MAX32652 ultra-low-power ARM Cortex-M4 microcontroller with MAX86171 dual-channel optical pulse oximeter / heart-rate sensor.',
      'Interfaced BMI160 ultra-low noise 6-axis inertial measurement unit (IMU) and MAX77818 power management IC for smart lithium charging.',
    ],
    specs: {
      mcu: 'Analog Devices MAX32652 (ARM Cortex-M4 with FPU)',
      pcbDimensions: '20 mm × 25 mm (Multilayer rigid PCB)',
      hardware: ['MAX86171 Optical PPG AFE', 'BMI160 6-Axis IMU', 'MAX77818 PMIC & LiPo Charger'],
      protocols: ['SPI (High-Speed)', 'I2C (Fast Mode Plus)', 'Interrupt Pins for Wake-on-Motion'],
    },
    codeSnippet: {
      language: 'c',
      filename: 'max86171_afe_config.c',
      code: `/* MAX86171 Optical Pulse Oximeter & PPG Initialization */
#define MAX86171_I2C_ADDR       0x62
#define REG_SYSTEM_CFG          0x00
#define REG_PIN_FUNC            0x10
#define REG_MEAS1_CFG1          0x20

int MAX86171_Init(I2C_TypeDef *i2c_bus) {
    uint8_t cfg_buf[2];
    
    // Enable internal 32MHz PLL and Photodiode bias
    cfg_buf[0] = REG_SYSTEM_CFG;
    cfg_buf[1] = 0x01; // Power-on system clock
    I2C_Write(i2c_bus, MAX86171_I2C_ADDR, cfg_buf, 2);
    
    // Configure Optical LED1 (Green 537nm) and LED2 (Infrared 940nm)
    cfg_buf[0] = REG_MEAS1_CFG1;
    cfg_buf[1] = (0x02 << 4) | (0x01); // 100Hz sample rate, 19-bit ADC
    I2C_Write(i2c_bus, MAX86171_I2C_ADDR, cfg_buf, 2);
    return 0; // Success
}`,
    },
    keyTakeaway: 'High-density component placement with minimal parasitics, power rail decoupling, and sub-milliamp sleep current budgeting.',
  },
  {
    id: 'ecg-monitoring-system',
    title: 'Real-Time ECG Monitoring System (250 Hz)',
    category: 'iot',
    categoryLabel: 'IoT & Signal Processing',
    organization: 'Biomedical Telemetry Initiative',
    timeline: 'Technical Project',
    summary: 'Engineered an ESP32-driven physiological signal acquisition system interfaced with an AD8232 analog front-end, capturing 250 Hz cardiac waveforms and streaming data over UART to MATLAB.',
    image: '/src/assets/images/ecg_monitor_thumb_1788973791657.jpg',
    highlights: [
      'Developed high-precision firmware for ESP32 utilizing hardware timer interrupts to achieve jitter-free 250 Hz ADC sampling.',
      'Interfaced AD8232 single-lead heart rate monitor front-end with Lead-Off Detection (LO+ and LO-) for sensor disconnect detection.',
      'Implemented digital signal processing pipeline including 50Hz notch filtering, baseline wander removal, and Pan-Tompkins QRS peak detection.',
      'Streamed live telemetry packets over UART to a custom MATLAB dashboard for real-time waveform visualization and heart rate variability (HRV) metrics.',
    ],
    specs: {
      mcu: 'Espressif ESP32-WROOM-32 (Dual-Core Tensilica Xtensa)',
      samplingRate: '250 Hz (Hardware Timer ISR Driven)',
      hardware: ['AD8232 ECG Analog Front-End', '3-Lead Ag/AgCl Electrodes', 'UART-to-USB Bridge'],
      software: ['ESP-IDF / Embedded C', 'MATLAB Signal Processing Toolbox', 'Digital Bandpass & Notch Filters'],
    },
    codeSnippet: {
      language: 'c',
      filename: 'ecg_timer_isr.c',
      code: `/* Timer Interrupt Service Routine for 250Hz ECG Sampling */
#include "esp_timer.h"
#include "driver/adc.h"

#define SAMPLING_PERIOD_US 4000 // 4000us = 250Hz

static void IRAM_ATTR ecg_sample_timer_callback(void* arg) {
    // 1. Read Analog Front-End raw voltage from AD8232
    int raw_adc = adc1_get_raw(ADC1_CHANNEL_0);
    
    // 2. Check Lead-Off flags (LO+ and LO-)
    bool lo_plus = gpio_get_level(GPIO_NUM_14);
    bool lo_minus = gpio_get_level(GPIO_NUM_12);
    
    // 3. Format telemetry packet: [SYNC_BYTE, ADC_MSB, ADC_LSB, STATUS, CHECKSUM]
    uint8_t packet[5];
    packet[0] = 0xAA;
    packet[1] = (raw_adc >> 8) & 0xFF;
    packet[2] = raw_adc & 0xFF;
    packet[3] = (lo_plus << 1) | (lo_minus);
    packet[4] = packet[0] ^ packet[1] ^ packet[2] ^ packet[3];
    
    uart_write_bytes(UART_NUM_0, (const char*)packet, 5);
}`,
    },
    keyTakeaway: 'Precision timing without drift, low-noise analog signal conditioning, and deterministic UART serialization.',
  },
  {
    id: 'smart-reader-assistive',
    title: 'Smart Reader for Visually Impaired — Raspberry Pi',
    category: 'iot',
    categoryLabel: 'Embedded Systems & Assistive Tech',
    organization: 'Assistive Device Initiative',
    timeline: 'Technical Project',
    summary: 'Built an embedded Linux assistive system combining hardware push-button triggers, camera capture, Tesseract OCR processing, and eSpeak text-to-speech synthesis.',
    image: '/src/assets/images/smart_reader_thumb_1788973805163.jpg',
    highlights: [
      'Constructed a standalone Raspberry Pi assistive reading device with hardware GPIO debouncing and auditory status cues.',
      'Engineered an automated pipeline: physical trigger -> image capture -> adaptive thresholding -> optical character recognition (OCR) -> text-to-speech (TTS).',
      'Optimized embedded Linux system daemon scripts and memory footprints for fast, reliable, offline on-device processing.',
      'Integrated LED illumination ring and tactile feedback switches to assist users with varying degrees of visual impairment.',
    ],
    specs: {
      mcu: 'Raspberry Pi Single Board Computer (Broadcom BCM2837 ARM Cortex-A53)',
      hardware: ['Raspberry Pi Camera Module v2', 'Tactile Push Buttons', '3.5mm Audio DAC / Headphone Jack'],
      software: ['Python 3 / OpenCV', 'Tesseract OCR Engine', 'eSpeak NG Speech Synthesizer', 'Linux GPIO Sysfs'],
    },
    codeSnippet: {
      language: 'python',
      filename: 'reader_pipeline.py',
      code: `import RPi.GPIO as GPIO
import cv2
import pytesseract
import subprocess

TRIGGER_PIN = 17
AUDIO_BUSY_PIN = 27

def on_button_press(channel):
    print("[SYSTEM] Capture triggered via hardware GPIO...")
    # 1. Grab high-resolution frame
    cap = cv2.VideoCapture(0)
    ret, frame = cap.read()
    cap.release()
    
    # 2. Image pre-processing for maximum OCR contrast
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    denoised = cv2.fastNlMeansDenoising(gray, h=10)
    thresh = cv2.adaptiveThreshold(denoised, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 11, 2)
    
    # 3. Extract text and synthesize audio
    extracted_text = pytesseract.image_to_string(thresh)
    if extracted_text.strip():
        subprocess.run(["espeak-ng", "-v", "en-us", "-s", "150", extracted_text])`,
    },
    keyTakeaway: 'Seamless bridge between hardware event handling, embedded computer vision, and real-time audio playback.',
  },
  {
    id: 'industrial-iot-admini',
    title: 'Industrial IoT & SPI TFT Display Automation',
    category: 'iot',
    categoryLabel: 'IoT & Web Integration',
    organization: 'Admini — AI Ecosystem for MSMEs',
    timeline: 'Aug 2025 – Oct 2025',
    summary: 'Developed firmware for an ESP32-based industrial tracking system driving servo motors, SPI TFT displays, and synchronized cloud communication via Node.js and MongoDB.',
    image: '/src/assets/images/stm32_driver_thumb_1788973761362.jpg',
    highlights: [
      'Wrote modular firmware for ESP32 controlling dual precision servo actuators and rendering dynamic metrics on an SPI color TFT display.',
      'Established bi-directional cloud communication over REST and MQTT with a Node.js and MongoDB backend for real-time telemetry.',
      'Contributed to QR-based asset tracking verification and an AI-assisted web automation pipeline for MSME production efficiency.',
      'Engineered fail-safe mechanisms including hardware watchdog timers and network reconnection backoff routines.',
    ],
    specs: {
      mcu: 'ESP32 Dual-Core',
      protocols: ['SPI (TFT Display ST7789)', 'PWM (Servo Motor Control)', 'WiFi / HTTP / MQTT'],
      software: ['Embedded C/C++', 'Node.js', 'MongoDB', 'FreeRTOS Tasks'],
    },
    codeSnippet: {
      language: 'c',
      filename: 'spi_tft_telemetry.c',
      code: `/* ESP32 SPI TFT Status Rendering & Cloud Sync */
#include "esp_http_client.h"
#include "driver/spi_master.h"

void update_device_display(uint32_t units_counted, float motor_temp) {
    char status_str[64];
    snprintf(status_str, sizeof(status_str), "UNITS: %lu | TEMP: %.1fC", units_counted, motor_temp);
    
    // Fast block transfer over SPI bus to ST7789 display controller
    tft_draw_string(10, 30, status_str, TFT_WHITE, TFT_BLACK);
}`,
    },
    keyTakeaway: 'End-to-end integration connecting raw silicon, displays, actuators, and enterprise cloud dashboards.',
  },
];

export const EXPERIENCES: Experience[] = [
  {
    id: 'ibt-aura',
    role: 'Embedded Systems Engineer Intern',
    company: 'IBT Aura',
    subtitle: 'Multilayer Wearable Biometric PCB & Sensor Fusion',
    period: 'Dec 2025 – Feb 2026',
    type: 'internship',
    location: 'Chennai, India',
    points: [
      'Designed a compact 20 × 25 mm multilayer wearable PCB using KiCad, optimizing component placement, signal routing, and power integrity for space-constrained embedded systems.',
      'Integrated the MAX32652 microcontroller with the MAX86171 PPG sensor, BMI160 IMU, and MAX77818 PMIC, enabling reliable physiological and motion sensing.',
      'Conducted design rule checks (DRC), impedance matching calculations, and power plane distribution to ensure low noise across analog sensory traces.',
    ],
    technologies: ['KiCad', 'Multilayer PCB', 'MAX32652', 'MAX86171 PPG', 'BMI160 IMU', 'MAX77818 PMIC', 'I2C/SPI'],
  },
  {
    id: 'admini',
    role: 'Embedded Systems Engineer Intern',
    company: 'Admini — AI Ecosystem for MSMEs',
    subtitle: 'IoT System Firmware, SPI Display Interfacing & Cloud Telemetry',
    period: 'Aug 2025 – Oct 2025',
    type: 'internship',
    location: 'Chennai, India',
    points: [
      'Developed firmware for an ESP32-based IoT system integrating servo motor control, SPI display interfacing, and cloud communication using Node.js and MongoDB for real-time device monitoring and control.',
      'Worked on embedded and IoT development using ESP32 and Raspberry Pi, including SPI TFT display interfacing while also contributing to QR-based tracking metrics and an AI-assisted web automation tool.',
      'Designed modular FreeRTOS tasks to ensure non-blocking network requests while maintaining precision PWM for actuator control.',
    ],
    technologies: ['ESP32', 'Raspberry Pi', 'Embedded C/C++', 'Node.js', 'MongoDB', 'SPI TFT', 'Servo PWM', 'FreeRTOS'],
  },
  {
    id: 'ceg-tech-forum',
    role: 'Organizer, Industry Relations',
    company: 'CEG Tech Forum',
    subtitle: 'Premier Engineering Techno-Management Forum of Anna University',
    period: 'July 2025',
    type: 'leadership',
    location: 'College of Engineering Guindy, Chennai',
    points: [
      'Spearheaded industry outreach and partnership initiatives, connecting students with technology professionals and facilitating knowledge exchange at one of India’s premier engineering forums.',
      'Coordinated technical workshops, expert guest lectures on emerging embedded hardware trends, and student tech hackathons.',
    ],
    technologies: ['Leadership', 'Industry Partnerships', 'Technical Symposiums', 'Engineering Outreach'],
  },
  {
    id: 'anna-univ',
    role: 'B.E. Electronics & Communication Engineering',
    company: 'College of Engineering Guindy, Anna University',
    subtitle: 'Undergraduate Degree • CGPA: 8.34 / 10',
    period: '2023 – 2027',
    type: 'education',
    location: 'Chennai, Tamil Nadu, India',
    points: [
      'Ranked among top performers in core curriculum: Microprocessors & Microcontrollers, Digital System Design, Signals & Systems, Analog Circuits, and VLSI Design.',
      'Active researcher in embedded systems, bare-metal microcontroller architectures, and IoT hardware labs.',
    ],
    technologies: ['ARM Architecture', 'Digital Signal Processing', 'Verilog HDL', 'VLSI', 'Electronic Circuits'],
  },
  {
    id: 'agn-matric',
    role: 'Higher Secondary Certificate (HSC)',
    company: 'AGN Matric Higher Secondary School',
    subtitle: 'Academic Excellence • Score: 97.33%',
    period: '2021 – 2023',
    type: 'education',
    location: 'Salem, Tamil Nadu, India',
    points: [
      'Secured 97.33% with top marks in Mathematics, Physics, and Chemistry.',
    ],
    technologies: ['Physics', 'Mathematics', 'Chemistry'],
  },
];

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    title: 'Languages',
    iconName: 'Code',
    description: 'Low-level and systems programming languages for hardware and compute',
    skills: [
      { name: 'Embedded C', level: 'Advanced', highlight: true, detail: 'Register manipulation, bitwise ops, memory maps' },
      { name: 'C++', level: 'Proficient', highlight: true, detail: 'OOP for drivers, templates, hardware abstraction' },
      { name: 'Python', level: 'Proficient', detail: 'Scripting, OpenCV, OCR, automation, data logging' },
      { name: 'Verilog', level: 'Core', detail: 'RTL design, FSMs, combinational/sequential logic' },
    ],
  },
  {
    title: 'Embedded Systems & MCUs',
    iconName: 'Cpu',
    description: 'Target architectures, microcontrollers, and real-time execution kernels',
    skills: [
      { name: 'ARM Cortex-M', level: 'Advanced', highlight: true, detail: 'M0/M3/M4 cores, NVIC, memory barriers, SysTick' },
      { name: 'STM32 (Nucleo)', level: 'Advanced', highlight: true, detail: 'Direct register programming without vendor HAL' },
      { name: 'ESP32', level: 'Advanced', highlight: true, detail: 'Dual-core, WiFi/BLE, timer ISRs, ADC sampling' },
      { name: 'Raspberry Pi', level: 'Proficient', detail: 'Embedded Linux, GPIO, camera module, daemon services' },
      { name: 'Bare-Metal Programming', level: 'Advanced', highlight: true, detail: 'Startup code, linker scripts, clock trees' },
      { name: 'FreeRTOS (Basics)', level: 'Core', detail: 'Task scheduling, queues, semaphores, mutexes' },
    ],
  },
  {
    title: 'Hardware & Digital Design',
    iconName: 'Layers',
    description: 'Schematic capture, PCB layout, simulation, and silicon EDA tools',
    skills: [
      { name: 'KiCad PCB Design', level: 'Advanced', highlight: true, detail: 'Multilayer routing, DRC, 3D modeling, gerber gen' },
      { name: 'Multilayer PCB Routing', level: 'Proficient', highlight: true, detail: '20x25mm wearables, ground planes, power integrity' },
      { name: 'Digital Electronics', level: 'Advanced', detail: 'Gates, multiplexers, flip-flops, timing analysis' },
      { name: 'EasyEDA', level: 'Proficient', detail: 'Rapid prototyping and manufacturing export' },
      { name: 'Xilinx Vivado', level: 'Core', detail: 'FPGA synthesis, testbenches, simulation' },
      { name: 'Cadence Virtuoso', level: 'Core', detail: 'Analog/mixed-signal schematic capture' },
    ],
  },
  {
    title: 'Communication Protocols',
    iconName: 'Network',
    description: 'Hardware bus protocols, timing specifications, and serial buses',
    skills: [
      { name: 'SPI (Serial Peripheral Interface)', level: 'Advanced', highlight: true, detail: 'Full-duplex, multi-slave, up to 20+ MHz' },
      { name: 'UART / USART', level: 'Advanced', highlight: true, detail: 'Baud generation, FIFO ring buffers, parity' },
      { name: 'I2C (Inter-Integrated Circuit)', level: 'Advanced', highlight: true, detail: 'Standard/Fast mode, clock stretching, ACK/NACK' },
      { name: 'CAN Bus', level: 'Familiar', detail: 'Differential signaling, arbitration, frame structure' },
    ],
  },
  {
    title: 'Development & Lab Tools',
    iconName: 'Terminal',
    description: 'IDEs, toolchains, simulation packages, and instrumentation',
    skills: [
      { name: 'STM32CubeIDE', level: 'Advanced', highlight: true, detail: 'Debug configurations, register views, build system' },
      { name: 'MATLAB & Simulink', level: 'Proficient', detail: 'Signal processing, FFT, digital filter design' },
      { name: 'Git & Version Control', level: 'Proficient', detail: 'Repository workflow, submodules, branch strategy' },
      { name: 'Logic Analyzers & DSOs', level: 'Proficient', highlight: true, detail: 'Bus decoding, waveform inspection, timing jitter' },
    ],
  },
];

export const CERTIFICATIONS: Certification[] = [
  {
    id: 'fastbit-driver',
    title: 'Mastering Microcontroller & Embedded Driver Development',
    issuer: 'Fastbit Embedded Brain Academy — Udemy',
    badge: 'Arm Cortex-M',
    description: 'Comprehensive deep dive into writing peripheral driver APIs from scratch for GPIO, I2C, SPI, USART, and interrupt handling using ARM Cortex-M architecture and reference manuals.',
  },
  {
    id: 'nptel-iot',
    title: 'Introduction to Internet of Things',
    issuer: 'NPTEL (National Programme on Technology Enhanced Learning)',
    badge: 'IoT & Sensors',
    description: 'Covers IoT architectures, sensing protocols, edge computation, sensor networking, wireless data propagation, and real-time cloud data pipelines.',
  },
];
