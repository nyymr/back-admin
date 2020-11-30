import Server from "../utils/request";


//列表数据
export function getMenuList(data) {
    return Server({
        url: "/system/menu/search",
        method: "POST",
        data,
    })
}

//新增菜单
export function addMenu(data) {
    return Server({
        url: `/system/menu`,
        method: 'post',
        data
    })
}

// 编辑回显数据查询
export function getById(id) {
    return Server({
        url: `/system/menu/${id}`, // 反单引号 ``
        method: 'get'
    })
}
// 更新
export function updateMenu(data) {
    return Server({
        url: `/system/menu`,
        method: 'put', // put 方式提交
        data,
    })
}

//删除
export function deleteById(id) {
    return Server({
        url: `/system/menu/${id}`, // 反单引号 ``
        method: 'delete', // delete 方式提交
    })
}