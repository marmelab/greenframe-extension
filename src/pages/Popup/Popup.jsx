import React from 'react';
import logo from '../../assets/img/logo.svg';
import './Popup.css';

const Popup = () => {
  return (
    <div className="popup">
      <header className="header">
        <img src={logo} className="header_logo" alt="greenframe" />
        <h1 className="header_title">GreenFrame</h1>
      </header>
      <section className="section">
        <button className="button">Launch Analyze!</button>
      </section>
      <footer className="footer">
        <p className="footer_text">Made with ❤ by Marmelab</p>
        <a href='https://greenframe.io/' className="footer_link">https://greenframe.io/</a>
      </footer>
    </div>
  );
};

export default Popup;
