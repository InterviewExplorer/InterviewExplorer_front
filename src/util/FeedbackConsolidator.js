import axios from "axios"

export const handleFeedback = async () => {
    let data;
    
    try {
        const res = await axios.post("http://localhost:8000/get_consolidate_feedback", { feedback: true })
        console.log("서버응답: ", res)
        if (res.status === 201) {
            data = res.data
        } else {
            throw new Error("Failed to get feedback")
        }
    } catch (e) {
        console.error("Error getting feedback", e)
    }
}
    