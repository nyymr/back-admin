import Server from "../utils/request"

//分页数据接口
export function getCategoryList(name,status,current = 1, size = 20,  ) {
    return Server({
        url: "/article/category/search",
        method: "POST",
        data: {
            name,
            status,
            current,
            size,
        }
    })
}
//添加分类接口
export function addCategory(data) {
    return Server({
        url: "/article/category/",
        method: "POST",
        data
    })
}

//删除接口
export function delCategoryList(id) {
    return Server({
        url: `/article/category/${id}`,
        method: "DELETE",
    })
}

//编辑回填数据接口
export function getEditData(id) {
    return Server({
        url: `article/category/${id}`,
        method: "GET"
    })
}

//保存编辑接口
export function saveEditData(data) {
    return Server({
        url: "article/category",
        method: "PUT",
        data
    })
}


