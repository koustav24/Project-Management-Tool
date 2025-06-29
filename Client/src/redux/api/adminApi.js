import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";


const adminApi=createApi({
    reducerPath:"adminApi",
    baseQuery:fetchBaseQuery({baseUrl:"http://localhost:3000/admin"}),
    tagTypes:['project'],
    endpoints:(builder)=>({
        getAllProjectAdmin:builder.query({
            query:()=>({
                url:'/allProjects',
                credentials:'include'
            }),
            providesTags:['project']
        }),
        updateProjectAdmin:builder.mutation({
            query:({id,edit})=>({
                url:`/project/${id}`,   
                method:'PUT',
                credentials:'include',
                body:edit,
                headers:{
                    "Content-Type":"application/json"
                }
            }),
            invalidatesTags:['project']
        }),
        updateTaskAdmin:builder.mutation({
            query:({id,edit})=>({
                url:`/edit/${id}`,
                method:'POST',
                credentials:'include',
                body:edit,
            })
        }),
        changeProjectStatus:builder.mutation({
            query:({projectId,archy})=>({
                url:'/project/status',
                method:'put',
                credentials:'include',
                headers: {
                    'Content-Type': 'application/json', 
                  },
                body:JSON.stringify({archy,projectId})
            }),
        }),
        changeTaskStatus:builder.mutation({
            query:({taskId,projectId,archy})=>({
                url:'/task/status',
                method:'POST',
                credentials:'include',
                body:{taskId,projectId,archy}
            }),
        }),
        getAllGroups:builder.query({
            query:()=>({
                url:'/chat/AllChats',
                credentials:'include',
            })
        })
    })
})
export default adminApi;
export const {useGetAllProjectAdminQuery,useUpdateProjectAdminMutation,
    useUpdateTaskAdminMutation,useChangeProjectStatusMutation,
    useChangeTaskStatusMutation,useGetAllGroupsQuery
}=adminApi