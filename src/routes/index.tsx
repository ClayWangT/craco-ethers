import React from "react";

import {Route, Switch} from "react-router-dom";
import Home from "@/routes/Home";
import NotFound from "@/components/NotFound";

const RouterSwitch = () => {
  return <Switch>
    <Route exact path="/" render={() => <Home/>}/>
    <Route render={() => <NotFound />}/>
  </Switch>
}

export default RouterSwitch;