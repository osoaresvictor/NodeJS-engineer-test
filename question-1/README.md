
# Function Documentation: `countVowelsAsync`

## Overview

`countVowelsAsync` is an asynchronous function that counts the number of vowels in a given word and returns the result through a callback function. The function returns a promise that resolves with the vowel count.

## Function Signature

```javascript
function countVowelsAsync(word, resultCallback)
```

### Parameters

- `word` (string): The word in which vowels are to be counted. This parameter must be a string.
- `resultCallback` (function): A callback function that will be called with the result of the vowel count. This parameter must be a function.

### Returns

- `Promise<number>`: A promise that resolves with the number of vowels in the given word.

## Description

The `countVowelsAsync` function performs the following steps:

1. **Input Validation**:
   - Checks if the `word` parameter is a string. If not, it rejects the promise with an error message.
   - Checks if the `resultCallback` parameter is a function. If not, it rejects the promise with an error message.

2. **Vowel Counting**:
   - Initializes a `Set` containing the vowels `['a', 'e', 'i', 'o', 'u']`.
   - Converts the word to lowercase and iterates through each character to count the vowels.

3. **Asynchronous Execution**:
   - Uses `setImmediate` to defer the vowel counting operation, allowing other I/O events to be processed.
   - Calls the `resultCallback` function with the vowel count.

4. **Promise Resolution**:
   - Resolves the promise with the vowel count.

## Example Usage

```javascript
countVowelsAsync("hello test 123abc", (result) => console.log(result))
  .then(res => console.log(`It works! (${res})`))
  .catch(err => console.log(`Failed - ${err}`));
```

### Output

```
5
It works! (5)
```

## Error Handling

- If the `word` parameter is not a string, the promise is rejected with an error: `The first parameter should be a string`.
- If the `resultCallback` parameter is not a function, the promise is rejected with an error: `The second parameter should be a function`.

## Detailed Example

Below is a detailed example demonstrating the usage of `countVowelsAsync`:

```javascript
// Define a word to count vowels in
const word = "example word";

// Define a callback function to handle the result
function handleResult(result) {
  console.log(`Number of vowels: ${result}`);
}

// Call the countVowelsAsync function
countVowelsAsync(word, handleResult)
  .then(res => console.log(`Promise resolved with: ${res}`))
  .catch(err => console.error(`Promise rejected with error: ${err.message}`));

// Output:
// Number of vowels: 4
// Promise resolved with: 4
```

In this example:
- The word "example word" contains 4 vowels.
- The `handleResult` function logs the number of vowels to the console.
- The promise resolves with the count of 4 and logs the resolution message.
