import querySring from 'query-string';
import {AsyncStorage} from 'react-native';
import {Keys} from './Keys';
import {Actions} from 'react-native-router-flux';

export const API = {
  //login
  registUser: (data, res, err) => {
    APIdefault.POST('/user/regist', querySring.stringify(data), res, err);
  },
  //group
  groupList: (data, res, err) => {
    APIdefault.GET('/group/groupList?' + querySring.stringify(data), res, err);
  },
  createGroup: (data, res, err) => {
    APIdefault.POST('/group/createGroup', querySring.stringify(data), res, err);
  },
  deleteGroup: (data, res, err) => {
    APIdefault.POST('/group/deleteGroup', querySring.stringify(data), res, err);
  },
  leaveGroup: (data, res, err) => {
    APIdefault.POST('/group/leaveGroup', querySring.stringify(data), res, err);
  },
  //file
  downloadURL: 'http://112.169.11.118:38080/api/files/download?path=',
  fileList: (data, res, err) => {
    APIdefault.GET('/files/fileList?' + querySring.stringify(data), res, err);
  },
  uploadFiles: (data, res, err) => {
    APIdefault.filePost('/files/upload', data, res, err);
  },
  uploadThumnail: (data, res, err) => {
    APIdefault.filePost('/files/thumnail', data, res, err);
  },
  downloadFile: (data, res, err) => {
    APIdefault.GET('/files/download', querySring.stringify(data), res, err);
  },
};
const APIdefault = {
  host: 'http://112.169.11.118:38080/api',
  GET: (addr, responsefunc, errfunc) => {
    console.log('GET : ' + APIdefault.host + addr);
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
    console.log('POST : ' + APIdefault.host + addr, 'PARAM: ' + param);
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
    console.log('POST : ' + APIdefault.host + addr, 'PARAM: ' + param);
    var formData = new FormData();
    // formData.append('files', param.files);
    // formData.append('userNum', param.userNum);
    // formData.append('groupNum', param.groupNum);

    fetch(APIdefault.host + addr, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
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
};
