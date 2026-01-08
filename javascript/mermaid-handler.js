/*
 * Mermaid Handler
 * - 支持在 Markdown 中渲染 Mermaid 图表（如 sequenceDiagram、flowchart 等）
 * - 在 Markdown 渲染完成后调用 renderMermaidDiagrams() 处理代码块
 */

(function () {
    // Mermaid 初始化配置
    if (typeof mermaid !== 'undefined') {
        mermaid.initialize({
            startOnLoad: false,
            theme: 'default',
            securityLevel: 'loose',
            sequence: {
                diagramMarginX: 50,
                diagramMarginY: 10,
                actorMargin: 50,
                width: 150,
                height: 65,
                boxMargin: 10,
                useMaxWidth: true
            }
        });
    } else {
        console.warn('Mermaid library not found.');
    }

    // 渲染 Mermaid 图表
    window.renderMermaidDiagrams = function () {
        if (typeof mermaid === 'undefined') {
            console.warn('Mermaid library not loaded, skipping diagram rendering.');
            return;
        }

        // 支持多种可能的 class 命名方式
        const codeBlocks = document.querySelectorAll(
            'pre code.language-mermaid, pre code.lang-mermaid, pre > code[class*="mermaid"]'
        );

        // 如果没有找到，尝试查找以 "mermaid" 开头内容的代码块
        let blocks = Array.from(codeBlocks);
        if (blocks.length === 0) {
            // 查找所有 pre > code，检查内容是否以 mermaid 关键字开头
            const allCodeBlocks = document.querySelectorAll('pre > code');
            allCodeBlocks.forEach((block) => {
                const text = block.textContent.trim();
                if (text.startsWith('sequenceDiagram') ||
                    text.startsWith('flowchart') ||
                    text.startsWith('graph') ||
                    text.startsWith('gantt') ||
                    text.startsWith('pie') ||
                    text.startsWith('classDiagram') ||
                    text.startsWith('stateDiagram') ||
                    text.startsWith('erDiagram') ||
                    text.startsWith('journey')) {
                    blocks.push(block);
                }
            });
        }

        if (blocks.length === 0) {
            return;
        }

        blocks.forEach((block) => {
            const container = document.createElement('div');
            container.className = 'mermaid';
            container.textContent = block.textContent;
            block.parentElement.replaceWith(container);
        });

        try {
            mermaid.run();
        } catch (err) {
            console.error('Mermaid rendering error:', err);
        }
    };
})();

