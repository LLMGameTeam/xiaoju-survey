# 快速测试指南 - 图片链接功能

## 🔧 已修复的问题

1. ✅ 支持 `@https://...` 和 `@ https://...` 两种格式（有无空格都可以）
2. ✅ 支持 HTML 实体编码的 `@` 符号（`&commat;`, `&#64;`, `&#x40;`）
3. ✅ 添加了详细的控制台调试日志
4. ✅ 支持所有常见图片格式（jpg, jpeg, png, gif, webp, svg）

## 🚀 快速测试步骤

### 1. 重新构建项目

```bash
cd web
npm run build
npm run dev
```

### 2. 清除浏览器缓存

在浏览器中按 `Ctrl + Shift + Delete` 或 `Cmd + Shift + Delete`，清除缓存后刷新页面。

或者使用硬刷新：`Ctrl + F5` (Windows) 或 `Cmd + Shift + R` (Mac)

### 3. 打开浏览器开发者工具

按 `F12` 打开开发者工具，切换到 **Console（控制台）** 标签页

### 4. 测试问卷主标题

1. 创建或编辑一个问卷
2. 点击主标题区域进行编辑
3. 输入以下内容（任选一种）：

**选项 A（无空格）**：
```
欢迎参加问卷 @https://via.placeholder.com/150x50/4A90E2/FFFFFF?text=Logo 调查
```

**选项 B（有空格）**：
```
欢迎参加问卷 @ https://via.placeholder.com/150x50/E74C3C/FFFFFF?text=Test 调查
```

**选项 C（用户的实际链接）**：
```
欢迎参加问卷 @https://pic-poivre.oss-cn-hangzhou.aliyuncs.com/pics/0fdde94dfec7d228a2fa067c368c0bb.png 调查
```

4. 点击保存或切换到其他区域
5. 查看控制台输出

### 5. 测试问题标题

1. 添加一个单选题或多选题
2. 在题目标题中输入：
```
您更喜欢哪个产品？@https://via.placeholder.com/200x100/3498DB/FFFFFF?text=Product 请选择
```

3. 保存后查看效果

### 6. 测试选项文本

1. 在单选题或多选题的选项中输入：
```
选项A @https://via.placeholder.com/100x100/2ECC71/FFFFFF?text=A
选项B @https://via.placeholder.com/100x100/F39C12/FFFFFF?text=B
```

2. 保存后查看效果

## 📊 预期的控制台输出

如果功能正常工作，你应该在控制台看到类似这样的输出：

```
[parseImageLinks] Original HTML: <p>欢迎参加问卷 @https://via.placeholder.com/150x50/4A90E2/FFFFFF?text=Logo 调查</p>
[parseImageLinks] Found match: @https://via.placeholder.com/150x50/4A90E2/FFFFFF?text=Logo  URL: https://via.placeholder.com/150x50/4A90E2/FFFFFF?text=Logo
[parseImageLinks] Result HTML: <p>欢迎参加问卷 <img src="https://via.placeholder.com/150x50/4A90E2/FFFFFF?text=Logo" class="inline-image" alt="image" /> 调查</p>
```

## ❓ 如果仍然不显示图片

### 检查项 1: URL 格式

确保 URL 满足以下条件：
- ✅ 以 `@` 开头（可选空格）
- ✅ 使用 `http://` 或 `https://` 协议
- ✅ 以图片扩展名结尾：`.jpg`, `.jpeg`, `.png`, `.gif`, `.webp`, `.svg`（大小写不敏感）

### 检查项 2: 查看控制台日志

1. 如果没有看到任何 `[parseImageLinks]` 日志：
   - 说明函数没有被调用
   - 检查是否正确重新构建了项目
   - 检查浏览器缓存是否清除

2. 如果看到 `Original HTML` 但没有 `Found match`：
   - 说明正则表达式没有匹配到内容
   - 检查 URL 格式是否正确
   - 查看 `Original HTML` 中的实际内容

3. 如果看到了 `Found match` 和 `Result HTML` 但图片不显示：
   - 说明解析成功但渲染失败
   - 检查图片 URL 是否可访问
   - 检查是否有 CORS 问题
   - 查看网络标签页是否有加载错误

### 检查项 3: 测试简单的 URL

使用最简单的测试 URL：
```
@https://via.placeholder.com/150
```

注意：这个 URL 没有文件扩展名，所以需要手动添加：
```
@https://via.placeholder.com/150.png
```

### 检查项 4: 检查元素 HTML

1. 右键点击标题区域 -> 检查元素
2. 查看实际的 HTML 内容
3. 应该看到 `<img src="..." class="inline-image" ... />`
4. 如果看到的是 `@https://...` 原始文本，说明解析没有生效

### 检查项 5: 使用测试页面

访问专门的测试页面：
```
http://localhost:5173/test-image-link.html
```

在这个页面中直接测试正则表达式和解析功能。

## 📸 测试用图片 URL

以下是一些可靠的测试图片 URL：

```
@https://via.placeholder.com/150x50/4A90E2/FFFFFF?text=Logo
@https://via.placeholder.com/100x100/E74C3C/FFFFFF?text=Icon
@https://via.placeholder.com/200x100/3498DB/FFFFFF?text=Banner
@https://via.placeholder.com/300x200/2ECC71/FFFFFF?text=Image
```

## 🐛 仍然无法解决？

请提供以下信息：

1. **浏览器控制台的完整输出**（特别是包含 `[parseImageLinks]` 的所有日志）
2. **你输入的完整内容**
3. **检查元素后看到的实际 HTML**（右键 -> 检查元素）
4. **浏览器和版本**（例如：Chrome 120, Firefox 121）
5. **任何错误消息的截图**

你可以通过以下方式复制控制台内容：
1. 在控制台中右键
2. 选择"Save as..." 或直接复制文本

## 💡 小提示

- 每次修改代码后，记得重新构建项目（`npm run build`）
- 每次刷新页面前，建议使用硬刷新（`Ctrl + F5`）
- 如果使用生产构建，确保运行 `npm run build` 而不是 `npm run dev`
- 图片链接必须是公开可访问的 URL
- 建议使用 CDN 托管的图片以获得更好的性能

---

最后更新：2025-11-07

