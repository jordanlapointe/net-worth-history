export function valueToDollarsAbbreviated(value) {
  const number = valueToNumber(value);
  const valueWithNotation = Intl.NumberFormat("en", {
    notation: "compact",
  }).format(number);
  return valueWithNotation.toLowerCase();
}

export function valueToDollarsFormatted(value) {
  const number = valueToNumber(value);
  if (!value || !number) {
    return "0.00";
  }
  return Intl.NumberFormat("en", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  }).format(value);
}

export function valueToNumber(value) {
  const isNumber = typeof value === "number";
  const isString = typeof value === "string";
  if (value === "Infinite") {
    return 0;
  }
  if (isNumber) {
    const isNaN = Number.isNaN(value);
    return isNaN ? 0 : value;
  }
  if (isString) {
    const valueWithoutCommas = value.replace(",", "");
    const valueNumeric = Number(valueWithoutCommas);
    const isNaN = Number.isNaN(valueNumeric);
    return isNaN ? 0 : valueNumeric;
  }
  return 0;
}
