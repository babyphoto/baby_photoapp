import querySring from 'query-string';
import {AsyncStorage} from 'react-native';
import {Keys} from './Keys';
import {Actions} from 'react-native-router-flux';

export const API = {
  //
  connect: (data, res, err) => {
    APIdefault.GET('/connect', res, err);
  },
  //user
  registUser: (data, res, err) => {
    APIdefault.POST('/user/regist', querySring.stringify(data), res, err);
  },
  userSearch: (data, res, err) => {
    APIdefault.GET('/user/userSearch?' + querySring.stringify(data), res, err);
  },
  groupUserList: (data, res, err) => {
    APIdefault.GET(
      '/user/groupUserList?' + querySring.stringify(data),
      res,
      err,
    );
  },
  groupUserDetailList: (data, res, err) => {
    APIdefault.GET(
      '/user/groupUserDetailList?' + querySring.stringify(data),
      res,
      err,
    );
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
  inviteGroup: (data, res, err) => {
    APIdefault.POST('/group/inviteGroup', querySring.stringify(data), res, err);
  },
  modifyGroup: (data, res, err) => {
    APIdefault.POST('/group/modifyGroup', querySring.stringify(data), res, err);
  },
  //file
  downloadURL: 'http://115.68.216.94/api' + '/files/download?path=',
  downloadVideoURL: 'http://115.68.216.94/api' + '/files/downloadVideo?path=',
  // downloadURL: 'http://112.169.11.118:38080/api' + '/files/download?path=',
  // downloadVideoURL:
  //   'http://112.169.11.118:38080/api' + '/files/downloadVideo?path=',

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
  deleteFile: (data, res, err) => {
    APIdefault.POST('/files/delete', querySring.stringify(data), res, err);
  },
  uploadProgress: (data, res, err, process) => {
    APIdefault.fileProgress('/files/upload', data, process)
      .then(res)
      .catch(err);
  },
};
const APIdefault = {
  // host: 'http://112.169.11.118:38080/api',
  host: 'http://115.68.216.94/api',
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
    fetch(APIdefault.host + addr, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
      },
      body: param,
    })
      .then(response => {
        return response.json();
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
  fileProgress: (addr, param, progress) => {
    return new Promise((resolve, reject) => {
      console.log(APIdefault.host + addr, param);
      var oReq = new XMLHttpRequest();
      oReq.upload.addEventListener('progress', ev => {
        progress(ev);
      });
      oReq.open('POST', APIdefault.host + addr);
      oReq.send(param);
      oReq.onreadystatechange = function() {
        if (oReq.readyState === XMLHttpRequest.DONE) {
          let data = JSON.parse(oReq.responseText);
          resolve(data);
        }
      };
      oReq.onerror = function(err) {
        reject(err);
      };
    });
  },
};
