const { selectCommentsByReviewId, insertComment, removeComment } = require("../models/models");


exports.getCommentsByReviewId = (req, res, next) => {
    const { review_id } = req.params;
    selectCommentsByReviewId(review_id).then(comments => {
        res.status(200).send({ comments: comments });
    }).catch(next)
};

exports.postComment = (req, res, next) => {
    const { review_id } = req.params;
    const { username, body } = req.body;
    insertComment(review_id, username, body).then(comment => {
        res.status(201).send({ comment: comment })
    }).catch(next)
};

exports.deleteComment = (req, res, next) => {
    const { comment_id } = req.params;
    removeComment(comment_id).then(() => {
        res.status(204).send();
    }).catch(next)
};
