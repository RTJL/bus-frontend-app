import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/Button';
import LocationOnIcon from '@material-ui/icons/LocationOn';

const Search = ({ toggleClear, allBusStops, onChangeSearchText, onClickLocation }) => {
  return (
    <Box m={1}>
      <Grid
        container
        spacing={1}
        alignItems='center'
      >
        <Grid item xs={10}>
          <Autocomplete
            freeSolo
            blurOnSelect
            key={toggleClear}
            onChange={onChangeSearchText}
            options={allBusStops.map((option) => 
              option.BusStopCode
            )}
            renderInput={(params) => (
              <TextField {...params}
                variant="outlined"
                label="Busstop Code"/>
            )}
          />
        </Grid>
        <Grid item xs={2}>
          <IconButton onClick={onClickLocation}>
            <LocationOnIcon/>
          </IconButton>
        </Grid>

      </Grid>
    </Box>
  )
}

export default Search;
