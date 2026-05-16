class UIUtils {
    static showGetItemMenu(title, description, image) {
        const img = document.getElementById('item-image');
        if (img) img.src = image ?? '';

        const titleEl = document.querySelector('#get-item-menu .title');
        if (titleEl) titleEl.textContent = title ?? '';

        const descEl = document.querySelector('#get-item-menu .description');
        if (descEl) descEl.textContent = description ?? '';

        document.getElementById('get-item-menu')?.classList.remove('invisible');
    }

    static hideGetItemMenu() {
        document.getElementById('get-item-menu')?.classList.add('invisible');
    }
}

export default UIUtils;