// =====================================
// TOOLBOX — ОСНОВНЫЕ ФУНКЦИИ
// =====================================


// 1. СВЕТЛАЯ И ТЁМНАЯ ТЕМЫ

const themeToggle = document.getElementById("themeToggle");

function updateThemeButton() {
    const isDark = document.body.classList.contains("dark");

    themeToggle.textContent = isDark ? "☀️" : "🌙";

    themeToggle.setAttribute(
        "aria-label",
        isDark ? "Включить светлую тему" : "Включить тёмную тему"
    );
}

try {
    const savedTheme = localStorage.getItem("toolbox-theme");

    if (savedTheme === "dark") {
        document.body.classList.add("dark");
    }
} catch (error) {
    console.log("Настройки темы недоступны");
}

updateThemeButton();

themeToggle.addEventListener("click", function () {

    document.body.classList.toggle("dark");

    const theme = document.body.classList.contains("dark")
        ? "dark"
        : "light";

    try {
        localStorage.setItem("toolbox-theme", theme);
    } catch (error) {
        console.log("Не удалось сохранить тему");
    }

    updateThemeButton();
});


// =====================================
// 2. ПОИСК И КАТЕГОРИИ
// =====================================

const searchInput = document.getElementById("searchInput");

const cards = document.querySelectorAll(".tool-card");

const categoryButtons = document.querySelectorAll(".category");

const noResults = document.getElementById("noResults");

let activeCategory = "all";

function filterTools() {

    const search = searchInput.value.toLowerCase().trim();

    let visibleCount = 0;

    cards.forEach(function (card) {

        const text = (
            card.querySelector("h3").textContent + " " +
            card.querySelector("p").textContent
        ).toLowerCase();

        const category = card.dataset.category;

        const matchesSearch = text.includes(search);

        const matchesCategory =
            activeCategory === "all" ||
            category === activeCategory;

        const shouldShow = matchesSearch && matchesCategory;

        card.hidden = !shouldShow;

        if (shouldShow) {
            visibleCount++;
        }

    });

    noResults.hidden = visibleCount !== 0;
}

searchInput.addEventListener("input", filterTools);

categoryButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        categoryButtons.forEach(function (btn) {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        activeCategory = button.dataset.category;

        filterTools();

    });

});


// =====================================
// 3. ГЕНЕРАТОР ПАРОЛЕЙ
// =====================================

const generatePasswordButton =
    document.getElementById("generatePasswordButton");

generatePasswordButton.addEventListener("click", function () {

    const length = Number(
        document.getElementById("passwordLength").value
    );

    const chars =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZ" +
        "abcdefghijklmnopqrstuvwxyz" +
        "0123456789" +
        "!@#$%^&*";

    let password = "";

    // Используем криптографически стойкий генератор.
    // Отбрасываем значения, создающие смещение распределения.

    const randomBytes = new Uint8Array(length);

    const limit = Math.floor(256 / chars.length) * chars.length;

    while (password.length < length) {

        crypto.getRandomValues(randomBytes);

        for (const value of randomBytes) {

            if (value >= limit) {
                continue;
            }

            password += chars[value % chars.length];

            if (password.length === length) {
                break;
            }
        }
    }

    document.getElementById("passwordResult").textContent =
        password;

});


// =====================================
// 4. СЧЁТЧИК СИМВОЛОВ
// =====================================

const textInput = document.getElementById("textInput");

textInput.addEventListener("input", function () {

    const text = textInput.value;

    const characters = [...text].length;

    const words = text.trim() === ""
        ? 0
        : text.trim().split(/\s+/u).length;

    document.getElementById("textResult").textContent =
        "Символов: " + characters +
        " | Слов: " + words;

});


// =====================================
// 5. КАЛЬКУЛЯТОР ПРОЦЕНТОВ
// =====================================

const calculateButton = document.getElementById("calculateButton");

calculateButton.addEventListener("click", function () {

    const numberValue =
        document.getElementById("numberInput").value;

    const percentValue =
        document.getElementById("percentInput").value;

    const resultElement =
        document.getElementById("percentResult");

    if (numberValue.trim() === "" ||
        percentValue.trim() === "") {

        resultElement.textContent =
            "Введите число и процент";

        return;
    }

    const number = Number(numberValue);
    const percent = Number(percentValue);

    if (!Number.isFinite(number) ||
        !Number.isFinite(percent)) {

        resultElement.textContent =
            "Введите корректные числа";

        return;
    }

    const result = number * percent / 100;

    resultElement.textContent =
        "Результат: " +
        result.toLocaleString("ru-RU", {
            maximumFractionDigits: 10
        });

});