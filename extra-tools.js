
function toolboxRun(id) {
    const inputA = document.getElementById("inputA").value;
    const inputB = document.getElementById("inputB").value;
    const result = document.getElementById("result");

    function number(value) {
        if (value.trim() === "") {
            throw new Error("Введите число");
        }

        const n = Number(value);

        if (!Number.isFinite(n)) {
            throw new Error("Некорректное число");
        }

        return n;
    }

    function lines() {
        return inputA.split(/\r?\n/);
    }

    function numbers() {
        const values = inputA
            .split(/[\s,;]+/)
            .filter(Boolean)
            .map(Number);

        if (!values.length || values.some(
            n => !Number.isFinite(n)
        )) {
            throw new Error("Введите числа через пробел");
        }

        return values;
    }

    function format(n) {
        if (!Number.isFinite(n)) {
            throw new Error("Результат вне допустимого диапазона");
        }
        return String(Number(n.toPrecision(12)));
    }

    function randomInt(max) {
        const data = new Uint32Array(1);
        const range = 4294967296;
        const limit = Math.floor(range / max) * max;

        do {
            crypto.getRandomValues(data);
        } while (data[0] >= limit);

        return data[0] % max;
    }

    try {
        let output = "";

        switch (id) {

            case "line-count":
                output = "Строк: " + (
                    inputA ? lines().length : 0
                );
                break;

            case "reverse-lines":
                output = lines().reverse().join("\n");
                break;

            case "trim-lines":
                output = lines().map(
                    x => x.trim()
                ).join("\n");
                break;

            case "remove-empty":
                output = lines().filter(
                    x => x.trim() !== ""
                ).join("\n");
                break;

            case "number-lines":
                output = lines().map(
                    (x, i) => `${i + 1}. ${x}`
                ).join("\n");
                break;

            case "prefix-lines":
                output = lines().map(
                    x => inputB + x
                ).join("\n");
                break;

            case "suffix-lines":
                output = lines().map(
                    x => x + inputB
                ).join("\n");
                break;

            case "tabs-spaces":
                output = inputA.replace(/\t/g, "    ");
                break;

            case "word-frequency": {
                const words = inputA.toLowerCase()
                    .match(/[\p{L}\p{N}]+/gu) || [];

                const counts = new Map();

                words.forEach(word => {
                    counts.set(
                        word,
                        (counts.get(word) || 0) + 1
                    );
                });

                output = [...counts.entries()]
                    .sort((a, b) => b[1] - a[1])
                    .map(x => `${x[0]}: ${x[1]}`)
                    .join("\n");
                break;
            }

            case "square":
                output = format(number(inputA) ** 2);
                break;

            case "sqrt": {
                const n = number(inputA);
                if (n < 0) throw new Error(
                    "Число должно быть неотрицательным"
                );
                output = format(Math.sqrt(n));
                break;
            }

            case "power":
                output = format(
                    number(inputA) ** number(inputB)
                );
                break;

            case "average": {
                const values = numbers();
                output = format(
                    values.reduce((a, b) => a + b, 0)
                    / values.length
                );
                break;
            }

            case "median": {
                const values = numbers().sort(
                    (a, b) => a - b
                );

                const mid = Math.floor(values.length / 2);

                output = format(
                    values.length % 2
                    ? values[mid]
                    : (values[mid - 1] + values[mid]) / 2
                );
                break;
            }

            case "bmi": {
                const weight = number(inputA);
                const height = number(inputB) / 100;

                if (weight <= 0 || height <= 0) {
                    throw new Error(
                        "Вес и рост должны быть больше нуля"
                    );
                }

                output = "ИМТ: " +
                    format(weight / (height * height));

                break;
            }

            case "temperature": {
                const c = number(inputA);
                output = format(c * 9 / 5 + 32) + " °F";
                break;
            }

            case "km-miles":
                output = format(
                    number(inputA) * 0.6213711922
                ) + " миль";
                break;

            case "miles-km":
                output = format(
                    number(inputA) * 1.609344
                ) + " км";
                break;

            case "percent-change": {
                const oldValue = number(inputA);
                const newValue = number(inputB);

                if (oldValue === 0) {
                    throw new Error(
                        "Начальное значение не может быть нулём"
                    );
                }

                output = format(
                    (newValue - oldValue)
                    / Math.abs(oldValue) * 100
                ) + "%";
                break;
            }

            case "utf8-bytes":
                output = "Байт: " +
                    new TextEncoder().encode(inputA).length;
                break;

            case "binary-decimal": {
                const text = inputA.trim();

                if (!/^[01]+$/.test(text)) {
                    throw new Error("Введите двоичное число");
                }

                output = BigInt("0b" + text).toString(10);
                break;
            }

            case "decimal-binary": {
                const text = inputA.trim();

                if (!/^-?\d+$/.test(text)) {
                    throw new Error("Введите целое число");
                }

                output = BigInt(text).toString(2);
                break;
            }

            case "hex-decimal": {
                const text = inputA.trim()
                    .replace(/^0x/i, "");

                if (!/^[0-9a-f]+$/i.test(text)) {
                    throw new Error("Введите HEX-число");
                }

                output = BigInt("0x" + text).toString(10);
                break;
            }

            case "unix-date": {
                const seconds = number(inputA);

                const date = new Date(seconds * 1000);

                if (Number.isNaN(date.getTime())) {
                    throw new Error("Некорректная дата");
                }

                output = date.toLocaleString("ru-RU");
                break;
            }

            case "coin":
                output = randomInt(2)
                    ? "Орёл"
                    : "Решка";
                break;

            case "dice":
                output = "Выпало: " + (randomInt(6) + 1);
                break;

            case "random-choice": {
                const choices = lines().filter(
                    x => x.trim()
                );

                if (!choices.length) {
                    throw new Error(
                        "Введите варианты, каждый с новой строки"
                    );
                }

                output = choices[randomInt(choices.length)];
                break;
            }

            default:
                throw new Error("Неизвестный инструмент");
        }

        result.textContent = output;

    } catch (error) {
        result.textContent = "Ошибка: " + error.message;
    }
}

async function toolboxHash() {
    const result = document.getElementById("result");
    const text = document.getElementById("inputA").value;

    try {
        if (!crypto.subtle) {
            throw new Error(
                "Для SHA-256 откройте сайт через HTTPS"
            );
        }

        const data = new TextEncoder().encode(text);

        const hash = await crypto.subtle.digest(
            "SHA-256",
            data
        );

        result.textContent = Array.from(
            new Uint8Array(hash)
        ).map(
            x => x.toString(16).padStart(2, "0")
        ).join("");

    } catch (error) {
        result.textContent = "Ошибка: " + error.message;
    }
}
