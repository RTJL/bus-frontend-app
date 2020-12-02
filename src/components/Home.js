import React, { useState, useEffect } from "react";
import ArrivalService from "../services/ArrivalService";
import BusStopsService from "../services/BusStopsService";
import BusesDataService from "../services/BusesService";
import { Service } from "../services/DbService";
import { getBoundsOfDistance } from "geolib";

import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/Button';
import SearchIcon from '@material-ui/icons/Search';
import CachedIcon from '@material-ui/icons/Cached';
import LocationSearchingIcon from '@material-ui/icons/LocationSearching';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import DirectionsBusIcon from '@material-ui/icons/DirectionsBus';

const Home = () => {
  const [busStopCode, setBusStopCode] = useState("");
  // const [coord, setCoord] = useState({
  //   lat: 0,
  //   lng: 0
  // });
  const [nearestBusStops, setNearestBusStops] = useState({});
  const [busStopArrival, setBusStopArrival] = useState({});
  const [isUpdatingCache, setIsUpdatingCache] = useState(true);

  useEffect(() => {
    const checkAndUpdateCache = async() => {
      const noOfBusStop = await Service.getBusStopCount();
      var requests = [];
      if (noOfBusStop === 0) {
        requests.push(BusStopsService.updateCache());
        requests.push(BusesDataService.updateCache());
      }
      Promise.all(requests)
        .then(() => {
          console.log("udpated cache");
          setIsUpdatingCache(false);
        });
    }
    checkAndUpdateCache();
  }, [])

  const onChangeBusStopCode = e => {
    const code = e.target.value;
    setBusStopCode(code);
  }

  const arrivalById = async () => {
    if (busStopCode.length !== 5 || !Number(busStopCode)) {
      alert("Invalid busstop code");
      return;
    }

    const busStop = await Service.getBusStop(busStopCode);
    var busStopDict = {
      [busStopCode]: busStop
    };
    const arrivalDict = await updateArrivals(busStopDict);
    setNearestBusStops(busStopDict);
    setBusStopArrival(arrivalDict);

    console.log(busStopDict);
  }

  const handleNearbyClick = () => {
    if (navigator.geolocation) {
      setBusStopCode("");
      setNearestBusStops({});
      setBusStopArrival({});
      navigator.geolocation.getCurrentPosition(updateCoord, coordError);
    } else {
      alert("Unable to retrieve current location");
    }
    
  }

  const handleReloadClick = async () => {
    const arrivalDict = await updateArrivals(nearestBusStops);
    setBusStopArrival(arrivalDict);
  }

  const updateCoord = async (position) => {
    // const lat = 1.421202;
    // const lng = 103.833704;
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;

    if (lat === 0 || lng === 0) {
      return;
    }

    console.log(position);
    const bounds = getBoundsOfDistance(
      { lat: lat, lng: lng}, 300
    );

    const busStopDict = await updateNearestBusStops(bounds);
    const arrivalDict = await updateArrivals(busStopDict);
    setNearestBusStops(busStopDict);
    setBusStopArrival(arrivalDict);
  }

  const coordError = (error) => {
    var msg = '';
    switch(error.code) {
      case error.PERMISSION_DENIED:
        msg = "User denied the request for Geolocation."
        break;
      case error.POSITION_UNAVAILABLE:
        msg = "Location information is unavailable."
        break;
      case error.TIMEOUT:
        msg = "The request to get user location timed out."
        break;
      case error.UNKNOWN_ERROR:
      default:
        msg = "An unknown error occurred."
        break;
    }
    alert(msg);
  }

  const updateNearestBusStops = async (bounds) => {
    const minLat = bounds[0].latitude;
    const minLng = bounds[0].longitude;
    const maxLat = bounds[1].latitude;
    const maxLng = bounds[1].longitude;

    const latBusStops = await Service.getBusStopLatBound(minLat, maxLat);
    const busStops = latBusStops.filter(latBusStop => {
      return latBusStop.Longitude < maxLng && latBusStop.Longitude > minLng;
    });
    var dict = {};
    busStops.forEach(stop => {
      dict[stop.BusStopCode] = stop;
    });
    console.log(busStops);
    return dict;
  }

  const updateArrivals = async (nearestBusStops) => {
    const stops = Object.keys(nearestBusStops);
    const responses = await ArrivalService.getAll(stops);

    var dict = {};
    responses.forEach((response,index) => {
      dict[stops[index]] = response.data.services;
    });

    return dict;
  }

  return (
    <>
    {isUpdatingCache ? (
      <>
      <p>Checking for new buses and stops</p>
      </>
    ) : (
      <>
        <Box m={1}>
          <Grid
            container
            spacing={1}
            alignItems='center'
          >
            <Grid item xs={5}>
              <TextField
                variant="outlined"
                label="Busstop Code"
                value={busStopCode}
                onChange={onChangeBusStopCode}
              />
            </Grid>
            <Grid item xs={2}>
              <IconButton onClick={arrivalById}>
                <SearchIcon/>
              </IconButton>
            </Grid>
            <Grid item xs={2}>
              <IconButton onClick={handleReloadClick}>
                <CachedIcon/>
              </IconButton>
            </Grid>
            <Grid item xs={2}>
              <IconButton onClick={handleNearbyClick}>
                <LocationSearchingIcon/>
              </IconButton>
            </Grid>
          </Grid>
        </Box>

        {busStopArrival && Object.keys(busStopArrival).map((key, index) =>(
          <Box key={key} m={1}>
          <Card variant="outlined">
            <CardContent>
              {nearestBusStops[key] &&
              (
                <Typography variant="h5" component="h2">
                  {nearestBusStops[key].Description} - {nearestBusStops[key].RoadName} ({nearestBusStops[key].BusStopCode})
                </Typography>
              )
              }
              <List>
                {nearestBusStops[key] && busStopArrival[key].map((service, index) => (
                  <ListItem disableGutters={true} key={service.ServiceNo}>
                    <Box>
                      <h3>{service.ServiceNo}</h3>
                      <Grid container spacing={1}>
                        {service.NextBus.EstimatedArrival &&
                          <Grid item key={index.toString() + "1"} xs={4}>
                          <Button
                            variant="contained"
                            color="primary"
                            size="large"
                            startIcon={<DirectionsBusIcon />}
                          >
                            {Math.round((((new Date() - Date.parse(service.NextBus.EstimatedArrival)) % 86400000) % 3600000) / 60000)}
                            {}
                          </Button>
                          </Grid>
                        }
                        {service.NextBus2.EstimatedArrival &&
                          <Grid item key={index.toString() + "1"} xs={4}>
                          <Button
                            variant="contained"
                            color="primary"
                            size="large"
                            startIcon={<DirectionsBusIcon />}
                          >
                            {Math.round((((new Date() - Date.parse(service.NextBus2.EstimatedArrival)) % 86400000) % 3600000) / 60000)}
                            {}
                          </Button>
                          </Grid>
                        }
                        {service.NextBus3.EstimatedArrival &&
                          <Grid item key={index.toString() + "1"} xs={4}>
                          <Button
                            variant="contained"
                            color="primary"
                            size="large"
                            startIcon={<DirectionsBusIcon />}
                          >
                            {Math.round((((new Date() - Date.parse(service.NextBus3.EstimatedArrival)) % 86400000) % 3600000) / 60000)}
                            {}
                          </Button>
                          </Grid>
                        }
                      </Grid>
                    </Box>
                  </ListItem>
                ))}
              </List>
              
            </CardContent>
          </Card>
          
          </Box>
        ))}
      </>
    )}

    </>
  )
}

export default Home;
