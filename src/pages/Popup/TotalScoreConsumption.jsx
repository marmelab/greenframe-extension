import React from 'react';
import secrets from 'secrets';
import {
  computeDisplayableCo2g,
  computeDisplayableCo2gPerMin,
} from './computeDisplayableCo2g';
import { computeMilliWh } from './computeMilliWh';

const REACT_APP_APP_URL_ANALYSES = secrets.REACT_APP_APP_URL_ANALYSES;

export const TotalScoreConsumption = ({ score, analysisId }) => (
  <div>
    <h2>Estimated consumption</h2>
    <h3>
      {computeDisplayableCo2g(score?.co2?.total)} mg eq. CO<sub>2</sub>
    </h3>
    <p>({computeDisplayableCo2gPerMin(score)} mg/min)</p>
    <h2>Electric consumption</h2>

    <p> {computeMilliWh(score?.wh?.total)} mWh</p>
    <h2>
      See the full analysis{' '}
      <a
        href={`${REACT_APP_APP_URL_ANALYSES}/${analysisId}`}
        target="_blank"
        rel="noreferrer"
      >
        here
      </a>
    </h2>
  </div>
);
