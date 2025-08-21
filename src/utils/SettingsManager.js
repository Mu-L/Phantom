/**
 * 设置管理器
 * 负责管理Cookie设置和正则表达式配置
 */
class SettingsManager {
    constructor() {
        this.defaultRegexPatterns = {
            // API路径
            api: [
                '/api/[^\\s"\'<>]+',
                '/v\\d+/[^\\s"\'<>]+',
                '\\.json[^\\s"\'<>]*',
                '\\.xml[^\\s"\'<>]*',
                '/rest/[^\\s"\'<>]+',
                '/graphql[^\\s"\'<>]*'
            ].join('|'),
            
            // 域名和URL
            domain: [
                '(([a-zA-Z0-9]+:)?\\/\\/)?[a-zA-Z0-9\\-\\.]*?\\.(xin|com|cn|net|com\\.cn|vip|top|cc|shop|club|wang|xyz|luxe|site|news|pub|fun|online|win|red|loan|ren|mom|net\\.cn|org|link|biz|bid|help|tech|date|mobi|so|me|tv|co|vc|pw|video|party|pics|website|store|ltd|ink|trade|live|wiki|space|gift|lol|work|band|info|click|photo|market|tel|social|press|game|kim|org\\.cn|games|pro|men|love|studio|rocks|asia|group|science|design|software|engineer|lawyer|fit|beer|tw|我爱你|中国|公司|网络|在线|网址|网店|集团|中文网)(\\:\\d{1,5})?(\\/)?'
            ].join('|'),
            
            // 邮箱地址（排除静态资源域名）
            email: [
                '[\'""][a-zA-Z0-9\\._\\-]*@[a-zA-Z0-9\\._\\-]{1,63}\\.((?!js|css|jpg|jpeg|png|ico)[a-zA-Z]{2,})[\'""]'
            ].join('|'),
            
            // 中国大陆手机号
            phone: [
                '(1(3([0-35-9]\\d|4[1-8])|4[14-9]\\d|5([\\d]\\d|7[1-79])|66\\d|7[2-35-8]\\d|8\\d{2}|9[89]\\d)\\d{7})'
            ].join('|'),
            
            // IP地址
            ip: [
                '[\'"](([a-zA-Z0-9]+:)?\\/\\/)?\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}(\\/.*?)?[\'"]'
            ].join('|'),
            
            // 路径
            paths : [
            '["\'](?:\\/|\\.\\.\\/|\\.\\/)[^\\/\\>\\< \\)\\(\\{\\}\\,\\\'"\\\\]([^\\>\\< \\)\\(\\{\\}\\,\\\'"\\\\])*?["\']',
            '["\'][^\\/\\>\\< \\)\\(\\{\\}\\,\\\'"\\\\][\\w\\/]*?\\/[\\w\\/]*?["\']'
            ].join('|'),
            
            // 身份证号
            idCard: [
                '[\'"](\\d{8}(0\\d|10|11|12)([0-2]\\d|30|31)\\d{3}$)|(\\d{6}(18|19|20)\\d{2}(0[1-9]|10|11|12)([0-2]\\d|30|31)\\d{3}(\\d|X|x))[\'"]'
            ].join('|'),
            
            // JWT Token
            jwt: [
                '[\'""]ey[A-Za-z0-9_-]{10,}\\.[A-Za-z0-9._-]{10,}|ey[A-Za-z0-9_\\/+-]{10,}\\.[A-Za-z0-9._\\/+-]{10,}[\'""]'
            ].join('|'),
            
            // Bearer Token
            bearerToken: [
                '[Bb]earer\\s+[a-zA-Z0-9\\-=._+/\\\\]{20,500}'
            ].join('|'),
            
            // Basic Auth
            // Basic Auth
            basicAuth: [
                '[Bb]asic\\s+[A-Za-z0-9+/]{18,}={0,2}'
            ].join('|'),
            
            // Authorization Header
            authHeader: [
                '["\'\\\[]*[Aa]uthorization["\'\\\]]*\\s*[:=]\\s*[\'"]?\\b(?:[Tt]oken\\s+)?[a-zA-Z0-9\\-_+/]{20,500}[\'"]?'
            ].join('|'),
            
            // 微信AppID
            wechatAppId: [
                '[\'"](wx[a-z0-9]{15,18})[\'"]',
                '[\'"](ww[a-z0-9]{15,18})[\'"]'
            ].join('|'),
            
            // GitHub Token
            githubToken: [
                '(ghp|gho|ghu|ghs|ghr|github_pat)_[a-zA-Z0-9_]{36,255}'
            ].join('|'),
            
            // GitLab Token
            gitlabToken: [
                'glpat-[a-zA-Z0-9\\-=_]{20,22}'
            ].join('|'),
            
            // AWS密钥
            awsKey: [
                'AKIA[A-Z0-9]{16}',
                'LTAI[A-Za-z\\d]{12,30}',
                'AKID[A-Za-z\\d]{13,40}'
            ].join('|'),
            
            // Google API Key
            googleApiKey: [
                'AIza[0-9A-Za-z_\\-]{35}'
            ].join('|'),
            
            // Webhook URLs
            webhookUrls: [
                'https:\\/\\/qyapi\\.weixin\\.qq\\.com\\/cgi\\-bin\\/webhook\\/send\\?key=[a-zA-Z0-9\\-]{25,50}',
                'https:\\/\\/oapi\\.dingtalk\\.com\\/robot\\/send\\?access_token=[a-z0-9]{50,80}',
                'https:\\/\\/open\\.feishu\\.cn\\/open\\-apis\\/bot\\/v2\\/hook\\/[a-z0-9\\-]{25,50}',
                'https:\\/\\/hooks\\.slack\\.com\\/services\\/[a-zA-Z0-9\\-_]{6,12}\\/[a-zA-Z0-9\\-_]{6,12}\\/[a-zA-Z0-9\\-_]{15,24}'
            ].join('|'),
            
            // 加密算法调用检测
            cryptoUsage: [
                '\\W(Base64\\.encode|Base64\\.decode|btoa|atob|CryptoJS\\.AES|CryptoJS\\.DES|JSEncrypt|rsa|KJUR|\\$\\.md5|md5|sha1|sha256|sha512)[\\(\\.)]'
            ].join('|'),
            
            // 敏感信息（综合模式）
            sensitive: [
                // GitHub 各类 Token
                'github[_-]?token["\']?[^\\S\\r\\n]*[=:][^\\S\\r\\n]*["\']?[\\w-]+["\']?',
                'github[_-]?oauth[_-]?token["\']?[^\\S\\r\\n]*[=:][^\\S\\r\\n]*["\']?[\\w-]+["\']?',
                'github[_-]?api[_-]?token["\']?[^\\S\\r\\n]*[=:][^\\S\\r\\n]*["\']?[\\w-]+["\']?',
                'github[_-]?access[_-]?token["\']?[^\\S\\r\\n]*[=:][^\\S\\r\\n]*["\']?[\\w-]+["\']?',
                'github[_-]?client[_-]?secret["\']?[^\\S\\r\\n]*[=:][^\\S\\r\\n]*["\']?[\\w-]+["\']?',
                // AWS 密钥
                'aws[_-]?access[_-]?key[_-]?id["\']?[^\\S\\r\\n]*[=:][^\\S\\r\\n]*["\']?[\\w-]+["\']?',
                'aws[_-]?secret[_-]?access[_-]?key["\']?[^\\S\\r\\n]*[=:][^\\S\\r\\n]*["\']?[\\w-]+["\']?',
                'aws[_-]?key["\']?[^\\S\\r\\n]*[=:][^\\S\\r\\n]*["\']?[\\w-]+["\']?',
                'awssecretkey["\']?[^\\S\\r\\n]*[=:][^\\S\\r\\n]*["\']?[\\w-]+["\']?',
                // Google API Key
                'google[_-]?api[_-]?key["\']?[^\\S\\r\\n]*[=:][^\\S\\r\\n]*["\']?[\\w-]+["\']?',
                'google[_-]?client[_-]?secret["\']?[^\\S\\r\\n]*[=:][^\\S\\r\\n]*["\']?[\\w-]+["\']?',
                'google[_-]?maps[_-]?api[_-]?key["\']?[^\\S\\r\\n]*[=:][^\\S\\r\\n]*["\']?[\\w-]+["\']?',
                // 通用密钥字段
                '[\\w_-]*?password[\\w_-]*?["\']?[^\\S\\r\\n]*[=:][^\\S\\r\\n]*["\']?[\\w-]+["\']?',
                '[\\w_-]*?token[\\w_-]*?["\']?[^\\S\\r\\n]*[=:][^\\S\\r\\n]*["\']?[\\w-]+["\']?',
                '[\\w_-]*?secret[\\w_-]*?["\']?[^\\S\\r\\n]*[=:][^\\S\\r\\n]*["\']?[\\w-]+["\']?',
                '[\\w_-]*?accesskey[\\w_-]*?["\']?[^\\S\\r\\n]*[=:][^\\S\\r\\n]*["\']?[\\w-]+["\']?',
                '[\\w_-]*?bucket[\\w_-]*?["\']?[^\\S\\r\\n]*[=:][^\\S\\r\\n]*["\']?[\\w-]+["\']?',
                // 私钥
                '["\']?[-]+BEGIN \\w+ PRIVATE KEY[-]+',
                '["\']?private[_-]?key[_-]?(id)?["\']?[^\\S\\r\\n]*[=:][^\\S\\r\\n]*["\']?[\\w-]+["\']?',
                // 华为云 OSS
                'huawei\\.oss\\.(ak|sk|bucket\\.name|endpoint|local\\.path)["\']?[^\\S\\r\\n]*[=:][^\\S\\r\\n]*["\']?[\\w-]+["\']?',
                // 其他服务密钥
                'stripe[_-]?(secret|private|publishable)[-_]?key["\']?[^\\S\\r\\n]*[=:][^\\S\\r\\n]*["\']?[\\w-]+["\']?',
                'slack[_-]?token["\']?[^\\S\\r\\n]*[=:][^\\S\\r\\n]*["\']?[\\w-]+["\']?',
                'twilio[_-]?(token|sid|api[_-]?key|api[_-]?secret)["\']?[^\\S\\r\\n]*[=:][^\\S\\r\\n]*["\']?[\\w-]+["\']?',
                'firebase[_-]?(token|key|api[_-]?token)["\']?[^\\S\\r\\n]*[=:][^\\S\\r\\n]*["\']?[\\w-]+["\']?',
                'mailgun[_-]?(api[_-]?key|secret[_-]?api[_-]?key)["\']?[^\\S\\r\\n]*[=:][^\\S\\r\\n]*["\']?[\\w-]+["\']?',
                'docker[_-]?(token|password|key|hub[_-]?password)["\']?[^\\S\\r\\n]*[=:][^\\S\\r\\n]*["\']?[\\w-]+["\']?',
                'npm[_-]?(token|api[_-]?key|auth[_-]?token|password)["\']?[^\\S\\r\\n]*[=:][^\\S\\r\\n]*["\']?[\\w-]+["\']?'
            ].join('|'),
            
            // GitHub链接
            github: [
                'https?://github\\.com/[a-zA-Z0-9_\\-\\.]+/[a-zA-Z0-9_\\-\\.]+'
            ].join('|'),
            
            // Vue文件
            vue: [
                '["\'][^"\']*\\.vue["\']'
            ].join('|'),
            
            // 公司名称
            company: [
            // 中文公司名称模式
            '(?:[\\u4e00-\\u9fa5\\（\\）]{4,15}(?:公司|中心))',
            '(?:[\\u4e00-\\u9fa5]{2,15}(?:软件|科技|集团))',
    
            // 英文公司名称模式（新增）
            '[A-Z][a-zA-Z\\s]{2,30}(?:Inc|Corp|LLC|Ltd|Company|Group|Technology|Systems)',
    
            // 扩展的中文公司类型（新增）
            '(?:公司|集团|企业|有限责任公司|股份有限公司|科技|网络|信息|技术)[\\u4e00-\\u9fa5]{2,20}(?:公司|集团|企业|有限责任公司|股份有限公司)'
            ].join('|'),
            
            // 注释
            comment: [
             '<!--([\\s\\S]*?)-->',
             '/\\*([\\s\\S]*?)\\*/',
             '(?<![pst]:)\\/\\/\\s*(.+)$'
            ].join('|')
        };
        
        this.init();
    }

    /**
     * 初始化设置管理器
     */
    init() {
        this.bindEvents();
        this.loadSettings();
    }

    /**
     * 绑定事件监听器
     */
    bindEvents() {
        // Cookie相关按钮
        document.getElementById('getCookieBtn')?.addEventListener('click', () => this.getCurrentCookie());
        document.getElementById('saveCookieBtn')?.addEventListener('click', () => this.saveCookie());
        document.getElementById('clearCookieBtn')?.addEventListener('click', () => this.clearCookie());
        
        // 正则配置相关按钮
        document.getElementById('saveRegexBtn')?.addEventListener('click', () => this.saveRegexConfig());
        document.getElementById('resetRegexBtn')?.addEventListener('click', () => this.resetRegexConfig());
        
        // 数据管理按钮
        document.getElementById('clearAllDataBtn')?.addEventListener('click', () => this.clearAllData());
    }

    /**
     * 加载设置
     */
    async loadSettings() {
        try {
            // 加载Cookie设置
            const result = await chrome.storage.local.get(['phantomCookie', 'phantomRegexConfig', 'regexSettings']);
            
            if (result.phantomCookie) {
                document.getElementById('cookieInput').value = result.phantomCookie;
            }
            
            // 加载正则配置
            const regexConfig = result.phantomRegexConfig || this.defaultRegexPatterns;

            // 如果 regexSettings 不存在，基于当前配置构建并保存，保证全链路生效
            if (!result.regexSettings) {
                const regexSettings = {
                    absoluteApis: regexConfig.api || this.defaultRegexPatterns.api,
                    relativeApis: regexConfig.api || this.defaultRegexPatterns.api,
                    domains: regexConfig.domain || this.defaultRegexPatterns.domain,
                    emails: regexConfig.email || this.defaultRegexPatterns.email,
                    phoneNumbers: regexConfig.phone || this.defaultRegexPatterns.phone,
                    credentials: regexConfig.sensitive || this.defaultRegexPatterns.sensitive,
                    ipAddresses: regexConfig.ip || this.defaultRegexPatterns.ip,
                    paths: regexConfig.paths || this.defaultRegexPatterns.paths,
                    jwts: regexConfig.jwt || this.defaultRegexPatterns.jwt,
                    githubUrls: regexConfig.github || this.defaultRegexPatterns.github,
                    vueFiles: regexConfig.vue || this.defaultRegexPatterns.vue,
                    companies: regexConfig.company || this.defaultRegexPatterns.company,
                    comments: regexConfig.comment || this.defaultRegexPatterns.comment,
                    // 扩展项
                    idCards: regexConfig.idCard || this.defaultRegexPatterns.idCard,
                    bearerTokens: regexConfig.bearerToken || this.defaultRegexPatterns.bearerToken,
                    basicAuth: regexConfig.basicAuth || this.defaultRegexPatterns.basicAuth,
                    authHeaders: regexConfig.authHeader || this.defaultRegexPatterns.authHeader,
                    wechatAppIds: regexConfig.wechatAppId || this.defaultRegexPatterns.wechatAppId,
                    awsKeys: regexConfig.awsKey || this.defaultRegexPatterns.awsKey,
                    googleApiKeys: regexConfig.googleApiKey || this.defaultRegexPatterns.googleApiKey,
                    githubTokens: regexConfig.githubToken || this.defaultRegexPatterns.githubToken,
                    gitlabTokens: regexConfig.gitlabToken || this.defaultRegexPatterns.gitlabToken,
                    webhookUrls: regexConfig.webhookUrls || this.defaultRegexPatterns.webhookUrls,
                    cryptoUsage: regexConfig.cryptoUsage || this.defaultRegexPatterns.cryptoUsage
                };
                await chrome.storage.local.set({ regexSettings });
                console.log('✅ 已构建并保存默认 regexSettings（首次初始化）');
                // 通知其他模块配置已更新
                this.notifyConfigUpdate(regexSettings);
            }
            document.getElementById('apiRegex').value = regexConfig.api || this.defaultRegexPatterns.api;
            document.getElementById('domainRegex').value = regexConfig.domain || this.defaultRegexPatterns.domain;
            document.getElementById('emailRegex').value = regexConfig.email || this.defaultRegexPatterns.email;
            document.getElementById('phoneRegex').value = regexConfig.phone || this.defaultRegexPatterns.phone;
            document.getElementById('sensitiveRegex').value = regexConfig.sensitive || this.defaultRegexPatterns.sensitive;
            document.getElementById('ipRegex').value = regexConfig.ip || this.defaultRegexPatterns.ip;
            document.getElementById('jwtRegex').value = regexConfig.jwt || this.defaultRegexPatterns.jwt;
            document.getElementById('githubRegex').value = regexConfig.github || this.defaultRegexPatterns.github;
            document.getElementById('vueRegex').value = regexConfig.vue || this.defaultRegexPatterns.vue;
            document.getElementById('companyRegex').value = regexConfig.company || this.defaultRegexPatterns.company;
            document.getElementById('commentRegex').value = regexConfig.comment || this.defaultRegexPatterns.comment;
            
            // 新增的正则表达式输入框
            document.getElementById('pathsRegex').value = regexConfig.paths || this.defaultRegexPatterns.paths;
            document.getElementById('idCardRegex').value = regexConfig.idCard || this.defaultRegexPatterns.idCard;
            document.getElementById('bearerTokenRegex').value = regexConfig.bearerToken || this.defaultRegexPatterns.bearerToken;
            document.getElementById('basicAuthRegex').value = regexConfig.basicAuth || this.defaultRegexPatterns.basicAuth;
            document.getElementById('authHeaderRegex').value = regexConfig.authHeader || this.defaultRegexPatterns.authHeader;
            document.getElementById('wechatAppIdRegex').value = regexConfig.wechatAppId || this.defaultRegexPatterns.wechatAppId;
            document.getElementById('awsKeyRegex').value = regexConfig.awsKey || this.defaultRegexPatterns.awsKey;
            document.getElementById('googleApiKeyRegex').value = regexConfig.googleApiKey || this.defaultRegexPatterns.googleApiKey;
            document.getElementById('githubTokenRegex').value = regexConfig.githubToken || this.defaultRegexPatterns.githubToken;
            document.getElementById('gitlabTokenRegex').value = regexConfig.gitlabToken || this.defaultRegexPatterns.gitlabToken;
            document.getElementById('webhookUrlsRegex').value = regexConfig.webhookUrls || this.defaultRegexPatterns.webhookUrls;
            document.getElementById('cryptoUsageRegex').value = regexConfig.cryptoUsage || this.defaultRegexPatterns.cryptoUsage;
            
        } catch (error) {
            console.error('加载设置失败:', error);
        }
    }

    /**
     * 获取当前网站的Cookie
     */
    async getCurrentCookie() {
        try {
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            if (!tab || !tab.url) {
                this.showMessage('无法获取当前标签页信息', 'error');
                return;
            }

            const url = new URL(tab.url);
            const cookies = await chrome.cookies.getAll({ domain: url.hostname });
            
            if (cookies.length === 0) {
                this.showMessage('当前网站没有Cookie', 'warning');
                return;
            }

            const cookieString = cookies.map(cookie => `${cookie.name}=${cookie.value}`).join('; ');
            document.getElementById('cookieInput').value = cookieString;
            this.showMessage('Cookie获取成功', 'success');
            
        } catch (error) {
            console.error('获取Cookie失败:', error);
            this.showMessage('获取Cookie失败: ' + error.message, 'error');
        }
    }

    /**
     * 保存正则表达式设置
     */
    async saveRegexSettings() {
        try {
            const regexSettings = {};
            
            // 收集所有正则表达式设置
            const regexItems = document.querySelectorAll('.regex-item');
            regexItems.forEach(item => {
                const textarea = item.querySelector('textarea');
                const category = textarea.id.replace('regex-', '');
                regexSettings[category] = textarea.value.trim();
            });
            
            // 保存到Chrome存储
            await chrome.storage.local.set({ regexSettings });
            
            console.log('正则表达式设置已保存:', regexSettings);
            
            // 通知PatternExtractor重新加载配置
            if (window.patternExtractor) {
                await window.patternExtractor.loadCustomPatterns();
                console.log('✅ PatternExtractor已重新加载配置');
            }
            
            this.showMessage('正则表达式设置保存成功！配置已生效', 'success');
            
        } catch (error) {
            console.error('保存正则表达式设置失败:', error);
            this.showMessage('保存正则表达式设置失败: ' + error.message, 'error');
        }
    }

    /**
     * 保存正则配置
     */
    async saveRegexConfig() {
        try {
            const regexConfig = {
                api: document.getElementById('apiRegex').value.trim(),
                domain: document.getElementById('domainRegex').value.trim(),
                email: document.getElementById('emailRegex').value.trim(),
                phone: document.getElementById('phoneRegex').value.trim(),
                sensitive: document.getElementById('sensitiveRegex').value.trim(),
                ip: document.getElementById('ipRegex').value.trim(),
                jwt: document.getElementById('jwtRegex').value.trim(),
                github: document.getElementById('githubRegex').value.trim(),
                vue: document.getElementById('vueRegex').value.trim(),
                company: document.getElementById('companyRegex').value.trim(),
                comment: document.getElementById('commentRegex').value.trim(),
                
                // 新增的正则表达式配置
                paths: document.getElementById('pathsRegex').value.trim(),
                idCard: document.getElementById('idCardRegex').value.trim(),
                bearerToken: document.getElementById('bearerTokenRegex').value.trim(),
                basicAuth: document.getElementById('basicAuthRegex').value.trim(),
                authHeader: document.getElementById('authHeaderRegex').value.trim(),
                wechatAppId: document.getElementById('wechatAppIdRegex').value.trim(),
                awsKey: document.getElementById('awsKeyRegex').value.trim(),
                googleApiKey: document.getElementById('googleApiKeyRegex').value.trim(),
                githubToken: document.getElementById('githubTokenRegex').value.trim(),
                gitlabToken: document.getElementById('gitlabTokenRegex').value.trim(),
                webhookUrls: document.getElementById('webhookUrlsRegex').value.trim(),
                cryptoUsage: document.getElementById('cryptoUsageRegex').value.trim()
            };

            // 验证正则表达式
            for (const [key, pattern] of Object.entries(regexConfig)) {
                if (pattern) {
                    try {
                        new RegExp(pattern, 'gi');
                    } catch (e) {
                        this.showMessage(`${key}正则表达式格式错误: ${e.message}`, 'error');
                        return;
                    }
                }
            }

            // 转换为PatternExtractor期望的格式
            const regexSettings = {
                absoluteApis: regexConfig.api || this.defaultRegexPatterns.api,
                relativeApis: regexConfig.api || this.defaultRegexPatterns.api,
                domains: regexConfig.domain || this.defaultRegexPatterns.domain,
                emails: regexConfig.email || this.defaultRegexPatterns.email,
                phoneNumbers: regexConfig.phone || this.defaultRegexPatterns.phone,
                credentials: regexConfig.sensitive || this.defaultRegexPatterns.sensitive,
                ipAddresses: regexConfig.ip || this.defaultRegexPatterns.ip,
                paths: regexConfig.paths || this.defaultRegexPatterns.paths,
                jwts: regexConfig.jwt || this.defaultRegexPatterns.jwt,
                githubUrls: regexConfig.github || this.defaultRegexPatterns.github,
                vueFiles: regexConfig.vue || this.defaultRegexPatterns.vue,
                companies: regexConfig.company || this.defaultRegexPatterns.company,
                comments: regexConfig.comment || this.defaultRegexPatterns.comment,
                // 新增的正则表达式配置映射
                idCards: regexConfig.idCard || this.defaultRegexPatterns.idCard,
                bearerTokens: regexConfig.bearerToken || this.defaultRegexPatterns.bearerToken,
                basicAuth: regexConfig.basicAuth || this.defaultRegexPatterns.basicAuth,
                authHeaders: regexConfig.authHeader || this.defaultRegexPatterns.authHeader,
                wechatAppIds: regexConfig.wechatAppId || this.defaultRegexPatterns.wechatAppId,
                awsKeys: regexConfig.awsKey || this.defaultRegexPatterns.awsKey,
                googleApiKeys: regexConfig.googleApiKey || this.defaultRegexPatterns.googleApiKey,
                githubTokens: regexConfig.githubToken || this.defaultRegexPatterns.githubToken,
                gitlabTokens: regexConfig.gitlabToken || this.defaultRegexPatterns.gitlabToken,
                webhookUrls: regexConfig.webhookUrls || this.defaultRegexPatterns.webhookUrls,
                cryptoUsage: regexConfig.cryptoUsage || this.defaultRegexPatterns.cryptoUsage
            };

            // 同时保存两种格式以保持兼容性
            await chrome.storage.local.set({ 
                phantomRegexConfig: regexConfig,
                regexSettings: regexSettings
            });
            
            console.log('✅ 正则配置已保存:', { regexConfig, regexSettings });
            
            this.showMessage('正则配置保存成功', 'success');
            
            // 通知其他模块配置已更新
            this.notifyConfigUpdate(regexSettings);
            
        } catch (error) {
            console.error('保存正则配置失败:', error);
            this.showMessage('保存正则配置失败: ' + error.message, 'error');
        }
    }

    /**
     * 重置正则配置为默认值
     */
    async resetRegexConfig() {
        try {
            document.getElementById('apiRegex').value = this.defaultRegexPatterns.api;
            document.getElementById('domainRegex').value = this.defaultRegexPatterns.domain;
            document.getElementById('emailRegex').value = this.defaultRegexPatterns.email;
            document.getElementById('phoneRegex').value = this.defaultRegexPatterns.phone;
            document.getElementById('sensitiveRegex').value = this.defaultRegexPatterns.sensitive;
            document.getElementById('ipRegex').value = this.defaultRegexPatterns.ip;
            document.getElementById('jwtRegex').value = this.defaultRegexPatterns.jwt;
            document.getElementById('githubRegex').value = this.defaultRegexPatterns.github;
            document.getElementById('vueRegex').value = this.defaultRegexPatterns.vue;
            document.getElementById('companyRegex').value = this.defaultRegexPatterns.company;
            document.getElementById('commentRegex').value = this.defaultRegexPatterns.comment;
            
            // 新增的正则表达式输入框重置
            document.getElementById('pathsRegex').value = this.defaultRegexPatterns.paths;
            document.getElementById('idCardRegex').value = this.defaultRegexPatterns.idCard;
            document.getElementById('bearerTokenRegex').value = this.defaultRegexPatterns.bearerToken;
            document.getElementById('basicAuthRegex').value = this.defaultRegexPatterns.basicAuth;
            document.getElementById('authHeaderRegex').value = this.defaultRegexPatterns.authHeader;
            document.getElementById('wechatAppIdRegex').value = this.defaultRegexPatterns.wechatAppId;
            document.getElementById('awsKeyRegex').value = this.defaultRegexPatterns.awsKey;
            document.getElementById('googleApiKeyRegex').value = this.defaultRegexPatterns.googleApiKey;
            document.getElementById('githubTokenRegex').value = this.defaultRegexPatterns.githubToken;
            document.getElementById('gitlabTokenRegex').value = this.defaultRegexPatterns.gitlabToken;
            document.getElementById('webhookUrlsRegex').value = this.defaultRegexPatterns.webhookUrls;
            document.getElementById('cryptoUsageRegex').value = this.defaultRegexPatterns.cryptoUsage;
            
            // 转换为PatternExtractor期望的格式
            const regexSettings = {
                absoluteApis: this.defaultRegexPatterns.api,
                relativeApis: this.defaultRegexPatterns.api,
                domains: this.defaultRegexPatterns.domain,
                emails: this.defaultRegexPatterns.email,
                phoneNumbers: this.defaultRegexPatterns.phone,
                credentials: this.defaultRegexPatterns.sensitive,
                ipAddresses: this.defaultRegexPatterns.ip,
                paths: this.defaultRegexPatterns.paths,
                jwts: this.defaultRegexPatterns.jwt,
                githubUrls: this.defaultRegexPatterns.github,
                vueFiles: this.defaultRegexPatterns.vue,
                companies: this.defaultRegexPatterns.company,
                comments: this.defaultRegexPatterns.comment,
                // 新增的正则表达式配置映射
                idCards: this.defaultRegexPatterns.idCard,
                bearerTokens: this.defaultRegexPatterns.bearerToken,
                basicAuth: this.defaultRegexPatterns.basicAuth,
                authHeaders: this.defaultRegexPatterns.authHeader,
                wechatAppIds: this.defaultRegexPatterns.wechatAppId,
                awsKeys: this.defaultRegexPatterns.awsKey,
                googleApiKeys: this.defaultRegexPatterns.googleApiKey,
                githubTokens: this.defaultRegexPatterns.githubToken,
                gitlabTokens: this.defaultRegexPatterns.gitlabToken,
                webhookUrls: this.defaultRegexPatterns.webhookUrls,
                cryptoUsage: this.defaultRegexPatterns.cryptoUsage
            };
            
            // 同时保存两种格式
            await chrome.storage.local.set({ 
                phantomRegexConfig: this.defaultRegexPatterns,
                regexSettings: regexSettings
            });
            
            console.log('✅ 正则配置已重置为默认值:', { regexSettings });
            
            this.showMessage('正则配置已重置为默认值', 'success');
            
            // 通知其他模块配置已更新
            this.notifyConfigUpdate(regexSettings);
            
        } catch (error) {
            console.error('重置正则配置失败:', error);
            this.showMessage('重置正则配置失败: ' + error.message, 'error');
        }
    }

    /**
     * 通知其他模块配置已更新
     */
    notifyConfigUpdate(regexSettings) {
        console.log('🔄 通知其他模块配置已更新:', regexSettings);
        
        // 如果PatternExtractor存在，更新其配置
        if (window.patternExtractor && typeof window.patternExtractor.updatePatterns === 'function') {
            window.patternExtractor.updatePatterns(regexSettings);
            console.log('✅ PatternExtractor配置已更新');
        } else {
            console.warn('⚠️ PatternExtractor未找到或updatePatterns方法不存在');
        }
        
        // 触发全局事件，通知其他可能监听的模块
        window.dispatchEvent(new CustomEvent('regexConfigUpdated', { 
            detail: regexSettings 
        }));
    }

    /**
     * 保存Cookie设置
     */
    async saveCookie() {
        try {
            const cookieValue = document.getElementById('cookieInput').value.trim();
            
            if (!cookieValue) {
                this.showMessage('请输入Cookie内容', 'warning');
                return;
            }
            
            await chrome.storage.local.set({ phantomCookie: cookieValue });
            this.showMessage('Cookie保存成功', 'success');
            
        } catch (error) {
            console.error('保存Cookie失败:', error);
            this.showMessage('保存Cookie失败: ' + error.message, 'error');
        }
    }

    /**
     * 清空Cookie设置
     */
    async clearCookie() {
        try {
            document.getElementById('cookieInput').value = '';
            await chrome.storage.local.remove('phantomCookie');
            this.showMessage('Cookie已清空', 'success');
            
        } catch (error) {
            console.error('清空Cookie失败:', error);
            this.showMessage('清空Cookie失败: ' + error.message, 'error');
        }
    }

    /**
     * 获取当前Cookie设置
     */
    async getCookieSetting() {
        try {
            const result = await chrome.storage.local.get('phantomCookie');
            return result.phantomCookie || '';
        } catch (error) {
            console.error('获取Cookie设置失败:', error);
            return '';
        }
    }

    /**
     * 获取当前正则配置
     */
    async getRegexConfig() {
        try {
            const result = await chrome.storage.local.get('phantomRegexConfig');
            return result.phantomRegexConfig || this.defaultRegexPatterns;
        } catch (error) {
            console.error('获取正则配置失败:', error);
            return this.defaultRegexPatterns;
        }
    }

    /**
     * 清空全部数据 - 真正解决自动保存问题
     */
    async clearAllData() {
        // 确认清空操作
        if (!confirm('⚠️ 警告：此操作将清空所有页面的扫描数据！\n\n包括：\n• 所有页面的扫描结果\n• 深度扫描数据\n• 扫描状态信息\n\n此操作不可恢复，确定要继续吗？')) {
            return;
        }
        
        // 二次确认
        if (!confirm('请再次确认：真的要清空所有数据吗？')) {
            return;
        }
        
        try {
            console.log('🗑️ 开始清空全部数据...');
            
            // 第一步：暂时禁用自动保存机制，防止数据被重新写入
            let originalSaveResults = null;
            if (window.srcMiner && typeof window.srcMiner.saveResults === 'function') {
                console.log('🚫 暂时禁用自动保存机制...');
                originalSaveResults = window.srcMiner.saveResults;
                window.srcMiner.saveResults = () => {
                    console.log('🚫 自动保存已被暂时禁用');
                };
            }
            
            // 第二步：彻底清空 SRCMiner 实例的内存数据
            if (window.srcMiner) {
                console.log('🧹 清空SRCMiner实例内存数据...');
                
                // 检查是否有深度扫描正在运行
                const isDeepScanRunning = window.srcMiner.deepScanRunning;
                console.log('深度扫描运行状态:', isDeepScanRunning);
                
                // 清空所有内存中的数据
                window.srcMiner.results = {};
                window.srcMiner.deepScanResults = {};
                window.srcMiner.scannedUrls = new Set();
                window.srcMiner.pendingUrls = new Set();
                
                // 只有在没有深度扫描运行时才重置扫描状态
                if (!isDeepScanRunning) {
                    window.srcMiner.deepScanRunning = false;
                    window.srcMiner.currentDepth = 0;
                    console.log('✅ 已重置扫描状态');
                } else {
                    console.log('⚠️ 检测到深度扫描正在运行，保持扫描状态');
                }
            }
            
            // 第三步：获取所有存储的键并识别扫描相关数据
            const allData = await chrome.storage.local.get(null);
            console.log('📋 当前存储的所有数据键:', Object.keys(allData));
            
            const keysToRemove = [];
            
            // 找出所有与扫描数据相关的键（包括双下划线格式）
            for (const key in allData) {
                if (
                    // 双下划线格式（实际存储格式）
                    key.endsWith('__results') || 
                    key.endsWith('__deepResults') || 
                    key.endsWith('__deepBackup') || 
                    key.endsWith('__deepState') || 
                    key.endsWith('__lastSave') ||
                    // 单下划线格式（兼容性）
                    key.endsWith('_results') || 
                    key.endsWith('_deepResults') || 
                    key.endsWith('_deepBackup') || 
                    key.endsWith('_deepState') || 
                    key.endsWith('_lastSave') ||
                    // 旧版本的全局键
                    key === 'srcMinerResults' ||
                    key === 'deepScanResults' ||
                    key === 'deepScanBackup' ||
                    key === 'deepScanState' ||
                    key === 'lastSaveTime' ||
                    // 其他可能的扫描相关键
                    key === 'deepScanComplete' ||
                    key === 'deepScanTimestamp' ||
                    key === 'deepScanUrl' ||
                    key === 'deepScanCompletedAt' ||
                    key === 'deepScanResultsCount' ||
                    key === 'lastDeepScanCompleted' ||
                    key === 'deepScanRunning' ||
                    // lastScan_ 开头的键（自动扫描时间记录）
                    key.startsWith('lastScan_')
                ) {
                    keysToRemove.push(key);
                }
            }
            
            console.log(`🔍 找到 ${keysToRemove.length} 个数据键需要清空:`, keysToRemove);
            
            // 第四步：删除所有相关键
            if (keysToRemove.length > 0) {
                await chrome.storage.local.remove(keysToRemove);
                console.log(`✅ 已删除 ${keysToRemove.length} 个数据键`);
            }
            
            // 第五步：验证删除结果并处理残留数据
            const verifyData = await chrome.storage.local.get(keysToRemove);
            const remainingKeys = Object.keys(verifyData);
            
            if (remainingKeys.length > 0) {
                console.warn('⚠️ 发现残留数据键，尝试强制删除:', remainingKeys);
                // 尝试逐个删除剩余的键
                for (const key of remainingKeys) {
                    try {
                        await chrome.storage.local.remove([key]);
                        console.log(`✅ 强制删除成功: ${key}`);
                    } catch (error) {
                        console.error(`❌ 强制删除失败: ${key}`, error);
                    }
                }
            }
            
            // 第六步：清空界面显示
            const resultsDiv = document.getElementById('results');
            const statsDiv = document.getElementById('stats');
            if (resultsDiv) {
                resultsDiv.innerHTML = '';
                console.log('✅ 已清空结果显示区域');
            }
            if (statsDiv) {
                statsDiv.textContent = '';
                console.log('✅ 已清空统计显示区域');
            }
            
            // 第七步：重置UI状态
            if (window.srcMiner) {
                // 只有在没有深度扫描运行时才重置UI状态
                if (!window.srcMiner.deepScanRunning) {
                    // 重置深度扫描UI状态
                    if (typeof window.srcMiner.resetDeepScanUI === 'function') {
                        window.srcMiner.resetDeepScanUI();
                        console.log('✅ 已重置深度扫描UI状态');
                    }
                }
                
                // 更新分类选择器
                if (typeof window.srcMiner.updateCategorySelect === 'function') {
                    window.srcMiner.updateCategorySelect();
                    console.log('✅ 已更新分类选择器');
                }
                
                // 强制刷新显示
                if (typeof window.srcMiner.displayResults === 'function') {
                    window.srcMiner.displayResults();
                    console.log('✅ 已刷新结果显示');
                }
            }
            
            // 第八步：最终验证
            const finalCheck = await chrome.storage.local.get(null);
            const remainingDataKeys = Object.keys(finalCheck).filter(key => 
                key.endsWith('__results') || 
                key.endsWith('__deepResults') || 
                key.endsWith('__deepBackup') || 
                key.endsWith('__deepState') || 
                key.endsWith('__lastSave') ||
                key.endsWith('_results') || 
                key.endsWith('_deepResults') || 
                key.endsWith('_deepBackup') || 
                key.endsWith('_deepState') || 
                key.endsWith('_lastSave') ||
                key === 'srcMinerResults' ||
                key === 'deepScanResults' ||
                key === 'deepScanBackup' ||
                key === 'deepScanState' ||
                key === 'lastSaveTime' ||
                key.startsWith('lastScan_')
            );
            
            // 第九步：恢复自动保存机制
            if (originalSaveResults && window.srcMiner) {
                setTimeout(() => {
                    window.srcMiner.saveResults = originalSaveResults;
                    console.log('✅ 自动保存机制已恢复');
                }, 1000); // 1秒后恢复，确保清空操作完全完成
            }
            
            // 显示结果
            if (remainingDataKeys.length > 0) {
                console.warn('⚠️ 最终检查发现残留数据键:', remainingDataKeys);
                this.showMessage(`清空完成，但发现 ${remainingDataKeys.length} 个残留数据键，可能需要手动处理`, 'warning');
            } else {
                console.log('✅ 数据清空验证通过，无残留数据');
                this.showMessage(`已成功清空 ${keysToRemove.length} 个数据项，所有扫描数据已彻底清除`, 'success');
            }
            
        } catch (error) {
            console.error('❌ 清空全部数据失败:', error);
            this.showMessage('清空数据失败: ' + error.message, 'error');
        }
    }

    /**
     * 显示消息提示
     */
    showMessage(message, type = 'info') {
        // 创建消息提示元素
        const messageEl = document.createElement('div');
        messageEl.className = `settings-message ${type}`;
        messageEl.textContent = message;
        messageEl.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 10px 15px;
            border-radius: 6px;
            color: #fff;
            font-size: 12px;
            z-index: 10000;
            animation: slideIn 0.3s ease;
            background: ${type === 'success' ? '#00d4aa' : type === 'error' ? '#e74c3c' : '#f39c12'};
        `;

        document.body.appendChild(messageEl);

        // 3秒后自动移除
        setTimeout(() => {
            messageEl.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (messageEl.parentNode) {
                    messageEl.parentNode.removeChild(messageEl);
                }
            }, 300);
        }, 3000);
    }
}

// 导出设置管理器
window.SettingsManager = SettingsManager;