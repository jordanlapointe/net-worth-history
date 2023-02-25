import { extend } from "vee-validate";
import { required } from "vee-validate/dist/rules";

extend("required", { ...required, message: "{_field_} is required" });

extend("number", {
  validate: (value) => {
    const valueNoExtras = value.replaceAll(/[,$]/g, "");
    const isNumber = !isNaN(valueNoExtras);
    const isInfinity = valueNoExtras === "Infinity";
    return isNumber && !isInfinity;
  },
  message: "Must be a number",
});
