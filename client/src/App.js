import logo from './logo.svg';
import './App.css';
import Main from './MainComponent';
import { BrowserRouter } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';

function App() {
  return (
    <ChakraProvider>
      <BrowserRouter>
        <div className="App">
          <Main />
        </div>
      </BrowserRouter>
    </ChakraProvider>
  );
}

export default App;
