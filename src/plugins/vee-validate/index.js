import { extend } from "vee-validate";
import { required } from "vee-validate/dist/rules";

extend("required", { ...required, message: "{_field_} is required" });

extend("number", {
  validate: (value) => {
    const valueNoCommas = value.replaceAll(",", "");
    const isNumber = !isNaN(valueNoCommas);
    const isInfinity = valueNoCommas === "Infinity";
    return isNumber && !isInfinity;
  },
  message: "Must be a number",
});
