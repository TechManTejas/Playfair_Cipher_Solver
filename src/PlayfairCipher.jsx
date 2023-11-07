import { useState } from 'react';

const PlayfairCipher = () => {
    const [plainText, setPlainText] = useState('THISISTEXT');
    const [key, setKey] = useState('TEJAS');
    const [cipherText, setCipherText] = useState('');
    const [explanation, setExplanation] = useState('');

    const handleEncrypt = () => {
        // Function to handle Playfair Cipher encryption with step-by-step explanation
        const encryptWithExplanation = (text, key) => {
            // Create the Playfair matrix
            const createMatrix = (key) => {
                key = key.replace(/ /g, '').toUpperCase();
                key = key.replace(/J/g, 'I'); // Replace 'J' with 'I'
                const alphabet = 'ABCDEFGHIKLMNOPQRSTUVWXYZ';
                const matrix = Array(5).fill().map(() => Array(5).fill(''));

                let row = 0;
                let col = 0;

                for (const char of key) {
                    matrix[row][col] = char;
                    const nextCol = col + 1;
                    if (nextCol < 5) {
                        col = nextCol;
                    } else {
                        col = 0;
                        row++;
                    }
                }

                for (const char of alphabet) {
                    if (!matrix.flat().includes(char)) {
                        matrix[row][col] = char;
                        const nextCol = col + 1;
                        if (nextCol < 5) {
                            col = nextCol;
                        } else {
                            col = 0;
                            row++;
                        }
                    }
                }

                let matrixString = '';
                for (let i = 0; i < 5; i++) {
                    matrixString += matrix[i].join(' ') + '\n';
                }

                return [matrix, matrixString];
            };

            // Prepare the text for encryption
            const prepareText = (text) => {
                text = text.replace(/ /g, '').toUpperCase();
                text = text.replace(/J/g, 'I');
                const digraphs = [];
                let i = 0;

                while (i < text.length) {
                    let digraph = text[i];
                    if (i + 1 < text.length) {
                        if (digraph.charAt(0) === text[i + 1]) {
                            digraph += 'X';
                            i++;
                        } else {
                            digraph += text[i + 1];
                            i += 2;
                        }
                    } else {
                        digraph += 'X';
                        i++;
                    }
                    digraphs.push(digraph);
                }

                return digraphs;
            };

            // Encrypt the prepared text
            const [matrix, matrixString] = createMatrix(key);
            const digraphs = prepareText(text);
            let result = '';
            let stepExplanation = '';

            for (const digraph of digraphs) {
                const [a, b] = digraph;
                let [aRow, aCol] = [0, 0];
                let [bRow, bCol] = [0, 0];
                let [aRowNew, aColNew] = [0, 0];
                let [bRowNew, bColNew] = [0, 0];
                let status = ""

                // Find the positions of the letters in the matrix
                for (let i = 0; i < 5; i++) {
                    for (let j = 0; j < 5; j++) {
                        if (matrix[i][j] === a) {
                            aRow = i;
                            aCol = j;
                        }
                        if (matrix[i][j] === b) {
                            bRow = i;
                            bCol = j;
                        }
                    }
                }

                // Encrypt the digraph
                if (aRow === bRow) {
                    status = "Case: Same Row"
                    aRowNew = aRow
                    aColNew = (aCol + 1) % 5
                    bRowNew = bRow
                    bColNew = (bCol + 1) % 5
                } else if (aCol === bCol) {
                    status = "Case: Same Column"
                    aRowNew = (aRow + 1) % 5
                    aColNew = aCol
                    bRowNew = (bRow + 1) % 5
                    bColNew = bCol
                } else {
                    status = "Case: Different Row & Column"
                    aRowNew = aRow
                    aColNew = bCol
                    bRowNew = bRow
                    bColNew = aCol
                }
                result += matrix[aRowNew][aColNew] + matrix[bRowNew][bColNew];

                stepExplanation += `Digraph: ${a}${b}\t\t\t\t${status}\n`;
                stepExplanation += `A: ${a}, B: ${b}\n`;
                stepExplanation += `OLD\t\t\t\t\t\tNEW\n`;
                stepExplanation += `A-Row: ${aRow}, A-Col: ${aCol}\t` + `\tA-Row: ${aRowNew}, A-Col: ${aColNew}\n`;
                stepExplanation += `B-Row: ${bRow}, B-Col: ${bCol}\t` + `\tB-Row: ${bRowNew}, B-Col: ${bColNew}\n`;;
                stepExplanation += `Result: ${result}\n\n`;
            }

            const explanation = <div>
                <div className='text-3xl m-3 text-blue-900'>
                    Step 1: Create Playfair Matrix
                </div>
                <div className='text-center font-bold text-3xl'>
                    {matrixString}
                </div>
                <div className='text-3xl m-3 text-blue-900'>
                    Step 2: Prepare Text
                </div>
                <div className='text-center font-bold text-3xl'>
                    {digraphs.join(' ')}
                </div>
                <div className='text-3xl m-3 text-blue-900'>
                    Step 3: Encrypt Text
                </div>
                <div className='font-thin text-3xl m-3'>
                    {stepExplanation}
                </div>
            </div>
            return [result, explanation];
        };

        // Call the encryption function with explanation
        const [result, explanation] = encryptWithExplanation(plainText, key);
        setCipherText(result);
        setExplanation(explanation);
    };

    return (
        <div>
            <h1 className='text-center text-4xl m-3'>Playfair Playground - Tejas Vaij & Raj Lokhande</h1>
            <div className="mb-4 flex justify-center">
                <input
                    className="border rounded-md py-2 px-3 w-1/2"
                    type="text"
                    placeholder="Enter Plain Text"
                    value={plainText}
                    onChange={(e) => setPlainText(e.target.value)}
                />
            </div>
            <div className="mb-4 flex justify-center">
                <input
                    className="border rounded-md py-2 px-3 w-1/2"
                    type="text"
                    placeholder="Enter Key"
                    value={key}
                    onChange={(e) => setKey(e.target.value)}
                />
            </div>
            <div className="flex justify-center">
                <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                    onClick={handleEncrypt}
                >
                    Encrypt
                </button>
            </div>
            <div className='text-center text-4xl m-3'>Cipher Text: <span className='font-black'>
                {cipherText}
            </span>
            </div>
            <div className='m-3'>
                <div className='text-4xl m-3'>Step-by-Step Explanation:</div>
                <pre>{explanation}</pre>
            </div>
        </div>
    );
};

export default PlayfairCipher;
