import React, { useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import { Button } from '@material-ui/core';
import { useAddToHomescreenPrompt } from './hooks/useAddToHomescreenPrompt';

function App() {
  const [prompt, promptToInstall] = useAddToHomescreenPrompt();
  const [isVisible, setVisibleState] = React.useState(false);

  useEffect(() => {
    if (prompt) {
      setVisibleState(true);
    }
  }, [prompt]);

  async function createNotification() {
    try {
      const reg = await navigator.serviceWorker.getRegistration();
      Notification.requestPermission().then((permission) => {
        if (permission !== 'granted') {
          alert('you need to allow push notifications');
        } else {
          const timestamp = new Date().getTime() + 30 * 1000; // now plus 5000ms
          if (!reg) {
            alert('No registration');
            return;
          }
          setTimeout(
            () =>
              reg.showNotification('Demo Push Notification', {
                tag: timestamp.toString(), // a unique ID
                timestamp,
                body: 'Inshur is Awesome', // content of the push notification
                // showTrigger: new TimestampTrigger(timestamp), // set the time for the push notification
                data: {
                  url: window.location.href, // pass the current url to the notification
                },
                // badge: './assets/badge.png',
                // icon: './assets/icon.png',
                actions: [
                  {
                    action: 'open',
                    title: 'Open app',
                  },
                  {
                    action: 'close',
                    title: 'Close notification',
                  },
                ],
              }),
            timestamp
          );
        }
      });
    } catch {
      alert('Failed to register the service worker');
    }
  }

  return (
    <div className='App'>
      <header className='App-header'>
        <img src={logo} className='App-logo' alt='logo' />
        {isVisible && (
          <Button variant='contained' color='primary' onClick={promptToInstall}>
            Add to Homescreen
          </Button>
        )}
        <Button
          variant='contained'
          color='secondary'
          onClick={createNotification}
        >
          Show Notification
        </Button>
        <h1>4</h1>
      </header>
    </div>
  );
}

export default App;
