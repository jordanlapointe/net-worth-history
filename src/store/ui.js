import { format, parseISO } from "date-fns";
import { enUS } from "date-fns/locale";
import merge from "lodash/merge";
import { make } from "vuex-pathify";
import {
  valueToDollarsAbbreviated,
  valueToDollarsFormatted,
} from "@/utilities/currency";

const state = {
  accountFilter: "",
  colors: {
    black: "",
    dark: "",
    info: "",
    light: "",
    primary: "",
    secondary: "",
    white: "",
  },
  isDarkMode: window.matchMedia("(prefers-color-scheme: dark)").matches,
};

const getters = {
  ...make.getters(state),
  // getterName(state, getters, rootGetters) {
  //   return 'value';
  // },
  chartOptions({ colors }) {
    return {
      adapters: {
        date: {
          locale: enUS,
        },
      },
      animation: {
        duration: 600,
      },
      elements: {
        bar: {
          backgroundColor: colors.secondary,
          borderColor: colors.white,
          borderWidth: 1,
          borderRadius: 7,
          hoverBackgroundColor: colors.black,
          hoverBorderWidth: 0,
        },
      },
      layout: {
        autoPadding: true,
      },
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          backgroundColor: colors.black,
          bodyAlign: "center",
          bodyColor: colors.light,
          bodyFont: {
            size: 20,
          },
          borderColor: colors.white,
          borderWidth: 2,
          callbacks: {
            label: ({ raw }) => {
              return `$${valueToDollarsFormatted(raw)}`;
            },
            title: (tooltipItem) => {
              const { label } = tooltipItem[0];
              return format(parseISO(label), "LLLL yyyy");
            },
          },
          caretPadding: 10,
          caretSize: 12,
          cornerRadius: 7,
          displayColors: false,
          padding: {
            bottom: 12,
            left: 20,
            right: 20,
            top: 12,
          },
          titleAlign: "center",
          titleColor: colors.light,
          titleFont: {
            lineHeight: 1,
            size: 16,
          },
          titleMarginBottom: 6,
        },
      },
      responsive: true,
      scales: {
        x: {
          afterFit: function (scaleInstance) {
            scaleInstance.height = 80;
          },
          border: {
            color: colors.secondary,
          },
          grid: {
            lineWidth: 0,
          },
          offset: true,
          ticks: {
            callback(value) {
              const label = this.getLabelForValue(value);
              return format(parseISO(label), "LLL yyyy");
            },
            color: colors.black,
            font: {
              size: 14,
            },
          },
        },
        y: {
          afterFit: function (scaleInstance) {
            scaleInstance.width = 60;
          },
          border: {
            width: 0,
          },
          grid: {
            color: colors.light,
            lineWidth: 2,
          },
          ticks: {
            callback: (value) => `$${valueToDollarsAbbreviated(value)}`,
            color: colors.dark,
            font: {
              size: 14,
            },
          },
        },
      },
    };
  },
  chartOptionsProjection({ colors }, { chartOptions }) {
    return merge({}, chartOptions, {
      elements: {
        point: {
          hoverBackgroundColor: colors.black,
          hoverBorderColor: colors.white,
          radius: 0,
          hoverBorderWidth: 2,
          hoverRadius: 6,
        },
      },
      interaction: {
        axis: "x",
        intersect: false,
        mode: "nearest",
      },
      plugins: {
        tooltip: {
          callbacks: {
            label({ dataset, formattedValue }) {
              return `${dataset.id} $${formattedValue}`;
            },
          },
        },
      },
      transitions: {
        active: false,
      },
    });
  },
};

const mutations = {
  ...make.mutations(state),
  setColors() {
    const computedStyle = getComputedStyle(document.body);
    const getCssVar = (name) => {
      return computedStyle.getPropertyValue(name);
    };
    const colorNames = Object.keys(state.colors);
    const colorsByName = colorNames.reduce((accumulator, name) => {
      accumulator[name] = getCssVar(`--${name}`);
      return accumulator;
    }, {});
    const isDarkMode = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    state.colors = colorsByName;
    state.isDarkMode = isDarkMode;
  },
};

const actions = {
  ...make.actions(state),
  refreshColors({ commit }) {
    commit("setColors");
  },
};

export default {
  actions,
  getters,
  mutations,
  namespaced: true,
  state,
};
