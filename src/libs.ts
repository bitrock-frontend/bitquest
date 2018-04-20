'use strict';

interface Keys extends Array<string> {
  [index: number]: string;
}

const types: Keys = ['json', 'text', 'response'];

const keyVal = (key: string, object: any): string => 
  `${key}=${encodeURIComponent(object[key])}`;


export const checkTypes = (response: string): any =>
  response && (types.indexOf(response) >= 0);

export const getQuery = (queryParams: any): string => {
  const keys: Keys = Object.keys(queryParams);
  const arr: Keys = keys.map((k: string) => keyVal(k, queryParams));
  return '?' + arr.join('&');
}