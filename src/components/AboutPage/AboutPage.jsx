import { Typography } from '@mui/material';
import React from 'react';

// This is one of our simplest components
// It doesn't have local state,
// It doesn't dispatch any redux actions or display any part of redux state
// or even care what the redux state is'

function AboutPage() {
  return (
    <div className="container">
      <div>
        <p>
          Surviving in the printing industry is not for the faint of heart Print
          Profit believes the future is worth fighting for We go the distance in
          empowering printers to profitability
        </p>
        <p>
          2023 Print Profit was founded out of a passion to build a stronger
          financial future for the industry by empowering printers to maximize
          profitability.
        </p>
      </div>
    </div>
  );
}

export default AboutPage;
