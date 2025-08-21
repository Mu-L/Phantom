/**
 * API测试器 - 负责API接口的批量测试功能
 */
class ApiTester {
    constructor(srcMiner) {
        this.srcMiner = srcMiner;
    }
    
    /**
     * 获取Cookie设置
     */
    async getCookieSetting() {
        try {
            if (this.srcMiner.settingsManager) {
                return await this.srcMiner.settingsManager.getCookieSetting();
            }
            return '';
        } catch (error) {
            console.error('获取Cookie设置失败:', error);
            return '';
        }
    }
    
    // 批量请求测试
    async batchRequestTest() {
        const method = document.getElementById('requestMethod').value;
        const selectedCategory = document.getElementById('categorySelect').value;
        
        // 获取并发数和超时时间配置
        const concurrencyInput = document.getElementById('apiConcurrency');
        const timeoutInput = document.getElementById('apiTimeout');
        
        const concurrency = concurrencyInput ? parseInt(concurrencyInput.value) : 8;
        const timeout = timeoutInput ? parseInt(timeoutInput.value) * 1000 : 5000; // 转换为毫秒
        
        console.log(`🔧 API测试配置: 并发数=${concurrency}, 超时=${timeout/1000}秒`);
        
        if (!selectedCategory) {
            alert('请先选择要测试的分类');
            return;
        }
        
        const items = this.srcMiner.results[selectedCategory] || [];
        
        if (items.length === 0) {
            alert(`选中的分类"${this.getCategoryTitle(selectedCategory)}"中没有数据，请先扫描页面`);
            return;
        }
        
        if (this.isTestableCategory(selectedCategory)) {
            await this.testSelectedCategory(selectedCategory, items, method, concurrency, timeout);
        } else {
            alert(`分类"${this.getCategoryTitle(selectedCategory)}"不支持请求测试`);
        }
    }
    
    // 获取分类标题
    getCategoryTitle(categoryKey) {
        const categoryTitles = {
            'absoluteApis': '绝对路径API',
            'relativeApis': '相对路径API',
            'jsFiles': 'JS文件',
            'cssFiles': 'CSS文件',
            'images': '图片文件',
            'urls': '完整URL',
            'domains': '域名',
            'paths': '路径'
        };
        return categoryTitles[categoryKey] || categoryKey;
    }
    
    // 检查分类是否可以进行请求测试
    isTestableCategory(categoryKey) {
        const testableCategories = [
            'absoluteApis', 'relativeApis', 'jsFiles', 'cssFiles', 
            'images', 'urls', 'paths'
        ];
        return testableCategories.includes(categoryKey);
    }
    
    // 测试选中的分类
    async testSelectedCategory(categoryKey, items, method, concurrency = 8, timeout = 5000) {
        try {
            // 获取Cookie设置
            const cookieSetting = await this.getCookieSetting();
            
            // 使用新的TestWindow类创建测试窗口
            const testWindow = new TestWindow();
            await testWindow.createTestWindow(categoryKey, items, method, concurrency, timeout, cookieSetting);
            
            // 显示成功提示
            const modal = document.getElementById('requestResultModal');
            const resultsDiv = document.getElementById('requestResults');
            
            modal.style.display = 'block';
            resultsDiv.innerHTML = `
                <div style="text-align: center; color: #00d4aa; margin-bottom: 20px;">
                    <h3>✅ 测试窗口已打开</h3>
                    <p>已在新窗口中启动 ${this.getCategoryTitle(categoryKey)} 的批量测试</p>
                    <p>测试项目数: ${items.length} | 方法: ${method}</p>
                    <p>并发数: ${concurrency} | 超时: ${timeout/1000}秒</p>
                    <br>
                    <button onclick="document.getElementById('requestResultModal').style.display='none'" 
                            style="padding: 10px 20px; background: #00d4aa; color: white; border: none; border-radius: 5px; cursor: pointer;">
                        关闭此提示
                    </button>
                </div>
            `;
            
            // 3秒后自动关闭提示
            setTimeout(() => {
                modal.style.display = 'none';
            }, 3000);
            
        } catch (error) {
            console.error('创建测试窗口失败:', error);
            alert('创建测试窗口失败: ' + error.message);
        }
        
        return; // 直接返回，不再执行原来的测试逻辑
        
        const results = [];
        let successCount = 0;
        let failCount = 0;
        
        // 真正的并发处理 - 每个请求完成后立即显示结果
        let completedCount = 0;
        let activeRequests = 0;
        let currentIndex = 0;
        
        const processNextBatch = () => {
            // 启动新的请求直到达到并发限制或没有更多项目
            while (activeRequests < concurrency && currentIndex < items.length) {
                const item = items[currentIndex];
                const itemIndex = currentIndex;
                currentIndex++;
                activeRequests++;
                
                // 异步处理单个请求
                this.processSingleRequest(item, categoryKey, baseUrl, method, timeout, itemIndex)
                    .then(result => {
                        // 请求完成，更新计数器
                        activeRequests--;
                        completedCount++;
                        
                        if (result.success) {
                            successCount++;
                        } else {
                            failCount++;
                        }
                        
                        results.push(result);
                        
                        // 立即更新显示
                        resultsDiv.innerHTML = `
                            <div style="text-align: center; color: #00d4aa; margin-bottom: 10px;">
                                测试进度: ${completedCount}/${items.length} | 成功: ${successCount} | 失败: ${failCount}
                                <br>当前并发: ${activeRequests}/${concurrency}
                            </div>
                            ${this.renderRequestResults(results)}
                        `;
                        
                        // 如果还有未处理的项目，启动下一个请求
                        if (currentIndex < items.length) {
                            processNextBatch();
                        }
                    })
                    .catch(error => {
                        console.error('请求处理失败:', error);
                        activeRequests--;
                        completedCount++;
                        failCount++;
                        
                        results.push({
                            url: item,
                            fullUrl: item,
                            status: 'Error',
                            statusText: error.message || '请求失败',
                            size: 'N/A',
                            time: 'N/A',
                            success: false
                        });
                        
                        // 更新显示
                        resultsDiv.innerHTML = `
                            <div style="text-align: center; color: #00d4aa; margin-bottom: 10px;">
                                测试进度: ${completedCount}/${items.length} | 成功: ${successCount} | 失败: ${failCount}
                                <br>当前并发: ${activeRequests}/${concurrency}
                            </div>
                            ${this.renderRequestResults(results)}
                        `;
                        
                        // 继续处理下一个
                        if (currentIndex < items.length) {
                            processNextBatch();
                        }
                    });
            }
        };
        
        // 开始处理
        processNextBatch();
        
        // 等待所有请求完成
        while (completedCount < items.length) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        const modalTitle = modal.querySelector('h3');
        modalTitle.textContent = '批量测试结果';
        
        resultsDiv.innerHTML = `
            <div style="text-align: center; color: #00d4aa; margin-bottom: 10px;">
                测试完成: ${successCount} 成功 / ${failCount} 失败 (共 ${items.length} 个)
                <br>分类: ${this.getCategoryTitle(categoryKey)} | 方法: ${method}
            </div>
            ${this.renderRequestResults(results)}
        `;
    }
    
    // 处理单个请求
    async processSingleRequest(item, categoryKey, baseUrl, method, timeout, index, cookieSetting = null) {
        try {
            let url = await this.buildTestUrl(item, categoryKey, baseUrl);
            
            if (!url) {
                return {
                    url: item,
                    fullUrl: 'Invalid URL',
                    status: 'Error',
                    statusText: '无法构建有效URL',
                    size: 'N/A',
                    time: 'N/A',
                    success: false,
                    index: index
                };
            }
            
            const startTime = performance.now();
            const response = await this.makeRequest(url, method, timeout, cookieSetting);
            const endTime = performance.now();
            const duration = (endTime - startTime).toFixed(2);
            
            let size = 'N/A';
            try {
                if (response.headers && response.headers.get('content-length')) {
                    size = this.formatBytes(parseInt(response.headers.get('content-length')));
                }
            } catch (e) {
                // 忽略获取大小失败
            }
            
            // 判断成功状态：2xx状态码或者no-cors模式下的200
            const isSuccess = response.ok || (response.status >= 200 && response.status < 300);
            
            return {
                url: item,
                fullUrl: url,
                status: response.status || 'Unknown',
                statusText: response.statusText || 'OK',
                size: size,
                time: `${duration}ms`,
                success: isSuccess,
                index: index
            };
        } catch (error) {
            // 这里应该很少执行到，因为makeRequest已经处理了大部分错误
            return {
                url: item,
                fullUrl: item,
                status: 'Exception',
                statusText: error.message || '未知异常',
                size: 'N/A',
                time: 'N/A',
                success: false,
                index: index
            };
        }
    }

    // 构建测试URL
    async buildTestUrl(item, categoryKey, baseUrl) {
        try {
            let url = item;
            
            switch (categoryKey) {
                case 'absoluteApis':
                case 'paths':
                    if (baseUrl && url.startsWith('/')) {
                        url = baseUrl + url;
                    }
                    break;
                    
                case 'relativeApis':
                    if (baseUrl && !url.startsWith('http')) {
                        url = baseUrl + (url.startsWith('/') ? '' : '/') + url;
                    }
                    break;
                    
                case 'urls':
                    if (!url.startsWith('http')) {
                        url = 'http://' + url;
                    }
                    break;
                    
                case 'jsFiles':
                case 'cssFiles':
                case 'images':
                    if (baseUrl && !url.startsWith('http')) {
                        if (url.startsWith('/')) {
                            url = baseUrl + url;
                        } else {
                            url = baseUrl + '/' + url;
                        }
                    }
                    break;
                    
                default:
                    if (baseUrl && !url.startsWith('http')) {
                        url = baseUrl + (url.startsWith('/') ? '' : '/') + url;
                    }
            }
            
            new URL(url);
            return url;
        } catch (error) {
            console.error('构建URL失败:', error, item);
            return null;
        }
    }
    
    // 发送请求
    // 发送请求 - 通过后台脚本
    async makeRequest(url, method, timeout = 5000, customCookie = null) {
        console.log(`🌐 API测试通过后台脚本请求: ${url}`);
        
        const requestOptions = {
            method: method,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Accept': '*/*',
                'Cache-Control': 'no-cache'
            },
            timeout: timeout
        };
        
        if (method === 'POST') {
            requestOptions.headers['Content-Type'] = 'application/json';
            requestOptions.body = JSON.stringify({});
        }
        
        try {
            // 通过后台脚本发送请求（会自动使用保存的Cookie）
            const response = await this.makeRequestViaBackground(url, requestOptions);
            return response;
        } catch (error) {
            // 返回错误响应对象
            return {
                status: 'Error',
                statusText: error.message || '请求失败',
                ok: false,
                headers: new Headers()
            };
        }
    }
    
    // 通过后台脚本发送请求
    async makeRequestViaBackground(url, options = {}) {
        return new Promise((resolve, reject) => {
            chrome.runtime.sendMessage({
                action: 'makeRequest',
                url: url,
                options: options
            }, (response) => {
                if (chrome.runtime.lastError) {
                    reject(new Error(chrome.runtime.lastError.message));
                } else if (response && response.success) {
                    // 模拟fetch响应对象
                    resolve({
                        ok: response.data.status >= 200 && response.data.status < 300,
                        status: response.data.status,
                        statusText: response.data.statusText,
                        headers: new Map(Object.entries(response.data.headers || {})),
                        text: () => Promise.resolve(response.data.text),
                        json: () => {
                            try {
                                return Promise.resolve(JSON.parse(response.data.text));
                            } catch (e) {
                                return Promise.reject(new Error('Invalid JSON'));
                            }
                        },
                        url: response.data.url
                    });
                } else {
                    reject(new Error(response?.error || 'Request failed'));
                }
            });
        });
    }
    
    // 批量测试多个API - 供DisplayManager调用
    async testMultipleApis(items, method, baseUrl) {
        if (!items || items.length === 0) {
            return [];
        }
        
        console.log(`🔍 开始批量测试 ${items.length} 个API，方法: ${method}`);
        
        const results = [];
        const concurrencyLimit = 5; // 并发限制
        
        // 分批处理
        const chunks = [];
        for (let i = 0; i < items.length; i += concurrencyLimit) {
            chunks.push(items.slice(i, i + concurrencyLimit));
        }
        
        for (const chunk of chunks) {
            const chunkPromises = chunk.map(async (item) => {
                try {
                    // 构建URL
                    let url = await this.buildTestUrl(item, 'absoluteApis', baseUrl);
                    if (!url) {
                        return {
                            url: item,
                            method: method,
                            status: 'Error',
                            success: false,
                            time: 0,
                            data: null,
                            error: '无法构建有效URL'
                        };
                    }
                    
                    // 发送请求并计时
                    const startTime = performance.now();
                    const response = await this.makeRequest(url, method, 5000); // 使用默认5秒超时
                    const endTime = performance.now();
                    const time = Math.round(endTime - startTime);
                    
                    // 尝试获取响应数据
                    let data = null;
                    try {
                        if (response.status !== 0) {
                            const contentType = response.headers.get('content-type') || '';
                            if (contentType.includes('application/json')) {
                                data = await response.json();
                            } else if (contentType.includes('text/')) {
                                const text = await response.text();
                                data = text.substring(0, 5000); // 限制文本大小
                            } else {
                                data = `[${contentType}] 二进制数据`;
                            }
                        }
                    } catch (e) {
                        data = `解析响应失败: ${e.message}`;
                    }
                    
                    return {
                        url: item,
                        fullUrl: url,
                        method: method,
                        status: response.status,
                        statusText: response.statusText,
                        success: response.ok || response.status < 400,
                        time: time,
                        data: data
                    };
                } catch (error) {
                    return {
                        url: item,
                        method: method,
                        status: 'Error',
                        statusText: error.message,
                        success: false,
                        time: 0,
                        data: null,
                        error: error.message
                    };
                }
            });
            
            const chunkResults = await Promise.all(chunkPromises);
            results.push(...chunkResults);
        }
        
        console.log(`✅ API测试完成，成功: ${results.filter(r => r.success).length}/${results.length}`);
        return results;
    }
    
    // 渲染请求结果
    renderRequestResults(results) {
        if (!results || results.length === 0) {
            return '<div style="text-align: center; color: #666;">无结果</div>';
        }
        
        let html = `
            <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
                <thead>
                    <tr style="background: rgba(0, 212, 170, 0.1);">
                        <th style="padding: 8px; text-align: left; border-bottom: 1px solid #00d4aa;">URL</th>
                        <th style="padding: 8px; text-align: center; border-bottom: 1px solid #00d4aa;">状态码</th>
                        <th style="padding: 8px; text-align: center; border-bottom: 1px solid #00d4aa;">大小</th>
                        <th style="padding: 8px; text-align: center; border-bottom: 1px solid #00d4aa;">耗时</th>
                    </tr>
                </thead>
                <tbody>
        `;
        
        results.forEach(result => {
            const statusColor = result.success ? '#00d4aa' : '#ff4757';
            html += `
                <tr style="border-bottom: 1px solid rgba(0, 212, 170, 0.2);">
                    <td style="padding: 8px; word-break: break-all;">${result.url}</td>
                    <td style="padding: 8px; text-align: center; color: ${statusColor};">${result.status}</td>
                    <td style="padding: 8px; text-align: center;">${result.size}</td>
                    <td style="padding: 8px; text-align: center;">${result.time}</td>
                </tr>
            `;
        });
        
        html += `</tbody></table>`;
        return html;
    }
    
    // 格式化字节大小
    formatBytes(bytes, decimals = 2) {
        if (bytes === 0 || bytes === 'N/A') return 'N/A';
        
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
        
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }
}