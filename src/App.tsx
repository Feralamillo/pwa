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

        navigator.serviceWorker
          .register('/sw.js')
          .then((registration) => {
            console.log('Service worker registered.');

            // No controller for this page, nothing to do for now.
            if (!navigator.serviceWorker.controller) {
              console.log('No service worker controlling this page.');
            }

            // A new service worker has been fetched, watch for state changes.
            //
            // This event is fired EVERY TIME a service worker is fetched and
            // succesfully parsed and goes into 'installing' state. This
            // happens, too, the very first time the page is visited, the very
            // first time a service worker is fetched for this page, when the
            // page doesn't have a controller, but in that case there's no new
            // version available and the notification must not appear.
            //
            // So, if the page doesn't have a controller, no notification shown.
            registration.addEventListener('updatefound', function () {
              console.log('New service worker in installing state.');

              if (!registration) {
                console.log('Registration is null');
                return;
              }

              if (registration.installing) {
                registration.installing.onstatechange = function () {
                  console.log('Service worker state changed to', registration);
                  // @ts-ignore
                  if (registration.state === 'installed') {
                    if (!navigator.serviceWorker.controller) {
                      console.log('First install for this service worker.');
                    } else {
                      console.log(
                        'New service worker is ready to install on refresh.'
                      );
                    }
                  }
                };
              }
            });

            // If a service worker is in 'waiting' state, then maybe the user
            // dismissed the notification when the service worker was in the
            // 'installing' state or maybe the 'updatefound' event was fired
            // before it could be listened, or something like that. Anyway, in
            // that case the notification has to be shown again.
            //
            if (registration.waiting) {
              console.log('Service working in skipwaiting state.');
            }

            // Well, really this should go into a setInterval() call, but I'm
            // including it here to be exhaustive.
            console.log('Updating service worker.');
            registration.update();
          })
          .catch((error) =>
            console.log('Service worker not registered (' + error + ').')
          );
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
              });
            });
          }
        }),
      5000
    );
  }

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
          Allow Notifications
        </Button>
        <h1>8</h1>
      </header>
    </div>
  );
}

export default App;
