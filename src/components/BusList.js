import Divider from '@material-ui/core/Divider';

import BusItem from './BusItem';

const BusList = ({ services }) => {  
  return (
    <>
    <Divider />
    <div style={{padding: '0px 16px 16px 16px'}}>
      {
        services.map((service, index) => (
          <BusItem key={index} service={service}/>
        ))
      }
    </div>
    </>
  )
}

export default BusList;
