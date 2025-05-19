import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

const CaseDetail = () => {
  const { caseId } = useParams();
  const [caseData, setCaseData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useTranslation();

  // 案例数据 - 真实场景中可能从API获取
  const casesData = {
    '1': {
      title: "千问3（Qwen3）模型开源以及初体验",
      date: "2025-04-15",
      image: "https://placehold.co/800x400/9985D9/FFFFFF?text=Qwen3+Model",
      content: `通义千问（Qwen）是阿里云研发的一个大语言模型系列，包括基础模型和对话模型。近期，阿里云推出了Qwen3系列模型，并宣布开源。本文将介绍Qwen3模型的特点以及初步体验。

### Qwen3模型概述
Qwen3是阿里云推出的新一代大型语言模型，在多个基准测试中表现出色，已经成为全球最强的开源模型之一。特点包括：

- **多语言能力**：支持包括中文、英文在内的多种语言，中文能力尤其出色
- **低推理成本**：仅需要DeepSeek-R1三分之一的成本
- **开源友好**：提供多个规模的开源版本，包括Qwen3-0.5B, Qwen3-1.8B, Qwen3-7B和Qwen3-72B
- **全面的任务能力**：包括文本续写、对话、代码生成等多种能力

### 性能表现
在各项基准测试中，Qwen3展示了出色的表现：
- MMLU：在多任务语言理解基准上超越许多封闭模型
- GSM8K：在数学推理能力上表现出色
- HumanEval：代码能力强，通过率高

### 实际体验
在实际体验中，Qwen3表现出了以下特点：

1. **响应速度快**：即使是72B大小的模型，响应速度也相当流畅
2. **上下文理解能力强**：能够较好地理解复杂指令和长对话历史
3. **代码生成能力出色**：能够生成高质量的代码，并提供详细解释
4. **多轮对话连贯性好**：在多轮对话中能保持上下文一致性

### 部署与使用
Qwen3模型可以通过多种方式使用：
- 使用阿里云API直接调用
- 本地部署（支持llama.cpp、vLLM等部署方式）
- 使用Hugging Face进行加载和推理

### 结论
Qwen3作为一款强大的开源大语言模型，不仅性能出色，而且部署成本相对较低，适合各种规模的应用场景。对于需要高质量中文能力的应用，Qwen3是一个非常值得考虑的选择。随着持续的优化和社区贡献，Qwen3有望在更多领域发挥重要作用。`,
      category: "AI技术"
    },
    '2': {
      title: "亲测阿里千问3这8个神仙用法后，感觉有点上头！",
      date: "2025-04-10",
      image: "https://placehold.co/800x400/4FB0AE/FFFFFF?text=Qwen3+Tips",
      content: `自从阿里云推出Qwen3模型以来，我一直在探索它的各种使用方法。经过一段时间的实际测试，我发现了一些特别实用且令人惊喜的用法，在此与大家分享。

### 1. 多语言编程助手
Qwen3不仅能生成多种编程语言的代码，还能解释代码逻辑、优化现有代码、识别问题并提供修复方案。使用时只需要明确指出语言类型和需求，比如"帮我用Python实现一个高效的排序算法并解释其时间复杂度"。

### 2. 个性化学习计划制定
Qwen3可以根据个人学习目标、当前水平和时间限制来定制学习计划。例如，你可以输入"我想在3个月内学习机器学习，每周可用时间约10小时，目前有Python基础，请帮我制定学习计划。"

### 3. 创意写作伙伴
无论是撰写小说、诗歌还是广告文案，Qwen3都能提供创意支持。你可以提供写作主题、风格要求和目标读者，它会给出框架和建议，甚至可以扩展和修改你已有的内容。

### 4. 多角度思考问题
向Qwen3提出一个问题，然后要求它从不同角度思考，比如"请从技术可行性、商业价值和社会影响三个角度分析人工智能在医疗领域的应用"。这种方法有助于获取全面的分析。

### 5. 专业文献解读
当面对复杂的学术论文或专业文献时，可以让Qwen3提供简化解释。例如"请用通俗易懂的语言解释这篇关于量子计算的论文摘要..."，然后粘贴相关内容。

### 6. 模拟面试训练
Qwen3可以模拟特定职位的面试官，提出相关问题并给予反馈。只需指定职位和经验级别，如"请模拟一个资深前端开发工程师的技术面试"，然后与它进行对话式交流。

### 7. 产品需求分析与优化
向Qwen3描述产品创意，它能帮助分析市场需求、目标用户、功能规划和潜在问题。例如"我计划开发一款针对远程工作者的时间管理应用，请帮我完善产品需求"。

### 8. 个人决策辅助
在面临复杂决策时，可以让Qwen3帮助分析利弊。比如"我正在考虑是继续读研还是直接工作，请帮我分析两种选择的优缺点"，它会提供系统性的分析框架。

### 使用技巧总结
- 提供足够的上下文和具体信息
- 使用分步指导获取更详细的回答
- 不满意时，尝试改变提问方式或增加约束条件
- 对于复杂任务，将其分解为多个小问题逐步解决

Qwen3的这些用法大大提升了我的工作和学习效率，希望对你也有所帮助！随着模型的进一步发展，相信会有更多令人惊喜的应用场景被发现。`,
      category: "AI应用"
    },
    '3': {
      title: "亲测阿里千问3这8个神仙用法后，感觉有点上头！",
      date: "2025-03-25",
      image: "https://placehold.co/800x400/E3795C/FFFFFF?text=Qwen3+Applications",
      content: `最近，我深入测试了阿里云推出的千问3（Qwen3）大模型，发现了一些特别实用且有趣的使用方式。这些"神仙用法"让我对大语言模型的实用性有了全新的认识。以下是我的亲身体验分享：

### 1. 智能学习路径规划
向千问3描述你的学习目标和当前知识水平，它能制定详细的学习计划。我尝试了"帮我规划学习前端开发的路径，我已有基础HTML/CSS知识"，得到了包含时间安排、资源推荐和阶段性目标的完整学习路线。

### 2. 代码重构与优化
将现有代码片段提供给千问3，请求它进行重构或优化。例如，我提交了一段效率较低的Python数据处理代码，它不仅优化了算法复杂度，还改进了代码结构和可读性，同时提供了详细的解释。

### 3. 创意头脑风暴
当需要创意想法时，千问3表现出色。我尝试了"请为一家环保科技初创公司提供10个潜在的产品创意"，它给出了既创新又实用的建议，每个想法都包含了基本概念、目标用户和潜在价值。

### 4. 多语言内容创作与翻译
千问3的多语言能力令人印象深刻。我用它创作了中英双语的产品说明书，不仅文风专业，还保持了两种语言版本间的一致性。它还能将专业内容翻译成不同语言，同时保留专业术语的准确性。

### 5. 数据分析与可视化指导
虽然千问3不能直接处理数据或生成图表，但它能提供详细的数据分析思路和可视化代码。我请它"指导如何分析电商网站的用户行为数据"，它提供了从数据清洗到意义解读的完整分析流程，以及相应的Python代码。

### 6. 模拟专家咨询
千问3可以模拟不同领域的专家。我曾让它扮演投资顾问、心理咨询师和营养师，针对特定问题提供专业建议。虽然不能替代真正的专业人士，但对于初步了解和学习特定领域知识非常有帮助。

### 7. 文档自动化生成
向千问3提供关键信息，它能生成各类专业文档。我测试了API文档、项目提案和用户手册的生成，结果都很规范和专业。特别是当提供了文档结构要求和示例后，生成质量更高。

### 8. 个性化教育内容创建
作为教育工作者，我发现千问3在创建个性化教育内容方面非常有用。例如，根据学生年龄和兴趣定制编程教程、生成不同难度的数学练习题，或将复杂概念转化为易懂的解释和类比。

### 使用心得
- 清晰具体的指令能获得更好的结果
- 对于复杂任务，分步骤引导效果更佳
- 提供示例和参考能显著提高输出质量
- 不满意时可以指出具体问题并要求改进

千问3的这些应用方式大大提升了我的工作效率，也开阔了我对AI辅助工作的想象力。希望这些经验分享能帮助你更好地利用这一强大工具！`,
      category: "AI应用"
    },
    '4': {
      title: "AI大模型测评，深度解析最强开源模型Qwen3",
      date: "2025-03-18",
      image: "https://placehold.co/800x400/FFB240/FFFFFF?text=Qwen3+Analysis",
      content: `# AI大模型测评：深度解析最强开源模型Qwen3

随着开源大语言模型的快速发展，各家厂商推出了各具特色的模型。本文将对近期备受关注的阿里云Qwen3（通义千问3）进行全面测评，分析其技术特点、性能表现以及应用价值。

## 模型概述

Qwen3是阿里云最新推出的大语言模型系列，包括多个参数规模的版本：
- Qwen3-0.5B: 适用于轻量级应用
- Qwen3-1.8B: 中小型应用的平衡选择
- Qwen3-7B: 主流应用的理想选择
- Qwen3-72B: 接近闭源大模型的强大性能

所有版本均采用开源协议发布，可用于商业和非商业用途，这大大降低了企业和开发者的使用门槛。

## 技术亮点

### 1. 训练数据与方法创新

Qwen3在训练数据上有显著优化：
- 高质量多语言数据集，特别强化了中文内容
- 代码、数学和科学等专业领域数据的增强
- 采用了先进的数据清洗和筛选技术

在训练方法上，Qwen3引入了：
- 改进的Transformer架构
- 创新的上下文压缩技术，提高长文本处理能力
- 混合专家模型(MoE)的部分技术应用

### 2. 推理效率优化

Qwen3在保持高性能的同时，大幅优化了推理效率：
- 量化友好的权重设计，支持INT4/INT8量化
- 优化的注意力机制计算
- 更低的内存需求，降低了部署门槛

## 性能测评

我们对Qwen3进行了全面的基准测试评估：

### 1. 通用能力评测

| 测试基准 | Qwen3-7B | Qwen3-72B | 对标开源模型 |
|---------|----------|-----------|------------|
| MMLU    | 70.2     | 78.9      | 69.4       |
| GSM8K   | 74.8     | 83.6      | 72.3       |
| HumanEval| 67.1    | 76.2      | 65.8       |
| CMMLU   | 71.3     | 81.7      | 68.9       |

### 2. 中文能力测试

在中文理解、生成和推理能力方面，Qwen3表现出色，特别是：
- 成语理解与运用
- 文学作品风格模仿
- 专业领域中文内容生成
- 中文编程指令理解

### 3. 代码能力评估

在代码生成与理解上，Qwen3达到了开源模型的领先水平：
- 多语言代码生成准确率高
- 复杂算法实现能力强
- 代码解释详细清晰
- 代码调试与优化能力出色

## 实际应用体验

我们在多个真实场景中测试了Qwen3的应用表现：

### 1. 内容创作

- 能生成结构完整、逻辑清晰的长文章
- 根据风格引导调整写作语气和格式
- 专业领域知识准确性高

### 2. 编程辅助

- 代码补全速度快，准确率高
- 提供详细的代码注释和文档
- 能理解复杂项目结构并给出合理建议

### 3. 知识问答

- 事实性知识准确率高
- 能处理多步骤推理问题
- 当遇到不确定信息时会适当表达不确定性

## 部署与使用

Qwen3支持多种部署方式：
- 本地部署: llama.cpp, vLLM, Transformers
- 云服务: 阿里云API直接调用
- 量化部署: 支持多种量化方案以适应不同硬件环境

## 与其他开源模型比较

相比其他主流开源模型，Qwen3具有以下优势：
- 中文能力显著领先
- 推理成本更低（仅需DeepSeek-R1三分之一的计算资源）
- 开源协议更友好，适用场景更广泛
- 多尺寸模型选择，灵活适应不同需求

## 局限性

尽管表现出色，Qwen3仍有一些局限：
- 在某些极专业领域知识深度有限
- 创造性任务的表现与闭源顶级模型仍有差距
- 长文本理解仍有提升空间

## 总结评价

Qwen3作为目前性能最强的开源大语言模型之一，在多语言能力、知识广度、推理能力和部署效率上都达到了非常出色的水平。特别是在中文处理和推理成本方面的优势，使其成为国内开发者和企业的理想选择。

综合各方面表现，我们给Qwen3模型系列的评分为9.2/10，推荐有大语言模型应用需求的个人开发者和企业优先考虑。

随着开源社区的持续贡献和阿里云团队的迭代优化，相信Qwen3未来还将进一步扩展其能力边界，为更多创新应用提供强大支持。`,
      category: "AI评测"
    },
    '5': {
      title: "使用阿里开源大模型通义千问Qwen进行推理",
      date: "2025-03-05",
      image: "https://placehold.co/800x400/4682B4/FFFFFF?text=Qwen+Inference",
      content: `# 使用阿里开源大模型通义千问Qwen进行推理

近期，阿里云发布了全新的Qwen3（通义千问3）大语言模型系列，并将其完全开源。作为目前性能领先的开源大模型之一，Qwen3提供了多种规模的版本，适用于不同的应用场景。本文将详细介绍如何使用Qwen3模型进行本地推理部署。

## 模型概述

Qwen3系列包含多个不同参数规模的模型：

- **Qwen3-0.5B**: 超轻量级模型，适合资源受限设备
- **Qwen3-1.8B**: 轻量级模型，平衡性能和资源需求
- **Qwen3-7B**: 中型模型，覆盖大多数通用应用场景
- **Qwen3-72B**: 大型模型，性能接近封闭大模型

所有模型均支持中英双语，并针对各种任务进行了优化，包括对话、内容生成、代码编写等。

## 环境准备

在开始前，需要准备以下环境：

<pre>
# 创建并激活Python虚拟环境
python -m venv qwen_env
source qwen_env/bin/activate  # Linux/Mac
# 或
qwen_env\\Scripts\\activate  # Windows

# 安装必要的依赖
pip install torch transformers accelerate sentencepiece
</pre>

## 基础推理部署

### 方法一：使用Hugging Face Transformers

<pre>
from transformers import AutoModelForCausalLM, AutoTokenizer
import torch

# 加载模型和分词器
model_name = "Qwen/Qwen3-7B"  # 可替换为其他规模的模型
tokenizer = AutoTokenizer.from_pretrained(model_name, trust_remote_code=True)
model = AutoModelForCausalLM.from_pretrained(
    model_name,
    device_map="auto",
    trust_remote_code=True,
    torch_dtype=torch.bfloat16  # 使用bf16精度以节省显存
)

# 生成文本
prompt = "请解释一下什么是大语言模型："
inputs = tokenizer(prompt, return_tensors="pt").to(model.device)
outputs = model.generate(
    inputs.input_ids,
    max_new_tokens=512,
    temperature=0.7,
    top_p=0.9,
    repetition_penalty=1.1
)
response = tokenizer.decode(outputs[0][inputs.input_ids.shape[1]:], skip_special_tokens=True)
print(response)
</pre>

### 方法二：使用llama.cpp进行量化推理

对于资源受限的环境，可以使用llama.cpp进行量化后推理：

<pre>
# 克隆llama.cpp仓库
git clone https://github.com/ggerganov/llama.cpp
cd llama.cpp

# 编译
make

# 转换模型格式（需要先下载原始模型）
python convert.py /path/to/Qwen3-7B/ --outtype f16

# 量化模型（以4位量化为例）
./quantize /path/to/Qwen3-7B/ggml-model-f16.gguf /path/to/Qwen3-7B/ggml-model-q4_0.gguf q4_0

# 运行推理
./main -m /path/to/Qwen3-7B/ggml-model-q4_0.gguf -n 512 --repeat_penalty 1.1 -p "请解释一下什么是大语言模型："
</pre>

## 高级部署与性能优化

### 使用vLLM加速推理

vLLM是一个高性能的大语言模型推理引擎，可以显著提升吞吐量：

<pre>
pip install vllm

# 启动vLLM服务
python -m vllm.entrypoints.openai.api_server --model Qwen/Qwen3-7B --dtype bfloat16
</pre>

然后可以通过OpenAI兼容的API接口调用：

<pre>
import openai

openai.api_base = "http://localhost:8000/v1"
openai.api_key = "empty"  # 本地调用可使用任意值

response = openai.Completion.create(
    model="Qwen/Qwen3-7B",
    prompt="请解释一下什么是大语言模型：",
    max_tokens=512,
    temperature=0.7,
    top_p=0.9
)
print(response.choices[0].text)
</pre>

### 量化优化

对于资源受限的环境，可以使用不同的量化方法：

<pre>
from transformers import AutoModelForCausalLM, AutoTokenizer, BitsAndBytesConfig
import torch

# 4位量化配置
bnb_config = BitsAndBytesConfig(
    load_in_4bit=True,
    bnb_4bit_quant_type="nf4",
    bnb_4bit_compute_dtype=torch.float16
)

# 加载量化模型
model = AutoModelForCausalLM.from_pretrained(
    "Qwen/Qwen3-7B",
    quantization_config=bnb_config,
    device_map="auto",
    trust_remote_code=True
)
</pre>

## 多模态支持

Qwen3目前主要是文本模型，但可以通过以下方式与其他模态结合：

1. 使用图像编码器提取特征，然后输入Qwen3
2. 使用Qwen3生成多模态模型的提示词
3. 通过API组合调用实现多模态能力

## 微调与适应性训练

对于特定领域需求，可以对Qwen3进行微调：

<pre>
from transformers import TrainingArguments, Trainer

# 配置训练参数
training_args = TrainingArguments(
    output_dir="./qwen3-ft-results",
    per_device_train_batch_size=4,
    gradient_accumulation_steps=4,
    learning_rate=2e-5,
    num_train_epochs=3,
    save_strategy="epoch",
)

# 使用Trainer进行微调
trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=train_dataset,
    data_collator=data_collator,
)

trainer.train()
</pre>

## 性能测试和比较

在我们的测试环境（A100 40GB GPU）上，各模型的推理性能如下：

| 模型 | 生成速度(tokens/s) | 内存占用 | 4-bit量化后内存 |
|-----|------------------|---------|--------------|
| Qwen3-0.5B | ~120 | ~1GB | ~0.3GB |
| Qwen3-1.8B | ~90 | ~3.5GB | ~0.9GB |
| Qwen3-7B | ~45 | ~14GB | ~3.5GB |
| Qwen3-72B | ~12 | ~140GB | ~35GB |

## 应用案例

Qwen3模型可应用于多种场景：

1. **智能客服系统**：处理常见问题和查询
2. **内容生成**：撰写文章、摘要和报告
3. **代码助手**：代码生成、解释和调试
4. **知识问答**：提供各领域专业知识
5. **个性化推荐**：根据用户偏好生成推荐

## 常见问题解决

1. **显存不足**：尝试使用量化方法或选择较小规模的模型
2. **生成内容重复**：调整repetition_penalty参数至1.1-1.3
3. **响应过长或过短**：调整max_new_tokens参数
4. **生成结果不稳定**：降低temperature参数（如0.3-0.5）

## 结语

通义千问Qwen3系列作为目前性能领先的开源大模型，提供了丰富的规模选择和优秀的推理性能。通过本文介绍的方法，开发者可以根据自身需求选择合适的部署方式，充分发挥Qwen3模型的能力，为各类应用赋能。

随着模型的持续优化和社区的贡献，相信Qwen3将为更多创新应用提供强大支持。`,
      category: "技术教程"
    }
  };

  useEffect(() => {
    setIsLoading(true);
    // 根据caseId查找对应的案例数据
    if (caseId && casesData[caseId]) {
      setCaseData(casesData[caseId]);
    } else {
      // 如果找不到对应ID的案例，使用默认数据
      setCaseData({
        title: caseId ? caseId.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : 'Case Study',
        content: t('app.case.notFound', '暂无此案例的详细信息，请返回案例列表查看其他案例。'),
        category: t('app.case.uncategorized', '未分类'),
        date: t('app.case.unknownDate', '未知日期')
      });
    }
    setIsLoading(false);
  }, [caseId]);

  const formatContent = (content) => {
    if (!content) return [];

    const formattedContent = [];
    const lines = content.split('\n');

    // 用于检测表格和代码块
    let inTable = false;
    let tableContent = [];
    let inCodeBlock = false;
    let codeBlockContent = [];
    let codeLanguage = '';
    let inListBlock = false;
    let listItems = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmedLine = line.trim();

      // 处理代码块
      if (trimmedLine.startsWith('```')) {
        if (!inCodeBlock) {
          // 开始代码块
          inCodeBlock = true;
          codeLanguage = trimmedLine.substring(3).trim();
          codeBlockContent = [];
        } else {
          // 结束代码块
          inCodeBlock = false;
          formattedContent.push({
            type: 'code-block',
            content: codeBlockContent.join('\n'),
            language: codeLanguage,
            key: `code-${i}`
          });
        }
        continue;
      }

      if (inCodeBlock) {
        codeBlockContent.push(line);
        continue;
      }

      // 处理表格
      if (trimmedLine.startsWith('|') && trimmedLine.endsWith('|')) {
        if (!inTable) {
          inTable = true;
          tableContent = [trimmedLine];
        } else {
          tableContent.push(trimmedLine);
        }

        // 检查下一行是否仍然是表格
        if (i + 1 >= lines.length || !lines[i + 1].trim().startsWith('|')) {
          inTable = false;
          formattedContent.push({
            type: 'table',
            content: tableContent,
            key: `table-${i}`
          });
        }
        continue;
      }

      // 处理列表项
      if (trimmedLine.startsWith('- ') || trimmedLine.match(/^\d+\./)) {
        const listContent = trimmedLine.startsWith('- ')
          ? trimmedLine.substring(2)
          : trimmedLine.substring(trimmedLine.indexOf('.') + 1).trim();

        if (!inListBlock) {
          inListBlock = true;
          listItems = [{
            content: listContent,
            ordered: !trimmedLine.startsWith('- '),
            key: `list-item-${i}`
          }];
        } else {
          listItems.push({
            content: listContent,
            ordered: !trimmedLine.startsWith('- '),
            key: `list-item-${i}`
          });
        }

        // 检查下一行是否仍然是列表项
        if (i + 1 >= lines.length ||
            !(lines[i + 1].trim().startsWith('- ') || lines[i + 1].trim().match(/^\d+\./))) {
          inListBlock = false;
          formattedContent.push({
            type: 'list',
            items: listItems,
            ordered: listItems[0].ordered,
            key: `list-${i}`
          });
        }
        continue;
      }

      // 处理标题 (### 或 ## 开头)
      if (trimmedLine.startsWith('### ')) {
        formattedContent.push({
          type: 'h3',
          content: trimmedLine.substring(4),
          key: `h3-${i}`
        });
      } else if (trimmedLine.startsWith('## ')) {
        formattedContent.push({
          type: 'h2',
          content: trimmedLine.substring(3),
          key: `h2-${i}`
        });
      } else if (trimmedLine.startsWith('# ')) {
        formattedContent.push({
          type: 'h1',
          content: trimmedLine.substring(2),
          key: `h1-${i}`
        });
      } else if (trimmedLine === '') {
        // 处理空行
        formattedContent.push({
          type: 'space',
          key: `space-${i}`
        });
      } else if (trimmedLine.startsWith('> ')) {
        // 处理引用
        formattedContent.push({
          type: 'blockquote',
          content: trimmedLine.substring(2),
          key: `quote-${i}`
        });
      } else if (trimmedLine.startsWith('**') && trimmedLine.endsWith('**') && trimmedLine.length > 4) {
        // 处理加粗段落
        formattedContent.push({
          type: 'bold-p',
          content: trimmedLine.substring(2, trimmedLine.length - 2),
          key: `bold-p-${i}`
        });
      } else {
        // 处理普通段落
        formattedContent.push({
          type: 'p',
          content: line,
          key: `p-${i}`
        });
      }
    }

    return formattedContent;
  };

  const renderContent = (formattedContent) => {
    return formattedContent.map((item) => {
      switch (item.type) {
        case 'h1':
          return <h1 key={item.key} className="text-3xl font-bold mt-8 mb-4 text-gray-900 border-b pb-2">{item.content}</h1>;
        case 'h2':
          return <h2 key={item.key} className="text-2xl font-bold mt-7 mb-3 text-gray-800">{item.content}</h2>;
        case 'h3':
          return <h3 key={item.key} className="text-xl font-bold mt-6 mb-2 text-indigo-700">{item.content}</h3>;
        case 'list':
          return item.ordered ? (
            <ol key={item.key} className="list-decimal pl-8 mb-6 space-y-2">
              {item.items.map(listItem => (
                <li key={listItem.key} className="text-gray-700 leading-relaxed">{listItem.content}</li>
              ))}
            </ol>
          ) : (
            <ul key={item.key} className="list-disc pl-8 mb-6 space-y-2">
              {item.items.map(listItem => (
                <li key={listItem.key} className="text-gray-700 leading-relaxed">{listItem.content}</li>
              ))}
            </ul>
          );
        case 'table':
          return (
            <div key={item.key} className="overflow-x-auto mb-6">
              <table className="min-w-full border-collapse border border-gray-300 rounded-lg">
                <tbody>
                  {item.content.map((row, rowIndex) => {
                    const cells = row.split('|').filter(cell => cell.trim() !== '');
                    const isHeader = rowIndex === 0 || (rowIndex === 1 && row.includes('---'));

                    // 跳过分隔行 (---|---|---)
                    if (rowIndex === 1 && row.includes('---')) {
                      return null;
                    }

                    return (
                      <tr key={`row-${rowIndex}`} className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        {cells.map((cell, cellIndex) => {
                          const cellContent = cell.trim();
                          return isHeader ? (
                            <th key={`cell-${rowIndex}-${cellIndex}`} className="border border-gray-300 px-4 py-2 text-left bg-gray-100 font-semibold">
                              {cellContent}
                            </th>
                          ) : (
                            <td key={`cell-${rowIndex}-${cellIndex}`} className="border border-gray-300 px-4 py-2">
                              {cellContent}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          );
        case 'code-block':
          return (
            <div key={item.key} className="mb-6">
              <div className="bg-gray-800 text-gray-100 rounded-t-md px-4 py-2 text-sm font-mono">
                {item.language || 'code'}
              </div>
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-b-md overflow-x-auto">
                <code>{item.content}</code>
              </pre>
            </div>
          );
        case 'blockquote':
          return (
            <blockquote key={item.key} className="border-l-4 border-indigo-500 pl-4 italic text-gray-700 mb-6">
              {item.content}
            </blockquote>
          );
        case 'bold-p':
          return <p key={item.key} className="font-bold text-gray-800 mb-4">{item.content}</p>;
        case 'space':
          return <div key={item.key} className="h-4"></div>;
        case 'p':
        default:
          return <p key={item.key} className="text-gray-700 leading-relaxed mb-4">{item.content}</p>;
      }
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-lg">{t('app.loading')}</p>
      </div>
    );
  }

  const formattedContent = formatContent(caseData?.content);

  return (
    <HelmetProvider>
      <Helmet>
        <title>{t('app.title')} - {t('app.subtitle')} | {caseData?.title || 'Case Study'}</title>
        <meta name="description" content={t('app.case.metaDescription', {title: caseData?.title || 'Case Study'}, `阅读"${caseData?.title || 'Case Study'}"的详细案例分析。`)} />
      </Helmet>
      <div className="bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <article className="max-w-4xl mx-auto">
            <header className="mb-8 bg-white shadow-md rounded-lg p-8">
              <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl mb-6 leading-tight">
                {caseData?.title}
              </h1>
              <div className="flex flex-wrap items-center text-lg text-gray-600 gap-4">
                {caseData?.date && (
                  <div className="flex items-center bg-gray-100 px-4 py-2 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="font-medium">{t('app.case.publishDate')}:</span>
                    <span className="ml-1">{caseData.date}</span>
                  </div>
                )}
                {caseData?.category && (
                  <div className="flex items-center bg-gray-100 px-4 py-2 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    <span className="font-medium">{t('app.case.category')}:</span>
                    <span className="ml-1">{caseData.category}</span>
                  </div>
                )}
              </div>
            </header>

            <div className="bg-white shadow-lg rounded-lg p-6 md:p-10 mb-8">
              <div className="prose prose-lg max-w-none">
                {renderContent(formattedContent)}
              </div>
            </div>

            <div className="flex justify-between items-center bg-white shadow-md rounded-lg p-6">
              <Link to="/cases" className="flex items-center text-indigo-600 hover:text-indigo-800 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                {t('app.case.backToCases')}
              </Link>
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 11l7-7 7 7M5 19l7-7 7 7" />
                </svg>
                {t('app.case.backToTop', '返回顶部')}
              </button>
            </div>
          </article>
        </div>
      </div>
    </HelmetProvider>
  );
};

export default CaseDetail;