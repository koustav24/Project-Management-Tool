import AdminLayout from "../../component/Layouts/AdminLayout";
import ChatsLayouAdmin from "../../component/Layouts/ChatsLayouAdmin";
import ChatsLayout from "../../component/Layouts/ChatsLayout";



const AdminCommunication=()=>{
    
    

    return(
        <div style={{display:'flex',justifyContent:'center',flexDirection:'column'}}>
            
            <h1  style={{color:"#007AFF",textAlign:"center"}}>Here We Can Communicate with Teams</h1>

            <img src="https://img.freepik.com/free-vector/communication-cartoon-design-concept-with-social-networks-signs-young-pare-talking-each-other-flat-vector-illustration_1284-80585.jpg"
            style={{height:"420px",objectFit:"contain"}}
            ></img>
        </div>
        
    )
}

export default AdminLayout()(ChatsLayouAdmin()(AdminCommunication));