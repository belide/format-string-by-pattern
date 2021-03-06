function formatStringByPattern(pattern, value) {
  if (!value) {
    return value;
  }

  const cleanValue = String(value).replace(/[^\da-zA-Z\n|]/g, '');
  const blockSizes = pattern
    .split(/[^\da-zA-Z\n|]/g)
    .filter(Boolean)
    .map(b => b.length);
  const separators = pattern.split(/[\da-zA-Z\n|]/g).filter(Boolean);
  const [firstSeparator] = separators;

  if (pattern.startsWith(firstSeparator)) {
    let curBlockSize;
    let beforeSlice;
    let afterSlice;
    let nextResult;

    const afterReduce = separators.reduce(
      (acc, cur, index) => {
        curBlockSize = blockSizes[index];
        beforeSlice = acc.value.slice(0, curBlockSize);
        afterSlice = acc.value.slice(curBlockSize);
        nextResult = beforeSlice
          ? acc.result.concat(cur, beforeSlice)
          : acc.result;

        return {
          result: nextResult,
          value: afterSlice,
        };
      },
      {
        result: '',
        value: cleanValue,
      }
    );

    return afterReduce.result.slice(0, pattern.length);
  }

  let curSeparator;
  let replace;
  let curSlice;
  let curRegex;
  let curValue;

  const afterReduce = blockSizes.reduce(
    (acc, cur, index) => {
      curSeparator = separators[index] || '';
      replace = `$1${curSeparator}$2`;
      curSlice = cur + acc.prevSlice + acc.prevSeparator.length;
      curRegex = new RegExp(`(.{${curSlice}})(.)`);
      curValue = acc.value.replace(curRegex, replace);

      return {
        prevSeparator: curSeparator,
        prevSlice: curSlice,
        value: curValue,
      };
    },
    {
      prevSeparator: '',
      prevSlice: 0,
      value: cleanValue,
    }
  );

  return afterReduce.value.slice(0, pattern.length);
}

module.exports = (pattern, value) =>
  value
    ? formatStringByPattern(pattern, value)
    : curriedValue => formatStringByPattern(pattern, curriedValue);
