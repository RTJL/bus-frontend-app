import List from '@material-ui/core/List';

import BusStopItem from "./BusStopItem";

const BusStopList = ({ nearestBusStops }) => {

  return (
    <>
    <List>
      {
        nearestBusStops.map((bus) => (
          <BusStopItem key={bus.BusStopCode} busStop={bus}/>
        ))
      }
    </List>
    </>
  )
}

export default BusStopList;
