import apiClient from "../interceptors/interceptor"

export const ChatService = () =>{

    const getAllThreads = async() =>{
        try{
            const response = await apiClient.get('/chat/threads')
            return response.data
        }
        catch(err){
            console.log(err);
        }
    }
    const getThreadMessages = async(id) =>{
        try{
            const res = await apiClient.get(`/chat/thread/messages/${id}`)
            return res.data
        }
        catch(err){
            console.log(err);
        }
    }
    const sendMessage = async(payload) =>{
        try{
            const res = await apiClient.post('/chat/send-message',payload)
            return res.data
        }
        catch(err){
            console.log(err);
        }
    }
    const createChatThread = async(payload) =>{
        try{
            const res = await apiClient.post('/chat/create-thread',payload)
            return res.data
        }
        catch(err){
            console.log(err);
        }
    }
    return {
        getAllThreads,
        getThreadMessages,
        sendMessage,
        createChatThread
    }
}