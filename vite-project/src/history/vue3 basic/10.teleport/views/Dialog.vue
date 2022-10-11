<template>
   <div class="dialog">
        <header class="header">
            <div>我是弹框</div>
            <el-icon>
                <CloseBold />
            </el-icon>
        </header>
        <main class="main">
            我是内容12321321321
        </main>
        <footer class="footer">
            <el-button size="small">取消</el-button>
            <el-button size="small" type="primary">确定</el-button>
        </footer>
    </div>
</template>
<script setup lang="ts"></script>
<style scoped lang="less">
.dialog {
    width: 400px;
    height: 400px;
    background: #141414;
    display: flex;
    flex-direction: column;
    position: absolute;
    left: 50%;
    top: 50%;
    margin-left: -200px;
    margin-top: -200px;
 
    .header {
        display: flex;
        color: #CFD3DC;
        border-bottom: 1px solid #636466;
        padding: 10px;
        justify-content: space-between;
    }
 
    .main {
        flex: 1;
        color: #CFD3DC;
        padding: 10px;
    }
 
    .footer {
        border-top: 1px solid #636466;
        padding: 10px;
        display: flex;
        justify-content: flex-end;
    }
}
</style>