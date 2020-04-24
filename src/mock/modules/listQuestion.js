
export function listQuestion(){
    let data = [
        {
            answerList: [],
            empty: false,
            groupId: 32,
            id: 114,
            priority: 0,
            questionType: 1,
            required: 1,
            title: "您出行方式是啥？"
        },
        {
            empty: false,
            groupId: 32,
            id: 112,
            priority: 0,
            questionType: 0,
            required: 0,
            title: "在哪里上班",
            answerId: 256,
            answerList: [
                {
                    empty: false,
                    id: 255,
                    priority: 0,
                    questionId: 112,
                    status: 0,
                    text: "广州天河"
                },
                {
                    empty: false,
                    id: 256,
                    priority: 0,
                    questionId: 112,
                    status: 0,
                    text: "广州白云"
                },{
                    empty: false,
                    id: 257,
                    priority: 0,
                    questionId: 112,
                    status: 0
                }
            ]
        }
    ]   
    return {
        data
    }
}


