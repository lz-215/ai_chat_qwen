#!/usr/bin/env python
# -*- coding: utf-8 -*-

import os
import re
import json
from datetime import datetime

# 定义文件路径
CASES_FILE = os.path.join("frontend", "src", "components", "Cases.jsx")
NEWS_FILE = os.path.join("frontend", "src", "components", "News.jsx")
OUTPUT_FILE = "外链内容.md"

def extract_links_from_cases():
    """从Cases.jsx文件中提取外链及其标题和描述"""
    print("正在从Cases.jsx中提取数据...")
    links = []
    
    try:
        with open(CASES_FILE, 'r', encoding='utf-8') as file:
            content = file.read()
            
            # 提取defaultCaseStudies数组内容
            case_studies_match = re.search(r'const defaultCaseStudies = \[(.*?)\];', content, re.DOTALL)
            if case_studies_match:
                case_studies_text = case_studies_match.group(1)
                
                # 在文本末尾添加逗号以匹配最后一个对象
                if not case_studies_text.rstrip().endswith(','):
                    case_studies_text += ','
                
                # 使用正则表达式匹配每个对象
                objects = []
                start_positions = [m.start() for m in re.finditer(r'\{\s*title:', case_studies_text)]
                
                for i in range(len(start_positions)):
                    start = start_positions[i]
                    # 如果是最后一个，则使用字符串结尾作为结束位置
                    if i == len(start_positions) - 1:
                        end = len(case_studies_text)
                    else:
                        end = start_positions[i + 1]
                    
                    objects.append(case_studies_text[start:end])
                
                for obj_text in objects:
                    # 提取标题
                    title_match = re.search(r'title:\s*"([^"]*)"', obj_text)
                    # 提取描述
                    desc_match = re.search(r'description:\s*"([^"]*)"', obj_text)
                    # 提取链接
                    url_match = re.search(r'externalUrl:\s*"([^"]*)"', obj_text)
                    
                    if title_match and desc_match and url_match:
                        links.append({
                            'source': 'Cases',
                            'title': title_match.group(1),
                            'description': desc_match.group(1),
                            'url': url_match.group(1)
                        })
                
                print(f"从Cases.jsx中找到{len(links)}个外链")
        
        return links
    except Exception as e:
        print(f"处理Cases.jsx时出错: {e}")
        return []

def extract_links_from_news():
    """从News.jsx文件中提取外链及其标题和描述"""
    print("正在从News.jsx中提取数据...")
    links = []
    
    try:
        with open(NEWS_FILE, 'r', encoding='utf-8') as file:
            content = file.read()
            
            # 提取defaultNewsData数组内容
            news_data_match = re.search(r'const defaultNewsData = \[(.*?)\];', content, re.DOTALL)
            if news_data_match:
                news_data_text = news_data_match.group(1)
                
                # 使用相同的方法匹配对象
                objects = []
                start_positions = [m.start() for m in re.finditer(r'\{\s*id:', news_data_text)]
                
                for i in range(len(start_positions)):
                    start = start_positions[i]
                    # 如果是最后一个，则使用字符串结尾作为结束位置
                    if i == len(start_positions) - 1:
                        end = len(news_data_text)
                    else:
                        end = start_positions[i + 1]
                    
                    objects.append(news_data_text[start:end])
                
                for obj_text in objects:
                    # 提取标题 - 处理单引号和双引号情况
                    title_match = re.search(r'title:\s*[\'"]([^\'"]*)[\'"]', obj_text)
                    # 提取描述
                    desc_match = re.search(r'description:\s*[\'"]([^\'"]*)[\'"]', obj_text)
                    # 提取链接
                    url_match = re.search(r'externalUrl:\s*[\'"]([^\'"]*)[\'"]', obj_text)
                    
                    if title_match and desc_match and url_match:
                        links.append({
                            'source': 'News',
                            'title': title_match.group(1),
                            'description': desc_match.group(1),
                            'url': url_match.group(1)
                        })
                
                print(f"从News.jsx中找到{len(links)}个外链")
        
        return links
    except Exception as e:
        print(f"处理News.jsx时出错: {e}")
        return []

def save_to_markdown(links):
    """将提取的链接保存到Markdown文件"""
    if not links:
        print("没有提取到任何链接")
        return
    
    print(f"正在将{len(links)}个链接保存到文件: {OUTPUT_FILE}")
    
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as file:
        file.write("# 外链内容汇总\n\n")
        file.write(f"生成时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n\n")
        
        # 按来源分类
        file.write("## Cases中的外链\n\n")
        cases_links = [link for link in links if link['source'] == 'Cases']
        for i, link in enumerate(cases_links, 1):
            file.write(f"### {i}. {link['title']}\n\n")
            file.write(f"**描述**: {link['description']}\n\n")
            file.write(f"**链接**: [{link['url']}]({link['url']})\n\n")
        
        file.write("## News中的外链\n\n")
        news_links = [link for link in links if link['source'] == 'News']
        for i, link in enumerate(news_links, 1):
            file.write(f"### {i}. {link['title']}\n\n")
            file.write(f"**描述**: {link['description']}\n\n")
            file.write(f"**链接**: [{link['url']}]({link['url']})\n\n")
    
    print(f"数据已保存到 {OUTPUT_FILE}")

def main():
    """主函数"""
    print("开始提取外链内容...")
    
    # 检查文件是否存在
    if not os.path.exists(CASES_FILE):
        print(f"错误: 文件不存在 - {CASES_FILE}")
        return
    
    if not os.path.exists(NEWS_FILE):
        print(f"错误: 文件不存在 - {NEWS_FILE}")
        return
    
    print(f"Cases文件路径: {os.path.abspath(CASES_FILE)}")
    print(f"News文件路径: {os.path.abspath(NEWS_FILE)}")
    
    # 提取链接
    cases_links = extract_links_from_cases()
    news_links = extract_links_from_news()
    
    # 合并链接
    all_links = cases_links + news_links
    print(f"总共提取到{len(all_links)}个外链")
    
    # 保存到文件
    save_to_markdown(all_links)
    
    print("处理完成!")

if __name__ == "__main__":
    main() 