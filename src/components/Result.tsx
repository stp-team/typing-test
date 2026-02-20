import { resetTest } from "helpers/resetTest";
import { useSelector } from "react-redux";
import { State } from "store/reducer";
import { useState } from "react";
import "stylesheets/Result.scss";

export default function Result() {
    const [copySuccess, setCopySuccess] = useState(false);
    const {
        word: { wordList, typedHistory, currWord },
        preferences: { timeLimit },
    } = useSelector((state: State) => state);
    const spaces = wordList.indexOf(currWord); // this assumes spaces before currWord are typed
    let correctChars = 0;
    let typedChars = 0;

    const result = typedHistory.map((typedWord, idx) => {
        typedChars += typedWord.length;
        if (typedWord === wordList[idx]) {
            correctChars += wordList[idx].length;
            return true;
        }
        return false;
    });

    const correctWords = result.filter((x) => x).length;
    const wpm = (correctWords * 60) / timeLimit;

    const cpm = ((correctChars + spaces) * 60) / timeLimit;
    const accuracy = typedChars > 0 ? (correctChars / typedChars) * 100 : 0;

    const incorrectWords = result.filter((x) => !x).length;

    const copyResult = async () => {
        const resultData = {
            cpm: Math.round(cpm),
            wpm: Math.round(wpm),
            accuracy: accuracy.toFixed(1),
            correctWords,
            incorrectWords,
            date: new Date().toISOString(),
            timeLimit,
        };

        const json = JSON.stringify(resultData);
        const base64 = btoa(json);

        try {
            if (navigator.clipboard) {
                await navigator.clipboard.writeText(base64);
            } else {
                // Fallback for older browsers or non-secure contexts
                const textarea = document.createElement("textarea");
                textarea.value = base64;
                textarea.style.position = "fixed";
                textarea.style.opacity = "0";
                document.body.appendChild(textarea);
                textarea.select();
                const successful = document.execCommand("copy");
                document.body.removeChild(textarea);
                if (!successful) throw new Error("execCommand failed");
            }
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 1000);
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    };

    return (
        <div className="result">
            <table>
                <tbody>
                    <tr>
                        <td colSpan={2} align="center">
                            <h1>{Math.round(cpm) + " символов в минуту"}</h1>
                        </td>
                    </tr>
                    <tr>
                        <th>Точность:</th>
                        <td>{accuracy.toFixed(1)}%</td>
                    </tr>
                    <tr>
                        <th>Слов в минуту:</th>
                        <td>{Math.round(wpm)}</td>
                    </tr>
                    <tr>
                        <th>Правильных слов:</th>
                        <td>{result.filter((x) => x).length}</td>
                    </tr>
                    <tr className="wrong">
                        <th>Неправильных слов:</th>
                        <td>{result.filter((x) => !x).length}</td>
                    </tr>
                    <tr>
                        <td colSpan={2} align="center">
                            <button onClick={() => resetTest()}>
                                Перезапуск
                            </button>
                        </td>
                    </tr>
                    <tr>
                        <td colSpan={2} align="center">
                            <button
                                onClick={copyResult}
                                className={copySuccess ? "success" : ""}>
                                Скопировать результат
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}
