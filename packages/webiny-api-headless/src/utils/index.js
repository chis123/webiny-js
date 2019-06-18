import { upperFirst } from "lodash";
import createValidator from "./createValidator";
import createListArgs from "./createListArgs";

export { createValidator, createListArgs };

export function createTypeName(modelId) {
    return upperFirst(modelId);
}

export function createEntityName(modelId) {
    return "Headless" + upperFirst(modelId);
}