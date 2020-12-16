import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import DirectionsBusIcon from '@material-ui/icons/DirectionsBus';

const BusItem = ({ service }) => {
  const getEstimate = (nextBus) => {
    nextBus.EstimatedArrival = getMinuteDifference(now, Date.parse(nextBus.EstimatedArrival));
    if (nextBus.EstimatedArrival === 0) {
      nextBus.EstimatedArrival = "Arr";
    }
    else if (nextBus.EstimatedArrival < 0) {
      return null;
    }
    return nextBus;
  };

  const getMinuteDifference = ((dateStart, dateEnd) => {
    return Math.round((((dateEnd - dateStart) % 86400000) % 3600000) / 60000)
  });

  const now = new Date();
  const arrivals = [];
  if (service.NextBus.EstimatedArrival) {
    const est = getEstimate(service.NextBus);
    if (est !== null) {
      arrivals.push(est);
    }
  }
  if (service.NextBus2.EstimatedArrival) {
    const est = getEstimate(service.NextBus2);
    if (est !== null) {
      arrivals.push(est);
    }
  }
  if (service.NextBus3.EstimatedArrival) {
    const est = getEstimate(service.NextBus3);
    if (est !== null) {
      arrivals.push(est);
    }
  }
  
  return (
    <>
    {
      arrivals.length !== 0 ? 
      <Box key={service.ServiceNo}>
        <h3>{service.ServiceNo}</h3>
        <Grid container spacing={1} justify="flex-start">
        {
          arrivals.map((arrival, index) => (
            <Grid item key={index}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              startIcon={<DirectionsBusIcon />}
            >
              {arrival.EstimatedArrival}
            </Button>
            </Grid>
          ))
        }
        </Grid>
      </Box> : 
      <></>
    }
    
    </>
  )
}

export default BusItem;
