import React, {useEffect, useState} from 'react';
import {
    MenuItem,
    FormControl,
    Select,
    Card,
    CardContent
} from "@material-ui/core";
import InfoBox from "./InfoBox";
import Map from "./Map";
import './App.css';
import {sortData, prettyPrintStat} from "./util";
import LineGraph from "./LineGraph";
import Table from "./Table";
import "leaflet/dist/leaflet.css";

function App() {
    const [countries, setCountries] = useState([]);
    const [country, setCountry] = useState('worldwide');
    const [countryInfo, setCountryInfo] = useState({});
    const [tableData, setTableData] = useState([]);
    const [mapCenter, setMapCenter] = useState({
        lat: 34.80746, lng: -40.4796
    });
    const [mapZoom, setMapZoom] = useState(3);
    const [mapCountries, setMapCountries] = useState([]);
    const [casesType, setCasesType] = useState("cases");

    useEffect(() =>{
        fetch("https://disease.sh/v3/covid-19/all")
            .then((response)=>response.json())
            .then((data)=>{
                setCountryInfo(data)
            })
    }, []);

    useEffect(()=>{
    //    the code inside here will run once
    //    when the component loads and not again
    //    async -> send a request, wait for it, do something with the data
        const getCountriesData = async ()=>{
            await fetch("https://disease.sh/v3/covid-19/countries")
                .then((response)=>response.json())
                .then((data)=>{
                    const countries = data.map((country)=>(
                        {
                            name: country.country,
                            value: country.countryInfo.iso2
                        }));

                    const sortedData = sortData(data);
                    setTableData(sortedData);
                    setMapCountries(data);
                    setCountries(countries);

                });
        };
        getCountriesData();
    }, []);

    const onCountryChange = async (event) =>{
        const countryCode = event.target.value;

        console.log('yoooo', countryCode);
        setCountry(countryCode);

        const url =
            countryCode === "worldwide"
            ? "https://disease.sh/v3/covid-19/all"
            : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

        await fetch(url)
            .then(response => response.json())
            .then(data=>{
                console.log('data:', data);
                setCountry(countryCode);

                //all of the data from from the country response
                setCountryInfo(data);
                setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
                setMapZoom(4)
            });

    //    https://disease.sh/v3/covid-19/all
    // https://disease.sh/v3/covid-19/countries/[COUNTRY_CODE]

    };

    console.log('country info', countryInfo);

  return (
    <div className="app">
        <div className="app__left">
            <div className="app__header">
                <h1>COVID-19 TRACKER Made By Arman Shanto</h1>
                <FormControl className="app__dropdown">
                    <Select variant="outlined"
                        onChange={onCountryChange}
                        value={country}>
                        <MenuItem value="worldwide">Worldwide</MenuItem>
                        {countries.map((country, index)=>(
                            <MenuItem value={country.value} key={index}>{country.name}</MenuItem>
                        ))}

                    </Select>
                </FormControl>

            </div>

            <div className="app_stats">
                <InfoBox
                    isRed
                    active={casesType === "cases"}
                    onClick={(e)=> setCasesType('cases')}
                    title="Coronavirus"
                    cases={prettyPrintStat(countryInfo.todayCases)}
                    total={prettyPrintStat(countryInfo.cases)}
                />

                <InfoBox
                    active={casesType === "recovered"}
                    onClick={(e)=> setCasesType('recovered')}
                    title="Recovered"
                    cases={prettyPrintStat(countryInfo.todayRecovered)}
                    total={prettyPrintStat(countryInfo.recovered)}
                />

                <InfoBox
                    isRed
                    active={casesType === "deaths"}
                     onClick={(e)=> setCasesType('deaths')}
                     title="Deaths"
                     cases={prettyPrintStat(countryInfo.todayDeaths)}
                     total={prettyPrintStat(countryInfo.deaths)}
                />
            </div>

            <div className="app__map">
                <Map
                    casesType={casesType}
                    countries={mapCountries}
                    center={mapCenter}
                    zoom={mapZoom}
                />
                {/*Map*/}
            </div>
        </div>

        <Card className="app__right">
            <CardContent>
                <h3 className="app__table__title">Live Cases By Country</h3>
                <Table countries={tableData}/>
            </CardContent>
            {/*table*/}
            <h3 className="app__graphTitle">Worldwide New {casesType} </h3>
            <LineGraph className="app__graph" casesType={casesType}/>
            {/*chart representation*/}
        </Card>
    </div>
  );
}

export default App;
