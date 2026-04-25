# BeatForge 部署指南 - Windows 服务器

## 快速部署（3步）

### 1. 复制文件
将 `deploy/` 文件夹整个复制到 Windows 服务器上任意目录，例如：
```
C:\BeatForge\
  ├── index.html
  └── start.bat
```

### 2. 启动服务
双击 `start.bat` 即可启动。

如果 Windows 没有 Python，先装一个：
- 下载：https://www.python.org/downloads/
- 安装时**必须勾选** "Add Python to PATH"

### 3. 手机访问
确保手机和服务器在同一局域网（同一个 WiFi / 有线网络），手机浏览器打开：
```
http://<服务器IP>:8080
```
bat 启动后会自动显示 IP 地址。

---

## 其他部署方式

### 方式二：Nginx（推荐，性能更好）
1. 下载 Nginx for Windows：http://nginx.org/en/download.html
2. 解压后，将 `index.html` 复制到 `html/` 目录
3. 修改 `conf/nginx.conf`：
```nginx
server {
    listen 8080;
    server_name _;
    root html;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```
4. 启动：`nginx.exe`
5. 停止：`nginx.exe -s quit`

### 方式三：IIS（Windows 自带）
1. 打开"控制面板" → "程序" → "启用或关闭 Windows 功能" → 勾选 IIS
2. 将 `index.html` 复制到 `C:\inetpub\wwwroot\`
3. 浏览器访问 `http://localhost/` 即可
4. 如需改端口，在 IIS 管理器中修改绑定端口

---

## 移动端优化说明

BeatForge 已针对实时演奏做了以下优化：
- ✅ `latencyHint: 'interactive'` - 音频上下文低延迟模式
- ✅ `touchstart` 事件替代 `click` - 消除 300ms 触摸延迟
- ✅ 禁止缩放 - 防止误触缩放
- ✅ PWA meta 标签 - 支持添加到主屏幕（全屏体验）
- ✅ `user-scalable=no` - 消除双击缩放

### iOS 额外建议
- 添加到主屏幕后可全屏运行，体验接近原生 App
- 设置 → Safari → 高级 → 关闭"阻止跨站跟踪"可减少音频中断

### Android 建议
- Chrome 中"添加到主屏幕"可全屏运行
- 关闭省电模式以获得最佳音频性能

---

## 网络配置

如需跨网段访问，需在 Windows 防火墙放行端口：

```powershell
# 放行 8080 端口（管理员 PowerShell）
netsh advfirewall firewall add rule name="BeatForge" dir=in action=allow protocol=tcp localport=8080
```

---

## 故障排查

| 问题 | 解决方案 |
|------|---------|
| 手机打不开页面 | 检查防火墙、确认同一网络、ping 服务器 IP |
| 没有声音 | 先点"开始创作"激活音频上下文（浏览器安全策略） |
| 延迟明显 | 关闭蓝牙耳机用有线/内置扬声器，关闭省电模式 |
| 触摸不灵敏 | 添加到主屏幕后体验更佳 |
