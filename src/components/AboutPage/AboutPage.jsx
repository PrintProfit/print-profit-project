import '@fontsource-variable/cormorant';
import { Box, Button, Typography } from '@mui/material';

// This is one of our simplest components
// It doesn't have local state,
// It doesn't dispatch any redux actions or display any part of redux state
// or even care what the redux state is'

function AboutPage() {
  const pushToPrintProfit = () => {
    window.open('https://calendly.com/printprofit/introductory-call');
  };

  return (
    <div className="container">
      <Typography
        fontFamily="Cormorant Variable"
        sx={{
          flexGrow: 1,
          fontSize: 26,
          color: 'black',
          fontWeight: 'bold',
          textAlign: 'center',
          mt: 5,
        }}
      >
        Unconventional thinking. Unconventional results. Print profitability
        reimagined.
      </Typography>
      <Box align="center">
        <Box
          component="section"
          sx={{
            p: 2,
            border: '1px solid black',
            maxWidth: '40em',
            borderRadius: '5px',
            mt: 5,
          }}
        >
          <Typography
            fontFamily="Cormorant Variable"
            sx={{
              fontSize: 20,
              mb: 2,
              mt: 5,
            }}
          >
            Print Profit transforms how you do business. We turn hidden
            profitability insights into smart manufacturing strategies that
            drive financial performance. The way your company competes will
            never be the same.
          </Typography>
          <Button
            variant="contained"
            color="button"
            sx={{
              mb: 2,
              fontWeight: 'bold',
              mt: 2,
            }}
            onClick={pushToPrintProfit}
          >
            Book a call now
          </Button>
        </Box>
      </Box>
    </div>
  );
}

export default AboutPage;
