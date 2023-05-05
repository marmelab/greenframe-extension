/**
 * Converts the consumption score in Watt.hour into a displayable output in milliWatt.hour
 *
 * Examples :
 *  - computeMilliWh(0.125111) returns 125
 *  - computeMilliWh(0.125911) returns 126
 *  - computeMilliWh(0.0082591) returns 8.3
 *
 * @param {number} wh - The score in Watt.hour (Wh)
 * @returns {number} - The score in milliWatt.hour (mWh)
 */
export const computeMilliWh = (wh) =>
    wh < 0.01 ? Math.round(wh * 10000) / 10 : Math.round(wh * 1000);

export const computeDisplayableMilliWithUnit = (wh, executionCount) => {
    const mWhWithExecutionCount = computeMilliWh(wh) * executionCount;

    if (mWhWithExecutionCount >= 1e6) {
        return `${Math.round(mWhWithExecutionCount * 1) / 1e6} kWh`;
    }

    if (mWhWithExecutionCount >= 1000 && mWhWithExecutionCount < 1e6) {
        return `${Math.round(mWhWithExecutionCount * 1) / 1000} Wh`;
    }

    return `${Math.round(mWhWithExecutionCount)} mWH`;
};

export const computeDisplayableMilliWhPerMin = (score) => {
    const totalMilliWh = score?.wh?.total;
    const totalDuration = score?.s?.totalTime;
    if (totalMilliWh && totalDuration) {
        return computeMilliWh((totalMilliWh / totalDuration) * 60);
    }
    return 0;
};
