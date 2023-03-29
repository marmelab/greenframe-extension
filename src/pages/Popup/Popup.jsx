import React from 'react';
import secrets from 'secrets';
import logo from '../../assets/img/logo.svg';
import './Popup.css';

const REACT_APP_TOKEN = secrets.REACT_APP_TOKEN;

async function getCurrentTab() {
  let queryOptions = { active: true, lastFocusedWindow: true };
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
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

  const createAnalyse = fetch(
    'https://api.greenframe.io/analyses',
    requestOptions
  )
    .then((response) => response.json())
    .then((result) => result)
    .catch((error) => { throw new Error(error) });

  return createAnalyse;
}

async function getAnalyseById(id) {
  const requestOptions = {
    method: 'GET',
    redirect: 'follow',
  };

  return fetch(`https://api.greenframe.io/analyses/${id}`, requestOptions)
    .then((response) => response.text())
    .then((result) => result)
    .catch((error) => console.log('error', error));
}

const Popup = () => {
  const [loading, setLoading] = React.useState(false);
  const [result, setResult] = React.useState(null);
  const [error, setError] = React.useState(false);

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
        if (resultedAnalyse.status === 'finished') {
          clearInterval(interval);
          setResult(resultedAnalyse);
          setLoading(false);
        }
        if (resultedAnalyse.status === 'failed') {
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
        <button className="button" onClick={() => handleClick()} disabled={loading}>
          Launch Analyze!
        </button>

        {loading && (<div className="loading"><p>Pending Analyze</p><div className="dot_elastic"></div></div>)}
        {error && <p className="error">A error occured, please restart the analyze</p>}
        {result && (
          <div className="result">
            <p className="result_title">Result:</p>
            <p className="result_text">{result.status}</p>
          </div>
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
