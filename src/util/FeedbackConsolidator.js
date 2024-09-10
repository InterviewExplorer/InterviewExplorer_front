import axios from "axios"

export const handleFeedback = async () => {
    let data;
    
    try {
        const res = await axios.post("http://localhost:8000/get_consolidate_feedback", { feedback: true })
        console.log("서버응답: ", res)
        if (res.status === 200 || res.status === 201) {
            data = res.data
            console.log("통합 피드백(FeedbackConsolidator.js): ", data.consolidated_feedback)
            return data
        } else {
            throw new Error("Failed to get feedback")
        }
    } catch (e) {
        console.error("Error getting feedback", e)
    }
}
    