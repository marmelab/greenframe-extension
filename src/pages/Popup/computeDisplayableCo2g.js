/**
 * Converts the CO2 score in grams into a displayable output in milligrams
 *
 * Examples :
 *  - computeDisplayableCo2g(0.125111) returns 125
 *  - computeDisplayableCo2g(0.125911) returns 126
 *  - computeDisplayableCo2g(0.0082591) returns 8.3
 *
 * @param {number} co2g - The CO2 score in grams (g)
 * @returns {number} - The rounded CO2 score in milligrams (mg)
 */
export const computeDisplayableCo2g = (co2g) =>
    co2g < 0.01 ? Math.round(co2g * 10000) / 10 : Math.round(co2g * 1000);

export const computeDisplayableCo2gWithUnit = (co2g, executionCount) => {
    const co2gWithExecutionCount = computeDisplayableCo2g(co2g) * executionCount;

    if (co2gWithExecutionCount >= 1e6) {
        return `${Math.round(co2gWithExecutionCount * 1) / 1e6} kg`;
    }

    if (co2gWithExecutionCount >= 1000 && co2gWithExecutionCount < 1e6) {
        return `${Math.round(co2gWithExecutionCount * 1) / 1000} g`;
    }

    return `${Math.round(co2gWithExecutionCount)} mg`;
};

export const computeDisplayableCo2gPerMin = (score) => {
    const totalCo2 = score?.co2?.total;
    const totalDuration = score?.s?.totalTime;
    if (totalCo2 && totalDuration) {
        return computeDisplayableCo2g((totalCo2 / totalDuration) * 60);
    }
    return 0;
};
