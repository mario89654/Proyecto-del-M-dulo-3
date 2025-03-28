document.addEventListener("DOMContentLoaded", () => {
    const previewBtn = document.querySelector("#previewBtn");
    const contrastBtn = document.querySelector("#contrastBtn");
    const clearBtn = document.querySelector("#clearBtn");
    const fileInput = document.querySelector("#fileInput");
    const loadFileBtn = document.querySelector("#loadFileBtn");
    const exportPdfBtn = document.querySelector("#exportPdfBtn");
    const cancelBtn = document.querySelector("#cancelBtn");
    const markdownInput = document.querySelector("#editor");
    const previewSection = document.querySelector("#preview");
    const charCount = document.querySelector("#charCount");
    
    let wordCount = document.createElement("p");
    wordCount.id = "wordCount";
    wordCount.classList.add("text-gray-500", "text-sm", "mt-1");
    charCount.insertAdjacentElement("afterend", wordCount);

    let exportTimeout = null;

    const editorPlaceholder = "Escribí tu código Markdown aquí...";
    const previewPlaceholder = "Vista previa de HTML";

    // Restaurar contenido del editor desde localStorage
    markdownInput.value = localStorage.getItem("markdownContent") || editorPlaceholder;
    if (markdownInput.value !== editorPlaceholder) {
        markdownInput.classList.remove("text-gray-500");
    }
    previewSection.innerHTML = localStorage.getItem("previewContent") || `<p class="text-gray-500 text-sm">${previewPlaceholder}</p>`;

    function updateCounts() {
        const text = markdownInput.value.trim();
        charCount.textContent = `Caracteres: ${text.length}`;
        wordCount.textContent = `Palabras: ${text ? text.split(/\s+/).filter(word => word.length > 0).length : 0}`;
    }

    function convertToHtml(markdown) {
        return marked.parse(markdown);
    }

    function renderPreview(htmlContent) {
        previewSection.innerHTML = htmlContent || `<p class="text-gray-500 text-sm">${previewPlaceholder}</p>`;
    }

    // Guardado automático en localStorage
    markdownInput.addEventListener("input", () => {
        updateCounts();
        renderPreview(convertToHtml(markdownInput.value));
        localStorage.setItem("markdownContent", markdownInput.value);
        localStorage.setItem("previewContent", previewSection.innerHTML);
    });

    clearBtn.addEventListener("click", () => {
        markdownInput.value = "";
        previewSection.innerHTML = `<p class="text-gray-500 text-sm">${previewPlaceholder}</p>`;
        localStorage.removeItem("markdownContent");
        localStorage.removeItem("previewContent");
        updateCounts();
    });

    // Cargar archivo Markdown
    loadFileBtn.addEventListener("click", () => fileInput.click());

    fileInput.addEventListener("change", async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        loadFileBtn.textContent = "Cargando...";
        try {
            const content = await file.text();
            markdownInput.value = content;
            updateCounts();
            renderPreview(convertToHtml(content));
        } catch (error) {
            alert("Error al leer el archivo");
        } finally {
            loadFileBtn.textContent = "Cargar Markdown";
        }
    });

    // Simular exportación a PDF con tiempo de espera
    exportPdfBtn.addEventListener("click", () => {
        exportPdfBtn.disabled = true;
        exportPdfBtn.textContent = "Exportando...";
        cancelBtn.classList.remove("hidden");

        const delay = Math.floor(Math.random() * 5000) + 1000; // Entre 1s y 6s
        exportTimeout = setTimeout(() => {
            alert("PDF exportado con éxito");
            exportPdfBtn.disabled = false;
            exportPdfBtn.textContent = "Exportar a PDF";
            cancelBtn.classList.add("hidden");
        }, delay);
    });

    // Cancelar operación de exportación
    cancelBtn.addEventListener("click", () => {
        if (exportTimeout) {
            clearTimeout(exportTimeout);
            exportPdfBtn.disabled = false;
            exportPdfBtn.textContent = "Exportar a PDF";
            alert("Operación cancelada");
            cancelBtn.classList.add("hidden");
        }
    });

    updateCounts();
});