
const themeToggle = document.getElementById("themeToggle");

try {
    if (localStorage.getItem("toolbox-theme") === "dark") {
        document.body.classList.add("dark");
    }
} catch (e) {}

function updateTheme() {
    if (!themeToggle) return;

    const dark = document.body.classList.contains("dark");
    themeToggle.textContent = dark ? "☀️" : "🌙";
}

updateTheme();

if (themeToggle) {
    themeToggle.addEventListener("click", () => {
        document.body.classList.toggle("dark");

        try {
            localStorage.setItem(
                "toolbox-theme",
                document.body.classList.contains("dark")
                    ? "dark"
                    : "light"
            );
        } catch (e) {}

        updateTheme();
    });
}

// Поиск и категории

const search = document.getElementById("search");
const cards = document.querySelectorAll(".card");
const categories = document.querySelectorAll(".category");

let activeCategory = "Все";

function filterTools() {
    const query = search ? search.value.toLowerCase() : "";

    cards.forEach(card => {
        const matchesText =
            card.textContent.toLowerCase().includes(query);

        const matchesCategory =
            activeCategory === "Все" ||
            card.dataset.category === activeCategory;

        card.hidden = !(matchesText && matchesCategory);
    });
}

if (search) {
    search.addEventListener("input", filterTools);
}

categories.forEach(button => {
    button.addEventListener("click", () => {
        categories.forEach(b => b.classList.remove("active"));
        button.classList.add("active");
        activeCategory = button.dataset.category;
        filterTools();
    });
});

// Общие функции

function val(id) {
    return document.getElementById(id).value;
}

function show(value) {
    document.getElementById("result").textContent = String(value);
}

function numbers() {
    const a = val("a");
    const b = val("b");

    if (a.trim() === "" || b.trim() === "") {
        throw new Error("Заполните оба поля");
    }

    const x = Number(a);
    const y = Number(b);

    if (!Number.isFinite(x) || !Number.isFinite(y)) {
        throw new Error("Введите корректные числа");
    }

    return [x, y];
}

function run(fn) {
    try {
        fn();
    } catch (error) {
        show("Ошибка: " + error.message);
    }
}

// Генератор паролей

function toolPassword() {
    run(() => {
        const length = Number(val("length"));

        if (!Number.isInteger(length) || length < 8 || length > 128) {
            throw new Error("Длина должна быть от 8 до 128");
        }

        const chars =
            "ABCDEFGHIJKLMNOPQRSTUVWXYZ" +
            "abcdefghijklmnopqrstuvwxyz" +
            "0123456789!@#$%^&*";

        const bytes = new Uint8Array(length);
        let password = "";

        const limit = Math.floor(256 / chars.length) * chars.length;

        while (password.length < length) {
            crypto.getRandomValues(bytes);

            for (const byte of bytes) {
                if (byte >= limit) continue;

                password += chars[byte % chars.length];

                if (password.length === length) break;
            }
        }

        show(password);
    });
}

// Подсчёт символов

function toolCharacters() {
    const text = val("text");

    const characters = [...text].length;
    const words = text.trim()
        ? text.trim().split(/\s+/u).length
        : 0;

    show(`Символов: ${characters} | Слов: ${words}`);
}

// Проценты

function toolPercent() {
    run(() => {
        const [a, b] = numbers();
        show((a * b / 100).toLocaleString("ru-RU"));
    });
}

// Скидки

function toolDiscount() {
    run(() => {
        const [a, b] = numbers();

        if (a < 0 || b < 0 || b > 100) {
            throw new Error("Проверьте цену и скидку");
        }

        show(
            (a * (1 - b / 100)).toLocaleString("ru-RU") + " ₽"
        );
    });
}

// Регистр текста

function toolUpper() {
    show(val("text").toUpperCase());
}

function toolLower() {
    show(val("text").toLowerCase());
}

// Удаление дубликатов

function toolDuplicates() {
    const lines = val("text").split(/\r?\n/);
    show([...new Set(lines)].join("\n"));
}

// Лишние пробелы

function toolSpaces() {
    show(
        val("text")
            .replace(/[^\S\r\n]+/g, " ")
            .replace(/ *\n */g, "\n")
            .trim()
    );
}

// Случайное число

function toolRandom() {
    run(() => {
        const [min, max] = numbers();

        if (!Number.isSafeInteger(min) ||
            !Number.isSafeInteger(max) ||
            min > max) {
            throw new Error("Введите целые числа: минимум ≤ максимум");
        }

        const range = max - min + 1;

        if (!Number.isSafeInteger(range) || range <= 0 ||
            range > 4294967296) {
            throw new Error("Диапазон слишком большой");
        }

        const maxUint = 4294967296;
        const limit = Math.floor(maxUint / range) * range;
        const buffer = new Uint32Array(1);

        let value;

        do {
            crypto.getRandomValues(buffer);
            value = buffer[0];
        } while (value >= limit);

        show(min + (value % range));
    });
}

// Возраст

function toolAge() {
    run(() => {
        const birth = val("birth");

        if (!birth) {
            throw new Error("Выберите дату рождения");
        }

        const parts = birth.split("-").map(Number);
        const [year, month, day] = parts;

        const date = new Date(year, month - 1, day);

        if (date.getFullYear() !== year ||
            date.getMonth() !== month - 1 ||
            date.getDate() !== day) {
            throw new Error("Некорректная дата");
        }

        const today = new Date();

        if (date > today) {
            throw new Error("Дата рождения в будущем");
        }

        let age = today.getFullYear() - year;

        if (
            today.getMonth() + 1 < month ||
            (today.getMonth() + 1 === month &&
             today.getDate() < day)
        ) {
            age--;
        }

        show("Возраст: " + age);
    });
}

// JSON

function toolJSON() {
    run(() => {
        const object = JSON.parse(val("text"));
        show(JSON.stringify(object, null, 2));
    });
}

// Base64 с поддержкой русского текста

function toolBase64Encode() {
    run(() => {
        const bytes = new TextEncoder().encode(val("text"));
        let binary = "";

        for (const byte of bytes) {
            binary += String.fromCharCode(byte);
        }

        show(btoa(binary));
    });
}

function toolBase64Decode() {
    run(() => {
        const binary = atob(val("text").trim());

        const bytes = Uint8Array.from(
            binary,
            char => char.charCodeAt(0)
        );

        show(
            new TextDecoder("utf-8", {fatal: true}).decode(bytes)
        );
    });
}

// HEX → RGB

function toolColor() {
    const hex = val("color");

    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);

    show(`${hex.toUpperCase()} | RGB(${r}, ${g}, ${b})`);
}


// ==========================================
// TOOLBOX 4.0
// ==========================================

// НДС

function toolVAT() {
    run(() => {
        const [amount, rate] = numbers();

        if (amount < 0 || rate < 0 || rate > 100) {
            throw new Error("Проверьте сумму и ставку");
        }

        const vat = amount * rate / 100;
        const total = amount + vat;

        show(
            "НДС: " + vat.toFixed(2) + " ₽\n" +
            "Сумма с НДС: " + total.toFixed(2) + " ₽"
        );
    });
}

// Сортировка строк

function toolSort() {
    const lines = val("text").split(/\r?\n/);

    lines.sort((a, b) =>
        a.localeCompare(b, "ru")
    );

    show(lines.join("\n"));
}

// Переворот текста

function toolReverse() {
    show(
        Array.from(val("text")).reverse().join("")
    );
}

// Поиск и замена

function toolReplace() {
    run(() => {
        const text = val("text");
        const find = val("find");
        const replacement = val("replace");

        if (!find) {
            throw new Error("Введите текст для поиска");
        }

        show(text.replaceAll(find, replacement));
    });
}

// Генератор UUID

function toolUUID() {
    run(() => {
        if (!crypto.randomUUID) {
            throw new Error(
                "UUID недоступен в этом браузере. " +
                "Откройте сайт через HTTPS."
            );
        }

        show(crypto.randomUUID());
    });
}

// URL-кодирование

function toolURLEncode() {
    show(encodeURIComponent(val("text")));
}

function toolURLDecode() {
    run(() => {
        show(decodeURIComponent(val("text")));
    });
}

// HTML-экранирование

function toolHTMLEncode() {
    const text = val("text");

    const encoded = text
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#39;");

    show(encoded);
}

// HTML-декодирование

function toolHTMLDecode() {
    const textarea = document.createElement("textarea");

    textarea.innerHTML = val("text");

    show(textarea.value);
}

// Генератор UTM

function toolUTM() {
    run(() => {
        const address = val("utmUrl").trim();

        if (!address) {
            throw new Error("Введите адрес сайта");
        }

        const url = new URL(address);

        if (!["http:", "https:"].includes(url.protocol)) {
            throw new Error("Используйте http или https");
        }

        const source = val("utmSource").trim();
        const medium = val("utmMedium").trim();
        const campaign = val("utmCampaign").trim();

        if (!source || !medium || !campaign) {
            throw new Error("Заполните все UTM-поля");
        }

        url.searchParams.set("utm_source", source);
        url.searchParams.set("utm_medium", medium);
        url.searchParams.set("utm_campaign", campaign);

        show(url.toString());
    });
}

