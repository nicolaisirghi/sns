const Questions = require("../Models/Questions");
const Answers = require("../Models/Answers");
const Users = require("../Models/Users");
module.exports.getCategories = async function (req, res, next) {
    try {
        const posts = await Questions.find();
        const categories = posts.map((el) => el.category);
        const uniqueCategories = categories.filter(
            (item, index) => categories.indexOf(item) === index
        );
        res.status(200).json({categories: uniqueCategories});
    } catch (e) {
        next(e);

    }
};

module.exports.getQuestions = async function (req, res, next) {
    try {

        const category = req.params.category;
        let page, itemsCount;
        if (req.query.page) {
            page = req.query.page;
        } else {
            page = 1;
        }
        if (req.query.itemsCount) {
            itemsCount = req.query.itemsCount;
        } else {
            itemsCount = 5;
        }


        const questions = await Questions.find({category: category}, {_v: 0});
        const comments = [];
        for (let i = 0; i < questions.length; i++) {
            const answers = await Answers.find({answeredTo: questions[i]._id});
            const user = await Users.findOne(
                {_id: questions[i].user},
                {_id: 0, email: 0, password: 0}
            );
            comments.push({
                questionInfo: questions[i],
                answerInfo: answers,
                userInfo: user,
            });
        }

        const itemsFromCollectionSize = comments.length;

        const totalPages = Math.ceil(itemsFromCollectionSize / itemsCount);

        let newArr;
        if (page <= totalPages) {
            newArr = comments.slice((page - 1) * itemsCount, page * itemsCount);
        } else if (page > totalPages) {
            newArr = comments.slice((totalPages - 1) * itemsCount)
        }
        res.status(200).json({comments: newArr, totalItemsCount: itemsFromCollectionSize, itemsCount});
    } catch (e) {

        next(e)
    }
};
module.exports.addQuestion = async function (req, res, next) {
    try {
        const questionDocument = {...req.body.questionInfo, date: new Date()};
        const category = req.params.category;
        const questionFromCollection = await Questions.findOne({
            question: questionDocument.question,
        });
        if (!questionFromCollection) {
            await new Questions({...questionDocument, category}).save();
            res.status(200).send("Question added with success!");
        } else {
            throw new Error("This question is already asked!");
        }
    } catch (e) {
        next(e)
    }
};
module.exports.addAnswer = async function (req, res, next) {
    try {
        const {answerInfo} = req.body;
        const questionCandidate = await Questions.findOne({
            _id: answerInfo.answeredTo,
        });
        if (questionCandidate) {
            const answerDocument = {...answerInfo, date: new Date()};

            await new Answers(answerDocument).save();

            res
                .status(200)
                .send(
                    `Answered to question ${questionCandidate.question} with success!`
                );

        } else {
            throw new Error("Question not found");
        }
    } catch (e) {
        next(e)
    }
};

module.exports.getCommentsByQuestion = async function (req, res, next) {
    const questionID = req.query.questionID;
    try {
        const question = await Questions.findOne({_id: questionID});
        if (question) {
            const answers = await Answers.find({answeredTo: questionID});
            const comment = {questionInfo: question, answerInfo: answers};
            res.status(200).send(comment);
        } else {
            throw new Error("This id not in database")
        }
    } catch (e) {
        next(e)
    }
};


module.exports.deleteQuestion = async function (req, res, next) {
    try {
        const questionID = req.params.questionID;
        if (!questionID) throw new Error("Not question in params")
        const questionCandidate = await Questions.findOne({_id: questionID})
        if (!questionCandidate) throw new Error("Question not found ")
        if (questionCandidate.user != req.user.id) throw new Error("You don't have permission to remove this question!")
        await Questions.deleteOne(questionCandidate)
        res.status(200).send(`The question ${questionCandidate} was deleted`)
    } catch (e) {
        next(e)
    }
};
module.exports.deleteAnswer = async function (req, res, next) {
    try {
        const answerID = req.params.answerID;
        if (!answerID) throw new Error("Not answer in params")
        const answerCandidate = await Answers.findOne({_id: answerID})
        if (!answerCandidate) throw new Error("Answer not found ")
        if (answerCandidate.user != req.user.id) throw new Error("You don't have permission to remove this answer!")
        await Answers.deleteOne(answerCandidate)
        res.status(200).send(`The answer ${answerCandidate} was deleted`)
    } catch (e) {
        next(e)
    }
};


module.exports.changeQuestion = async function (req, res, next) {
    try {
        const questionID = req.params.questionID;
        if (!questionID) throw new Error("Not question in params")
        const questionCandidate = await Questions.findOne({_id: questionID})
        if (!questionCandidate) throw new Error("Question not found ")
        if (questionCandidate.user != req.user.id) throw new Error("You don't have permission to modify this question!")
        const {question, description} = req.body.questionInfo;
        if (!question || !description) throw new Error("Missing fields for update!")
        questionCandidate.question = question;
        questionCandidate.description = description;
        await questionCandidate.save();
        res.status(400).send(`Question ${questionCandidate} was updated with success!`)

    } catch (e) {
        next(e)
    }
};

module.exports.changeAnswer = async function (req, res, next) {
    try {
        const answerID = req.params.answerID;
        if (!answerID) throw new Error("Not answer in params")
        const answerCandidate = await Answers.findOne({_id: answerID})
        if (!answerCandidate) throw new Error("answer not found ")
        if (answerCandidate.user != req.user.id) throw new Error("You don't have permission to modify this answer!")
        const {answer} = req.body.answerInfo;
        if (!answer) throw new Error("Missing fields for update!")
        answerCandidate.answer = answer;
        await answerCandidate.save();
        res.status(400).send(`Answer ${answerCandidate} was updated with success!`)

    } catch (e) {
        next(e)
    }
};