import React from 'react';
import secrets from 'secrets';
import logo from '../../assets/img/logo.svg';
import './Popup.css';

const REACT_APP_TOKEN = secrets.REACT_APP_TOKEN;
async function getCurrentTab() {
  let queryOptions = { active: true, lastFocusedWindow: true };
  // `tab` will either be a `tabs.Tab` instance or `undefined`.
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}
async function createAnalyse(url) {
  var myHeaders = new Headers();
  myHeaders.append('Authorization', `Bearer ${REACT_APP_TOKEN}`);
  myHeaders.append('Content-Type', 'application/json');

  var raw = JSON.stringify({
    projectName: 'extension',
    url,
    distant: true,
    samples: '2',
  });

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow',
  };

  const createAnalyse = fetch(
    'https://api.greenframe.io/analyses',
    requestOptions
  )
    .then((response) => response.json())
    .then((result) => result)
    .catch((error) => console.log('error', error));

  return createAnalyse;
}

async function getAnalyseById(id) {
  var requestOptions = {
    method: 'GET',
    redirect: 'follow',
  };

  return fetch(`https://api.greenframe.io/analyses/${id}`, requestOptions)
    .then((response) => response.text())
    .then((result) => result)
    .catch((error) => console.log('error', error));
}

const Popup = () => {
  async function handleClick() {
    const tab = await getCurrentTab();
    const url = tab.url;
    console.log('Tab', tab);
    const createdAnalyse = await createAnalyse(url);
    const resultedAnalyse = await getAnalyseById(createdAnalyse?.id);
    console.log(resultedAnalyse);
  }

  return (
    <div className="greenframe_popup">
      <header className="header">
        <img src={logo} className="header_logo" alt="greenframe" />
        <h1 className="header_title">GreenFrame</h1>
      </header>
      <section className="section">
        <button className="button" onClick={() => handleClick()}>
          Launch Analyze!
        </button>
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
