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

  useEffect(() => {
    showNotification();
  }, []);

  useEffect(() => {
    serviceWorkerThings();
  }, []);

  function serviceWorkerThings() {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        let refreshing = false;
        navigator.serviceWorker.addEventListener('controllerchange', () => {
          console.log('New service worker in charge.');
          if (refreshing) return;
          refreshing = true;
          window.location.reload();
        });
      });
    } else {
      console.log('Service workers not supported.');
    }
  }

  function showNotification() {
    setTimeout(
      () =>
        Notification.requestPermission(function (result) {
          if (result === 'granted') {
            navigator.serviceWorker.ready.then(function (registration) {
              registration.showNotification('Vibration Sample', {
                body: 'Buzz! Buzz!',
                vibrate: [200, 100, 200, 100, 200, 100, 200],
                tag: 'vibration-sample',
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
              });
            });
          }
        }),
      5000
    );
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
        <h1>14</h1>
      </header>
    </div>
  );
}

export default App;
