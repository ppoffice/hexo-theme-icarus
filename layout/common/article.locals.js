module.exports = (ctx, locals) => {
    const { index, post } = locals;
    return Object.assign(locals, {
        index,
        post: () => post,
        post_id: post._id
    });
}