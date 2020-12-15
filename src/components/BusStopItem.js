import React, { useState } from "react";
import Collapse from '@material-ui/core/Collapse';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CachedIcon from '@material-ui/icons/Cached';
import CircularProgress from '@material-ui/core/CircularProgress'
import IconButton from '@material-ui/core/IconButton';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';

import BusList from "./BusList";
import Loading from "./Loading";
import ArrivalService from "../services/ArrivalService";

const BusStopItem = ({ busStop }) => {
  const [services, setServices] = useState([]);
  const [isCollapse, setIsCollapse] = useState(false);

  const toggleBusStop = () => {
    const originalIsCollpase = isCollapse;
    setIsCollapse(!isCollapse);

    if (!originalIsCollpase) {
      reloadServices();
    }
  }

  const onClickReload = async () => {
    await reloadServices();
    setIsCollapse(true);
  }

  const reloadServices = async() => {
    setServices([]);
    const response = await ArrivalService.get(busStop.BusStopCode);
    setServices(response.data.services);
  }

  return (
    <>
    <Box m={1}>
    <Card variant="outlined">
      <CardHeader
        avatar={
          <div onClick={toggleBusStop}>
            {isCollapse ? <ExpandLessIcon/> : <ExpandMoreIcon/>}
          </div>
        }
        action={
          <>
          {isCollapse ? 
          services.length === 0 ?
          <IconButton><CircularProgress disableShrink /></IconButton> : 
          <IconButton onClick={onClickReload}><CachedIcon/></IconButton>
          : <></>}
          </>
        }
        title={busStop.Description}
        subheader={busStop.RoadName + ' - ' +busStop.BusStopCode}
      />
        <Collapse in={isCollapse}>
          {
            services.length === 0 ? <Loading/> : <BusList services={services}/>
          }
        </Collapse>
    </Card>
    </Box>
    </>
  )
}

export default BusStopItem;
