import { formatISO } from "date-fns";
import Dexie from "dexie";
import { populate } from "@pvermeer/dexie-populate-addon";
import { TYPE_ASSET, TYPE_LIABILITY } from "@/constants/account";

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
  transaction.accounts.bulkPut([
    {
      id: 1,
      institution: "Local Credit Union",
      name: "Credit Card",
      type: TYPE_LIABILITY,
    },
    {
      id: 2,
      institution: "Local Credit Union",
      name: "Checking",
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
      value: 100,
    },
  ]);
  transaction.entries.put({
    balances: [1, 2],
    date: formatISO(new Date(), {
      representation: "date",
    }),
  });
  transaction.profiles.put({
    contribution: 1000,
    growthHigh: 6.7,
    growthLow: 4.7,
    id: 1,
  });
});

export default database;
