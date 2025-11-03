@echo off
echo 正在设置 Vue Org Chart 开发环境...

echo.
echo 1. 安装依赖...
pnpm install

echo.
echo 2. 构建组件库...
pnpm build

echo.
echo 3. 启动开发服务器...
echo 开发服务器将在 http://localhost:3000 启动
echo 按 Ctrl+C 停止服务器
echo.
pnpm dev
