import { useEffect, useState } from "react"
import toast from 'react-hot-toast'

const useAsyncMutation=(mutationHook)=>{
    const [isLoading,setIsLoading]=useState(false);
    const [data,setdata]=useState(null);

    const [mutate]=mutationHook();
    const executeMutation=async(toastMsg,...arg)=>{
        setIsLoading(true);
        const toastId=toast.loading(toastMsg || "Data Fetching");
        try {
            const res=await mutate(...arg);
            // console.log(res.data)
            if(res.data){
                toast.success(res.data.msg || "Succesfully fetched",{id:toastId});
                setdata(res.data);
                
                console.log("async Mutation",res.data)
                return res.data;
            }else{
                toast.error(res?.error?.data?.message || "Something Went Wrong" ,{id:toastId});
            }
        } catch (error) {
            console.log(error);
            toast.error("Something went Wrong",{id:toastId});
        }finally{
            setIsLoading(false)
        }
    }

    return [executeMutation,isLoading,data]
}

const useSocketEvents=(socket,handlers)=>{
   console.log("Setting up socket listeners")
    useEffect(()=>{
        Object.entries(handlers).forEach(([event,handler])=>{
            console.log("Power");
            socket.on(event,handler)
        })

        return ()=> {
            console.log("Cleaning up socket listeners");
            Object.entries(handlers).forEach(([event,handler])=>{
            socket.off(event,handler)
        })}

    },[socket,handlers])
}

export {useAsyncMutation,useSocketEvents}