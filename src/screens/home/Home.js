import React,{Component} from 'react';
import '../home/Home.css'
import Header from '../../common/header/Header';
class Home extends Component{
    render(){
        return(
            <div>
                <Header baseUrl={this.props.baseUrl}/>
                <p>Home Page</p>
            </div>
        )
    }
}
export default Home;