import Vue from "vue";
import VueRouter from "vue-router";
import NetWorth from "@/views/NetWorth.vue";
import Ledger from "@/views/Ledger.vue";
import Account from "@/views/Account.vue";
import AccountEdit from "@/views/AccountEdit.vue";
import Assumptions from "@/views/Assumptions.vue";
import Settings from "@/views/Settings.vue";
import Import from "@/views/Import.vue";
import "bootstrap-vue/dist/bootstrap-vue.css";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "net-worth",
    component: NetWorth,
  },
  {
    path: "/ledger",
    name: "ledger",
    component: Ledger,
  },
  {
    path: "/accounts/add/:category",
    name: "account-add",
    component: AccountEdit,
  },
  {
    path: "/accounts/:id",
    name: "account",
    component: Account,
  },
  {
    path: "/accounts/:id/edit",
    name: "account-edit",
    component: AccountEdit,
  },
  {
    path: "/settings",
    name: "settings",
    component: Settings,
  },
  {
    path: "/settings/assumptions",
    name: "settings-assumptions",
    component: Assumptions,
  },
  {
    path: "/settings/import",
    name: "settings-import",
    component: Import,
  },
  {
    path: "*",
    redirect: { name: "net-worth" },
  },
];

const router = new VueRouter({
  mode: "hash",
  routes,
});

export default router;
