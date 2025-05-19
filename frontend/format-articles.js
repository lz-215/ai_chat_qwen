/**
 * HTML 文件格式化工具
 * 用于规范化 public/downloaded_articles 目录下的 HTML 文件的缩进和格式
 */

const fs = require('fs');
const path = require('path');

// 目标目录
const targetDir = path.join(__dirname, 'public', 'downloaded_articles');
console.log(`目标目录: ${targetDir}`);

// 确保目标目录存在
if (!fs.existsSync(targetDir)) {
  console.error(`目录不存在: ${targetDir}`);
  process.exit(1);
}

// 获取目录下的所有 HTML 文件
const htmlFiles = fs.readdirSync(targetDir)
  .filter(file => file.endsWith('.html'));

console.log(`找到 ${htmlFiles.length} 个 HTML 文件需要格式化`);

/**
 * 简单的 HTML 格式化函数
 * @param {string} html 原始 HTML 字符串
 * @returns {string} 格式化后的 HTML 字符串
 */
function formatHtml(html) {
  // 移除多余的空白行和行首尾空格
  html = html.replace(/^\s+|\s+$/gm, '');
  
  // 标准化换行符
  html = html.replace(/\r\n/g, '\n');
  
  // 移除连续的空行，最多保留一个空行
  html = html.replace(/\n\s*\n\s*\n/g, '\n\n');
  
  // 处理标签缩进
  let formatted = '';
  let indent = 0;
  const lines = html.split('\n');
  
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i].trim();
    
    // 跳过空行
    if (line === '') {
      formatted += '\n';
      continue;
    }
    
    // 检查是否是闭合标签
    const isClosingTag = line.match(/^<\/[^>]+>/);
    
    // 检查是否是自闭合标签
    const isSelfClosingTag = line.match(/<[^>]+\/>/);
    
    // 检查是否是开始标签
    const isOpeningTag = line.match(/^<[^\/][^>]*>(?!.*<\/)/);
    
    // 如果是闭合标签，减少缩进
    if (isClosingTag) {
      indent = Math.max(0, indent - 2);
    }
    
    // 添加当前缩进
    formatted += ' '.repeat(indent) + line + '\n';
    
    // 如果是开始标签且不是自闭合标签，增加缩进
    if (isOpeningTag && !isSelfClosingTag) {
      indent += 2;
    }
  }
  
  return formatted;
}

// 格式化每个 HTML 文件
function formatHtmlFiles() {
  for (const file of htmlFiles) {
    const filePath = path.join(targetDir, file);
    console.log(`正在处理: ${file}`);
    
    try {
      // 读取文件内容
      const content = fs.readFileSync(filePath, 'utf8');
      
      // 格式化 HTML
      const formattedContent = formatHtml(content);
      
      // 写入格式化后的内容
      fs.writeFileSync(filePath, formattedContent, 'utf8');
      console.log(`✅ 已格式化: ${file}`);
    } catch (error) {
      console.error(`❌ 处理 ${file} 时出错:`, error.message);
    }
  }
}

// 运行格式化
formatHtmlFiles();
console.log('所有 HTML 文件格式化完成！');
