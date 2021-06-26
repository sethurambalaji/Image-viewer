import React, { Component } from 'react';
import '../home/Home.css'
import Header from '../../common/header/Header';
class Home extends Component {
    constructor() {
        super();
        this.state = {
            albumData: [],
            imageDetails: []
        }

    }

    UNSAFE_componentWillMount() {
        let data = null;
        let xhr = new XMLHttpRequest();
        let that = this;
        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                that.setState({ albumData: JSON.parse(this.responseText).data });
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
    getImageDetails = () => {
        this.state.albumData.map((image) => {
            return this.getImageDetailsById(image.id, image.caption);
        });
    };
    getImageDetailsById = (id, caption) => {
        let that = this;
        let xhr = new XMLHttpRequest();
        let data = null;
        // console.log("post id here :" + id);
        // console.log("post caption here:" + caption);
        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                that.setState({
                    imageDetails: that.state.imageDetails.concat(
                        JSON.parse(this.responseText)
                    ),
                });
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
    render() {
        return (
            <div>
                <Header baseUrl={this.props.baseUrl} />
                <p>Home Page</p>
            </div>
        )
    }
}
export default Home;