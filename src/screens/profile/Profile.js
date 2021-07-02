import React, { Component } from 'react';
import '../profile/Profile.css';
import Header from '../../common/header/Header';
import { Redirect } from 'react-router';
import { GridList } from '@material-ui/core';
import { GridListTile } from '@material-ui/core';
class Profile extends Component {
    constructor(){
        super();
        this.state ={
            albumDataMaster: [],
            albumDataCopy: [],
            imageDetailsMaster: [],
            imageDetailsCopy: [],
            tags: "#upgrad #reactjs #imageviewer #user #image",
            feed: [],
            feedCopy: [],
            isloggedIn:window.sessionStorage.getItem("access-token")===null?false:true
        }
    }

    UNSAFE_componentWillMount() {
        if (window.sessionStorage.getItem("access-token") !== null) {
            let data = null;
            let xhr = new XMLHttpRequest();
            let that = this;
            xhr.addEventListener("readystatechange", function () {
                if (this.readyState === 4) {
                    that.setState({ albumDataMaster: JSON.parse(this.responseText).data });
                    that.setState({ albumDataCopy: JSON.parse(this.responseText).data });
                    // get the image details for each image post
                    that.getImageDetails();
                }
            });
            xhr.open(
                "GET",
                "https://graph.instagram.com/me/media?fields=id,caption&access_token=" +
                window.sessionStorage.getItem("access-token")
            );
            xhr.send(data);
        }
    }



    getImageDetails = () => {
        this.state.albumDataMaster.map((image) => {
            return this.getImageDetailsById(image.id);
        });
    };
    getImageDetailsById = (id) => {
        let that = this;
        let xhr = new XMLHttpRequest();
        let data = null;
        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                that.setState({
                    imageDetailsMaster: that.state.imageDetailsMaster.concat(
                        JSON.parse(this.responseText)
                    ),
                });
                that.setState({
                    imageDetailsCopy: that.state.imageDetailsCopy.concat(
                        JSON.parse(this.responseText)
                    ),
                });
                that.setPostDetails(that.state.imageDetailsCopy);
            }

        });
        xhr.open(
            "GET",
            "https://graph.instagram.com/" +
            id +
            "?fields=id,media_type,media_url,username,timestamp&access_token=" +
            sessionStorage.getItem("access-token")
        );
        xhr.send(data);
    };

    setPostDetails = (albumDetails) => {
        let arr = this.state.feed;
        // console.log("arr: " + arr)
        let feed = {};
        albumDetails.forEach((post) => {
            feed.id = post.id;
            feed.caption = this.captionHandler(feed.id);
            feed.media_url = post.media_url;
            feed.timestamp = post.timestamp;
            feed.username = post.username;
            feed.likes = Math.floor(Math.random() * 100);
            feed.comments = [];
            feed.addedComment = "";
            arr.push(feed);
            arr = arr.filter((ele, ind) => ind === arr.findIndex(elem => elem.id === ele.id))

        })

        this.setState({ feed: arr })
        this.setState({ feedCopy: this.state.feed })
        console.log(this.state.feedCopy)
    }

    captionHandler = (id) => {
        let imageData = [];
        imageData = this.state.albumDataCopy.find((post) => {
            return post.id === id;
        });
        if (typeof imageData.caption === "undefined") {
            imageData.caption = "No Caption - Please comment your views"
        }
        return imageData.caption;
    }

    render() {
        return (
            (this.state.isloggedIn === false) ? <Redirect to="/" /> :
                <div>
                <Header/>
                <div>

                    Account Page Header
               
                </div>
                <GridList cols={3} cellHeight={300} spacing={1}>
                            {

                                this.state.feedCopy.map((post) => (

                                    <GridListTile key={post.id} alt={post.caption}>
                                    <img src={post.media_url} alt={post.caption}></img>
                                    </GridListTile>
                                ))
                            } 
                </GridList>
                </div>
            
           
        )
    }
}
export default Profile;