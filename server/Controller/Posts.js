const Questions = require("../Models/Questions")
const Answers = require("../Models/Answers")
const Users = require("../Models/Users")
module.exports.getCategories= async function(req,res){
    try{
        const posts = await Questions.find();
        const categories = posts.map(el=>el.category)
        const uniqueCategories  = categories.filter((item,index)=>categories.indexOf(item)===index)
        res.status(200).json({categories:uniqueCategories})
    }
    catch (e){
        res.status(400).send(e)
    }
}
module.exports.getQuestions = async function (req, res) {
    try {
        const category = req.params.category;
        const questions = await Questions.find({category:category}, {_v: 0})
        const comments = []
        for (let i = 0; i < questions.length; i++) {
            const answers = await Answers.find({answeredTo: questions[i]._id})
            const user = await Users.findOne({_id:questions[i].user},{_id:0,email:0,password:0})
            comments.push({questionInfo: questions[i], answerInfo: answers,userInfo:user})
        }
        res.status(200).json(comments)
    } catch (e) {
        console.log(e)
        res.status(400).send(e)
    }
}
module.exports.addQuestion = async function (req, res) {
    const questionDocument = {...req.body.questionInfo, date: new Date()};
    if (!questionDocument) res.status(400).send({
        message: "Error"
    })

    try {
        const questionFromCollection = await Questions.findOne({question:questionDocument.question})
        if(!questionFromCollection) {
            await (new Questions(questionDocument)).save();
            res.status(200).send("Question added with success!")
        }
        else {
            res.status(400).send("This question is already asked!")
        }
    } catch (e) {
        res.status(400).send(e)
    }

}
module.exports.addAnswer = async function (req, res) {
    const { answerInfo} = req.body;

    console.log(answerInfo)
    const questionCandidate = await Questions.findOne({_id:answerInfo.answeredTo});
    console.log(questionCandidate)
    if (questionCandidate) {
        const answerDocument = {...answerInfo, date: new Date()};
        try {

            await (new Answers(answerDocument)).save()

            res.status(200).send(`Answered to question ${questionCandidate.question} with success!`)
        } catch (e) {
            res.status(400).send(e)
        }
    }
    else{
        res.status(404).send("Question not found")
    }
}


module.exports.getCommentsByQuestion = async function (req, res) {
    const questionID = req.query.questionID;
    try {
        const question = await Questions.findOne({_id: questionID})
        if (question) {
            const answers = await Answers.find({answeredTo: questionID})
            const comment = {questionInfo:question, answerInfo:answers}
            res.status(200).send(comment)
        } else {
            res.status(400).send(questionID)
        }
    } catch (e) {
        res.status(404).send(e)

    }
}
