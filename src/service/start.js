import axios from "axios";

class StartService{
    start(){
        return axios.get("http://localhost:3002/getWebSocket/");
    }
}

export default new StartService();