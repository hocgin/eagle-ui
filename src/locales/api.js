import {success} from './utils/result';

export default {
  'POST /worked': (req, res) => {
    return res.json(success())
  },
};