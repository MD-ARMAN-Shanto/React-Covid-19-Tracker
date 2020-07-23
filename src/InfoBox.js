import React from "react";
import "./InfoBox.css"
import {Card, CardContent, Typography} from "@material-ui/core";

function InfoBox({title, cases, isRed, active, total, ...props}) {
    return(
        <Card onClick={props.onClick}
              className={`infoBox ${active && 'infoBox--selected'} 
                                  ${isRed && 'infoBox--red'}`}>
            <CardContent>
                {/*Title corona virus cases*/}
                <Typography color="textSecondary" className="infoBox__title">
                    {title}
                </Typography>

                {/*120 k cases*/}
                <h2 className={`infoBox__cases ${!isRed && "infoBox__cases--green"}`}>{cases}</h2>

                {/*1.2 M Total*/}
                <Typography color="textSecondary" className="infoBox__total">
                    {total} Total
                </Typography>

            </CardContent>
        </Card>
    )
}

export default InfoBox
