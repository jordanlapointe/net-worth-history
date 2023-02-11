import { format, parseISO } from "date-fns";
import { enUS } from "date-fns/locale";
import {
  valueToDollarsAbbreviated,
  valueToDollarsFormatted,
} from "@/utilities/currency";

export const chartOptions = {
  adapters: {
    date: {
      locale: enUS,
    },
  },
  elements: {
    bar: {
      backgroundColor: "#6c757d",
      borderColor: "#fff",
      borderWidth: 1,
      borderRadius: 7,
      hoverBackgroundColor: "#212529",
      hoverBorderWidth: 0,
    },
  },
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      backgroundColor: "#212529",
      bodyAlign: "center",
      bodyFont: {
        size: 20,
      },
      borderColor: "#fff",
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
      caretPadding: 8,
      caretSize: 12,
      cornerRadius: 7,
      displayColors: false,
      padding: {
        bottom: 12,
        left: 20,
        right: 20,
        top: 12,
      },
      position: "nearest",
      titleAlign: "center",
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
      ticks: {
        callback(value) {
          const label = this.getLabelForValue(value);
          return format(parseISO(label), "LLL yyyy");
        },
        color: "#212529",
        font: {
          size: 14,
        },
      },
    },
    y: {
      ticks: {
        callback: (value) => `$${valueToDollarsAbbreviated(value)}`,
        color: "#212529",
        font: {
          size: 14,
        },
      },
    },
  },
};

export const rangeChartOptions = {
  ...chartOptions,
  elements: {
    ...chartOptions.elements,
    bar: {
      ...chartOptions.elements.bar,
      borderSkipped: false,
      borderRadius: 0,
    },
    point: {
      borderColor: "white",
      radius: 0,
      hoverBorderWidth: 2,
      hoverRadius: 6,
    },
  },
  interaction: {
    intersect: false,
    mode: "index",
  },
  plugins: {
    ...chartOptions.plugins,
    tooltip: {
      ...chartOptions.plugins.tooltip,
      callbacks: {
        ...chartOptions.plugins.tooltip.callbacks,
        label({ dataset, formattedValue }) {
          return `${dataset.id}: $${formattedValue}`;
        },
      },
    },
  },
  scales: {
    ...chartOptions.scales,
    x: {
      ...chartOptions.scales.x,
    },
    y: {
      ...chartOptions.scales.y,
    },
  },
  transitions: {
    active: false,
  },
};
