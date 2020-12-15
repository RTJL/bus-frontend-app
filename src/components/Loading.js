import Grid from '@material-ui/core/Grid';

import loading0 from "../static/img/loading0.gif";
import loading1 from "../static/img/loading1.gif";
import loading2 from "../static/img/loading2.gif";
import loading3 from "../static/img/loading3.gif";
import loading4 from "../static/img/loading4.gif";
import loading5 from "../static/img/loading5.gif";

const images = [
  loading0,
  loading1,
  loading2,
  loading3,
  loading4,
  loading5
]

const Loading = () => {
  const randomNum = Math.floor(Math.random() * 5);
  return (
    <img width='100%' src={images[randomNum]} alt="loading"/>
  )
}

export default Loading;
