import { isValidIso } from "@/utilities/dates";
import { TYPE_ASSET, TYPE_LIABILITY } from "@/constants/account";

export const validateValue = (value, name, requirements) => {
  const { matches, type, validator } = requirements;
  const isMatched = matches ? matches.includes(value) : true;
  const isTypeValid = typeof value === type;
  const validatorPassed = validator ? validator(value, name) : true;
  if (!isMatched) {
    throw new Error(`"${name}" must be one of "${matches.join(", ")}"`);
  }
  if (!isTypeValid) {
    throw new Error(`"${name}" must be type "${type}"`);
  }
  if (!validatorPassed) {
    throw new Error(`"${name}" failed validator`);
  }
  return true;
};

export const validateObject = (object, schema) => {
  return Object.entries(schema).every(([key, requirements]) => {
    return validateValue(object[key], key, requirements);
  });
};

export const validateAccount = (account) => {
  const schema = {
    id: { type: "number" },
    institution: { type: "string" },
    name: { type: "string" },
    type: { matches: [TYPE_ASSET, TYPE_LIABILITY], type: "string" },
  };
  return validateObject(account, schema);
};

export const validateAccountWithoutId = (account) => {
  const schema = {
    institution: { type: "string" },
    name: { type: "string" },
    type: { matches: [TYPE_ASSET, TYPE_LIABILITY], type: "string" },
  };
  return validateObject(account, schema);
};

export const validateBalance = (balance) => {
  const schema = {
    account: { type: "number" },
    id: { type: "number" },
    value: { type: "number" },
  };
  return validateObject(balance, schema);
};

export const validateEntry = (entry) => {
  const schema = {
    date: { type: "string", validator: isValidIso },
    balances: { type: "object", validator: isValidNumberArray },
  };
  return validateObject(entry, schema);
};

export const validateDate = (date) => {
  const requirements = {
    type: "string",
    validator: isValidIso,
  };
  return validateValue(date, "date", requirements);
};

export const validateProfile = (balance) => {
  const schema = {
    contribution: { type: "number" },
    growthHigh: { type: "number" },
    growthLow: { type: "number" },
  };
  return validateObject(balance, schema);
};

function isValidNumberArray(array) {
  return array.every((value) => typeof value === "number");
}
