import React, { useEffect, useState } from 'react';
import secrets from 'secrets';
import logo from '../../assets/img/logo.svg';
import './Popup.css';
import { TotalScoreConsumption } from './TotalScoreConsumption';

const REACT_APP_TOKEN = secrets.REACT_APP_TOKEN;
const REACT_APP_API_URL_ANALYSES = secrets.REACT_APP_API_URL_ANALYSES;
const REACT_APP_API_URL_BENCHMARKS = secrets.REACT_APP_API_URL_BENCHMARKS;

async function getCurrentTab() {
  let queryOptions = { active: true, lastFocusedWindow: true };
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}
async function getBenchmarkAnalyse(url) {
  const requestOptions = {
    method: 'GET',
  };

  const existingBenchmarkAnalyse = fetch(
    `${REACT_APP_API_URL_BENCHMARKS}/domain?domain=${url}`,
    requestOptions
  )
    .then((response) => {
      return response.json();
    })
    .then((result) => result)
    .catch((error) => {
      throw new Error(error);
    });
  return existingBenchmarkAnalyse;
}
async function createAnalyse(url) {
  const myHeaders = new Headers();
  myHeaders.append('Authorization', `Bearer ${REACT_APP_TOKEN}`);
  myHeaders.append('Content-Type', 'application/json');

  const body = JSON.stringify({
    projectName: 'extension',
    url,
    samples: '2',
  });

  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body,
    redirect: 'follow',
  };

  const createAnalyse = fetch(REACT_APP_API_URL_ANALYSES, requestOptions)
    .then((response) => response.json())
    .then((result) => result)
    .catch((error) => {
      throw new Error(error);
    });

  return createAnalyse;
}

async function getAnalyseById(id) {
  const requestOptions = {
    method: 'GET',
    redirect: 'follow',
  };

  return fetch(`${REACT_APP_API_URL_ANALYSES}/${id}`, requestOptions)
    .then((response) => response.text())
    .then((result) => result)
    .catch((error) => console.log('error', error));
}

const Popup = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(true);
    getCurrentTab()
      .then((tab) => getBenchmarkAnalyse(tab.url))
      .then((result) => {
        console.log('result', result);
        setResult(result);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, []);

  async function handleClick() {
    setLoading(true);
    const tab = await getCurrentTab();
    const url = tab.url;

    let createdAnalyse;
    try {
      createdAnalyse = await createAnalyse(url);
    } catch (error) {
      console.log(error);
      setError(true);
      setLoading(false);
      return;
    }

    const interval = setInterval(async () => {
      try {
        const resultedAnalyse = await getAnalyseById(createdAnalyse?.id);
        const parsedResult = JSON.parse(resultedAnalyse);
        if (parsedResult.status === 'finished') {
          clearInterval(interval);
          setResult(parsedResult);
          setLoading(false);
        }
        if (parsedResult.status === 'failed') {
          clearInterval(interval);
          setError(true);
          setLoading(false);
        }
      } catch (error) {
        console.log(error);
        clearInterval(interval);
        setError(true);
        setLoading(false);
      }
    }, 5000);
  }
  return (
    <div className="greenframe_popup">
      <header className="header">
        <img src={logo} className="header_logo" alt="greenframe" />
        <h1 className="header_title">GreenFrame</h1>
      </header>
      <section className="section">
        {!result && (
          <button
            className="button"
            onClick={() => handleClick()}
            disabled={loading}
          >
            Launch analysis!
          </button>
        )}

        {loading && (
          <div className="loading">
            <p>Pending Analyze</p>
            <div className="dot_elastic"></div>
          </div>
        )}
        {error && (
          <p className="error">A error occured, please restart the analysis</p>
        )}
        {result && (
          <TotalScoreConsumption
            score={result.score}
            analysisId={result.analysisId}
          />
        )}
      </section>
      <footer className="footer">
        <p className="footer_text">Made with ❤ by Marmelab</p>
        <a href="https://greenframe.io/" className="footer_link">
          https://greenframe.io/
        </a>
      </footer>
    </div>
  );
};

export default Popup;
