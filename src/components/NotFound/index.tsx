import React from "react";
import styles from './index.m.scss';
import {useHistory} from "react-router";

export default function NotFound(){
  const history = useHistory();
  return <div className={styles.notFound}>
    404
    <br/>
    <br/>
    Page Not Found
    <br/>
    <br/>
    <a className='link' onClick={() => history.push('/')}>Home Page</a>
  </div>
};