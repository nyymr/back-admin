import Server from "../utils/request"

// export function getStaffList() {
//     return Server({
//         url: ``,
//         method: "",
//         data: {

//         }
//     })
// }


//获取分页数据
export function getArticleList(searchMap, current, size) {
    return Server({
        url: `/article/article/search`,
        method: "POST",
        data: {
            ...searchMap,
            current,
            size,
        }

    })
}

//删除接口
export function delArticle(id) {
    return Server({
        url: `/article/article/${id}`,
        method: "DELETE"
    })
}

//审核通过接口
export function auditArticleSuccess(id) {
    return Server({
        url: `/article/article/audit/success/${id}`,
        method: "GET"
    })
}

//审核不通过接口
export function auditArticleFail(id) {
    return Server({
        url: `/article/article/audit/fail/${id}`,
        method: "GET"
    })
}

//查看接口
export function lookArticle(id) {
    return Server({
        url: `/article/article/${id}`,
        method: "GET"
    })
}

//获取分类数据接口
export function getLabelOptions() {
    return Server({
        url: "/article/category/label/list",
        method: "GET"
    })
}




