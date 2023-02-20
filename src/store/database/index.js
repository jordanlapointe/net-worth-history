import { formatISO } from "date-fns";
import Dexie from "dexie";
import { populate } from "@pvermeer/dexie-populate-addon";
import { TYPE_ASSET, TYPE_LIABILITY } from "@/constants/account";
import { addMonthsIso } from "@/utilities/dates";

const database = new Dexie("appDatabase", {
  addons: [populate],
});

database.version(1).stores({
  accounts: "++id, institution, name, type",
  entries: "date, *balances => balances.id",
  balances: "++id, account => accounts.id, value",
  profiles: "++id, contribution, growthHigh, growthLow",
});

database.on("populate", function (transaction) {
  const todayIso = formatISO(new Date(), {
    representation: "date",
  });
  transaction.accounts.bulkPut([
    {
      id: 1,
      institution: "Credit Union",
      name: "Credit Card",
      type: TYPE_LIABILITY,
    },
    {
      id: 2,
      institution: "Local Bank",
      name: "Checking",
      type: TYPE_ASSET,
    },
    {
      id: 3,
      institution: "Acme Bank",
      name: "Savings",
      type: TYPE_ASSET,
    },
  ]);
  transaction.balances.bulkPut([
    {
      account: 1,
      id: 1,
      value: 25,
    },
    {
      account: 2,
      id: 2,
      value: 60,
    },
    {
      account: 3,
      id: 3,
      value: 200,
    },
    {
      account: 1,
      id: 4,
      value: 20,
    },
    {
      account: 2,
      id: 5,
      value: 70,
    },
    {
      account: 3,
      id: 6,
      value: 220,
    },
  ]);
  transaction.entries.bulkPut([
    {
      balances: [1, 2, 3],
      date: addMonthsIso(todayIso, -1),
    },
    {
      balances: [4, 5, 6],
      date: todayIso,
    },
  ]);
  transaction.profiles.put({
    contribution: 240,
    growthHigh: 6.7,
    growthLow: 4.7,
    id: 1,
  });
});

export default database;
