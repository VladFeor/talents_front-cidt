import axios from 'axios';
class AxiosService {
  constructor() {
    this.axios = axios.create();
  }
  getHeaders() {
    this.axios.interceptors.request.use((config) => {
      const token = localStorage.getItem('token');
      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      // if (!timeZone || !Intl.DateTimeFormat().resolvedOptions().timeZone.includes(timeZone)) {
      //   timeZone = 'UTC'; // Replace 'UTC' with your preferred default time zone
      // }

      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      config.headers['timeZone'] = timeZone;

      return config;
    });
  }
  async _request(options) {
    await this.getHeaders();
    return await this.axios.request(options);
  }

  async get(url, params, headers = {}) {
    return await this._request({
      method: 'get',
      url,
      params,
      headers,
    });
  }

  async post(url, data, isMultipart = false, headers = {}) {
    if (isMultipart) {
      let formData = new FormData();
      for (let key in data) {
        if (data[key] !== undefined) {
          formData.append(key, data[key]);
        }
      }
      formData.append('_method', 'POST');
      // for (let pair of formData.entries()) {
      //   console.log(pair[0] + ', ' + pair[1]);
      // }
      return await this._request({
        method: 'post',
        url,
        data: formData,
        headers,
      });
    }

    return await this._request({
      method: 'post',
      url,
      data,
      headers,
    });
  }

  async put(url, data, isMultipart = false, headers = {}) {
    if (isMultipart) {
      let formData = new FormData();
      for (let key in data) {
        if (data[key] !== undefined) {
          formData.append(key, data[key]);
        }
      }
      formData.append('_method', 'PUT');
      for (let pair of formData.entries()) {
        console.log(pair[0] + ', ' + pair[1]);
      }
      return await this._request({
        method: 'post',
        url,
        data: formData,
        headers,
      });
    }
    return await this._request({
      method: 'put',
      url,
      data,
      headers,
    });
  }
  async patch(url, data, isMultipart = false, headers = {}) {
    if (isMultipart) {
      let formData = new FormData();
      for (let key in data) {
        if (data[key] !== undefined) {
          formData.append(key, data[key]);
        }
      }
      formData.append('_method', 'patch');
      for (let pair of formData.entries()) {
        console.log(pair[0] + ', ' + pair[1]);
      }
      return await this._request({
        method: 'post',
        url,
        data: formData,
        headers,
      });
    }
    return await this._request({
      method: 'patch',
      url,
      data,
      headers,
    });
  }

  async delete(url, data, headers = {}) {
    return await this._request({
      method: 'delete',
      url,
      data,
      headers,
    });
  }
}

export default new AxiosService();
