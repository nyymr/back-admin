import Server from "../utils/request";


//列表分页接口
export function getLableList(name, categoryId, current, size) {
    return Server({
        url: "/article/label/search",
        method: "POST",
        data: {
            name,
            categoryId,
            current,
            size
        }
    })
}
//新增标签
export function addLable(name, categoryId) {
    return Server({
        url: "/article/label",
        method: 'POST',
        data: {
            name,
            categoryId,
        }
    })
}
//修改标签
export function updateLable(id, name, categoryId) {
    return Server({
        url: "/article/category",
        method: "PUT",
        data: {
            id,
            name,
            categoryId,
        }
    })
}

//删除标签
export function detLable(id) {
    return Server({
        url: `/article/label/${id}`,
        method: "DELETE"
    })
}

//通过标签 ID 查询数据接口
export function getLableData(id) {
    return Server({
        url: `/article/label/${id}`,
        method: "GET"
    })
}


//获取正常状态的所有分类
export function getCategory() {
    return Server({
        url: "/article/category/list",
        method: 'GET'
    })
}