const fs = require('fs');
const path = require('path');

// 源目录和目标目录
const sourceDir = path.join(__dirname, 'downloaded_articles');
const targetDir = path.join(__dirname, 'frontend', 'public', 'downloaded_articles');

// 确保目标目录存在
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
  console.log(`创建目录: ${targetDir}`);
}

// 读取源目录中的所有文件
fs.readdir(sourceDir, (err, files) => {
  if (err) {
    console.error('读取源目录失败:', err);
    return;
  }

  // 复制每个文件
  files.forEach(file => {
    const sourcePath = path.join(sourceDir, file);
    const targetPath = path.join(targetDir, file);

    // 检查是否是文件
    fs.stat(sourcePath, (err, stats) => {
      if (err) {
        console.error(`获取文件状态失败: ${file}`, err);
        return;
      }

      if (stats.isFile()) {
        // 复制文件
        fs.copyFile(sourcePath, targetPath, err => {
          if (err) {
            console.error(`复制文件失败: ${file}`, err);
            return;
          }
          console.log(`成功复制: ${file}`);
        });
      }
    });
  });
});

console.log('文件复制脚本执行完成。请检查目标目录中的文件。');
