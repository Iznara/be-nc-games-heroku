const { selectCommentsByReviewId, insertComment, removeComment, updateComment } = require("../models/comments.models");


exports.getCommentsByReviewId = (req, res, next) => {
    const { review_id } = req.params;
    const queryParams = req.query;
    const page = queryParams['page'];
    const limit = queryParams['limit'];
    selectCommentsByReviewId(review_id, page, limit).then(comments => {
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

exports.patchComment = (req, res, next) => {
    const { comment_id } = req.params;
    const { inc_votes } = req.body;
    updateComment(comment_id, inc_votes).then((comment) => {
        res.status(200).send({ comment: comment });
    }).catch(next)
};
