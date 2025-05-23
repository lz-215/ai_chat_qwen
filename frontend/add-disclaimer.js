/**
 * 免责声明添加工具
 * 用于在public/downloaded_articles目录下的HTML文件底部添加多语言免责声明
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// 获取当前文件的目录
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 目标目录
const targetDir = path.join(__dirname, 'public', 'downloaded_articles');
console.log(`目标目录: ${targetDir}`);

// 确保目标目录存在
if (!fs.existsSync(targetDir)) {
  console.error(`目录不存在: ${targetDir}`);
  process.exit(1);
}

// 多语言免责声明文本
const disclaimers = {
  // 英语
  en: `
<div class="disclaimer" style="margin-top: 30px; padding: 15px; border-top: 1px solid #eee; color: #666; font-size: 12px;">
  <p><strong>Disclaimer:</strong> This article is sourced from the internet and does not represent the position of this site. If the reposted content involves copyright issues, please contact us at ytsgabcde21@2925.com, and we will delete the relevant article to protect your rights.</p>
</div>
`,
  // 西班牙语
  es: `
<div class="disclaimer" style="margin-top: 30px; padding: 15px; border-top: 1px solid #eee; color: #666; font-size: 12px;">
  <p><strong>Aviso legal:</strong> Este artículo proviene de Internet y no representa la posición de este sitio. Si el contenido republicado involucra problemas de derechos de autor, contáctenos en ytsgabcde21@2925.com, y eliminaremos el artículo relevante para proteger sus derechos.</p>
</div>
`,
  // 法语
  fr: `
<div class="disclaimer" style="margin-top: 30px; padding: 15px; border-top: 1px solid #eee; color: #666; font-size: 12px;">
  <p><strong>Avis de non-responsabilité:</strong> Cet article provient d'Internet et ne représente pas la position de ce site. Si le contenu republié implique des problèmes de droits d'auteur, veuillez nous contacter à ytsgabcde21@2925.com, et nous supprimerons l'article concerné pour protéger vos droits.</p>
</div>
`,
  // 德语
  de: `
<div class="disclaimer" style="margin-top: 30px; padding: 15px; border-top: 1px solid #eee; color: #666; font-size: 12px;">
  <p><strong>Haftungsausschluss:</strong> Dieser Artikel stammt aus dem Internet und repräsentiert nicht die Position dieser Website. Wenn der wiederveröffentlichte Inhalt Urheberrechtsprobleme beinhaltet, kontaktieren Sie uns bitte unter ytsgabcde21@2925.com, und wir werden den betreffenden Artikel löschen, um Ihre Rechte zu schützen.</p>
</div>
`
};

// 获取目录下的所有 HTML 文件
const htmlFiles = fs.readdirSync(targetDir)
  .filter(file => file.endsWith('.html'));

console.log(`找到 ${htmlFiles.length} 个 HTML 文件需要处理`);

/**
 * 从HTML内容中提取语言
 * @param {string} htmlContent HTML内容
 * @returns {string} 语言代码
 */
function extractLanguage(htmlContent) {
  // 尝试从html标签的lang属性中提取语言
  const langMatch = htmlContent.match(/<html[^>]*lang=["']([^"']+)["'][^>]*>/i);
  if (langMatch && langMatch[1]) {
    // 提取主要语言代码（例如从zh-CN中提取zh）
    const langCode = langMatch[1].split('-')[0].toLowerCase();
    return langCode;
  }

  // 如果没有找到lang属性，默认返回英语
  return 'en';
}

/**
 * 检查HTML内容是否已包含免责声明
 * @param {string} htmlContent HTML内容
 * @returns {boolean} 是否已包含免责声明
 */
function hasDisclaimer(htmlContent) {
  // 检查是否包含免责声明的div
  return htmlContent.includes('<div class="disclaimer"') ||
         htmlContent.includes('免责声明') ||
         htmlContent.includes('Disclaimer') ||
         htmlContent.includes('Aviso legal') ||
         htmlContent.includes('Avis de non-responsabilité') ||
         htmlContent.includes('Haftungsausschluss');
}

/**
 * 向HTML内容添加免责声明
 * @param {string} htmlContent HTML内容
 * @param {string} language 语言代码
 * @returns {string} 添加了免责声明的HTML内容
 */
function addDisclaimer(htmlContent, language) {
  // 如果已经有免责声明，则不添加
  if (hasDisclaimer(htmlContent)) {
    return htmlContent;
  }

  // 获取对应语言的免责声明，如果没有则使用英语
  const disclaimer = disclaimers[language] || disclaimers.en;

  // 在</body>标签前添加免责声明
  if (htmlContent.includes('</body>')) {
    return htmlContent.replace('</body>', `${disclaimer}</body>`);
  }

  // 如果没有</body>标签，则在文件末尾添加
  return htmlContent + disclaimer;
}

// 处理每个HTML文件
function processHtmlFiles() {
  let successCount = 0;
  let skipCount = 0;
  let errorCount = 0;

  for (const file of htmlFiles) {
    const filePath = path.join(targetDir, file);
    console.log(`正在处理: ${file}`);

    try {
      // 读取文件内容
      const content = fs.readFileSync(filePath, 'utf8');

      // 检查是否已有免责声明
      if (hasDisclaimer(content)) {
        console.log(`✓ 已有免责声明，跳过: ${file}`);
        skipCount++;
        continue;
      }

      // 提取语言
      const language = extractLanguage(content);
      console.log(`  检测到语言: ${language}`);

      // 添加免责声明
      const updatedContent = addDisclaimer(content, language);

      // 写入更新后的内容
      fs.writeFileSync(filePath, updatedContent, 'utf8');
      console.log(`✅ 已添加免责声明: ${file}`);
      successCount++;
    } catch (error) {
      console.error(`❌ 处理 ${file} 时出错:`, error.message);
      errorCount++;
    }
  }

  console.log('\n处理完成!');
  console.log(`总计: ${htmlFiles.length} 个文件`);
  console.log(`成功: ${successCount} 个文件`);
  console.log(`跳过: ${skipCount} 个文件 (已有免责声明)`);
  console.log(`失败: ${errorCount} 个文件`);
}

// 运行处理
processHtmlFiles();
