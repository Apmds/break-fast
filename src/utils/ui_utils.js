class UIUtils {
    static setJoysticksVisible(visible) {
        document.querySelectorAll('.joystick-container, .action-buttons').forEach(el => {
            el.classList.toggle('joystick-hidden', !visible);
        });
    }

    static showGetItemMenu(title, description, image) {
        const img = document.getElementById('item-image');
        if (img) img.src = image ?? '';

        const titleEl = document.querySelector('#get-item-menu .title');
        if (titleEl) titleEl.textContent = title ?? '';

        const descEl = document.querySelector('#get-item-menu .description');
        if (descEl) descEl.textContent = description ?? '';

        document.getElementById('get-item-menu')?.classList.remove('invisible');
        UIUtils.setJoysticksVisible(false);
    }

    static hideGetItemMenu() {
        document.getElementById('get-item-menu')?.classList.add('invisible');
        UIUtils.setJoysticksVisible(true);
    }

    static showEndMenu(item_paths) {
        UIUtils.setJoysticksVisible(false);
        document.getElementById("crossair").classList.remove("invisible");

        document.getElementById("end-menu").classList.remove("invisible");
        document.getElementById("end-menu-title").classList.remove("invisible");

        setTimeout(() => {
            document.getElementById("end-menu-subtitle").classList.remove("invisible");
            
            setTimeout(() => {
                for (let i = 0; i < item_paths.length; i++) {
                    const item_path = item_paths[i];

                    setTimeout(() => {
                        document.getElementById("end-menu-items").innerHTML += `
                        <img class="item-image" src="${item_path}" alt="">
                        `;
                    }, i*500);
                }
            }, 1000);

            setTimeout(() => {
                document.getElementById("end-button").classList.remove("invisible");
            }, 1000 + item_paths.length*500 + 500);
        }, 1000);
    }

    static hideEndMenu() {
        document.getElementById("end-menu").classList.add("invisible");
        document.getElementById("end-menu-title").classList.add("invisible");
        document.getElementById("end-menu-subtitle").classList.add("invisible");
        document.getElementById("end-menu-items").innerHTML = "";
        document.getElementById("end-button").classList.add("invisible");
    }

    static getEndMenuButton() {
        return document.getElementById("end-button");
    }
}

export default UIUtils;