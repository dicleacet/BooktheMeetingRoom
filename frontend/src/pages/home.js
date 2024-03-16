import React from "react";
import ButtonComponent from "../components/Button";
import Card from "../components/card";

const Home = () => {

    return (

        <div className="home">
            <div className="container">
                <div className="content">
                    <Card peopleLength={100} timestamp={"09:00:00 - 10:00:00"} />
                    <Card peopleLength={100} timestamp={"09:00:00 - 10:00:00"} />
                    <Card peopleLength={100} timestamp={"09:00:00 - 10:00:00"} />
                    <Card peopleLength={100} timestamp={"09:00:00 - 10:00:00"} />
                    <Card peopleLength={100} timestamp={"09:00:00 - 10:00:00"} />
                    <Card peopleLength={100} timestamp={"09:00:00 - 10:00:00"} />
                    <Card peopleLength={100} timestamp={"09:00:00 - 10:00:00"} />
                    <Card peopleLength={100} timestamp={"09:00:00 - 10:00:00"} />
                </div>
            </div>
        </div>
    )
};

export default Home;