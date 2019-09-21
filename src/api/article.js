// 提供  文章  相关的接口调用的函数
import request from '@/utils/request'

/**
 * 获取文章列表
 * @param {Integer} channelId - 频道ID
 * @param {String} timestamp - 时间戳（分页页码）
 */
export const getArticles = (channelId, timestamp) => {
  return request('app/v1_1/articles', 'get', {
    channel_id: channelId,
    timestamp,
    with_top: 1
  })
}

/**
 * 不喜欢
 * @param {Object} articleId - 文章ID
 */
export const disLikes = (articleId) => {
  return request('/app/v1_0/article/dislikes', 'post', {
    target: articleId
  })
}

/**
 * 取消不喜欢
 * @param {Object} articleId - 文章ID
 */
export const undisLikes = (articleId) => {
  return request('/app/v1_0/article/dislikes/' + articleId, 'delete')
}

/**
 * 点赞
 * @param {Object} articleId - 文章ID
 */
export const likings = (articleId) => {
  return request('/app/v1_0/article/likings', 'post', {
    target: articleId
  })
}

/**
 * 取消点赞
 * @param {Object} articleId - 文章ID
 */
export const unlikings = (articleId) => {
  return request('/app/v1_0/article/likings/' + articleId, 'delete')
}

/**
 * 举报文章
 * @param {Obejct,Number} articleId - 文章ID
 * @param {Integer} type - 举报类型
 */
export const report = (articleId, type) => {
  return request('/app/v1_0/article/reports', 'post', {
    target: articleId,
    type
  })
}

/**
 * 获取建议词条
 * @param {String} text - 搜索关键字
 */
export const suggest = (text) => {
  return request('/app/v1_0/suggestion', 'get', {
    q: text
  })
}

/**
 * 根据搜索关键字查询文章列表
 * @param {Integer} param.page - 页码
 * @param {Integer} param.page - 每页多少条
 * @param {String} param.page - 搜索关键字
 */
export const searchArticles = ({ page = 1, perPage = 20, q }) => {
  return request('/app/v1_0/search', 'get', {
    page,
    per_page: perPage,
    q
  })
}

/**
 * 获取文章详情
 * @param {Object,Number} articleId - 文章ID
 */
export const getArticleDetail = (articleId) => {
  return request('/app/v1_0/articles/' + articleId, 'get')
}

/**
 * 获取 评论 回复 列表
 * @param  source - 文章ID 或者 评论ID
 * @param {String} type - a 获取评论  c  获取回复
 * @param {Integer} offset - 偏移量   每段数据最后一个数据的ID
 */
export const getComments = (source, type, offset) => {
  return request('/app/v1_0/comments', 'get', {
    source,
    type,
    offset
  })
}

/**
 * 评论或者回复
 * @param  target - 文章的ID  或者  评论ID
 * @param {*} content - 内容
 * @param {*} articleId - 文章的ID  当你是回复的时候
 */
export const commentOrReply = (target, content, articleId = null) => {
  return request('/app/v1_0/comments', 'post', {
    target,
    content,
    art_id: articleId
  })
}
