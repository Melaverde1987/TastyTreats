import { BASE_URL } from './config';
import axios from 'axios';

const HERO_ENDPOINT = '/events';

const fetchEvents = async () => {
  const response = await axios.get(`${BASE_URL}${HERO_ENDPOINT}`);
  //   console.log(response.data);
  return response.data;
};

export { fetchEvents };
