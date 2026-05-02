---
id: "ai_painting"
title: "AI绘画入门指南"
author: "鸿渚"
date: "2026-02-18"
readTime: "15分钟"
tags: ["AI", "绘画"]
---

## 一、Stable Diffusion 基础

Stable Diffusion 是一种基于扩散模型的开源AI绘画工具，因其高可控性和免费特性，成为许多专业用户的首选。要掌握它，你需要理解以下核心概念：

· 提示词（Prompt）：描述画面的文字。建议使用英文，结构遵循“主体+环境+风格+构图+画质”的公式。例如：a beautiful girl in red cheongsam, standing on ancient rooftop, full moon, cinematic lighting, 8k。
· 负面提示词（Negative Prompt）：告诉AI你不希望出现的内容。这是Stable Diffusion的一大优势，能有效避免画面缺陷。常用词汇：nsfw, worst quality, low quality, blurry, bad anatomy, extra limbs, deformed hands, watermark, text。
· 采样器（Sampler）：决定生成图像时去噪算法的具体方法，影响生成速度和质量。常用采样器包括Euler a（速度较快，风格较柔和）、DPM++ 2M Karras（质量高，细节丰富）等。新手可优先尝试DPM++ 2M Karras。
· CFG Scale（提示词相关性）：控制AI对提示词的遵循程度，取值范围一般为7-11。数值越高，生成结果越严格符合提示词，但可能损失艺术性；数值越低，AI发挥空间越大，但容易跑题。

此外，Stable Diffusion还涉及模型（Checkpoint）的选择、Lora微调模型、ControlNet精准控制等进阶功能，是深入创作的有力工具。

## 二、Midjourney 使用技巧

Midjourney 是目前公认艺术感最强的AI绘画工具，通过Discord平台操作。它的优势在于出图质量高、风格多样，但完全付费且可控性稍弱。以下是常用技巧：

· 基本操作：在Discord的Midjourney频道中输入/imagine，然后粘贴你的提示词。发送后等待约一分钟，AI会返回四张候选图。通过下方的U按钮（放大某张图）和V按钮（生成该图的变体）进行后续操作。
· 常用参数：
· --ar 16:9：设置图片宽高比（如手机壁纸2:3，电脑壁纸16:9）。
· --v 5或--v 6：指定模型版本，最新v6版本对提示词理解更强。
· --style expressive：选择风格变体（仅适用于v5以上版本），可使画面更具表现力。
· --s 750：风格化程度，数值越高艺术性越强，但可能偏离原始描述。
· --c 20：多样性参数，让四张图构图差异更大。
· 垫图（Image Prompt）：如果你想控制构图或姿势，可以上传参考图，复制图片地址后与提示词一起输入：/imagine [图片地址] [提示词]。Midjourney会参考该图的构图和色调进行生成。

## 三、模型推荐

模型（Checkpoint）是AI绘画的“大脑”，不同模型擅长不同风格。以下推荐几款主流模型，你可以在Hugging Face或Civitai下载：

· 二次元/动漫风格：
· Anything-v5：经典二次元模型，色彩鲜艳，适合日系插画。
· Counterfeit：细节丰富，线条干净，常用于高质量动漫图。
· MeinaMix：融合多种二次元风格，人物表现力强。
· 写实/人像风格：
· ChilloutMix：亚洲人像神器，皮肤质感真实，适合生成照片级人像。
· Realistic Vision：欧美写实风格，光影自然，适用性广。
· MajicMix Realistic：兼顾人像与风景，细节处理细腻。
· 建筑/室内设计：
· Architectural Design：专注于建筑外观和室内渲染，线条硬朗。
· Realistic Architecture：生成效果图级建筑表现，适合设计参考。
· Interior Design：室内设计专用，光影和材质表现优秀。

## 四、提示词示例

为了帮助你快速上手，以下是几个典型场景的提示词示例。注意观察其结构：主体描述 + 环境氛围 + 艺术风格 + 构图光线 + 画质要求。

### 示例1：二次元少女

masterpiece, best quality, 1girl, solo, long black hair, red cheongsam, holding a magic pen, standing on ancient Chinese roof, full moon, lanterns in the sky, magical atmosphere, Ghibli style, soft lighting, cinematic composition, detailed face, 8k

### 示例2：写实人像

portrait of a 25-year-old Asian woman, freckles, soft smile, wearing white linen shirt, golden hour sunlight, shallow depth of field, 35mm photography, f/1.8, realistic skin texture, 8k, highly detailed, RAW photo

### 示例3：赛博朋克城市

cyberpunk city street at night, neon lights, rain puddles reflecting signs, flying cars, crowded market, high angle shot, futuristic, volumetric lighting, unreal engine 5 render, 8k, highly detailed

### 示例4：概念建筑

futuristic library interior, huge glass dome, floating bookshelves, spiral staircases, natural light streaming in, biophilic design, architectural visualization, 8k, unreal engine 5, cinematic lighting

提示词格式建议：使用英文逗号分隔不同概念，避免复杂句式。对于关键元素可适当重复强调，如“detailed face, highly detailed face”。反向提示词建议单独列出，在Stable Diffusion中尤为关键。

---

希望这份指南能帮助你顺利开启AI绘画之旅。实践是提升的关键，多尝试、多调整，你也能创造出令人惊艳的作品！
