function countVowelsAsync(word, resultCallback) {
  return new Promise((resolve, reject) => {
    if (typeof word !== 'string') {
      return reject(new Error('The first parameter should be a string'));
    }

    if (typeof resultCallback !== 'function') {
      return reject(new Error('The second parameter should be a function'));
    }

    const vowelsSet = new Set(['a', 'e', 'i', 'o', 'u']);
    let vowelCount = 0;

    setImmediate(() => {
      for (let char of word.toLowerCase()) {
        if (vowelsSet.has(char)) {
          vowelCount++;
        }
      }

      resultCallback(vowelCount);

      resolve(vowelCount);
    });
  });
}

//Usage:
countVowelsAsync("hello test 123abc", (result) => console.log(result))
  .then(res =>console.log(`It works! (${res})`) )
  .catch(err => console.log(`Failed - ${err}`));
