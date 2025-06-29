import { Key } from "@mui/icons-material";

const fileFormat=(url="")=>{
  const fileExt=url.split('.').pop();

  if (fileExt === "mp4" || fileExt === "webm" || fileExt === "ogg" || fileExt === "flv")
    return "video";

  if (fileExt === "mp3" || fileExt === "wav") return "audio";
  if (
    fileExt === "png" ||
    fileExt === "jpg" ||
    fileExt === "jpeg" ||
    fileExt === "gif"
  )
    return "image";

  return "file";

}

const timeAgo=(dateString)=>{
  const now = new Date();
  const past = new Date(dateString);

  const diffInSeconds = Math.floor((now - past) / 1000);
  if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  return `${Math.floor(diffInSeconds / 86400)} days ago`;
}

const formatDate=(dd)=>{
  const date=new Date(dd);

  const formattedDate=date.toLocaleDateString("en-US",{
    weekday:"short",
    month:"long",
    day:"numeric",
    year:"numeric"
  }).replace(",","")
  return formattedDate;
}

const getOrSaveFromLocalStorage=({key,value,get,userId})=>{
  
  if (!userId) {
    console.warn("No userId provided for localStorage operation")
    return get ? 0 : undefined
  }
  const storageKey = `${key}_${userId}`;
  if(get){
     const t=localStorage.getItem(storageKey) 
            return t?parseInt(t,10):0;
  }else{
    localStorage.setItem(storageKey,value);
  }
}


export {fileFormat,timeAgo,formatDate,getOrSaveFromLocalStorage}