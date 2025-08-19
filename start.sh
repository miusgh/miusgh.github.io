#!/bin/bash

# 虚拟逗猫棒应用启动脚本

echo "🐱 虚拟逗猫棒应用启动中..."
echo "================================"

# 检查Python是否可用
if command -v python3 &> /dev/null; then
    echo "✅ 检测到Python3，使用Python启动服务器..."
    echo "🌐 服务器地址: http://localhost:8000"
    echo "📱 测试页面: http://localhost:8000/test.html"
    echo "🎮 主应用: http://localhost:8000/index.html"
    echo ""
    echo "按 Ctrl+C 停止服务器"
    echo "================================"
    python3 -m http.server 8000
elif command -v python &> /dev/null; then
    echo "✅ 检测到Python，使用Python启动服务器..."
    echo "🌐 服务器地址: http://localhost:8000"
    echo "📱 测试页面: http://localhost:8000/test.html"
    echo "🎮 主应用: http://localhost:8000/index.html"
    echo ""
    echo "按 Ctrl+C 停止服务器"
    echo "================================"
    python -m http.server 8000
elif command -v node &> /dev/null; then
    echo "✅ 检测到Node.js，使用http-server启动..."
    echo "🌐 服务器地址: http://localhost:8000"
    echo "📱 测试页面: http://localhost:8000/test.html"
    echo "🎮 主应用: http://localhost:8000/index.html"
    echo ""
    echo "按 Ctrl+C 停止服务器"
    echo "================================"
    npx http-server -p 8000
elif command -v php &> /dev/null; then
    echo "✅ 检测到PHP，使用PHP启动服务器..."
    echo "🌐 服务器地址: http://localhost:8000"
    echo "📱 测试页面: http://localhost:8000/test.html"
    echo "🎮 主应用: http://localhost:8000/index.html"
    echo ""
    echo "按 Ctrl+C 停止服务器"
    echo "================================"
    php -S localhost:8000
else
    echo "❌ 未检测到可用的服务器环境"
    echo "请安装以下任一环境："
    echo "  - Python 3: https://www.python.org/"
    echo "  - Node.js: https://nodejs.org/"
    echo "  - PHP: https://www.php.net/"
    echo ""
    echo "或者手动启动服务器："
    echo "  python3 -m http.server 8000"
    echo "  npx http-server -p 8000"
    echo "  php -S localhost:8000"
    exit 1
fi
