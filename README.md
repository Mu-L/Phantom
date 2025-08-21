# 幻影（Phantom）SRC漏洞挖掘辅助工具

一款面向 SRC 场景的浏览器扩展，自动收集页面及相关资源中的敏感信息与可疑线索，支持基础扫描、深度递归扫描、批量 API 测试及结果导出与自定义正则配置。

版本：1.6.2  
作者：Phantom&yihuo

## 特性概览

- 一键基础扫描：自动提取页面内的 API、URL、域名、邮箱、手机号、路径、参数、注释、多类 Token/Key 等
- ![image-20250821105907662](.\icon\image-20250821105907662.png)——!(图像- 20250821105907662)(\ \图标图像- 20250821105907662. png)
- 深度递归扫描：多层链接/资源爬取，支持并发、超时配置，并在新窗口中运行，不阻塞当前操作
- ![image-20250821105956759](.\icon\image-20250821105956759.png——!(图像- 20250821105956759)(\ \图标- 20250821105956759. png图像
- ![image-20250821110030658](.\icon\image-20250821110030658.png)
- 批量 API 测试：对扫描到的分类条目进行 GET/POST 批测，并发与超时可配置，结果支持复制
- ![image-20250821110058048](.\icon\image-20250821110058048.png)   -边缘:优势:/ /扩展
- 导出能力：支持 JSON 与 Excel（.xls XML 格式）两种导出
- ![image-20250821110136801](.\icon\image-20250821110136801.png)——!(图像- 20250821110136801)(\ \图标图像- 20250821110136801. png)
- 自定义正则：内置丰富默认规则，可在「设置」中按分类自定义正则并即时生效
- ![image-20250821110155338](.\icon\image-20250821110155338.png)
- Cookie 支持：可一键获取当前站点 Cookie 并保存，便于需要鉴权的请求场景
- ![image-20250821110217368](.\icon\image-20250821110217368.png)
- 去重与过滤：内置增强过滤器（域名/邮箱/手机号/API），减少误报
- 自动与增量：页面加载、DOM 变化与定时策略触发静默扫描；深度扫描过程中分层/分批实时合并与展示

## 安装

1. 打开 Chrome/Edge 等 Chromium 内核浏览器，访问 扩展程序
   - Chrome：chrome://extensions
   - Edge：edge://extensions
2. 右上角开启「开发者模式」
3. 点击「加载已解压的扩展程序」
4. 选择本项目文件夹（包含 manifest.json 的目录）

安装完成后，点击工具栏图标打开弹窗界面（popup.html）。

## 权限说明

manifest_version: 3  
host_permissions: <all_urls>

- activeTab / tabs / windows：读取当前页信息、打开深度扫描窗口
- storage：保存扫描结果、深度扫描状态与自定义配置
- cookies：获取并保存当前站点 Cookie（用于请求鉴权）
- offscreen：在需要时使用离屏文档执行任务（offscreen.html/offscreen.js）
- declarativeNetRequest / declarativeNetRequestWithHostAccess：保留/扩展能力（规则式网络处理）
- content_scripts：注入扫描逻辑（content.js 及扫描模块）

所有数据默认保存在浏览器本地（chrome.storage.local），不对外发送。

## 快速上手

- 基础扫描
  1) 打开目标页面
  2) ![image-20250821110310737](.\icon\image-20250821110310737.png)2) !(图像- 20250821110310737)(\ \图标图像- 20250821110310737. png)
  3) 点击扩展图标打开弹窗，默认会显示当前域
  4) 点击「开始扫描」或等待自动扫描（首次或超过5分钟未扫描会静默触发）
  5) 结果按分类展示，可点击条目复制
  
- 深度递归扫描
  1) 切换至「深度扫描」页
  2) ![image-20250821110343528](.\icon\image-20250821110343528.png)2) !(图像- 20250821110343528)(\ \图标图像- 20250821110343528. png)
  3) 展开配置（最大深度、并发数、超时；可选：扫描 JS/HTML/API）
  4) 再次点击按钮启动，新窗口将执行分层递归扫描并实时更新结果
  5) 扫描完成后结果会自动合并保存并回显
  
- 批量 API 测试
  1. 切换至「API测试」页
  
  2. 选择请求方法及要测试的分类（如绝对路径API、相对路径API、JS/CSS/图片/URL/域名/路径）
  
  3. ![image-20250821110504483](.\icon\image-20250821110504483.png)3. !(图像- 20250821110504483)(\ \图标图像- 20250821110504483. png)
  
  4. 支持选择GET/POST请求方式来进行测试
  
  5. ![image-20250821110540077](.\icon\image-20250821110540077.png)5. !(图像- 20250821110540077)(\ \图标图像- 20250821110540077. png)
  
  6. 配置并发与超时，点击「批量请求测试」
  
  7. 在弹窗结果中排序，查看与复制
  
  8. ![image-20250821110622952](.\icon\image-20250821110622952.png)8. !(图像- 20250821110622952)(\ \图标图像- 20250821110622952. png)
  
  9. 支持预览响应
  
     ![image-20250821110716479](.\icon\image-20250821110716479.png)!(图像- 20250821110716479)(\ \图标图像- 20250821110716479. png)
  
- 导出数据
  1) 在「扫描」页点击「导出数据」
  2) ![image-20250821110747681](.\icon\image-20250821110747681.png)2) !(图像- 20250821110747681)(\ \图标图像- 20250821110747681. png)
  3) 选择导出为 JSON 或 Excel（.xls）
  4) ![image-20250821110810246](.\icon\image-20250821110810246.png)4) !(图像- 20250821110810246)(\ \图标图像- 20250821110810246. png)
  5) 文件名格式：域名__随机数，例如 example.com__123456.xls
  
- 设置（Cookie与正则）
  1) 切换至「设置」页
  2) Cookie：点击获取当前站点 Cookie 或手动粘贴保存
  3) 正则：按分类编辑后「保存配置」即时生效；可「恢复默认」

## 支持的数据分类（部分）

- API：absoluteApis
- 网络与资源：urls、domains、subdomains、ports、paths、parameters、jsFiles、cssFiles、images、audios、videos、vueFiles、githubUrls
- 身份与联络：emails、phoneNumbers、ipAddresses、companies
- 安全敏感：sensitiveKeywords、credentials、jwts、bearerTokens、basicAuth、authHeaders、wechatAppIds、awsKeys、googleApiKeys、githubTokens、gitlabTokens、webhookUrls、idCards、cryptoUsage
- 表单信息：forms、inputFields、hiddenFields
- 注释：comments

说明：实际输出在展示前做去重、数量限制与过滤，避免噪音。

## 深度扫描原理与限制

- 原理
  - 从当前页初始结果中收集候选 URL（JS/HTML/API）
  - 分层递归（最大深度可配），队列+并发 worker 处理，URL 内容经 PatternExtractor 提取- 分层递归（最大深度可配），队列 并发 worker 处理，URL 内容经 PatternExtractor 提取- 分层递归（最大深度可配），队列 并发 worker 处理，URL 内容经 PatternExtractor 提取- 分层递归（最大深度可配），队列 并发 worker 处理，URL 内容经 PatternExtractor 提取- 分层递归（最大深度可配），队列 并发 worker 处理，URL 内容经 PatternExtractor 提取- 分层递归（最大深度可配），队列 并发 worker 处理，URL 内容经 PatternExtractor 提取- 分层递归（最大深度可配），队列 并发 worker 处理，URL 内容经 PatternExtractor 提取- 分层递归（最大深度可配），队列 并发 worker 处理，URL 内容经 PatternExtractor 提取- 分层递归（最大深度可配），队列 并发 worker 处理，URL 内容经 PatternExtractor 提取- 分层递归（最大深度可配），队列 并发 worker 处理，URL 内容经 PatternExtractor 提取- 分层递归（最大深度可配），队列 并发 worker 处理，URL 内容经 PatternExtractor 提取- 分层递归（最大深度可配），队列 并发 worker 处理，URL 内容经 PatternExtractor 提取- 分层递归（最大深度可配），队列 并发 worker 处理，URL 内容经 PatternExtractor 提取- 分层递归（最大深度可配），队列 并发 worker 处理，URL 内容经 PatternExtractor 提取- 分层递归（最大深度可配），队列 并发 worker 处理，URL 内容经 PatternExtractor 提取- 分层递归（最大深度可配），队列 并发 worker 处理，URL 内容经 PatternExtractor 提取- 分层递归（最大深度可配），队列 并发 worker 处理，URL 内容经 PatternExtractor 提取- 分层递归（最大深度可配），队列 并发 worker 处理，URL 内容经 PatternExtractor 提取- 分层递归（最大深度可配），队列 并发 worker 处理，URL 内容经 PatternExtractor 提取- 分层递归（最大深度可配），队列 并发 worker 处理，URL 内容经 PatternExtractor 提取- 分层递归（最大深度可配），队列 并发 worker 处理，URL 内容经 PatternExtractor 提取- 分层递归（最大深度可配），队列 并发 worker 处理，URL 内容经 PatternExtractor 提取- 分层递归（最大深度可配），队列 并发 worker 处理，URL 内容经 PatternExtractor 提取- 分层递归（最大深度可配），队列 并发 worker 处理，URL 内容经 PatternExtractor 提取- 分层递归（最大深度可配），队列 并发 worker 处理，URL 内容经 PatternExtractor 提取- 分层递归（最大深度可配），队列 并发 worker 处理，URL 内容经 PatternExtractor 提取- 分层递归（最大深度可配），队列 并发 worker 处理，URL 内容经 PatternExtractor 提取- 分层递归（最大深度可配），队列 并发 worker 处理，URL 内容经 PatternExtractor 提取- 分层递归（最大深度可配），队列 并发 worker 处理，URL 内容经 PatternExtractor 提取- 分层递归（最大深度可配），队列 并发 worker 处理，URL 内容经 PatternExtractor 提取- 分层递归（最大深度可配），队列 并发 worker 处理，URL 内容经 PatternExtractor 提取- 分层递归（最大深度可配），队列 并发 worker 处理，URL 内容经 PatternExtractor 提取- 分层递归（最大深度可配），队列 并发 worker 处理，URL 内容经 PatternExtractor 提取- 分层递归（最大深度可配），队列 并发 worker 处理，URL 内容经 PatternExtractor 提取- 分层递归（最大深度可配），队列 并发 worker 处理，URL 内容经 PatternExtractor 提取- 分层递归（最大深度可配），队列 并发 worker 处理，URL 内容经 PatternExtractor 提取- 分层递归（最大深度可配），队列 并发 worker 处理，URL 内容经 PatternExtractor 提取- 分层递归（最大深度可配），队列 并发 worker 处理，URL 内容经 PatternExtractor 提取- 分层递归（最大深度可配），队列 并发 worker 处理，URL 内容经 PatternExtractor 提取- 分层递归（最大深度可配），队列 并发 worker 处理，URL 内容经 PatternExtractor 提取- 分层递归（最大深度可配），队列 并发 worker 处理，URL 内容经 PatternExtractor 提取- 分层递归（最大深度可配），队列 并发 worker 处理，URL 内容经 PatternExtractor 提取- 分层递归（最大深度可配），队列 并发 worker 处理，URL 内容经 PatternExtractor 提取- 分层递归（最大深度可配），队列 并发 worker 处理，URL 内容经 PatternExtractor 提取- 分层递归（最大深度可配），队列 并发 worker 处理，URL 内容经 PatternExtractor 提取- 分层递归（最大深度可配），队列 并发 worker 处理，URL 内容经 PatternExtractor 提取- 分层递归（最大深度可配），队列 并发 worker 处理，URL 内容经 PatternExtractor 提取- 分层递归（最大深度可配），队列 并发 worker 处理，URL 内容经 PatternExtractor 提取- 分层递归（最大深度可配），队列 并发 worker 处理，URL 内容经 PatternExtractor 提取- 分层递归（最大深度可配），队列 并发 worker 处理，URL 内容经 PatternExtractor 提取- 分层递归（最大深度可配），队列 并发 worker 处理，URL 内容经 PatternExtractor 提取- 分层递归（最大深度可配），队列 并发 worker 处理，URL 内容经 PatternExtractor 提取- 分层递归（最大深度可配），队列 并发 worker 处理，URL 内容经 PatternExtractor 提取- 分层递归（最大深度可配），队列 并发 worker 处理，URL 内容经 PatternExtractor 提取- 分层递归（最大深度可配），队列 并发 worker 处理，URL 内容经 PatternExtractor 提取- 分层递归（最大深度可配），队列 并发 worker 处理，URL 内容经 PatternExtractor 提取- 分层递归（最大深度可配），队列 并发 worker 处理，URL 内容经 PatternExtractor 提取- 分层递归（最大深度可配），队列 并发 worker 处理，URL 内容经 PatternExtractor 提取- 分层递归（最大深度可配），队列 并发 worker 处理，URL 内容经 PatternExtractor 提取- 分层递归（最大深度可配），队列 并发 worker 处理，URL 内容经 PatternExtractor 提取- 分层递归（最大深度可配），队列 并发 worker 处理，URL 内容经 PatternExtractor 提取- 分层递归（最大深度可配），队列 并发 worker 处理，URL 内容经 PatternExtractor 提取- 分层递归（最大深度可配），队列 并发 worker 处理，URL 内容经 PatternExtractor 提取- 分层递归（最大深度可配），队列 并发 worker 处理，URL 内容经 PatternExtractor 提取
  - 通过 background.js 代发请求（runtime.sendMessage: makeRequest），处理跨域、超时、类型与文本提取
  - 应用增强过滤器（域名/邮箱/手机号与 API），结果实时合并到 deepScanResults，并回显与持久化
  - 仅同域扫描（same-domain 策略），避免越权和噪音

- 配置建议
  - 最大深度 2~3，避免过度抓取
  - 并发 5~16 之间；超时 5~10 秒
  - 若目标需要授权访问，请先在设置中保存 Cookie

- 已做优化
  - URL 内容缓存、正则缓存、分层显示更新、Set 去重、分批持久化

## 数据持久化与清理

- 存储键（以域名为维度）
  - {hostname}__results：基础/最终结果
  - {hostname}__deepResults：深度扫描结果
  - {hostname}__deepBackup：深度结果备份
  - {hostname}__deepState：深度扫描运行状态（深度、并发、已扫 URL 等）
  - {hostname}__lastSave：最后保存时间戳
  - lastScan_{url}：自动扫描节流用

- 清理方式
  - 弹窗「扫描」页的「清空结果」用于当前域数据的清理
  - 代码包含全量清理逻辑（SettingsManager.clearAllData），默认界面未开启全量清空按钮
——!(图像- 20250821105956759)(\ \图标- 20250821105956759. png图像
## 自定义正则（Settings）

- 保存位置与生效链路
  - 保存 phantomRegexConfig 与 regexSettings 两份，保证兼容
  - PatternExtractor 在扫描/深度扫描前会 load/update 自定义规则并即时生效
- 可配置项（示例）
  - API / 域名 / 邮箱 / 手机号 / 敏感信息 / IP / 路径 / JWT / Bearer / Basic / Authorization / 微信AppID / AWS / Google API Key / GitHub/GitLab Token / Webhook / 加密调用 / GitHub 链接 / Vue 文件 / 公司名称 / 注释 等——!(图像- 20250821105956759)(\ \图标- 20250821105956759. png图像
- 校验
  - 保存前会对每条正则进行语法校验，失败会提示并中断保存

## 目录结构（摘录）-铬:Chrome:   铬:   铬: / /扩展
   -边缘:优势:/ /扩展
- manifest.json：扩展清单（MV3）
- background.js：后台脚本（代理请求、结果存储消息处理等）
- content.js：页面内容脚本（自动/增量扫描、提取与过滤）
- popup.html：扩展弹窗 UI（扫描、深度扫描、API 测试、设置、关于）-铬:Chrome:   铬:   铬:   铬: / /扩展
- src/main.js：应用入口与模块装配（ILoveYouTranslucent7）   -边缘:优势:/ /扩展
- src/scanner/   - src /扫描仪/
  - PatternExtractor.js / ContentExtractor.js / BasicScanner.js / DeepScanner.js / DeepScanWindow.js
- src/api/
  - ApiTester.js / TestWindow.js 等
- src/ui/   - src /洋葱/
  - DisplayManager.js（结果展示）-铬:Chrome:   铬:   铬:   铬: / /扩展-铬:Chrome:   铬:   铬:   铬: / /扩展-铬:Chrome:   铬:   铬: / /扩展
- src/utils/   - src /跑龙套   -边缘:优势:/ /扩展   -边缘:优势:/ /扩展
  - ExportManager.js（JSON/XLS 导出）
  - SettingsManager.js（Cookie/正则配置、全量清理）
- filters/   -过滤器/
  - domain-phone-filter.js（域名/邮箱/手机号增强过滤）
  - api-filter.js（API 路径增强过滤）

## 常见问题

- 扫描无结果或很少
  - 目标为系统页（chrome://、chrome-extension://）会被跳过
  - 页面首扫后 5 分钟内静默节流；可手动点「开始扫描」
  - 规则过严或错误：检查设置中的自定义正则；可恢复默认
- 深度扫描不生效/请求失败
  - 站点需要鉴权：先保存 Cookie 后再执行
  - 并发过高或超时过短：适度调小并发、调大超时
- Excel 打不开
  - 导出为 .xls（XML 工作簿）可直接用 Excel 打开；若提示编码，选择 UTF-8
- 性能建议
  - 复杂页面建议使用默认节流与深度参数，避免过高并发导致浏览器卡顿

## 安全与合规

- 工具仅用于授权范围内的安全测试与 SRC 场景自查，请勿用于非法用途
- 结果保存在本地 storage，不会自动对外发送
- 在进行深度扫描与批量请求时，请遵循目标站点策略与相关法律法规

## 版本与致谢

- 版本：1.6.2
- 作者：Phantom&yihuo
- 站点：
  - https://www.cn-fnst.top/
  - https://blog.h-acker.cn/
- 开源地址：请参考项目发布页
- 致谢:D3f4ultX
