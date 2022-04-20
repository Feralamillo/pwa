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

  return (
    <div className='App'>
      <header className='App-header'>
        <img src={logo} className='App-logo' alt='logo' />
        {isVisible && (
          <Button variant='contained' color='primary' onClick={promptToInstall}>
            Add to Homescreen
          </Button>
        )}
        <h1>2</h1>
      </header>
    </div>
  );
}

export default App;
