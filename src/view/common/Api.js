import querySring from 'query-string';
import {AsyncStorage} from 'react-native';
import {Keys} from './Keys';
import {Actions} from 'react-native-router-flux';

export const API = {
  //login
  registUser: (data, res, err) => {
    APIdefault.POST('/user/regist', querySring.stringify(data), res, err);
  },
};
const APIdefault = {
  host: 'http://112.169.11.118:38080/api',
  GET: (addr, responsefunc, errfunc) => {
    fetch(APIdefault.host + addr, {
      method: 'GET',
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log(responseJson);
        if (responsefunc) {
          responsefunc(responseJson);
        }
      })
      .catch(error => {
        console.error(error);
        if (errfunc) {
          errfunc(error);
        }
      });
  },
  POST: (addr, param, responsefunc, errfunc) => {
    fetch(APIdefault.host + addr, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: param,
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log(responseJson);
        if (responsefunc) {
          responsefunc(responseJson);
        }
      })
      .catch(error => {
        console.error(error);
        if (errfunc) {
          errfunc(error);
        }
      });
  },
  filePost: (addr, param, responsefunc, errfunc) => {
    console.log('POST : ' + APIdefault.host + addr, 'PARAM: ' + param.file);
    var formData = new FormData();
    formData.append('file', {
      uri: param.file.uri,
      name: param.file.name,
      type: param.file.type,
    });

    fetch(APIdefault.host + addr, {
      method: 'POST',
      body: formData,
    })
      .then(response => {
        if (response.status === 200) {
          return response.json();
        }
      })
      .then(responseJson => {
        console.log(responseJson);
        if (responsefunc) {
          responsefunc(responseJson);
        }
      })
      .catch(error => {
        console.error(error);
        if (errfunc) {
          errfunc(error);
        }
      });
  },
};
